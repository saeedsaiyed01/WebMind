import type { LucideIcon } from "lucide-react";
import {
  Brain,
  FolderPlus,
  Layers,
  MessageSquare,
} from "lucide-react";

export type FeatureVisual = "sources" | "models" | "network" | "knowledge";

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: FeatureVisual;
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "Save Anything Instantly",
    description:
      "Drop tweets, notes, PDFs, and links into one place — your second brain starts here.",
    icon: FolderPlus,
    visual: "sources",
  },
  {
    title: "Choose Any AI Model",
    description:
      "Switch between Gemini, GPT, GLM, and more — pick the model that fits the task.",
    icon: Layers,
    visual: "models",
  },
  {
    title: "Powered By Latest AI",
    description:
      "Stay on the cutting edge with models that evolve as the AI landscape moves.",
    icon: Brain,
    visual: "network",
  },
  {
    title: "Intelligent Knowledge Hub",
    description:
      "Turn scattered saves into searchable, actionable intelligence you can query.",
    icon: MessageSquare,
    visual: "knowledge",
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
