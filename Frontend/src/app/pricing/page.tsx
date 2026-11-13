import PricingPage from "@/views/PricingPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Pricing — WebMind", "/pricing", false);

export default function Page() {
  return <PricingPage />;
}
