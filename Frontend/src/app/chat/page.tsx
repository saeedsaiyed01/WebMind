import { ChatPage } from "@/views/ChatPage";
import { pageMetadata } from "@/lib/metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata = pageMetadata("Chat — WebMind", "/chat", true);

export default function Page() {
  return <RequireAuth><ChatPage /></RequireAuth>;
}
