import { Dashboard } from "@/views/dashboard";
import { pageMetadata } from "@/lib/metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata = pageMetadata("Settings — WebMind", "/setting", true);

export default function Page() {
  return <RequireAuth><Dashboard /></RequireAuth>;
}
