import { Brain, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Github from "../../icons/Github";
import { UserDetails } from "../../services/userDetails";
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
                  {(location.pathname === '/chat' || location.pathname.startsWith('/chat/')) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-transparent border border-zinc-700 rounded-3xl">
                      <CreditCard className="w-5 h-5 text-zinc-400" />
                      <span className="font-bold text-zinc-300">{credits !== null ? `${credits} credits` : 'Loading...'}</span>
                    </div>
                  )}
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="px-3 py-2 pr-10 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                />
              </div>
                
                <button
                  onClick={handleGithub}
                  className=" text-gray-200 hover:text-white transition-colors"
                >
                  <Github />
                </button>
                <div className="relative">
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
                  {userModalOpen && <UserModal onClose={closeUserModal} />}
                </div>
          </div>
        </div>
        
        {/* Mobile Menu for Dashboard - Simplified for brevity */}
         {mobileMenuOpen && (
             <div className="md:hidden bg-zinc-950 border-t border-zinc-800 p-4">
                 {/* ... items ... */}
             </div>
         )}
         

      </nav>
    );
  }

  // Landing Page Navbar Implementation (Matching "Planora" reference)
  return (
    <>
     
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-2 pl-6 pr-2 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 w-full max-w-4xl justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-2 pr-4 cursor-pointer border-r border-white/10 mr-2" onClick={() => navigate('/')}>
         <Brain className="w-5 h-5 text-white" />
         <span className="text-sm font-bold text-white tracking-tight hidden sm:block">WebMind</span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
        {['Pricing', 'Features'].map((item) => (
           <button 
             key={item}
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
             className="px-6 py-2 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
           >
             {item}
           </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 pl-2">
  
        
        <button 
           onClick={() => localStorage.getItem("token") ? navigate('/dashboard') : navigate('/signup')}
           className="px-6 py-2.5 rounded-full bg-white text-black text-[13px] font-bold hover:bg-zinc-200 transition-all shadow-lg active:scale-95 flex items-center gap-2"
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
        <div className="absolute top-[120%] left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-4 flex flex-col space-y-2 md:hidden shadow-2xl overflow-hidden">
             {['Pricing', 'Features', 'Contact'].map((item) => (
                <button 
                    key={item}
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
                            navigate(`/${item.toLowerCase()}`);
                            setMobileMenuOpen(false);
                        }
                    }}
                    className="text-left text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white py-3 px-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium text-sm"
                >
                    {item}
                </button>
             ))}
        </div>
      )}
    </nav>
    </>
  );
};

export default NewNavbar;
