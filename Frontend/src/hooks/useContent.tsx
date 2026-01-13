import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type ContentType = "note" | "tweet" | "document" | "website";

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  originalLink?: string; 
  type: ContentType;
  timestamp?: string;
  content?: string;
}

export function useContent() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/content`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setContents(response.data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const deleteContent = useCallback(async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      setContents((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  }, []);

  const updateContent = useCallback(async (id: string, title: string) => {
      try {
        await axios.put(`${BACKEND_URL}/${id}`, { 
            contentId: id,
            newTitle: title 
        }, {
           headers: { Authorization: localStorage.getItem("token") || "" },
        });
        setContents(prev => prev.map(c => c._id === id ? { ...c, title } : c));
      } catch (error) {
        console.error("Failed to update content:", error);
        throw error; // Re-throw to handle UI feedback
      }
  }, []);

  return {
    contents,
    refresh: fetchContent,
    loading,
    deleteContent,
    updateContent
  };
}