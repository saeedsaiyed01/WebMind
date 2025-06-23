// useContent.ts
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

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

  const fetchContent = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setContents(response.data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    contents,
    refresh: fetchContent,
  };
}
