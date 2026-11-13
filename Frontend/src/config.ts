// Accept either a backend origin or a URL already ending in /api/v1.
const configuredUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const base = configuredUrl.replace(/\/+$/, "");
export const BACKEND_URL = base.endsWith("/api/v1") ? base : `${base}/api/v1`;
