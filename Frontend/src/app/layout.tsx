import type { Metadata } from "next";
import { Providers } from "./providers";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://webmind.space"),
  title: "WebMind — All Your Digital Memory Unleashed",
  icons: { icon: "/brain-icon.svg" },
};

// Apply the saved theme before paint, without reading browser storage during SSR.
const themeScript = `try { var t = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'; document.documentElement.classList.remove('light', 'dark'); document.documentElement.classList.add(t); } catch (_) {}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
