import { Button } from "@/components/ui/Button";
import SEO from "@/components/SEO";
import { AttachedDocumentChip, ContentItem, DocumentMentionPopup } from "@/components/ui/DocumentMentionPopup";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Bot, Check, ChevronDown, Copy, Loader2, Mic, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: number;
}

const SUPPORTED_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B" },
  { id: "openai/gpt-oss-20b:free", name: "GPT OSS 20B" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
];

const SUGGESTIONS = [
  "Summarize my latest notes",
  "What did I save about AI agents?",
  "Find the tweet I saved yesterday",
  "Compare two documents in my library",
];

export function ChatPage() {
  const { user, selectedModel, setCredits, addConversation, messages, setMessages } = useStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id: conversationId } = useParams();
  const navigate = useNavigate();

  const [attachedDocuments, setAttachedDocuments] = useState<ContentItem[]>([]);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [availableDocuments, setAvailableDocuments] = useState<ContentItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null);
  const [copiedMessageKey, setCopiedMessageKey] = useState<string | null>(null);

  const handleCopyMessage = useCallback(async (content: string, messageKey: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageKey(messageKey);
      window.setTimeout(() => {
        setCopiedMessageKey((current) => (current === messageKey ? null : current));
      }, 1800);
    } catch (error) {
      console.error("Failed to copy message", error);
    }
  }, []);

  const fetchDocuments = useCallback(async (query: string = "") => {
    setDocumentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const url = query
        ? `${API_BASE}/api/v1/content/search?q=${encodeURIComponent(query)}`
        : `${API_BASE}/api/v1/content`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const docs = data.results || data.content || [];
        const filtered = docs.filter(
          (d: ContentItem) => !attachedDocuments.some((ad) => ad._id === d._id)
        );
        setAvailableDocuments(filtered);
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
      setAvailableDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  }, [attachedDocuments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputValue(value);
    const textBeforeCursor = value.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@([a-zA-Z0-9\s]*)$/);
    if (atMatch) {
      const query = atMatch[1] || "";
      setMentionQuery(query);
      setMentionStartPos(cursorPos - query.length - 1);
      setShowMentionPopup(true);
      setMentionIndex(0);
      fetchDocuments(query);
    } else {
      setShowMentionPopup(false);
      setMentionQuery("");
      setMentionStartPos(null);
    }
  };

  const handleDocumentSelect = (doc: ContentItem) => {
    setAttachedDocuments((prev) => [...prev, doc]);
    if (mentionStartPos !== null) {
      const beforeMention = inputValue.substring(0, mentionStartPos);
      const afterMention = inputValue.substring(mentionStartPos + mentionQuery.length + 1);
      setInputValue(beforeMention + afterMention);
    }
    setShowMentionPopup(false);
    setMentionQuery("");
    setMentionStartPos(null);
    textareaRef.current?.focus();
  };

  const handleRemoveDocument = (docId: string) => {
    setAttachedDocuments((prev) => prev.filter((d) => d._id !== docId));
  };

  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      try {
        const token = localStorage.getItem("token");
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE}/api/v1/conversation/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const history = await res.json();
          const mapped = history
            .map((msg: any) => [
              { role: "user", content: msg.message, timestamp: msg.createdAt },
              { role: "assistant", content: msg.response, timestamp: msg.createdAt },
            ])
            .flat();
          setMessages(mapped);
        }
      } catch (e) {
        console.error("Failed to load chat", e);
      }
    };
    loadConversation();
  }, [conversationId, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeModel = selectedModel || SUPPORTED_MODELS[0];
  const [, setShowModels] = useState(false);
  const [showFooterModels, setShowFooterModels] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() && attachedDocuments.length === 0) return;
    const messageContent = inputValue.trim();
    const newMessage: Message = { role: "user", content: messageContent, timestamp: Date.now() };
    const attachedDocIds = attachedDocuments.map((d) => d._id);
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setAttachedDocuments([]);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: newMessage.content,
          model: activeModel.id,
          conversationId,
          attachedDocumentIds: attachedDocIds,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer, timestamp: Date.now() },
        ]);
        if (data.conversationId && data.conversationId !== conversationId) {
          navigate(`/chat/${data.conversationId}`, { replace: true });
          addConversation({
            _id: data.conversationId,
            title: newMessage.content.substring(0, 20) + "...",
            lastMessageAt: new Date(),
          });
        }
        if (data.remainingCredits !== undefined) setCredits(data.remainingCredits);
      }
    } catch (error) {
      console.error("Chat failed", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again.", timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <SEO title="Chat — WebMind" noindex={true} />
      <div
        className="relative flex h-full flex-col"
        onClick={() => {
          setShowModels(false);
          setShowFooterModels(false);
        }}
      >
        {/* Scrollable area */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6">
          {messages.length === 0 ? (
            <EmptyState user={user} onPick={(s) => setInputValue(s)} />
          ) : (
            <div ref={scrollRef} className="mx-auto max-w-2xl space-y-5">
              {messages.map((msg, i) => {
                const messageKey = `${msg.timestamp}-${i}`;
                const isCopied = copiedMessageKey === messageKey;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.01, 0.1) }}
                    className={cn("flex w-full gap-3", msg.role === "user" ? "justify-end group" : "justify-start")}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/60">
                        <Bot className="h-3.5 w-3.5 text-gold" />
                      </div>
                    )}
                    <div className={cn("flex max-w-[85%] flex-col gap-1", msg.role === "user" ? "items-end shrink-0" : "items-start")}>
                      <div
                        className={cn(
                          "inline-block w-auto rounded-2xl px-4 py-2.5 text-[12px] leading-6",
                          msg.role === "user"
                            ? "rounded-tr-sm bg-foreground text-background"
                            : "glass rounded-tl-sm text-foreground [&_p]:m-0"
                        )}
                      >
                        {msg.role === "user" ? (
                          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.content, messageKey)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
                            isCopied
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                          )}
                          aria-label={isCopied ? "Message copied" : "Copy message"}
                          title={isCopied ? "Copied" : "Copy"}
                        >
                          {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{isCopied ? "Copied" : "Copy"}</span>
                        </button>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-transform hover:scale-105">
                        <span className="select-none">{user?.name?.charAt(0) || "U"}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/60">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleInputChange={handleInputChange}
          textareaRef={textareaRef}
          showMentionPopup={showMentionPopup}
          mentionQuery={mentionQuery}
          availableDocuments={availableDocuments}
          mentionIndex={mentionIndex}
          handleDocumentSelect={handleDocumentSelect}
          setShowMentionPopup={setShowMentionPopup}
          documentsLoading={documentsLoading}
          attachedDocuments={attachedDocuments}
          handleRemoveDocument={handleRemoveDocument}
          showFooterModels={showFooterModels}
          setShowFooterModels={setShowFooterModels}
          activeModel={activeModel}
          loading={loading}
          handleSend={handleSend}
          onKeyDown={(e) => {
            if (showMentionPopup) {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setMentionIndex((prev) => Math.max(0, prev - 1));
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setMentionIndex((prev) => Math.min(availableDocuments.length - 1, prev + 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (availableDocuments[mentionIndex]) handleDocumentSelect(availableDocuments[mentionIndex]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setShowMentionPopup(false);
              }
              return;
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ user, onPick }: { user: { name?: string } | null; onPick: (s: string) => void }) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center space-y-8 text-center">
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl animate-pulse-glow" />
        <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border border-white/20 border-t-transparent animate-spin-reverse-slow" />
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-background/80 shadow-lift">
          <Bot className="relative z-10 h-6 w-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          Ask anything about your saved content. Type{" "}
          <span className="wm-kbd">@</span> to attach a document to ground your answer.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="glass rounded-full px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-zinc-500 hover:text-foreground hover:-translate-y-0.5"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatInput(props: {
  inputValue: string;
  setInputValue: (v: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  showMentionPopup: boolean;
  mentionQuery: string;
  availableDocuments: ContentItem[];
  mentionIndex: number;
  handleDocumentSelect: (doc: ContentItem) => void;
  setShowMentionPopup: (v: boolean) => void;
  documentsLoading: boolean;
  attachedDocuments: ContentItem[];
  handleRemoveDocument: (id: string) => void;
  showFooterModels: boolean;
  setShowFooterModels: (v: boolean) => void;
  activeModel: { id: string; name: string };
  loading: boolean;
  handleSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-2 pt-0 md:p-4">
      <div className="mx-auto max-w-2xl">
        <div className="glass-strong relative flex min-h-[80px] flex-col justify-between rounded-3xl p-3 shadow-lift md:min-h-[120px] md:p-4">
          <DocumentMentionPopup
            isOpen={props.showMentionPopup}
            searchQuery={props.mentionQuery}
            documents={props.availableDocuments}
            selectedIndex={props.mentionIndex}
            onSelect={props.handleDocumentSelect}
            onClose={() => props.setShowMentionPopup(false)}
            loading={props.documentsLoading}
          />

          {props.attachedDocuments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2 border-b border-border pb-2">
              {props.attachedDocuments.map((doc) => (
                <AttachedDocumentChip
                  key={doc._id}
                  document={doc}
                  onRemove={() => props.handleRemoveDocument(doc._id)}
                />
              ))}
            </div>
          )}

          <div className="relative z-10">
            {!props.inputValue && props.attachedDocuments.length === 0 && (
              <div className="pointer-events-none absolute left-0 top-0 flex items-center gap-2 p-1 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-zinc-300" />
                <span>Type @ to attach docs, or start your request</span>
              </div>
            )}
            <textarea
              ref={props.textareaRef}
              value={props.inputValue}
              onChange={props.handleInputChange}
              onKeyDown={props.onKeyDown}
              placeholder=""
              className="relative z-10 min-h-[40px] w-full resize-none border-none bg-transparent p-1 text-sm font-medium leading-relaxed text-foreground outline-none focus-visible:ring-0 placeholder:text-muted-foreground md:min-h-[50px]"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => props.setShowFooterModels(!props.showFooterModels)}
                  className="flex items-center gap-1.5 rounded-lg bg-background/50 px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                  title="Select Model"
                >
                  <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                  <span className="max-w-[100px] truncate">{props.activeModel.name}</span>
                  <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform duration-200", props.showFooterModels ? "rotate-180" : "")} />
                </button>
                {props.showFooterModels && (
                  <div className="glass-strong absolute bottom-full left-0 z-50 mb-2 w-56 overflow-hidden rounded-xl py-1 shadow-lift animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                    {SUPPORTED_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          // @ts-ignore
                          useStore.getState().setSelectedModel(model);
                          props.setShowFooterModels(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] transition-colors hover:bg-accent",
                          props.activeModel.id === model.id ? "font-medium text-foreground bg-accent/60" : "text-muted-foreground"
                        )}
                      >
                        <span className="flex-1 truncate">{model.name}</span>
                        {props.activeModel.id === model.id && <Check className="h-3 w-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={props.handleSend}
                disabled={props.loading || (!props.inputValue.trim() && props.attachedDocuments.length === 0)}
                size="icon"
                variant="default"
                className="h-9 w-9 rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                aria-label="Send message"
              >
                <Send className="ml-0.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="text-[8px] uppercase tracking-widest font-medium text-muted-foreground/70">
            WebMind may make errors. Check important information.
          </span>
        </div>
      </div>
    </div>
  );
}
