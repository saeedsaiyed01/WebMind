import { Check, Edit, ExternalLink, FileText, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PdfIcon from "../../icons/pdf";
import { Xicon } from "../../icons/Xlogo";
import { updateContent } from "../../services/userServices";
import { AddContentCard } from "./AddContentCard";

interface CardProps {
  id?: string;
  title?: string;
  link?: string;
  originalLink?: string;
  type: "tweet" | "note" | "website" | "document" | "add";
  notes?: string;
  onDelete?: () => void;
  onNotesChange?: (notes: string) => void;
  onTitleChange?: (title: string) => void;
  onClick?: () => void;
  isAddCard?: boolean;
}

export function Card({
  id,
  title = "",
  link = "",
  originalLink = "",
  type,
  notes = "",
  onDelete,
  onTitleChange,
  onClick,
  isAddCard = false,
}: CardProps) {
  if (isAddCard || type === "add") {
    return <AddContentCard onClick={onClick || (() => {})} />;
  }

  // State for editing and notes
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const titleRef = useRef<HTMLInputElement>(null);

  // Focus title input when editing
  useEffect(() => {
    if (isEditing) titleRef.current?.focus();
  }, [isEditing]);

  // Tweet embed script loader
  useEffect(() => {
    if (type === "tweet" && originalLink) {
      const embedTweet = () => {
        if ((window as any).twttr?.widgets?.load) {
          (window as any).twttr.widgets.load();
        }
      };

      // Check if script already loaded
      if (document.getElementById("twitter-wjs")) {
        embedTweet();
      } else {
        const script = document.createElement("script");
        script.id = "twitter-wjs";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = embedTweet;
        document.body.appendChild(script);
      }
    }
  }, [type, originalLink]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(); // only trigger parent callback
  };

  const saveEdits = async () => {
    if (!id) return;
    await updateContent(id, editedTitle, notes);
    onTitleChange?.(editedTitle);
    setIsEditing(false);
  };
  const renderDocumentPreview = () => {
    if (type !== "document" || !link) return null;

    return (
      <div className="mt-4 h-48 flex items-center justify-center rounded border bg-gray-100 border-gray-300 dark:bg-[#1e1e1e] dark:border-[#333]">
        <div className="text-center h-20">
          <PdfIcon />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            PDF Document
          </p>
        </div>
      </div>
    );
  };

  const renderWebsitePreview = () => {
    if (type !== "website" || !link) return null;
    let hostname = "";
    try {
      hostname = new URL(link).hostname;
    } catch {
      return null;
    }
    return (
      <div className="bg-white  dark:bg-black rounded-lg shadow overflow-hidden mt-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}`}
              alt="favicon"
              className="w-6 h-6"
            />
            <h3 className="text-lg font-bold text-gray-800">{hostname}</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">Preview of {hostname}.</p>
        </a>
      </div>
    );
  };

  const renderTweet = () => {
    if (type !== "tweet" || !originalLink) return null;

    const tweetUrl = originalLink.startsWith("http")
      ? originalLink.replace("x.com", "twitter.com")
      : `https://${originalLink.replace("x.com", "twitter.com")}`;

    const currentTheme =
      localStorage.getItem("theme") === "dark" ? "dark" : "light";

    return (
      <div className="flex justify-center mt-0">
        <blockquote
          className="twitter-tweet"
          data-conversation="none"
          data-theme={currentTheme}
        >
          <a href={tweetUrl}></a>
        </blockquote>
      </div>
    );
  };

  return (
    <div className="break-inside-avoid mb-4" onClick={onClick}>
      <div className="rounded-lg overflow-hidden bg-white dark:bg-black border-2 hover:border-purple-300  hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center truncate space-x-2">
            <div className="text-blue-400">
              {type === "note" ? (
                <FileText size={18} />
              ) : type === "tweet" ? (
                <Xicon />
              ) : type === "document" ? (
                <FileText size={18} />
              ) : (
                <ExternalLink size={18} />
              )}
            </div>
            {isEditing ? (
              <input
                ref={titleRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdits();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 focus:outline-none w-full"
              />
            ) : (
              <h3 className="font-medium text-black dark:text-white truncate">
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!isEditing && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-400"
                >
                  <Edit size={16} />
                </button>
                {type === "tweet" && originalLink && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(originalLink, "_blank");
                    }}
                    className="p-1.5 rounded-full  hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-400"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                {type !== "tweet" && type !== "note" && link && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(link, "_blank");
                    }}
                    className="p-1.5 rounded-full  hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-400"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
            {isEditing && (
              <button
                onClick={saveEdits}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-green-500"
              >
                <Check size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {type === "note" && notes && (
            <div
              className={`rounded-xl border p-4 mt-2 font-medium text-sm whitespace-pre-wrap ${
                localStorage.getItem("theme") === "dark"
                  ? "bg-[#1e1e1e] border-[#333] text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            >
              {notes}
            </div>
          )}

          {type === "website" && renderWebsitePreview()}
          {type === "tweet" && renderTweet()}
          {type === "document" && renderDocumentPreview()}
        </div>
      </div>
    </div>
  );
}
