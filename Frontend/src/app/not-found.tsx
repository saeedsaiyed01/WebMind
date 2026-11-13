import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
    <h1 className="text-3xl">Page not found</h1>
    <Link href="/" className="wm-btn-gold">Back to WebMind</Link>
  </main>;
}
