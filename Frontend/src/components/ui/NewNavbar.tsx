import { Brain, Menu, X } from "lucide-react";
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
        console.log('No token found');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/plan`, {
        headers: { 'Authorization': `${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Credits data:', data);
        setCredits(data.credits);
      } else {
        console.error('Failed to fetch credits:', response.status, response.statusText);
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

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/50 dark:bg-black/50 border-b border-neutral-700/80">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Brain className="text-purple-600 dark:text-purple-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Webmind
          </span>
        </div>

        {/* Desktop Navigation Links - Center */}
        {variant === "landing" && (
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              Features
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              Pricing
            </button>
          </div>
        )}

        {/* Desktop Right Items */}
        <div className="hidden md:flex items-center space-x-4">
        {variant === "dashboard" && (
            <div className="relative flex items-center space-x-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-transparent border border-purple-500 rounded-3xl">
       <CreditCard className="w-5 h-5 text-purple-500" />
       <span className="font-bold text-purple-500">{credits !== null ? `${credits} credits` : 'Loading...'}</span>
     </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="px-3 py-2 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => onSearch?.(query)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5  rounded bg-purple-600 text-white hover:bg-purple-500 transition"
                aria-label="Search"
                style={{ lineHeight: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>

            </div>
          )}
          {variant === "landing" ? (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-500 transition"
              >
                Login
              </button>
              <ThemeToggle />
              <button
                onClick={handleGithub}
                className=" text-gray-800 dark:text-gray-200 hover:gray-700 transition-colors"
              >
                <Github />
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <button
                onClick={handleGithub}
                className=" text-gray-800 dark:text-gray-200 hover:gray-700 transition-colors"
              >
                <Github />
              </button>
              <button
                onClick={openUserModal}
                className="h-8 w-8 rounded-full overflow-hidden border-2 border-purple-600/20 flex items-center justify-center text-white transition hover:border-purple-400"
                aria-label="User profile"
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
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-6 space-y-4">
            {variant === "landing" ? (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="w-full text-left px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-500 transition"
                >
                  Login
                </button>
                <ThemeToggle />
                <button
                  onClick={handleGithub}
                  className="text-gray-400 hover:text-[#FF4500] transition-colors"
                >
                  <Github />
                </button>
              </>
            ) : (
              <>
                {variant === "dashboard" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-transparent border border-purple-500 rounded-3xl justify-center">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-purple-500">{credits !== null ? `${credits} credits` : 'Loading...'}</span>
                  </div>
                )}
                <ThemeToggle />
                <button
                  onClick={handleGithub}
                  className="text-gray-400 hover:text-[#FF4500] transition-colors"
                >
                  <Github />
                </button>
                <button
                  onClick={openUserModal}
                  className="h-8 w-8 rounded-full overflow-hidden border-2 border-purple-600/20 flex items-center justify-center text-white transition hover:border-purple-400"
                  aria-label="User profile"
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
              </>
            )}
          </div>
        </div>
      )}

      {/* User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="w-full max-w-md p-4">
            <UserModal onClose={closeUserModal} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
