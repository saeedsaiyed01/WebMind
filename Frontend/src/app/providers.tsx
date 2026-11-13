"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { BACKEND_URL } from "@/config";
import { useStore } from "@/store/useStore";

const SessionReady = createContext(false);
export const useSessionReady = () => useContext(SessionReady);

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const token = useStore((state) => state.token);

  useEffect(() => {
    let active = true;
    async function initialize() {
      await useStore.persist.rehydrate();
      if (!active) return;
      const url = new URL(window.location.href);
      const oauthToken = url.searchParams.get("token");
      const savedToken = localStorage.getItem("token");
      useStore.getState().setToken(oauthToken || savedToken || useStore.getState().token);
      if (oauthToken) {
        url.searchParams.delete("token");
        window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
        router.replace("/dashboard");
      }
      setReady(true);
    }
    void initialize();
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    if (!ready || !token) return;
    const controller = new AbortController();
    async function loadUser() {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
        });
        if (response.status === 401 || response.status === 403) {
          useStore.getState().logout();
          return;
        }
        if (!response.ok) return;
        const user = await response.json();
        useStore.getState().setUser(user);
        if (user.credits !== undefined) useStore.getState().setCredits(user.credits);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Failed to load user", error);
      }
    }
    void loadUser();
    return () => controller.abort();
  }, [ready, token]);

  return (
    <SessionReady.Provider value={ready}>
      {children}
      <Toaster position="top-right" toastOptions={{ style: {
        background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))", border: "1px solid hsl(var(--border))",
      } }} />
      <Analytics />
    </SessionReady.Provider>
  );
}
