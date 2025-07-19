// components/ui/AddContentCard.tsx
import { PlusIcon } from "lucide-react";

interface AddContentCardProps {
  onClick: () => void;
}

export function AddContentCard({ onClick }: AddContentCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border-2 border-dashed border-ray-600  bg-white dark:bg-black rounded-lg p-4 text-black dark:text-white w-full  max-w-xs     mx-auto  hover:border-gray-300 dark:hover:border-gray-800  transition-all
      "
    >
      <div className="flex flex-col items-center justify-center   ">
        <PlusIcon size={24} className="mb-2" />
        <h3 className="text-md font-semibold ">Add Content</h3>
        <p className="text-xs text-gray-400">New note, tweet, doc...</p>
      </div>
    </div>
  );
}
