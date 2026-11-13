import SignUpPage from "@/views/SignUp";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Sign Up — WebMind", "/signup", false);

export default function Page() {
  return <SignUpPage />;
}
