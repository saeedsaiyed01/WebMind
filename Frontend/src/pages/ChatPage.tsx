import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Bot, Check, ChevronDown, Loader2, Mic, MoreVertical, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: number;
}

export function ChatPage() {
  const { user, selectedModel, credits, setCredits, addConversation, messages, setMessages } = useStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { id: conversationId } = useParams();
  const navigate = useNavigate();

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
         // Fetch conversation messages
         const res = await fetch(`http://localhost:8000/api/v1/conversation/${conversationId}`, {
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
    if (!inputValue.trim()) return;

    // ... existing credit check (commented out) ...

    const newMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage.content,
          model: activeModel.id,
          conversationId: conversationId // Pass ID if exists
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
    { id: "mistralai/devstral-2512:free", name: "Mistral Devstral" }
  ];

  const [showModels, setShowModels] = useState(false);
  const [showFooterModels, setShowFooterModels] = useState(false);
  // Default to first model if none selected
  const activeModel = selectedModel || SUPPORTED_MODELS[0];

  return (
    <DashboardLayout>
      <div 
        className="flex flex-col h-full relative" 
        onClick={() => { setShowModels(false); setShowFooterModels(false); }}
      >
        
        {/* Chat Header (Floating Top) */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.04]">
           <div className="flex items-center gap-3 relative">
              {/* Model Selector (Header - Optional) */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setShowModels(!showModels)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] transition-all text-zinc-200 font-medium text-[11px] group"
                >
                   {activeModel.name} <ChevronDown className={cn("h-3 w-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200", showModels ? "rotate-180" : "")} />
                </button>
                
                {/* Dropdown Menu */}
                {showModels && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    {SUPPORTED_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          // @ts-ignore
                          useStore.getState().setSelectedModel(model);
                          setShowModels(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[11px] hover:bg-white/[0.08] transition-colors flex items-center gap-2",
                          activeModel.id === model.id ? "text-emerald-400 font-medium bg-white/[0.03]" : "text-zinc-400"
                        )}
                      >
                        {activeModel.id === model.id && <Sparkles className="h-3 w-3" />}
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={async () => {
                   try {
                     const token = localStorage.getItem("token");
                     const res = await fetch("http://localhost:8000/api/v1/auth/refill", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` }
                     });
                     if (res.ok) {
                        setCredits(50);
                        alert("Refilled to 50 credits!");
                     }
                   } catch (e) { console.error(e); }
                }}
                className="hidden md:flex bg-[#BEF264]/10 text-[#BEF264] border border-[#BEF264]/20 pl-3 pr-4 py-1.5 rounded-xl text-[10px] font-semibold items-center gap-2 hover:bg-[#BEF264]/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                 <Sparkles className="h-3 w-3" /> 
                 {credits} Credits • Upgrade
              </button>
           </div>
           <button className="p-2 hover:bg-white/[0.05] rounded-xl text-zinc-500 transition-all">
              <MoreVertical className="h-4 w-4" />
           </button>
        </div>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {messages.length === 0 ? (
            /* Empty State / Hero */
            <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto text-center space-y-10">
               
               {/* Hero Icon & Text */}
               <div className="space-y-5">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                     {/* Swirl Effect Layers */}
                     <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-[25px] animate-pulse" />
                     <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-[spin_8s_linear_infinite]" />
                     <div className="absolute inset-1 border border-emerald-400/30 rounded-full border-t-transparent animate-[spin_12s_linear_infinite_reverse]" />
                     
                     <div className="relative w-12 h-12 bg-zinc-800 rounded-full border border-emerald-500/30 flex items-center justify-center shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-50" />
                        <Bot className="h-6 w-6 text-emerald-400 relative z-10" />
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
                         <Bot className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                   )}
                   <div className={cn(
                      "px-4 py-2.5 rounded-2xl max-w-[85%] text-[12px] leading-6",
                      msg.role === "user"
                         ? "bg-white text-black rounded-tr-sm"
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
                        <Bot className="h-3.5 w-3.5 text-emerald-400" />
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
        <div className="p-4 pt-0">
           <div className="max-w-2xl mx-auto">
              {/* REMOVED: border border-white/[0.08] */}
              <div className="relative bg-[#18181b] rounded-3xl shadow-2xl p-4 min-h-[120px] flex flex-col justify-between">
                 
                 {/* Input Field */}
                 <div className="relative z-10">
                    {!inputValue && (
                        <div className="absolute top-0 left-0 pointer-events-none flex items-center gap-2 text-zinc-500 text-sm p-1">
                           <Sparkles className="h-4 w-4 text-[#BEF264]/50" />
                           <span>Start your request, and let WebMind handle everything</span>
                        </div>
                    )}
                    {/* ADDED: outline-none to textarea */}
                    <textarea 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={(e) => {
                          if(e.key === "Enter" && !e.shiftKey) {
                             e.preventDefault();
                             handleSend();
                          }
                       }}
                       placeholder=""
                       className="w-full bg-transparent border-none focus-visible:ring-0 outline-none text-white text-sm p-1 min-h-[50px] resize-none placeholder:text-zinc-600 leading-relaxed font-medium z-10 relative"
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
                              <Sparkles className="h-3.5 w-3.5 text-emerald-500/70" /> 
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
                                       activeModel.id === model.id ? "text-emerald-400 font-medium bg-white/[0.03]" : "text-zinc-400"
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
                          disabled={loading || !inputValue.trim()}
                          size="icon"
                          className="bg-[#BEF264] text-black hover:bg-[#d4f88a] rounded-full h-9 w-9 shadow-lg shadow-[#BEF264]/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                       >
                          <Send className="h-4 w-4 ml-0.5" />
                       </Button>
                    </div>
                 </div>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-medium">
                  WebMind v1.0 may make errors. Check important information.
                </span>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
