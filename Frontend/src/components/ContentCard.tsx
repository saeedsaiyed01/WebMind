import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Check, ExternalLink, FilePenLine, FileText, Globe, Heart, ImageOff, Link2, MessageCircle, Repeat2, Share, StickyNote, Trash2, Twitter, X, Youtube } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ContentCardProps {
  item: {
    _id: string;
    title: string;
    type: "tweet" | "video" | "document" | "link" | "note";
    link?: string;
    content?: string;
    tags?: string[];
    createdAt?: string;
  };
  onDelete?: (id: string) => void;
  onEdit?: (item: any) => void;
  onUpdate?: (id: string, newTitle: string) => Promise<void>; // New prop for inline update
}

export function ContentCard({ item, onDelete, onEdit, onUpdate }: ContentCardProps) {
  const [imgError, setImgError] = useState(false);
  
  // Inline Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Time Ago Logic
  const timeAgo = useMemo(() => {
    if (!item.createdAt) return "";
    const date = new Date(item.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }, [item.createdAt]);
  
  // Sync state if prop changes
  useEffect(() => {
     if (!isEditing) setEditTitle(item.title);
  }, [item.title, isEditing]);

  // Focus effect
  useEffect(() => {
      if (isEditing && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isEditing]);

  const handleEditClick = () => {
     if (onUpdate) {
        setIsEditing(true);
     } else {
        onEdit?.(item); // Fallback to Modal if inline not supported
     }
  };

  const handleSave = async () => {
      if (!editTitle.trim()) {
          return; // Don't save empty
      }
      if (editTitle === item.title) {
          setIsEditing(false);
          return;
      }
      setIsSaving(true);
      if (onUpdate) {
         await onUpdate(item._id, editTitle);
      }
      setIsSaving(false);
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditTitle(item.title);
      setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') handleCancel();
  };

  const getIcon = () => {
    switch (item.type) {
      case "tweet": return <Twitter className="h-4 w-4 text-sky-500" />;
      case "video": return <Youtube className="h-4 w-4 text-red-500" />;
      case "document": return <FileText className="h-4 w-4 text-rose-500" />;
      case "link": return <Globe className="h-4 w-4 text-emerald-500" />;
      case "note": return <StickyNote className="h-4 w-4 text-amber-400" />;
      default: return <Link2 className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  };

  // Determine content type
  // Determine content type
  const isTwitter = item.type === "tweet" || (item.link && (item.link.includes("twitter.com") || item.link.includes("x.com")));
  const isYoutube = item.type === "video" || (item.link && (item.link.includes("youtube.com") || item.link.includes("youtu.be")));
  const ytEmbed = isYoutube && item.link ? getYoutubeEmbed(item.link) : null;
  const isImageStart = !isTwitter && !isYoutube && item.link && (item.link.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || item.link.includes("cloudinary"));

  const tweetContainerRef = useRef<HTMLDivElement>(null);
  const [tweetEmbedFailed, setTweetEmbedFailed] = useState(false);

  const extractTweetId = (text?: string) => {
    if (!text) return null;
    // Improved regex to handle various twitter/x url formats
    const match = text.match(/(?:twitter|x)\.com\/.*\/status\/(\d+)/);
    return match ? match[1] : null;
  };
  const tweetId = (isTwitter) ? (extractTweetId(item.link) || extractTweetId(item.content)) : null;

  useEffect(() => {
    let isCancelled = false;

    if (isTwitter && tweetId && tweetContainerRef.current) {
      setTweetEmbedFailed(false); // Reset error state

      const renderTweet = () => {
         if (isCancelled) return;
         // @ts-ignore
         if (window.twttr?.widgets && tweetContainerRef.current) {
            tweetContainerRef.current.innerHTML = ""; // Ensure clear before render
            // @ts-ignore
            window.twttr.widgets.createTweet(
              tweetId,
              tweetContainerRef.current,
              {
                theme: 'dark',
                dnt: true,
                align: 'center'
              }
            ).then((el: any) => {
                if (isCancelled) {
                    if (el) el.remove();
                    return;
                }
                if (!el) {
                    setTweetEmbedFailed(true);
                }
            });
         }
      };

      // @ts-ignore
      if (!window.twttr) {
         if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.onload = () => {
                if (!isCancelled) renderTweet();
            };
            document.body.appendChild(script);
         } else {
             const interval = setInterval(() => {
                 // @ts-ignore
                 if (window.twttr?.widgets) {
                     clearInterval(interval);
                     if (!isCancelled) renderTweet();
                 }
             }, 100);
             return () => {
                 isCancelled = true;
                 clearInterval(interval);
             };
         }
      } else {
         renderTweet();
      }
    } else if (isTwitter && !tweetId) {
        setTweetEmbedFailed(true);
    }

    return () => {
        isCancelled = true;
        if (tweetContainerRef.current) {
            tweetContainerRef.current.innerHTML = "";
        }
    };
  }, [isTwitter, tweetId]);

  return (
    <Card 
      className="group relative bg-[#0C0C0C] border border-white/[0.05] hover:border-white/20 text-zinc-200 transition-all duration-300 overflow-hidden flex flex-col mb-4 break-inside-avoid rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-row items-center justify-between p-4 border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex gap-3 min-w-0 flex-1 items-center">
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/[0.06] shrink-0">
             {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0 mr-2 flex flex-col justify-center">
             {isEditing ? (
                 <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-zinc-900/80 border border-zinc-700 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                        placeholder="Content Title"
                    />
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 p-1 rounded-md transition-colors"
                    >
                        {isSaving ? <span className="w-3 h-3 block rounded-full border border-emerald-500 border-t-transparent animate-spin"/> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                         onClick={handleCancel}
                         className="bg-red-500/10 text-red-500 hover:bg-red-500/20 p-1 rounded-md transition-colors"
                    >
                         <X className="w-3.5 h-3.5" />
                    </button>
                 </div>
             ) : (
                <div className="flex flex-col gap-0.5 min-w-0">
                     <CardTitle className="text-sm font-semibold truncate text-zinc-200 tracking-tight leading-none" title={item.title}>
                       {item.title}
                     </CardTitle>
                     <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                        {timeAgo || "Recently"}
                     </span>
                </div>
             )}
          </div>
        </div>
        
        {/* Actions - Hidden if filtering */}
        {!isEditing && (
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 -mr-2">
                 <button 
                    onClick={handleEditClick} 
                    className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-white/[0.08] transition-colors"
                    title="Edit Title"
                 >
                    <FilePenLine className="h-3.5 w-3.5" />
                 </button>
                 {item.link && (
                     <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-white/[0.08] transition-colors"
                        title="Open Link"
                     >
                        <ExternalLink className="h-3.5 w-3.5" />
                     </a>
                 )}
                 <button 
                    onClick={() => onDelete?.(item._id)} 
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                 >
                    <Trash2 className="h-3.5 w-3.5" />
                 </button>
            </div>
        )}
      </div>
      
      <CardContent className="p-0 flex-1 relative bg-black/20 min-h-[50px]">
        {/* Content Preview Area */}
        {ytEmbed ? (
           <div className="w-full aspect-video">
             <iframe 
               src={ytEmbed} 
               title={item.title}
               className="w-full h-full object-cover"
               allowFullScreen
             />
           </div>
        ) : isTwitter && !tweetEmbedFailed ? (
           <div className="w-full overflow-hidden flex justify-center bg-transparent px-3 py-3">
               <div ref={tweetContainerRef} className="w-full flex justify-center min-h-[150px]" />
           </div>
        ) : isImageStart ? (
           <div className="w-full h-full">
             {!imgError ? (
               <img 
                 src={item.link} 
                 alt={item.title} 
                 onError={() => setImgError(true)}
                 className="w-full h-auto object-cover hover:opacity-90 transition-opacity" 
               />
             ) : (
                <div className="w-full h-32 bg-zinc-900/30 flex flex-col items-center justify-center text-zinc-800 gap-2 border-t border-white/[0.02]">
                   <ImageOff className="h-6 w-6 opacity-30" />
                </div>
             )}
           </div>
        ) : (
           // Default Text / Note 
           <div className="p-5 flex flex-col justify-start h-full">
              {item.type === 'tweet' ? (
                 /* Static Tweet Fallback */
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                             {item.title.substring(0, 1)}
                          </div>
                          <div className="flex flex-col leading-none">
                             <span className="text-sm font-semibold text-zinc-200">{item.title}</span>
                             <span className="text-[11px] text-zinc-500">@{item.title.replace(/\s+/g, '').toLowerCase()}</span>
                          </div>
                       </div>
                       <Twitter className="w-4 h-4 text-sky-500 fill-current" />
                    </div>
                    <div className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                       {item.content || item.link || "No content."}
                    </div>
                    <div className="flex items-center justify-between pt-2 text-zinc-600">
                       <div className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer group">
                           <div className="p-1.5 rounded-full group-hover:bg-sky-500/10"><MessageCircle className="w-3.5 h-3.5" /></div>
                       </div>
                       <div className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-pointer group">
                           <div className="p-1.5 rounded-full group-hover:bg-green-500/10"><Repeat2 className="w-3.5 h-3.5" /></div>
                       </div>
                       <div className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer group">
                           <div className="p-1.5 rounded-full group-hover:bg-rose-500/10"><Heart className="w-3.5 h-3.5" /></div>
                       </div>
                       <div className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer group">
                           <div className="p-1.5 rounded-full group-hover:bg-sky-500/10"><Share className="w-3.5 h-3.5" /></div>
                       </div>
                    </div>
                 </div>
              ) : item.type === 'note' ? (
                 <div className="text-sm text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {item.content || item.link || "No content."}
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-80 py-8">
                    <Globe className="h-8 w-8 stroke-[1.5]" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Link Preview</span>
                     <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400/80 hover:text-blue-400 underline decoration-blue-400/30 underline-offset-4 max-w-full break-all text-center px-4">
                        {item.link || "No link provided"}
                     </a>
                </div>
              )}
           </div>
        )}
      </CardContent>
    </Card>
  );
}
