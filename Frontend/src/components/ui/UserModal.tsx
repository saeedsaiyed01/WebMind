import axios from "axios";
import { CreditCard, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetails } from "../../services/userDetails";

export default function UserModal({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [credits, setCredits] = useState<number | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const navigateProfile = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Delay adding the event listener to avoid handling the click that opened the modal
    const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div
      ref={dropdownRef}
      className="absolute top-12 right-0 w-72 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-[100]"
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
  );
}
