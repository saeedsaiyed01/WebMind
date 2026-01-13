import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

// Simple custom dropdown to avoid full ShadCN Select complexity for now
// We can upgrade to real Command/Popover later.

export function ModelSelector() {
  const { models, setModels, selectedModel, setSelectedModel } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/models");
        const data = await res.json();
        if (data.models) {
          setModels(data.models);
          // Set default if none selected
          if (!selectedModel && data.models.length > 0) {
              const defaultModel = data.models.find((m: any) => m.id === "gemini-2.5-flash") || data.models[0];
              setSelectedModel(defaultModel);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
      }
    };
    fetchModels();
  }, [setModels, selectedModel, setSelectedModel]);

  return (
    <div className="relative inline-block text-left">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[200px] justify-between bg-black text-white border-zinc-800 hover:bg-zinc-900"
      >
        {selectedModel ? selectedModel.name : "Select Model"}
        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[250px] origin-top-right rounded-md border border-zinc-800 bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-900",
                  selectedModel?.id === model.id ? "text-white" : "text-zinc-400"
                )}
              >
                <div className="flex-1">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-zinc-500">{model.isFree ? "Free" : "Premium"}</div>
                </div>
                {selectedModel?.id === model.id && (
                  <Check className="h-4 w-4 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
