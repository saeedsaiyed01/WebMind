import PaymentCancelPage from "@/views/PaymentCancelPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Payment Cancelled — WebMind", "/payment-cancel", true);

export default function Page() {
  return <PaymentCancelPage />;
}
