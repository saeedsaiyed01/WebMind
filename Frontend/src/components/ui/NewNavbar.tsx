import { Brain, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Github from "../../icons/Github";
import { UserDetails } from "../../services/userDetails";
import UserModal from "./UserModal";

import { CreditCard } from 'lucide-react';
/** `dashboard` branch is unused — app shell uses DashboardLayout. Only `landing` is mounted (landing + pricing). */
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
  const location = useLocation();
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
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          {/* Row 1: logo + actions (mobile); full bar on md+ */}
          <div className="flex h-14 items-center justify-between gap-3 md:h-16">
            <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-8">
              <div
                className="flex min-w-0 shrink-0 cursor-pointer items-center space-x-2"
                onClick={() => navigate("/")}
              >
                <Brain className="h-5 w-5 shrink-0 text-white" />
                <span className="truncate text-base font-semibold text-white md:text-xl">
                  Webmind
                </span>
              </div>

              {/* Desktop Navigation only */}
              <div className="hidden items-center space-x-1 rounded-full border border-white/5 bg-zinc-900/50 p-1 md:flex">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    location.pathname === "/dashboard"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    location.pathname.startsWith("/chat")
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Chat
                </button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
              <div className="hidden items-center space-x-4 md:flex">
                <div className="relative flex items-center space-x-4">
                  {(location.pathname === "/chat" ||
                    location.pathname.startsWith("/chat/")) && (
                    <div className="flex items-center gap-2 rounded-3xl border border-zinc-700 bg-transparent px-4 py-2">
                      <CreditCard className="h-5 w-5 text-zinc-400" />
                      <span className="font-bold text-zinc-300">
                        {credits !== null ? `${credits} credits` : "Loading..."}
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGithub}
                  className="text-gray-200 transition-colors hover:text-white"
                >
                  <Github />
                </button>
              </div>

              {(location.pathname === "/chat" ||
                location.pathname.startsWith("/chat/")) && (
                <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 md:hidden">
                  <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-300">
                    {credits !== null ? credits : ".."}
                  </span>
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={openUserModal}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-700 text-white transition hover:border-zinc-500"
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
                {userModalOpen && <UserModal onClose={closeUserModal} />}
              </div>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-zinc-400 hover:text-white md:hidden"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Row 2 (mobile only): full-width Dashboard / Chat — avoids squeeze between logo and actions */}
          <div className="border-t border-zinc-800/80 pb-2.5 pt-2 md:hidden">
            <div className="flex w-full items-center gap-1 rounded-full border border-white/5 bg-zinc-900/50 p-1">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`min-h-[40px] flex-1 rounded-full px-3 py-2 text-center text-sm font-medium transition-all ${
                  location.pathname === "/dashboard"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className={`min-h-[40px] flex-1 rounded-full px-3 py-2 text-center text-sm font-medium transition-all ${
                  location.pathname.startsWith("/chat")
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                Chat
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu for Dashboard */}
         {mobileMenuOpen && (
             <div className="md:hidden bg-zinc-950 border-t border-zinc-800 p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2">
                 <input
                   type="search"
                   value={query}
                   onChange={handleSearchChange}
                   placeholder="Search..."
                   className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                 />
                 <div className="flex flex-col space-y-2">
                    <button 
                        onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                        className={`p-3 rounded-lg text-left font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }}
                        className={`p-3 rounded-lg text-left font-medium transition-colors ${location.pathname.startsWith('/chat') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                    >
                        AI Chat
                    </button>
                 </div>
                 
                 <div className="pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 mb-4" onClick={() => { openUserModal(); setMobileMenuOpen(false); }}>
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700 flex items-center justify-center text-white bg-zinc-900">
                            {userAvatar ? (
                              <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium">{username.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{userName || 'User'}</span>
                            <span className="text-xs text-zinc-500">View Profile</span>
                        </div>
                    </div>
                    {/* Github Link in Mobile */}
                     <button
                        onClick={() => { handleGithub(); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white w-full p-2"
                      >
                        <div className="scale-75 origin-left"><Github /></div>
                        <span className="text-sm">Star on GitHub</span>
                      </button>
                 </div>
             </div>
         )}
      </nav>
    );

  }

  // Landing Page Navbar Implementation (Matching "Planora" reference)
  return (
    <>
     
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-2 pl-5 pr-2 wm-glass-nav rounded-full shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-4xl justify-between font-sans">
      
      {/* Logo */}
      <div className="flex items-center gap-2 pr-3 cursor-pointer border-r border-white/10 mr-1 shrink-0" onClick={() => navigate('/')}>
         <Brain className="w-5 h-5 text-white" />
         <span className="font-display text-sm font-bold text-white tracking-tight">WebMind</span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
        {['Pricing', 'Features'].map((item) => (
           <button 
             key={item}
             type="button"
             onClick={() => {
                if(item === 'Pricing') navigate('/pricing');
                else if(item === 'Features') {
                    const element = document.getElementById('features');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        navigate('/');
                        setTimeout(() => {
                           document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }
             }}
             className="px-5 py-2 text-caption font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
           >
             {item}
           </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 pl-1 shrink-0">
        
        <button 
           type="button"
           onClick={() => localStorage.getItem("token") ? navigate('/dashboard') : navigate('/signup')}
           className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-white text-black text-caption font-semibold hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          {localStorage.getItem("token") ? "Dashboard" : "Get Started"}
        </button>
        
        {/* Mobile Menu Toggle */}
         <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white rounded-full hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
      </div>

         {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col gap-1 md:hidden shadow-2xl overflow-hidden">
             {['Pricing', 'Features'].map((item) => (
                <button 
                    key={item}
                    type="button"
                    onClick={() => {
                        if (item === 'Features') {
                            const element = document.getElementById('features');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                setMobileMenuOpen(false);
                            } else {
                                navigate('/');
                                setTimeout(() => {
                                   document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                   setMobileMenuOpen(false);
                                }, 100);
                            }
                        } else {
                            navigate('/pricing');
                            setMobileMenuOpen(false);
                        }
                    }}
                    className="text-left text-zinc-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-colors font-medium text-caption"
                >
                    {item}
                </button>
             ))}
             <button
               type="button"
               onClick={() => {
                 localStorage.getItem("token") ? navigate('/dashboard') : navigate('/signup');
                 setMobileMenuOpen(false);
               }}
               className="mt-1 w-full py-3 rounded-xl bg-white text-black text-caption font-semibold hover:bg-zinc-200 transition-colors sm:hidden"
             >
               {localStorage.getItem("token") ? "Dashboard" : "Get Started"}
             </button>
        </div>
      )}
    </nav>
    </>
  );
};

export default NewNavbar;
