import SignInPage from "@/views/SignIn";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Sign In — WebMind", "/signin", false);

export default function Page() {
  return <SignInPage />;
}
