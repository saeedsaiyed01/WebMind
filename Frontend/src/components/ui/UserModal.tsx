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
        className="glass-strong fixed z-[200] right-4 top-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))] w-[min(calc(100vw-2rem),20rem)] max-h-[min(90vh,32rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-border shadow-lift sm:top-24"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="flex items-center border-b border-border bg-background/30 p-4">
        <div className="flex-1">
          {isloading ? (
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-40 animate-pulse rounded bg-muted"></div>
            </div>
          ) : (
            <div>
              <p className="truncate font-semibold text-foreground">
                {userName || username}
              </p>
              {email && (
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 p-2">
         {/* Credits Display */}
         <div className="mx-2 my-2 flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm text-foreground">
            <div className="flex items-center gap-2">
               <CreditCard className="h-4 w-4 text-gold" />
               <span>Credits</span>
            </div>
            <span className="font-bold text-foreground">{credits !== null ? credits : '-'}</span>
         </div>

        <div className="mx-2 mb-2 rounded-lg border border-border bg-background/40 p-2">
          <div className="mb-2 flex items-center gap-2 px-1 text-overline">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
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
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{m.name}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0 text-gold" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={navigateProfile}
        >
          <User className="mr-3 h-4 w-4" /> Profile
        </button>

        <div className="wm-divider mx-2 my-1" />

        <button
          className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" /> Logout
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
