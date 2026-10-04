export type ChatPhase = "working" | "searching" | "solving";

export interface ChatResult {
  answer: string;
  conversationId?: string;
  remainingCredits?: number;
  timestamp?: string;
}

interface PhaseEvent {
  type: "phase";
  phase: ChatPhase;
}

interface ResultEvent extends ChatResult {
  type: "result";
}

interface ErrorEvent {
  type: "error";
  error: string;
  needsUpgrade?: boolean;
}

type ChatStreamEvent = PhaseEvent | ResultEvent | ErrorEvent;

export async function readChatStream(
  response: Response,
  onPhase?: (phase: ChatPhase) => void,
): Promise<ChatResult> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw Object.assign(new Error(data.error || "Failed to generate answer"), {
        needsUpgrade: data.needsUpgrade,
      });
    }
    return {
      answer: data.answer,
      conversationId: data.conversationId,
      remainingCredits: data.remainingCredits,
      timestamp: data.timestamp,
    };
  }

  if (!response.ok || !response.body) {
    throw new Error("Failed to generate answer");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  let conversationId: string | undefined;
  let remainingCredits: number | undefined;
  let timestamp: string | undefined;

  const handleLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const event = JSON.parse(trimmed) as ChatStreamEvent;
    if (event.type === "phase") {
      onPhase?.(event.phase);
      return;
    }
    if (event.type === "result") {
      answer = event.answer;
      conversationId = event.conversationId;
      remainingCredits = event.remainingCredits;
      timestamp = event.timestamp;
      return;
    }
    throw Object.assign(new Error(event.error || "Failed to generate answer"), {
      needsUpgrade: event.needsUpgrade,
    });
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) handleLine(line);
  }

  buffer += decoder.decode();
  if (buffer.trim()) handleLine(buffer);

  if (!answer) {
    throw new Error("Failed to generate answer");
  }

  return { answer, conversationId, remainingCredits, timestamp };
}
