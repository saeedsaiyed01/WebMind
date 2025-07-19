import { JSX } from "react";
import AddContentIcon from "../../icons/AddContentIcon";
import AiInsightsIcon from "../../icons/AiInsightsIcon";
import AskQuestionsIcon from "../../icons/AskQuestionsIcon";
import GetAnswersIcon from "../../icons/GetAnswersIcon";
import SeamlessIntegrationIcon from "../../icons/SeamlessIntegrationIcon";
import SmartOrganizationIcon from "../../icons/SmartOrganizationIcon";
type features = {
  icon: JSX.Element;
  title: string;
  description: string;
};
// --- Data for the cards ---
export const features = [
  {
    icon: <AddContentIcon />,
    title: "Add Your Content",
    description:
      "Import tweets, notes, and documents easily to build your digital repository.",
  },
  {
    icon: <AiInsightsIcon />,
    title: "AI-Powered Insights",
    description:
      "Harness the power of AI to turn your unstructured data into organized, actionable insights.",
  },
  {
    icon: <SmartOrganizationIcon />,
    title: "Smart Organization",
    description:
      "Automatically categorize and tag your content so your knowledge base is always organized.",
  },
  {
    icon: <SeamlessIntegrationIcon />,
    title: "Seamless Integration",
    description:
      "Connect effortlessly with your favorite platforms to bring all your knowledge together.",
  },
  {
    icon: <AskQuestionsIcon />,
    title: "Ask Questions",
    description:
      "Query your content using natural language and let our AI uncover valuable insights.",
  },
  {
    icon: <GetAnswersIcon />,
    title: "Get Answers",
    description:
      "Your content is organized and analyzed, so you can retrieve precise, knowledge-based answers.",
  },
];

// --- Reusable Card Component ---
// This component takes icon, title, and description as props.
export const LandingPageCard = ({ icon, title, description }: any) => {
  return (
    <div
      className="group relative flex flex-col items-start p-6 rounded-2xl 
    bg-white/5 dark:bg-black/10 ring-1 ring-black/10 dark:ring-white/10 
    backdrop-blur-lg transition-all duration-300 ease-in-out 
    hover:bg-black/10 dark:hover:bg-white/10 
    hover:ring-black/20 dark:hover:ring-white/20 
    hover:-translate-y-2"
    >
      {/* Purple Glow Effect */}
      <div
        className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/50 
    opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg 
        bg-gray-100 dark:bg-gray-800 
        ring-1 ring-black/10 dark:ring-white/10"
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};
