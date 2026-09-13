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
      className="card-aurum group relative mb-4 flex flex-col overflow-hidden break-inside-avoid text-card-foreground"
    >
      <div className="flex flex-row items-center justify-between border-b border-border bg-background/30 p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="shrink-0 rounded-lg border border-border bg-background/60 p-2">
             {getIcon()}
          </div>

          <div className="mr-2 flex min-w-0 flex-1 flex-col justify-center">
             {isEditing ? (
                 <div className="flex w-full items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-md border border-border bg-background/80 px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50"
                        placeholder="Content Title"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-md bg-gold/10 p-1 text-gold transition-colors hover:bg-gold/20"
                    >
                        {isSaving ? <span className="block h-3 w-3 animate-spin rounded-full border border-gold border-t-transparent"/> : <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                         onClick={handleCancel}
                        className="rounded-md bg-destructive/10 p-1 text-destructive transition-colors hover:bg-destructive/20"
                    >
                         <X className="h-3.5 w-3.5" />
                    </button>
                 </div>
             ) : (
                <div className="flex min-w-0 flex-col gap-0.5">
                     <CardTitle className="truncate text-sm font-semibold leading-none tracking-tight text-foreground" title={item.title}>
                       {item.title}
                     </CardTitle>
                     <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {timeAgo || "Recently"}
                     </span>
                </div>
             )}
          </div>
        </div>

        {!isEditing && (
            <div className="-mr-2 flex items-center gap-1 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
                 <button
                    onClick={handleEditClick}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    title="Edit Title"
                 >
                    <FilePenLine className="h-3.5 w-3.5" />
                 </button>
                 {item.link && (
                     <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        title="Open Link"
                     >
                        <ExternalLink className="h-3.5 w-3.5" />
                     </a>
                 )}
                 <button
                    onClick={() => onDelete?.(item._id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                 >
                    <Trash2 className="h-3.5 w-3.5" />
                 </button>
            </div>
        )}
      </div>

      <CardContent className="relative min-h-[50px] flex-1 p-0">
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
                <div className="w-full h-32 flex flex-col items-center justify-center gap-2 border-t border-border bg-muted/30 text-muted-foreground/50">
                   <ImageOff className="h-6 w-6 opacity-50" />
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
                             <span className="text-sm font-semibold text-foreground">{item.title}</span>
                             <span className="text-[11px] text-muted-foreground">@{item.title.replace(/\s+/g, '').toLowerCase()}</span>
                          </div>
                       </div>
                       <Twitter className="w-4 h-4 text-sky-500 fill-current" />
                    </div>
                    <div className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                       {item.content || item.link || "No content."}
                    </div>
                    <div className="flex items-center justify-between pt-2 text-muted-foreground">
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
                 <div className="text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {item.content || item.link || "No content."}
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-80 py-8">
                    <Globe className="h-8 w-8 stroke-[1.5]" />
                    <span className="text-overline">Link Preview</span>
                     <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gold/80 hover:text-gold underline decoration-gold/30 underline-offset-4 max-w-full break-all text-center px-4">
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
