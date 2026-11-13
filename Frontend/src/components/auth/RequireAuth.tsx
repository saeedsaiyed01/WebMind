"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionReady } from "@/app/providers";
import { useStore } from "@/store/useStore";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const ready = useSessionReady();
  const token = useStore((state) => state.token);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (ready && !token) router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
  }, [ready, token, router, pathname]);
  if (!ready || !token) return <main className="flex min-h-screen items-center justify-center bg-background text-foreground" role="status">Loading your workspace…</main>;
  return children;
}
