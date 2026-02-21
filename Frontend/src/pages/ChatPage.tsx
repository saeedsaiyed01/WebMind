import { Button } from "@/components/ui/Button";
import SEO from "@/components/SEO";
import { AttachedDocumentChip, ContentItem, DocumentMentionPopup } from "@/components/ui/DocumentMentionPopup";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Bot, Check, ChevronDown, Loader2, Mic, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: number;
}

export function ChatPage() {
  const { user, selectedModel, setCredits, addConversation, messages, setMessages } = useStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { id: conversationId } = useParams();
  const navigate = useNavigate();

  const [attachedDocuments, setAttachedDocuments] = useState<ContentItem[]>([]);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [availableDocuments, setAvailableDocuments] = useState<ContentItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null);

  // Fetch documents for @ mention autocomplete
  const fetchDocuments = useCallback(async (query: string = "") => {
    setDocumentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const url = query 
        ? `${API_BASE}/api/v1/content/search?q=${encodeURIComponent(query)}`
        : `${API_BASE}/api/v1/content`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        const docs = data.results || data.content || [];
        // Filter out already attached documents
        const filtered = docs.filter(
          (d: ContentItem) => !attachedDocuments.some(ad => ad._id === d._id)
        );
        setAvailableDocuments(filtered);
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
      setAvailableDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  }, [attachedDocuments]);

  // Detect @ mentions in input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputValue(value);

    // Find if we're in an @ mention context (letters, numbers, spaces allowed after @)
    const textBeforeCursor = value.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@([a-zA-Z0-9\s]*)$/);

    if (atMatch) {
      const query = atMatch[1] || "";
      setMentionQuery(query);
      setMentionStartPos(cursorPos - query.length - 1); // Position of @
      setShowMentionPopup(true);
      setMentionIndex(0);
      fetchDocuments(query);
    } else {
      setShowMentionPopup(false);
      setMentionQuery("");
      setMentionStartPos(null);
    }
  };

  // Handle document selection from popup
  const handleDocumentSelect = (doc: ContentItem) => {
    setAttachedDocuments(prev => [...prev, doc]);
    
    // Remove the @query from input
    if (mentionStartPos !== null) {
      const beforeMention = inputValue.substring(0, mentionStartPos);
      const afterMention = inputValue.substring(mentionStartPos + mentionQuery.length + 1);
      setInputValue(beforeMention + afterMention);
    }
    
    setShowMentionPopup(false);
    setMentionQuery("");
    setMentionStartPos(null);
    textareaRef.current?.focus();
  };

  // Remove attached document
  const handleRemoveDocument = (docId: string) => {
    setAttachedDocuments(prev => prev.filter(d => d._id !== docId));
  };

  // Load conversation when ID changes
  useEffect(() => {
    const loadConversation = async () => {
       if (!conversationId) {
          // Do NOT clear messages here. Let them persist.
          // setMessages([]); 
          return;
       }
       
       try {
         const token = localStorage.getItem("token");
         const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
         // Fetch conversation messages
         const res = await fetch(`${API_BASE}/api/v1/conversation/${conversationId}`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (res.ok) {
            const history = await res.json();
            // Map backend history to frontend format
            const mapped = history.map((msg: any) => [
               { role: "user", content: msg.message, timestamp: msg.createdAt },
               { role: "assistant", content: msg.response, timestamp: msg.createdAt }
            ]).flat();
            setMessages(mapped);
         }
       } catch (e) { console.error("Failed to load chat", e); }
    };
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && attachedDocuments.length === 0) return;

    // Build message content with attached doc info for display
    const messageContent = inputValue.trim();

    const newMessage: Message = {
      role: "user",
      content: messageContent,
      timestamp: Date.now(),
    };

    // Store attached doc IDs before clearing
    const attachedDocIds = attachedDocuments.map(d => d._id);

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setAttachedDocuments([]); // Clear after send
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage.content,
          model: activeModel.id,
          conversationId: conversationId,
          attachedDocumentIds: attachedDocIds // Send attached doc IDs for focused search
        })
      });

      const data = await res.json();
      
      if (data.answer) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.answer, 
            timestamp: Date.now() 
          }
        ]);
        
        // Handle New Conversation Creation
        if (data.conversationId && data.conversationId !== conversationId) {
            // Update URL
            navigate(`/chat/${data.conversationId}`, { replace: true });
            
            // Add to Sidebar Store (so it appears immediately)
            addConversation({
               _id: data.conversationId,
               title: newMessage.content.substring(0, 20) + "...",
               lastMessageAt: new Date()
            });
        }

        // Update credits
        if (data.remainingCredits !== undefined) {
            setCredits(data.remainingCredits);
        }
      }
    } catch (error) {
      console.error("Chat failed", error);
      setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: "Sorry, something went wrong. Please try again.", 
            timestamp: Date.now() 
          }
        ]);
    } finally {
      setLoading(false);
    }
  };

  // Models configuration
  const SUPPORTED_MODELS = [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B" },
    { id: "openai/gpt-oss-20b:free", name: "GPT OSS 20B" },
    { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" }
  ];

  const [_showModels, setShowModels] = useState(false);
  const [showFooterModels, setShowFooterModels] = useState(false);
  // Default to first model if none selected
  const activeModel = selectedModel || SUPPORTED_MODELS[0];

  return (
    <DashboardLayout>
      <SEO title="Chat — WebMind" noindex={true} />
      <div 
        className="flex flex-col h-full relative" 
        onClick={() => { setShowModels(false); setShowFooterModels(false); }}
      >
        
        {/* Chat Header (Floating Top) */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.04] opacity-0 pointer-events-none h-0 p-0 overflow-hidden">
        </div>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {messages.length === 0 ? (
            /* Empty State / Hero */
            <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto text-center space-y-10">
               
               {/* Hero Icon & Text */}
               <div className="space-y-5">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                     {/* Swirl Effect Layers - Monochrome Glass */}
                     <div className="absolute inset-0 bg-white/5 rounded-full blur-[25px] animate-pulse" />
                     <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-[spin_8s_linear_infinite]" />
                     <div className="absolute inset-1 border border-white/20 rounded-full border-t-transparent animate-[spin_12s_linear_infinite_reverse]" />
                     
                     <div className="relative w-12 h-12 bg-zinc-900 rounded-full border border-white/10 flex items-center justify-center shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                        <Bot className="h-6 w-6 text-white relative z-10" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <h1 className="text-2xl font-bold text-white tracking-tight">Welcome, {user?.name || "User"}</h1>
                     <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                        Start by scripting a task, and let WebMind take over. 
                        Not sure where to start?
                     </p>
                  </div>
               </div>


            </div>
          ) : (
            /* Message List */
            <div ref={scrollRef} className="space-y-5 max-w-2xl mx-auto">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex w-full gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                   {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-1">
                         <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                   )}
                   <div className={cn(
                      "px-4 py-2.5 rounded-2xl max-w-[85%] text-[12px] leading-6",
                      msg.role === "user"
                         ? "bg-zinc-800 text-white border border-zinc-700 rounded-tr-sm"
                         : "bg-white/[0.04] backdrop-blur-sm text-zinc-200 border border-white/[0.06] rounded-tl-sm"
                   )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                   </div>
                   {/* User Avatar - Gmail Style */}
                   {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1 border border-white/10 shadow-sm transition-all hover:scale-105">
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider select-none">
                           {user?.name?.charAt(0) || "U"}
                         </span>
                      </div>
                   )}
                </div>
              ))}
              {loading && (
                 <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-white/[0.04] backdrop-blur-sm px-4 py-2.5 rounded-2xl rounded-tl-sm border border-white/[0.06]">
                       <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area (Nested at Bottom - Glassy) */}
        <div className="p-2 md:p-4 pt-0">
           <div className="max-w-2xl mx-auto">
              {/* REMOVED: border border-white/[0.08] */}
              <div className="relative bg-[#18181b] rounded-3xl shadow-2xl p-3 md:p-4 min-h-[80px] md:min-h-[120px] flex flex-col justify-between">
                 
                 {/* @ Mention Popup */}
                 <DocumentMentionPopup
                    isOpen={showMentionPopup}
                    searchQuery={mentionQuery}
                    documents={availableDocuments}
                    selectedIndex={mentionIndex}
                    onSelect={handleDocumentSelect}
                    onClose={() => setShowMentionPopup(false)}
                    loading={documentsLoading}
                 />
                 
                 {/* Attached Documents Chips */}
                 {attachedDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-white/[0.06]">
                       {attachedDocuments.map(doc => (
                          <AttachedDocumentChip
                             key={doc._id}
                             document={doc}
                             onRemove={() => handleRemoveDocument(doc._id)}
                          />
                       ))}
                    </div>
                 )}
                 
                 {/* Input Field */}
                 <div className="relative z-10">
                    {!inputValue && attachedDocuments.length === 0 && (
                        <div className="absolute top-0 left-0 pointer-events-none flex items-center gap-2 text-zinc-500 text-sm p-1">
                           <Sparkles className="h-4 w-4 text-zinc-500" />
                           <span>Type @ to attach docs, or start your request</span>
                        </div>
                    )}
                    {/* ADDED: outline-none to textarea */}
                    <textarea 
                       ref={textareaRef}
                       value={inputValue}
                       onChange={handleInputChange}
                       onKeyDown={(e) => {
                          // Handle popup navigation when popup is open
                          if (showMentionPopup) {
                             if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setMentionIndex(prev => Math.max(0, prev - 1));
                             } else if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setMentionIndex(prev => Math.min(availableDocuments.length - 1, prev + 1));
                             } else if (e.key === "Enter") {
                                e.preventDefault();
                                if (availableDocuments[mentionIndex]) {
                                   handleDocumentSelect(availableDocuments[mentionIndex]);
                                }
                             } else if (e.key === "Escape") {
                                e.preventDefault();
                                setShowMentionPopup(false);
                             }
                             return;
                          }
                          
                          // Normal enter to send
                          if(e.key === "Enter" && !e.shiftKey) {
                             e.preventDefault();
                             handleSend();
                          }
                       }}
                       placeholder=""
                       className="w-full bg-transparent border-none focus-visible:ring-0 outline-none text-white text-sm p-1 min-h-[40px] md:min-h-[50px] resize-none placeholder:text-zinc-600 leading-relaxed font-medium z-10 relative"
                       style={{ whiteSpace: 'pre-wrap' }}
                    />
                 </div>
                 
                 {/* Bottom: Tools & Send */}
                 <div className="flex items-center justify-between pt-1 relative z-10">
                    
                    {/* Left Tools */}
                    <div className="flex items-center gap-1">
                       
                       {/* Model Toggle Only */}
                       <div className="relative" onClick={(e) => e.stopPropagation()}>
                          {/* REMOVED: border from button */}
                          <button 
                             onClick={() => setShowFooterModels(!showFooterModels)}
                             className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800/50 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-all"
                             title="Select Model"
                          >
                              <Sparkles className="h-3.5 w-3.5 text-zinc-400" /> 
                              <span className="truncate max-w-[100px]">{activeModel.name}</span>
                              <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform duration-200", showFooterModels ? "rotate-180" : "")} />
                          </button>
                          
                          {showFooterModels && (
                              <div className="absolute bottom-full left-0 mb-2 w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                                 {SUPPORTED_MODELS.map((model) => (
                                   <button
                                     key={model.id}
                                     onClick={() => {
                                        // @ts-ignore
                                        useStore.getState().setSelectedModel(model);
                                        setShowFooterModels(false);
                                     }}
                                     className={cn(
                                       "w-full text-left px-3 py-2 text-[11px] hover:bg-white/[0.08] transition-colors flex items-center gap-2",
                                       activeModel.id === model.id ? "text-white font-medium bg-white/[0.05]" : "text-zinc-400"
                                     )}
                                   >
                                     <span className="flex-1 truncate">{model.name}</span>
                                     {activeModel.id === model.id && <Check className="h-3 w-3" />}
                                   </button>
                                 ))}
                              </div>
                          )}
                       </div>
                    </div>

                    {/* Right Tools: Mic & Send */}
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] rounded-full h-9 w-9 transition-colors">
                          <Mic className="h-4 w-4" />
                       </Button>
                       <Button 
                          onClick={handleSend} 
                          disabled={loading || (!inputValue.trim() && attachedDocuments.length === 0)}
                          size="icon"
                          className="bg-white text-black hover:bg-zinc-200 rounded-full h-9 w-9 shadow-lg shadow-white/10 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                       >
                          <Send className="h-4 w-4 ml-0.5" />
                       </Button>
                    </div>
                 </div>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-medium">
                  WebMind may make errors. Check important information.
                </span>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
