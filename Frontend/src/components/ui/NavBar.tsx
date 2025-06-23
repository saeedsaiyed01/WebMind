import { Brain, Menu, Search, Settings, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UserDetails } from "../../services/userDetails";
import UserModal from "./UserModal";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [username, setUsername] = useState<string>("");
  const [query, setQuery] = useState("");
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      const userDetails = await UserDetails();
      setUsername(userDetails.username);
    };
    getUserData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Send search query to parent
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#0A0A0B]/90 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-[#FF4500]" />
            <span className="text-xl text-white font-bold">WebMind</span>
          </div>

          {/* Desktop Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search your mind..."
                className="w-64 px-4 py-2 rounded-lg bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF4500]/50 outline-none text-white placeholder-gray-400"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="h-8 w-8 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setUserModalOpen(!userModalOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Open user settings"
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden bg-[#0A0A0B] border-t border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen py-4" : "max-h-0"
          }`}
        >
          <div className="container mx-auto px-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search your mind..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF4500]/50 outline-none text-white placeholder-gray-400"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => {
                  setUserModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Open user settings"
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="relative w-full max-w-[2000px] mx-auto">
            <div className="absolute top-4 right-4 max-w-md max-h-[90vh] overflow-auto">
              <UserModal onClose={handleCloseUserModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
