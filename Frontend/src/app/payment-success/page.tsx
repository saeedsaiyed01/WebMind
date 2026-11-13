import PaymentSuccessPage from "@/views/PaymentSuccessPage";
import { pageMetadata } from "@/lib/metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Suspense } from "react";

export const metadata = pageMetadata("Payment — WebMind", "/payment-success", true);

export default function Page() {
  return <Suspense fallback={<p role="status">Loading payment…</p>}><RequireAuth><PaymentSuccessPage /></RequireAuth></Suspense>;
}
