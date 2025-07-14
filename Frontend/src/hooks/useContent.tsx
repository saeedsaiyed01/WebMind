// useContent.ts
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type ContentType = "note" | "tweet" | "document" | "website";

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  originalLink?: string; // NEW: for tweets/websites
  type: ContentType;
  timestamp?: string;
}

export function useContent() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ✅ NEW

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true); // ✅ start loading
      const response = await axios.get(`${BACKEND_URL}/content`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setContents(response.data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false); // ✅ done loading
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    contents,
    refresh: fetchContent,
    loading, // ✅ export
  };
}