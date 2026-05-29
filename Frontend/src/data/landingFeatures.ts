import type { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  FolderPlus,
  GalleryVerticalEnd,
  MessageSquare,
  Wrench,
} from "lucide-react";

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "Add Your Content",
    description:
      "Import tweets, notes, and documents to build your digital repository.",
    icon: FolderPlus,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Turn unstructured data into organized, actionable knowledge.",
    icon: Wrench,
  },
  {
    title: "Smart Organization",
    description:
      "Automatically categorize content so your base stays searchable.",
    icon: GalleryVerticalEnd,
  },
  {
    title: "Ask Questions",
    description:
      "Query everything in natural language and uncover what matters.",
    icon: MessageSquare,
  },
  {
    title: "Get Answers",
    description:
      "Retrieve precise, knowledge-based answers from your own content.",
    icon: CheckCircle,
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Add content",
    description: "Save tweets, notes, PDFs, and links in one place.",
  },
  {
    step: "02",
    title: "Let AI organize",
    description: "WebMind structures and indexes your knowledge automatically.",
  },
  {
    step: "03",
    title: "Ask anything",
    description: "Chat with your library and get answers grounded in your data.",
  },
];
