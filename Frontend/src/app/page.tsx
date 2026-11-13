import LandingPage from "@/views/landingPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("WebMind — All Your Digital Memory Unleashed", "/", false);

export default function Page() {
  return <LandingPage />;
}
