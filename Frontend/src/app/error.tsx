"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
    <h1 className="text-3xl">Something went wrong</h1>
    <button onClick={reset} className="wm-btn-gold">Try again</button>
  </main>;
}
