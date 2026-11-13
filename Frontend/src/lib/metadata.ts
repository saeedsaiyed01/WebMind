import type { Metadata } from "next";

const description = "Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base.";
export function pageMetadata(title: string, path: string, noindex = false, summary = description): Metadata {
  return {
    title, description: summary,
    alternates: noindex ? undefined : { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description: summary, url: path, siteName: "WebMind", type: "website", images: ["/og-banner.png"] },
    twitter: { card: "summary_large_image", title, description: summary, images: ["/og-banner.png"] },
  };
}
