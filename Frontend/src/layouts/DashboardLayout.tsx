import { Button } from "@/components/ui/Button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import axios from "axios";
import {
  Bell,
  LogOut,
  Menu,
  Plus,
  Sun,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout, conversations, setConversations, setMessages } = useStore();
  const navigate = useNavigate();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
     const fetchConversations = async () => {
        try {
           const token = localStorage.getItem("token");
           if (!token) return;
           const res = await axios.get("http://localhost:8000/api/v1/conversations", {
              headers: { Authorization: `Bearer ${token}` }
           });
           setConversations(res.data);
        } catch (e) {
           // console.error("Failed to load history", e);
        }
     };
     fetchConversations();
  }, [setConversations]);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname]);

  const handleDeleteClick = (e: React.MouseEvent, convId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setConvToDelete(convId);
      setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
      if (!convToDelete) return;
      setIsDeleting(true);
      try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8000/api/v1/conversation/${convToDelete}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          setConversations(conversations.filter(c => c._id !== convToDelete));
          toast.success("Chat deleted successfully");
          
          if (location.pathname.includes(convToDelete)) {
              navigate('/chat');
          }
      } catch (error) {
          toast.error("Failed to delete chat");
      } finally {
          setIsDeleting(false);
          setDeleteModalOpen(false);
          setConvToDelete(null);
      }
  };

  return (
    <div className={cn(
      "h-screen bg-[#030303] text-zinc-100 overflow-hidden p-3 flex font-sans antialiased selection:bg-white/20",
      sidebarOpen ? "gap-3" : "gap-0"
    )}>
      
      {/* ==================== SIDEBAR ISLAND (Glassy) ==================== */}
      <aside
        className={cn(
          "w-[240px] bg-[#0C0C0C]/50 backdrop-blur-xl rounded-[24px] border border-white/[0.04] flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 shadow-2xl shadow-black/50 ml-1 my-1",
          sidebarOpen ? "opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full p-0 border-0 ml-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5">
            <div className="w-3 h-3 rounded-full border-[3px] border-black" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            WebMind
          </span>
        </div>

        {/* New Chat Button */}
        <div className="px-5 pb-4">
          <Button 
            onClick={() => {
               setMessages([]); // Clear current messages
               navigate('/chat');
            }}
            className="w-full justify-start gap-2.5 bg-white/[0.03] border border-white/[0.06] text-zinc-200 hover:bg-white/[0.08] hover:border-white/[0.1] rounded-xl h-10 px-4 font-medium text-[13px] transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>
        
        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
          {(() => {
            const grouped: Record<string, any[]> = {
              Today: [],
              Yesterday: [],
              "Previous 7 Days": [],
              Older: []
            };

            conversations.forEach(conv => {
              const date = new Date(conv.lastMessageAt || conv.createdAt);
              const now = new Date();
              const yesterday = new Date();
              yesterday.setDate(now.getDate() - 1);
              
              if (date.toDateString() === now.toDateString()) {
                // @ts-ignore
                grouped.Today.push(conv);
              } else if (date.toDateString() === yesterday.toDateString()) {
                // @ts-ignore
                grouped.Yesterday.push(conv);
              } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
                // @ts-ignore
                grouped["Previous 7 Days"].push(conv);
              } else {
                // @ts-ignore
                grouped.Older.push(conv);
              }
            });

            return Object.entries(grouped).map(([label, convs]) => (
              // @ts-ignore
              convs.length > 0 && (
                <div key={label}>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-2 px-2 sticky top-0 bg-[#0C0C0C]/90 backdrop-blur-md pb-1 pt-1 z-10">{label}</h3>
                  <div className="space-y-0.5">
                    {/* @ts-ignore */}
                    {convs.map((conv) => (
                      <Link
                        key={conv._id}
                        to={`/chat/${conv._id}`}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all group opacity-80 hover:opacity-100 relative pr-8",
                          location.pathname.includes(conv._id)
                            ? "bg-white/[0.08] text-white opacity-100"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                        )}
                      >
                        <span className="truncate flex-1">{conv.title || "New Chat"}</span>
                        
                        {/* Delete Button - Visible on Hover */}
                        <button
                            onClick={(e) => handleDeleteClick(e, conv._id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-rose-400 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ));
          })()}
          
          {conversations.length === 0 && (
              <div className="text-[11px] text-zinc-600 px-3 py-2 italic font-medium">
                  No history yet. Start a chat!
              </div>
          )}
        </nav>

        {/* User Profile - Sidebar */}
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-all cursor-pointer group shadow-sm active:scale-[0.98]">
            {/* Dynamic Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-indigo-500/20 transition-all">
               <span className="text-xs font-bold text-white uppercase tracking-wider">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">{user?.name || "User"}</p>
              <p className="text-[11px] text-zinc-600 truncate group-hover:text-zinc-500 transition-colors">{user?.email || "No Email"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="h-7 w-7 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg flex-shrink-0 transition-all">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ==================== RIGHT COLUMN: NAVBAR + MAIN ==================== */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 my-1 mr-1">
        
        {/* ==================== TOP NAVBAR ISLAND (Glassy) ==================== */}
        <header className="h-[52px] bg-[#0C0C0C]/50 backdrop-blur-xl rounded-full border border-white/[0.04] flex items-center justify-between px-3 flex-shrink-0 shadow-lg shadow-black/20">
          
          {/* Left: Sidebar Toggle + Navigation */}
          <div className="flex items-center gap-4">
            {location.pathname !== "/dashboard" && (
              <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)} 
                  className="text-zinc-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full active:scale-95"
              >
                  <Menu className="h-4 w-4" />
              </button>
            )}

            {/* Navigation Pills */}
            <div className="hidden md:flex items-center p-1 bg-[#050505]/80 border border-white/[0.06] rounded-full shadow-inner">
              <Link 
                to="/dashboard" 
                className={cn(
                  "px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-300",
                  location.pathname === "/dashboard" 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/chat" 
                className={cn(
                  "px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-300",
                  location.pathname === "/chat" || location.pathname === "/"
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                AI Chat
              </Link>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-200 rounded-full h-9 w-9 hover:bg-white/5 transition-colors active:scale-95">
              <Sun className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-200 rounded-full h-9 w-9 hover:bg-white/5 transition-colors active:scale-95">
              <Bell className="h-4 w-4" />
            </Button>
            
            {/* User Avatar - Navbar Top */}
            <div className="h-9 w-9 ml-1.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md">
               <span className="text-xs font-bold text-white uppercase tracking-wider">{user?.name?.charAt(0) || "U"}</span> 
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT ISLAND (Glassy) ==================== */}
        <main className="flex-1 bg-[#0C0C0C]/40 backdrop-blur-2xl rounded-[24px] border border-white/[0.04] overflow-hidden relative flex flex-col shadow-2xl shadow-black/50">
          {children}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
