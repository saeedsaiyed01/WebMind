import { cn } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
   Check,
   FileText,
   Globe,
   Link as LinkIcon,
   Loader2,
   StickyNote,
   Twitter,
   X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://web-mind-be.vercel.app/api/v1";

enum ContentType {
  Tweet = "tweet",
  Note = "note",
  Document = "document",
  Website = "link",
}

interface CreateContentModalProps {
  onOpen: boolean;
  onClose: () => void;
  onContentAdded?: () => void;
  initialData?: any; 
}

const CONTENT_TYPES = [
  { id: ContentType.Note, label: "Note", icon: StickyNote },
  { id: ContentType.Website, label: "Website", icon: Globe },
  { id: ContentType.Document, label: "Document", icon: FileText },
  { id: ContentType.Tweet, label: "Tweet", icon: Twitter },
];

import { ContentCard } from "../ContentCard";

// ... [Keep existing imports except useRef for inputs if replaced, but let's keep useRef code minimal or remove it]

export function CreateContentModal({
  onOpen,
  onClose,
  initialData,
  onContentAdded,
}: CreateContentModalProps) {
  // Converted to state for real-time preview
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<ContentType>(ContentType.Tweet);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (onOpen && initialData) {
      setType(initialData.type);
      setTitle(initialData.title || "");
      setLink(initialData.link || "");
      setContent(initialData.content || initialData.link || "");
    } else if (onOpen) {
      setType(ContentType.Tweet);
      resetForm();
    }
  }, [onOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should not exceed 10MB.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const resetForm = useCallback(() => {
    setTitle("");
    setLink("");
    setContent("");
    setSelectedFile(null);
    setError(null);
    setIsLoading(false);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (onOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpen, onClose]);

  const addContent = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (type === ContentType.Document && !selectedFile && !initialData) {
      setError("Please upload a PDF file.");
      return;
    }
    if (type === ContentType.Note && !content.trim()) {
      setError("Note content is required.");
      return;
    }
    if (type === ContentType.Tweet || type === ContentType.Website) {
      if (!link.trim()) {
        setError(`${type === ContentType.Tweet ? "Tweet link" : "Website link"} is required.`);
        return;
      }
      try { new URL(link); } catch (_) {
        setError("Please enter a valid URL.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      
      if (initialData) {
         await axios.put(`${BACKEND_URL}/${initialData._id}`, {
             contentId: initialData._id,
             newTitle: title, 
             link: (type === ContentType.Note) ? undefined : link,
             content: (type === ContentType.Note) ? content : undefined
         }, { headers: { Authorization: token } });
         toast.success("Content updated successfully.");
      } else {
          if (type === ContentType.Document) {
            const formData = new FormData();
            formData.append("file", selectedFile!);
            formData.append("title", title);
            await axios.post(`${BACKEND_URL}/upload-document`, formData, {
              headers: { "Content-Type": "multipart/form-data", Authorization: token },
            });
            await new Promise(r => setTimeout(r, 500)); 
          } else {
            const payload: any = { title, type };
            if (type === ContentType.Note) payload.content = content;
            else payload.url = link; 
            
            await axios.post(`${BACKEND_URL}/memory`, payload, { headers: { Authorization: token } });
          }
           toast.success("Content saved successfully.");
      }
      resetForm();
      onClose();
      onContentAdded?.();
    } catch (err: any) {
      // Clean error message
      const msg = err.response?.data?.error || err.response?.data?.message || "Error saving content.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const previewItem = {
     _id: "preview",
     title: title || "Untitled Title",
     type: type as any,
     link: link,
     content: content || (type === ContentType.Note ? "Start typing to see preview..." : undefined),
     createdAt: new Date().toISOString()
  };

  if (!onOpen) return null;

  return (
    <AnimatePresence>
      {onOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-all"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="glass-strong my-8 flex w-full max-w-lg flex-col rounded-3xl border border-border shadow-lift"
            >

              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-background/30 px-6 py-5">
                 <h2 className="flex items-center gap-2 text-lg font-medium tracking-tight text-foreground">
                    {initialData ? "Edit Content" : "Add Content"}
                 </h2>
                 <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-6 md:p-8 space-y-7">
                 
                 {/* Segmented Control Tabs — 2×2 grid on mobile to avoid overlap; single row on md+ */}
                 <div
                    className={cn(
                       "relative border border-border bg-background/40 p-1.5",
                       "grid grid-cols-2 gap-2 rounded-2xl",
                       "md:flex md:gap-0 md:rounded-full md:p-1"
                    )}
                 >
                    {CONTENT_TYPES.map((tab) => (
                       <button
                          key={tab.id}
                          type="button"
                          onClick={() => setType(tab.id)}
                          className={cn(
                             "relative z-10 flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-[12px] font-medium transition-colors sm:text-[13px]",
                             "md:flex-1 md:rounded-full md:py-2 md:text-center",
                             type === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                       >
                          {type === tab.id && (
                             <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 -z-10 rounded-xl bg-accent shadow-sm md:rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                             />
                          )}
                          <tab.icon className={cn("h-3.5 w-3.5 shrink-0", type === tab.id && "text-white")} aria-hidden />
                          <span className="min-w-0 truncate">{tab.label}</span>
                       </button>
                    ))}
                 </div>

                 {/* Inputs */}
                 <div className="space-y-5">
                    
                    {/* Title Input */}
                    <div className="space-y-1.5">
                       <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          type="text"
                          placeholder="Title"
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-1 focus:ring-white/40"
                       />
                    </div>

                    {/* Dynamic Content Input */}
                    {(type === ContentType.Tweet || type === ContentType.Website) && (
                       <div className="space-y-1.5">
                          <div className="group relative">
                             <div className="pointer-events-none absolute left-3.5 top-3.5 text-muted-foreground transition-colors">
                                {type === ContentType.Tweet ? <Twitter className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                             </div>
                             <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                type="url"
                                placeholder={type === ContentType.Tweet ? "Paste X/Twitter link" : "https://example.com/..."}
                                className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-1 focus:ring-white/40"
                             />
                          </div>
                       </div>
                    )}

                    {type === ContentType.Note && (
                       <div className="space-y-1.5">
                          <textarea
                             value={content}
                             onChange={(e) => setContent(e.target.value)}
                             placeholder="Write your note..."
                             className="w-full min-h-[120px] resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-1 focus:ring-white/40"
                          />
                       </div>
                    )}

                    {type === ContentType.Document && (
                       <div className="space-y-1.5">
                          <div className="group relative cursor-pointer rounded-xl border border-dashed border-border p-8 text-center transition-colors hover:bg-accent/40">
                             <input
                                id="file-input"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                             />
                             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <FileText className="h-8 w-8 text-muted-foreground/60 transition-colors group-hover:text-white" />
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                                   {selectedFile ? selectedFile.name : "Choose PDF file"}
                                </span>
                             </div>
                          </div>
                          {selectedFile && (
                             <div className="flex items-center gap-2 px-1 pt-1 text-xs text-white animate-in fade-in slide-in-from-top-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                Ready to upload
                             </div>
                          )}
                       </div>
                    )}

                    {error && (
                       <div className="flex items-center gap-1.5 px-1 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                          <div className="h-1 w-1 rounded-full bg-destructive"/>
                          {error}
                       </div>
                    )}
                 </div>

                 {/* Live Preview Section - Reusing actual ContentCard */}
                 {(title || link || content || selectedFile) && (
                    <div className="pt-2 pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-overline mb-3 flex items-center gap-2 px-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                            Live Preview
                        </div>
                        <div className="pointer-events-none origin-top scale-[0.98] transform opacity-100">
                           {/* @ts-ignore */}
                           <ContentCard item={previewItem} />
                        </div>
                    </div>
                 )}

                 {/* Footer Button */}
                 <div className="pt-2">
                    <button
                       onClick={addContent}
                       disabled={isLoading}
                       className="w-full rounded-xl py-3 font-semibold text-sm bg-white text-black hover:bg-zinc-200 active:scale-98 transition-all disabled:pointer-events-none disabled:opacity-50"
                    >
                       {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Processing...
                          </div>
                       ) : (
                          "Submit Content"
                       )}
                    </button>
                 </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
export default CreateContentModal;
