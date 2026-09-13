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
    <div className="glass-strong absolute bottom-full left-0 z-50 mb-2 max-h-64 w-80 overflow-hidden rounded-xl shadow-lift animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-overline">Attach Document</span>
          {searchQuery && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
              "{searchQuery}"
            </span>
          )}
        </div>
        <button onClick={onClose} className="rounded p-1 transition-colors hover:bg-accent">
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>

      {/* List */}
      <div ref={listRef} className="max-h-48 overflow-y-auto py-1">
        {loading ? (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            {searchQuery ? `No documents matching "${searchQuery}"` : "No documents found"}
          </div>
        ) : (
          documents.map((doc, index) => (
            <button
              key={doc._id}
              onClick={() => onSelect(doc)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                index === selectedIndex ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-background/60">
                {typeIcons[doc.type] || <FileText className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{doc.title || "Untitled"}</div>
                <div className="text-[10px] text-muted-foreground">{typeLabels[doc.type] || doc.type}</div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="border-t border-border bg-background/30 px-3 py-1.5">
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
          <span><span className="wm-kbd text-[8px]">↑↓</span> navigate</span>
          <span><span className="wm-kbd text-[8px]">↵</span> select</span>
          <span><span className="wm-kbd text-[8px]">esc</span> close</span>
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
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent group">
      {typeIcons[document.type] || <FileText className="h-3 w-3" />}
      <span className="max-w-[150px] truncate">{document.title || "Untitled"}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded p-0.5 opacity-60 transition-colors hover:bg-accent group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
