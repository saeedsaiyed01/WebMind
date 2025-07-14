  // CreateContentModal.tsx
  import axios from "axios";
import { Check, FileText, Globe, Link2, Loader2, StickyNote, Twitter, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "./Button";
import { InputBox } from "./InputBox";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  enum ContentType {
    Tweet = "tweet",
    Note = "note",
    Document = "document",
    Website = "website",
  }

  interface CreateContentModalProps {
    onOpen: boolean;
    onClose: () => void;
    onContentAdded?: () => void;
  }

  export function CreateContentModal({ onOpen, onClose, onContentAdded }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [type, setType] = useState<ContentType>(ContentType.Tweet);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
      if (titleRef.current) titleRef.current.value = "";
      if (linkRef.current) linkRef.current.value = "";
      if (contentRef.current) contentRef.current.value = "";
      setSelectedFile(null);
      setError(null);
      setIsLoading(false);
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }, []);

    useEffect(() => {
      resetForm();
    }, [type, resetForm]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      if (onOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onOpen, onClose]);

    const addContent = async () => {
      setError(null);
      const title = titleRef.current?.value || "";
      if (!title.trim()) {
        setError("Title is required.");
        return;
      }
      
      // Type-specific inline validations
      if (type === ContentType.Document && !selectedFile) {
        setError("Please upload a PDF file.");
        return;
      }
      if (type === ContentType.Note && !(contentRef.current?.value || "").trim()) {
        setError("Note content is required.");
        return;
      }
      if ((type === ContentType.Tweet || type === ContentType.Website)) {
        const url = linkRef.current?.value || "";
        if (!url.trim()) {
          const requiredField = type === ContentType.Tweet ? "Tweet link" : "Website link";
          setError(`${requiredField} is required.`);
          return;
        }
        try {
          new URL(url);
        } catch (_) {
          setError("Please enter a valid URL (e.g., https://example.com).");
          return;
        }
      }

      setIsLoading(true);
      try {
        if (type === ContentType.Document) {
          const formData = new FormData();
          formData.append("file", selectedFile!);
          formData.append("title", title);
          await axios.post(`${BACKEND_URL}/upload-document`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token") || "",
            },
          });
          setTimeout(() => {
            toast.success("Content saved successfully.", {
              icon: <Check className="w-5 h-5 text-green-500" />,
            });
          }, 200);
        } else {
          const payload: any = { title, type };
          if (type === ContentType.Note) {
            payload.content = contentRef.current?.value || "";
          } else {
            payload.url = linkRef.current?.value || "";
          }
          await axios.post(`${BACKEND_URL}/memory`, payload, {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          });
          toast.success("Content saved successfully.", {
            icon: <Check className="w-5 h-5 text-green-500" />,
          });
        }
        resetForm();
        onClose();
        onContentAdded?.();
      } catch (err: any) {
        console.error("API Error:", err);
        const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    const getTypeIcon = (contentType: ContentType) => {
      switch (contentType) {
        case ContentType.Tweet:
          return <Twitter className="h-4 w-4 mr-1.5" />;
        case ContentType.Note:
          return <StickyNote className="h-4 w-4 mr-1.5" />;
        case ContentType.Document:
          return <FileText className="h-4 w-4 mr-1.5" />;
        case ContentType.Website:
          return <Globe className="h-4 w-4 mr-1.5" />;
        default:
          return null;
      }
    };

    if (!onOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-gray-950 text-gray-200 rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-gray-700"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <h2 className="text-2xl font-semibold flex items-center text-white">
                <Link2 className="inline-block mr-3 h-6 w-6 text-orange-500" />
                Add Content
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-orange-500 transition-colors rounded-full p-1 -mr-2"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Type Selection */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
           
              <Button
                text="Note"
                size="sm"
                onClick={() => setType(ContentType.Note)}
                variant={type === ContentType.Note ? "orange" : "secondary"}
                icon={getTypeIcon(ContentType.Note)}
              />
              <Button
                text="Website"
                size="sm"
                onClick={() => setType(ContentType.Website)}
                variant={type === ContentType.Website ? "orange" : "secondary"}
                icon={getTypeIcon(ContentType.Website)}
              />
              <Button
                text="Document"
                size="sm"
                onClick={() => setType(ContentType.Document)}
                variant={type === ContentType.Document ? "orange" : "secondary"}
                icon={getTypeIcon(ContentType.Document)}
              />
                 <Button
                text="Tweet"
                size="sm"
                onClick={() => setType(ContentType.Tweet)}
                variant={type === ContentType.Tweet ? "orange" : "secondary"}
                icon={getTypeIcon(ContentType.Tweet)}
              />
            </div>

            {/* Input Area */}
            <div className="space-y-4 mb-6">
              <InputBox
                label="Title"
                reference={titleRef}
                placeholder="Give your content a title..."
                className="w-full"
                required
                error={error && error.includes("Title") ? error : undefined}
              />

              {type === ContentType.Note && (
                <InputBox
                  label="Note Content"
                  isTextArea={true}
                  reference={contentRef}
                  placeholder="Write your note here..."
                  className="min-h-[100px]"
                  required
                  error={error && error.includes("Note") ? error : undefined}
                />
              )}

              {(type === ContentType.Tweet || type === ContentType.Website) && (
                <InputBox
                  label={type === ContentType.Tweet ? "Tweet URL" : "Website URL"}
                  reference={linkRef}
                  placeholder={type === ContentType.Tweet ? "https://twitter.com/..." : "https://example.com"}
                  type="url"
                  required
                  error={
                    error && (error.includes("link") || error.includes("URL"))
                      ? error
                      : undefined
                  }
                />
              )}

              {type === ContentType.Document && (
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium text-gray-400 mb-1">
                    PDF Document (Max 10MB)
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className={`w-full px-3 py-2 bg-gray-900 text-white border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                      error && (error.includes("PDF") || error.includes("size"))
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-700"
                    }`}
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-400 mt-1.5">Selected: {selectedFile.name}</p>
                  )}
                  {error && (error.includes("PDF") || error.includes("size")) && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
              )}
            </div>


            {error &&
              !(
                error.includes("PDF") ||
                error.includes("size") ||
                error.includes("Note") ||
                error.includes("link") ||
                error.includes("URL")
              ) && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

            <div className="mt-6 flex justify-end">
              <Button
                text={isLoading ? "Submitting..." : "Submit Content"}
                onClick={addContent}
                size="md"
                variant="orange"
                disabled={isLoading}
                icon={isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                className="min-w-[150px] justify-center"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  export default CreateContentModal;
