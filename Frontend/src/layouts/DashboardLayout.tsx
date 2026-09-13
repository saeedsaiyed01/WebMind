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
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, conversations, setConversations, setMessages, credits, setCredits } = useStore();
  const navigate = useNavigate();

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch {
        // noop
      }
    };
    fetchConversations();
  }, [setConversations]);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/plan`, {
          headers: { Authorization: `${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
    };
    fetchCredits();
  }, [setCredits]);

  useEffect(() => {
    if (location.pathname === "/dashboard") setSidebarOpen(false);
  }, [location.pathname]);

  const chatSwipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const onChatAreaTouchStart = (e: React.TouchEvent) => {
    if (!location.pathname.startsWith("/chat")) return;
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    const t = e.touches[0];
    chatSwipeStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onChatAreaTouchEnd = (e: React.TouchEvent) => {
    if (!location.pathname.startsWith("/chat")) return;
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    const start = chatSwipeStartRef.current;
    chatSwipeStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < 44) return;
    if (absY > absX * 0.65) return;
    if (!sidebarOpen) {
      if (start.x <= 36 && dx > 50) setSidebarOpen(true);
    } else {
      if (dx < -45) setSidebarOpen(false);
    }
  };

  const onChatAreaTouchCancel = () => {
    chatSwipeStartRef.current = null;
  };

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(conversations.filter((c) => c._id !== convToDelete));
      toast.success("Chat deleted successfully");
      if (location.pathname.includes(convToDelete)) navigate("/chat");
    } catch {
      toast.error("Failed to delete chat");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setConvToDelete(null);
    }
  };

  const grouped: Record<string, any[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };
  conversations.forEach((conv: any) => {
    const date = new Date(conv.lastMessageAt || conv.createdAt);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === now.toDateString()) grouped.Today.push(conv);
    else if (date.toDateString() === yesterday.toDateString()) grouped.Yesterday.push(conv);
    else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) grouped["Previous 7 Days"].push(conv);
    else grouped.Older.push(conv);
  });

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden bg-background p-3 font-sans text-foreground antialiased",
        sidebarOpen ? "gap-3" : "gap-0"
      )}
    >
      {/* mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─────────── SIDEBAR ISLAND ─────────── */}
      <aside
        className={cn(
          "glass-strong flex shrink-0 flex-col overflow-hidden transition-all duration-300 z-50",
          "fixed inset-y-0 left-0 h-full w-[280px] md:rounded-3xl md:my-1 md:ml-1 md:h-auto md:w-[248px]",
          sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:w-0 md:ml-0 md:p-0"
        )}
      >
        {/* logo */}
        <div className="flex items-center gap-3 px-6 pb-5 pt-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-sm">
            <Brain className="h-4 w-4 text-black" />
          </span>
          <span className="font-sans text-lg font-bold tracking-tight text-foreground">WebMind</span>
        </div>

        {/* new chat */}
        <div className="px-4 pb-4">
          <Button
            onClick={() => {
              setMessages([]);
              navigate("/chat");
            }}
            className="h-10 w-full justify-start gap-2.5 rounded-xl border border-border bg-background/50 px-4 text-[13px] font-medium text-foreground hover:border-zinc-500 hover:bg-background active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 text-foreground" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* conversation list */}
        <nav className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {Object.entries(grouped).map(([label, convs]) =>
            convs.length > 0 ? (
              <div key={label}>
                <h3 className="text-overline sticky top-0 z-10 bg-card/80 px-2 pb-1 pt-1 backdrop-blur-md">
                  {label}
                </h3>
                <div className="space-y-0.5">
                  {convs.map((conv: any) => (
                    <Link
                      key={conv._id}
                      to={`/chat/${conv._id}`}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 pr-8 text-[13px] font-medium transition-all",
                        location.pathname.includes(conv._id)
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <span className="flex-1 truncate">{conv.title || "New Chat"}</span>
                      <button
                        onClick={(e) => handleDeleteClick(e, conv._id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          )}
          {conversations.length === 0 && (
            <div className="px-3 py-2 text-[11px] italic text-muted-foreground">
              No history yet. Start a chat!
            </div>
          )}
        </nav>

        {/* user profile */}
        <div className="mt-auto p-4">
          <div className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/40 p-3 transition-all hover:border-border hover:bg-background/60 active:scale-[0.98]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 text-sm font-bold text-white">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || "User"} className="h-full w-full object-cover" />
              ) : (
                <span className="uppercase tracking-wider">{user?.name?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">{user?.name || "User"}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user?.email || "No Email"}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ─────────── RIGHT COLUMN ─────────── */}
      <div className="my-1 mr-1 flex min-w-0 flex-1 flex-col gap-3">
        <SidebarHeader
          location={location}
          navigate={navigate}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          credits={credits}
          setUserModalOpen={setUserModalOpen}
          userModalOpen={userModalOpen}
          user={user}
        />

        {/* mobile primary nav */}
        <nav className="flex shrink-0 flex-col gap-1 md:hidden" aria-label="Primary">
          <div className="glass flex w-full items-center gap-1 rounded-2xl p-1">
            <Link
              to="/dashboard"
              className={cn(
                "min-h-[40px] flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium transition-all",
                location.pathname === "/dashboard" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              className={cn(
                "min-h-[40px] flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium transition-all",
                location.pathname.startsWith("/chat") ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              AI Chat
            </Link>
          </div>
        </nav>

        {/* main island */}
        <main
          className="glass relative flex flex-1 flex-col overflow-hidden rounded-3xl"
          onTouchStart={onChatAreaTouchStart}
          onTouchEnd={onChatAreaTouchEnd}
          onTouchCancel={onChatAreaTouchCancel}
        >
          {children}
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}

function SidebarHeader({
  location,
  navigate,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  credits,
  setUserModalOpen,
  userModalOpen,
  user,
}: {
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  credits: number | null;
  setUserModalOpen: (v: boolean) => void;
  userModalOpen: boolean;
  user: { name?: string; email?: string; avatar?: string } | null;
}) {
  return (
    <header
      className={cn(
        "glass relative z-50 flex h-[52px] shrink-0 items-center justify-between overflow-visible rounded-2xl px-2 md:rounded-full md:px-3",
        sidebarOpen ? "hidden md:flex" : "flex"
      )}
    >
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        {location.pathname.startsWith("/chat") && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="-mr-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95 md:hidden"
            aria-label="Open history"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div
          className="flex cursor-pointer items-center gap-2 md:hidden"
          onClick={() => navigate("/")}
        >
          <Brain className="h-5 w-5 text-foreground" />
          <span className="text-sm font-bold text-foreground">WebMind</span>
        </div>

        {location.pathname !== "/dashboard" && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95 md:block"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div className="hidden items-center rounded-full border border-border bg-background/50 p-1 md:flex">
          <Link
            to="/dashboard"
            className={cn(
              "rounded-full px-5 py-1.5 text-[12px] font-medium transition-all",
              location.pathname === "/dashboard"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className={cn(
              "rounded-full px-5 py-1.5 text-[12px] font-medium transition-all",
              location.pathname.startsWith("/chat")
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            AI Chat
          </Link>
        </div>

        <button
          onClick={() => navigate("/pricing")}
          className="hidden items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-zinc-500 hover:text-foreground md:flex"
        >
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-zinc-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-foreground">{credits !== null ? credits : "..."}</span>
          <span className="text-muted-foreground/60">Credits</span>
          <span className="mx-1 h-3 w-px bg-border" />
          <span className="text-foreground hover:underline">Upgrade</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="relative">
          <div
            onClick={() => setUserModalOpen(true)}
            className="ml-1.5 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || "User"} className="h-full w-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || "U"}</span>
            )}
          </div>
          {userModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="glass-strong absolute left-0 right-0 top-[60px] z-50 mx-2 flex flex-col space-y-2 rounded-2xl p-4 shadow-lift md:hidden animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              navigate("/dashboard");
              setMobileMenuOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 text-left font-medium transition-colors",
              location.pathname === "/dashboard" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" /> Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/chat");
              setMobileMenuOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 text-left font-medium transition-colors",
              location.pathname.startsWith("/chat") ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Brain className="h-4 w-4" /> AI Chat
          </button>
          <div className="wm-divider my-2" />
          <button
            onClick={() => {
              navigate("/pricing");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 rounded-xl p-3 text-left font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <CreditCard className="h-4 w-4" />
            <span>{credits !== null ? credits : "..."} Credits (Upgrade)</span>
          </button>
        </div>
      )}
    </header>
  );
}
