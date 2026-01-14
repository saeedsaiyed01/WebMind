import { cn } from "@/lib/utils";
import { FileText, Globe, MessageSquare, StickyNote, X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ContentItem {
  _id: string;
  title: string;
  type: "note" | "tweet" | "document" | "website";
  timestamp: string;
  link?: string;
  pineconeId: string;
}

interface DocumentMentionPopupProps {
  isOpen: boolean;
  searchQuery: string;
  documents: ContentItem[];
  selectedIndex: number;
  onSelect: (document: ContentItem) => void;
  onClose: () => void;
  loading?: boolean;
}

const typeIcons: Record<ContentItem["type"], React.ReactNode> = {
  note: <StickyNote className="h-4 w-4 text-yellow-400" />,
  tweet: <MessageSquare className="h-4 w-4 text-blue-400" />,
  document: <FileText className="h-4 w-4 text-purple-400" />,
  website: <Globe className="h-4 w-4 text-green-400" />,
};

const typeLabels: Record<ContentItem["type"], string> = {
  note: "Note",
  tweet: "Tweet",
  document: "Document",
  website: "Website",
};

export function DocumentMentionPopup({
  isOpen,
  searchQuery,
  documents,
  selectedIndex,
  onSelect,
  onClose,
  loading,
}: DocumentMentionPopupProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && documents.length > 0) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, documents.length]);

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 max-h-64 overflow-hidden bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
            Attach Document
          </span>
          {searchQuery && (
            <span className="text-[10px] text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
              "{searchQuery}"
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/[0.05] rounded transition-colors"
        >
          <X className="h-3 w-3 text-zinc-500" />
        </button>
      </div>

      {/* List */}
      <div ref={listRef} className="overflow-y-auto max-h-48 py-1">
        {loading ? (
          <div className="px-3 py-4 text-center text-zinc-500 text-xs">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="px-3 py-4 text-center text-zinc-500 text-xs">
            {searchQuery ? `No documents matching "${searchQuery}"` : "No documents found"}
          </div>
        ) : (
          documents.map((doc, index) => (
            <button
              key={doc._id}
              onClick={() => onSelect(doc)}
              className={cn(
                "w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors",
                index === selectedIndex
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                {typeIcons[doc.type] || <FileText className="h-4 w-4 text-zinc-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {doc.title || "Untitled"}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {typeLabels[doc.type] || doc.type}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="px-3 py-1.5 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3 text-[9px] text-zinc-500">
          <span>
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[8px]">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[8px]">↵</kbd> select
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[8px]">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

// Attached document chip component
interface AttachedDocumentChipProps {
  document: ContentItem;
  onRemove: () => void;
}

export function AttachedDocumentChip({ document, onRemove }: AttachedDocumentChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-zinc-300 hover:bg-white/[0.08] transition-colors group">
      {typeIcons[document.type] || <FileText className="h-3 w-3" />}
      <span className="max-w-[150px] truncate">{document.title || "Untitled"}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 hover:bg-white/[0.1] rounded transition-colors opacity-60 group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
