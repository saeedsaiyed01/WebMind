import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}

const BASE_URL = "https://webmind.buzz";
const DEFAULT_IMAGE = `${BASE_URL}/og-banner.png`;
const DEFAULT_DESCRIPTION =
  "Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base.";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes("WebMind") ? title : `${title} — WebMind`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WebMind" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
