import { AlertTriangle, Brain, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Github from "../../icons/Github";
import { UserDetails } from "../../services/userDetails";
import ThemeToggle from "./ThemeToggle";
import UserModal from "./UserModal";

import { CreditCard } from 'lucide-react';
export type NavbarVariant = "landing" | "dashboard";

interface NewNavbarProps {
  variant: NavbarVariant;
  onSearch?: (query: string) => void;
}

const NewNavbar: React.FC<NewNavbarProps> = ({
  variant,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState("");
  
  const handleGithub = () => {
    window.open("https://github.com/saeedsaiyed01/WebMind");
  };

  useEffect(() => {
    if (variant === "dashboard") {
      UserDetails().then((u) => {
        if (u) {
          setUsername(u.username || u.email || "User");
          setUserName(u.name || u.username || u.email || "User");
          setUserAvatar(u.avatar || "");
        }
      });
    }
  }, [variant]);


  useEffect(() => {
    if (variant === "dashboard") {
      fetchCredits();
    }
  }, [variant]);
  
  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onSearch?.(q);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const openUserModal = () => setUserModalOpen(true);
  const closeUserModal = () => setUserModalOpen(false);

  // Dashboard Navbar Implementation
  if (variant === "dashboard") {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-zinc-950/80 border-b border-zinc-800">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Brain className="text-white" />
            <span className="text-xl font-semibold text-white">
              Webmind
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
              <div className="relative flex items-center space-x-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-transparent border border-zinc-700 rounded-3xl">
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                  <span className="font-bold text-zinc-300">{credits !== null ? `${credits} credits` : 'Loading...'}</span>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="px-3 py-2 pr-10 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                />
              </div>
                <ThemeToggle />
                <button
                  onClick={handleGithub}
                  className=" text-gray-200 hover:text-white transition-colors"
                >
                  <Github />
                </button>
                <button
                  onClick={openUserModal}
                  className="h-8 w-8 rounded-full overflow-hidden border-2 border-zinc-700 flex items-center justify-center text-white transition hover:border-zinc-500"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
          </div>
        </div>
        
        {/* Mobile Menu for Dashboard - Simplified for brevity */}
         {mobileMenuOpen && (
             <div className="md:hidden bg-zinc-950 border-t border-zinc-800 p-4">
                 {/* ... items ... */}
             </div>
         )}
         
         {userModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
              <div className="w-full max-w-md p-4">
                <UserModal onClose={closeUserModal} />
              </div>
            </div>
          )}
      </nav>
    );
  }

  // Landing Page Navbar Implementation (Matching "Planora" reference)
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-amber-500/90 backdrop-blur-sm flex items-center justify-center text-black font-semibold text-[11px] md:text-sm tracking-wide px-4 shadow-lg">
         <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            WebMind is currently under scheduled maintenance. We will be back shortly.
         </span>
      </div>

      <nav className="fixed top-9 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
         <Brain className="w-6 h-6 text-white" />
         <span className="text-lg font-medium text-white tracking-wide">WebMind</span>
      </div>

      {/* Center Pill Navigation */}
      <div className="hidden md:flex items-center bg-[#1c1c1c]/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full space-x-6 shadow-2xl">
        {['Home', 'Pricing', 'Features', 'Contact', 'About'].map((item) => (
           <button 
             key={item}
             onClick={() => {
                if(item === 'Pricing') navigate('/pricing');
                else if(item === 'Home') navigate('/');
                // Add other navigations as needed
             }}
             className="text-sm text-zinc-400 hover:text-white transition-colors font-medium"
           >
             {item}
           </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-6">
        <button className="text-sm text-zinc-300 hover:text-white transition-colors font-medium">
          Learn More
        </button>
        <button 
           onClick={() => navigate('/signup')}
           className="px-5 py-2 text-sm font-medium bg-[#2a2a2a] text-white rounded-lg border border-white/10 hover:bg-[#333] transition-all"
        >
          Try It Now
        </button>
      </div>

      {/* Mobile Menu Toggle */}
       <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

         {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 flex flex-col space-y-4 md:hidden">
             {['Home', 'Pricing', 'Features', 'Contact', 'About'].map((item) => (
                <button 
                    key={item}
                     onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                    className="text-left text-zinc-300 hover:text-white py-2"
                >
                    {item}
                </button>
             ))}
             <div className="h-px bg-zinc-800 my-2" />
             <button onClick={() => navigate('/signup')} className="w-full py-3 bg-white text-black rounded-lg font-medium">
                 Try It Now
             </button>
        </div>
      )}
    </nav>
    </>
  );
};

export default NewNavbar;
