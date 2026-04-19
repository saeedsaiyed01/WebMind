import axios from "axios";
import { useStore } from "@/store/useStore";
import { Check, CreditCard, LogOut, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { UserDetails } from "../../services/userDetails";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

const FALLBACK_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B" },
  { id: "openai/gpt-oss-20b:free", name: "GPT OSS 20B" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
];

export default function UserModal({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { selectedModel, setSelectedModel, models, setModels } = useStore();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDetails = await UserDetails();
        if (userDetails) {
          // Handle Google OAuth users (have name, email, avatar)
          if (userDetails.name) {
            setUserName(userDetails.name);
            setUsername(userDetails.name);
          } else if (userDetails.username) {
            // Handle regular users
            let displayName = userDetails.username;
            if (userDetails.username.includes("@")) {
              displayName = userDetails.username.split("@")[0];
            }
            setUsername(displayName);
            setUserName(displayName);
          }

          // Set email
          setEmail(userDetails.email || "");
        }

        // Fetch Credits
        const token = localStorage.getItem("token");
        if (token) {
           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/v1/plan`, {
              headers: { Authorization: `Bearer ${token}` }
           });
           setCredits(response.data.credits);
        }
      } catch (err) {
        console.error("Error fetching user data or credits", err);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/models`);
        const data = await res.json();
        const current = useStore.getState().selectedModel;
        if (data.models?.length) {
          setModels(data.models);
          if (!current) {
            const def =
              data.models.find((m: { id: string }) => m.id === "gemini-2.5-flash") ||
              data.models[0];
            setSelectedModel(def);
          }
        } else {
          setModels(FALLBACK_MODELS);
          if (!current) setSelectedModel(FALLBACK_MODELS[0]);
        }
      } catch {
        setModels(FALLBACK_MODELS);
        if (!useStore.getState().selectedModel) setSelectedModel(FALLBACK_MODELS[0]);
      }
    };
    loadModels();
  }, [setModels, setSelectedModel]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const navigateProfile = () => {
    navigate("/");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const panel = (
    <>
      <div
        className="fixed inset-0 z-[190] bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dropdownRef}
        role="dialog"
        aria-modal="true"
        className="fixed z-[200] right-4 top-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))] w-[min(calc(100vw-2rem),20rem)] max-h-[min(90vh,32rem)] overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-800 bg-[#18181b] shadow-2xl sm:top-24 sm:max-h-[min(90vh,32rem)]"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="p-4 border-b border-zinc-800 flex items-center bg-[#202023]">
        <div className="flex-1">
          {isloading ? (
            <div className="space-y-2">
              <div className="bg-zinc-700 animate-pulse h-4 w-32 rounded"></div>
              <div className="bg-zinc-700 animate-pulse h-3 w-40 rounded"></div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-white truncate">
                {userName || username}
              </p>
              {email && (
                <p className="text-xs text-zinc-400 truncate">
                  {email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-2 space-y-1">
         {/* Credits Display */}
         <div className="px-3 py-2 flex items-center justify-between text-sm text-zinc-300 bg-zinc-900/50 rounded-lg mx-2 my-2 border border-zinc-800/50">
            <div className="flex items-center gap-2">
               <CreditCard className="w-4 h-4 text-purple-400" />
               <span>Credits</span>
            </div>
            <span className="font-bold text-white">{credits !== null ? credits : '-'}</span>
         </div>

        <div className="mx-2 mb-2 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-2">
          <div className="mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            AI model
          </div>
          <div className="max-h-40 space-y-0.5 overflow-y-auto pr-0.5">
            {(models.length ? models : FALLBACK_MODELS).map((m) => {
              const active = (selectedModel || FALLBACK_MODELS[0]).id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(m);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-white/[0.08] font-medium text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <span className="truncate pr-2">{m.name}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0 text-violet-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="w-full flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={navigateProfile}
        >
          <User className="w-4 h-4 mr-3" /> Profile
        </button>
        
        <div className="h-px bg-zinc-800 my-1 mx-2" />
        
        <button
          className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" /> Logout
        </button>
      </div>
    </div>
    </>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(panel, document.body);
}
