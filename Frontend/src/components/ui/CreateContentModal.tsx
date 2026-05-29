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

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#0C0C0C]/90 backdrop-blur-xl w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col my-8"
            >
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#0C0C0C]/50 shrink-0">
                 <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
                    {initialData ? "Edit Content" : "Add Content"}
                 </h2>
                 <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors p-1.5 rounded-full hover:bg-white/5">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-6 md:p-8 space-y-7">
                 
                 {/* Segmented Control Tabs — 2×2 grid on mobile to avoid overlap; single row on md+ */}
                 <div
                    className={cn(
                       "relative border border-white/5 bg-black/40 p-1.5",
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
                             type === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                          )}
                       >
                          {type === tab.id && (
                             <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 -z-10 rounded-xl bg-zinc-800 shadow-sm md:rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                             />
                          )}
                          <tab.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
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
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-transparent transition-all font-sans"
                       />
                    </div>

                    {/* Dynamic Content Input */}
                    {(type === ContentType.Tweet || type === ContentType.Website) && (
                       <div className="space-y-1.5">
                          <div className="relative group">
                             <div className="absolute left-3.5 top-3.5 pointer-events-none text-zinc-500 transition-colors">
                                {type === ContentType.Tweet ? <Twitter className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                             </div>
                             <input 
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                type="url"
                                placeholder={type === ContentType.Tweet ? "Paste X/Twitter link" : "https://example.com/..."}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-transparent transition-all font-sans"
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
                             className="w-full min-h-[120px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-transparent transition-all font-sans resize-none leading-relaxed"
                          />
                       </div>
                    )}
                    
                    {type === ContentType.Document && (
                       <div className="space-y-1.5">
                          <div className="relative group border border-dashed border-white/10 rounded-xl p-8 hover:bg-white/[0.02] transition-colors text-center cursor-pointer">
                             <input 
                                id="file-input"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <div className="flex flex-col items-center gap-2 text-zinc-500">
                                <FileText className="w-8 h-8 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                                <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
                                   {selectedFile ? selectedFile.name : "Choose PDF file"}
                                </span>
                             </div>
                          </div>
                          {selectedFile && (
                             <div className="flex items-center gap-2 text-xs text-emerald-500 px-1 pt-1 animate-in fade-in slide-in-from-top-1">
                                <Check className="w-3 h-3" />
                                Ready to upload
                             </div>
                          )}
                       </div>
                    )}

                    {error && (
                       <div className="text-xs text-rose-500 font-medium px-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                          <div className="w-1 h-1 rounded-full bg-rose-500"/>
                          {error}
                       </div>
                    )}
                 </div>
                 
                 {/* Live Preview Section - Reusing actual ContentCard */}
                 {(title || link || content || selectedFile) && (
                    <div className="pt-2 pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3 px-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                            Live Preview
                        </div>
                        <div className="pointer-events-none opacity-100 transform scale-[0.98] origin-top">
                           {/* @ts-ignore */}
                           <ContentCard item={previewItem} />
                        </div>
                    </div>
                 )}

                 {/* Footer Button - White Solid */}
                 <div className="pt-2">
                    <button
                       onClick={addContent}
                       disabled={isLoading}
                       className="w-full rounded-lg bg-white text-black font-semibold text-sm py-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-white/5"
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
