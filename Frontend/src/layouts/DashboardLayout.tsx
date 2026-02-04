import { Button } from "@/components/ui/Button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import UserModal from "@/components/ui/UserModal";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import axios from "axios";
import {
  Brain,
  CreditCard,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Trash2,
  X
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
  const { user, logout, conversations, setConversations, setMessages, credits, setCredits } = useStore();
  const navigate = useNavigate();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const fetchCredits = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/plan`, {
            headers: { 'Authorization': `${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          }
        } catch (error) {
          console.error('Failed to fetch credits:', error);
        }
    };
    fetchCredits();
  }, [setCredits]);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setSidebarOpen(false);
    } else {
      // Only auto-open sidebar on desktop
      if (window.innerWidth >= 768) {
         setSidebarOpen(true);
      } else {
         setSidebarOpen(false);
      }
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
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
           className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
           onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR ISLAND (Glassy) ==================== */}
      <aside
        className={cn(
          "bg-[#0C0C0C]/90 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 shadow-2xl z-50 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_50px_rgba(0,0,0,0.55)]",
          // Mobile Styles (Fixed Overlay)
          "fixed inset-y-0 left-0 h-full w-[280px]",
          // Desktop Styles (Relative Island)
          "md:relative md:rounded-[24px] md:border md:border-white/[0.06] md:bg-[#0C0C0C]/55 md:shadow-black/50 md:ml-1 md:my-1 md:h-auto md:w-[240px] md:ring-1 md:ring-white/10 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_22px_60px_rgba(0,0,0,0.6)]",
          
          sidebarOpen 
            ? "translate-x-0 opacity-100" 
            : "-translate-x-full opacity-0 md:w-0 md:ml-0 md:border-0 md:p-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-5">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-white/5">
            <Brain className="text-white" />
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-indigo-500/20 transition-all overflow-hidden">
               {user?.avatar ? (
                 <img src={user.avatar} alt={user?.name || "User"} className="h-full w-full object-cover" />
               ) : (
                 <span className="text-xs font-bold text-white uppercase tracking-wider">{user?.name?.charAt(0) || "U"}</span>
               )}
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
        <header
          className={cn(
            "h-[52px] bg-[#0C0C0C]/55 backdrop-blur-xl rounded-2xl md:rounded-full border border-white/[0.06] flex items-center justify-between px-2 md:px-3 flex-shrink-0 shadow-lg shadow-black/20 relative z-50 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_40px_rgba(0,0,0,0.55)] overflow-hidden min-w-0 max-w-full",
            sidebarOpen ? "hidden md:flex" : "flex"
          )}
        >
          
          {/* Left: Sidebar Toggle + Navigation */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* Mobile: History Sidebar Toggle (Chat Only) */}
            {location.pathname.startsWith('/chat') && (
              <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="md:hidden text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full active:scale-95 -mr-2"
              >
                  <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Mobile: WebMind Logo */}
            <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
               <Brain className="h-5 w-5 text-zinc-100" />
               <span className="text-sm font-bold text-white">WebMind</span>
            </div>

            {location.pathname !== "/dashboard" && (
              <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)} 
                  className="hidden md:block text-zinc-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full active:scale-95"
              >
                  <Menu className="h-4 w-4" />
              </button>
            )}

            {/* Desktop Navigation Pills */}
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

            {/* Credit Display */}
            <div className="hidden md:flex items-center gap-2 pl-2">
               <button 
                  onClick={() => navigate('/pricing')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all group"
               >
                   <div className="w-3.5 h-3.5 rounded bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full border-[1.5px] border-black" />
                   </div>
                   <span>{credits !== null ? credits : '...'} Credits</span>
                   <span className="w-[1px] h-3 bg-white/10 mx-1" />
                   <span className="text-zinc-500 hover:text-white transition-colors">Upgrade</span>
               </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
             {/* Mobile Menu Toggle */}
              <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="md:hidden text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full active:scale-95"
              >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            <div className="hidden md:flex items-center gap-1.5" />
            
            {/* User Avatar - Navbar Top (Visible on all) */}
            <div className="relative">
              <div 
                onClick={() => setUserModalOpen(true)}
                className="h-9 w-9 ml-1.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                 {user?.avatar ? (
                   <img src={user.avatar} alt={user?.name || "User"} className="h-full w-full object-cover" />
                 ) : (
                   <span className="text-xs font-bold text-white uppercase tracking-wider">{user?.name?.charAt(0) || "U"}</span>
                 )}
              </div>
              {userModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
             <div className="absolute top-[60px] right-0 left-0 bg-[#0C0C0C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col space-y-2 md:hidden shadow-2xl z-50 mx-2 animate-in slide-in-from-top-2">
                 <button 
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <LayoutGrid className="h-4 w-4" />
                    Dashboard
                </button>
                <button 
                    onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium transition-colors ${location.pathname.startsWith('/chat') ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                >
                     <Brain className="h-4 w-4" />
                    AI Chat
                </button>
                <div className="h-px bg-white/10 my-2" />
                <button 
                    onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    <CreditCard className="h-4 w-4" />
                    <span>{credits !== null ? credits : '...'} Credits (Upgrade)</span>
                </button>
             </div>
          )}
        </header>

        {/* ==================== MAIN CONTENT ISLAND (Glassy) ==================== */}
        <main className="flex-1 bg-[#0C0C0C]/45 backdrop-blur-2xl rounded-[24px] border border-white/[0.06] overflow-hidden relative flex flex-col shadow-2xl shadow-black/50 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_70px_rgba(0,0,0,0.6)]">
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
