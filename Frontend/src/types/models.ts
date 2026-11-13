export interface Model {
  id: string;
  name: string;
  isFree?: boolean;
}

export interface Conversation {
  _id: string;
  title: string;
  createdAt?: string;
  lastMessageAt?: string | Date;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: number | string;
}

export interface ContentItem {
  _id: string;
  title: string;
  type: "tweet" | "video" | "document" | "link" | "note" | "website";
  link?: string;
  originalLink?: string;
  content?: string;
  tags?: string[];
  createdAt?: string;
  timestamp?: string;
}
