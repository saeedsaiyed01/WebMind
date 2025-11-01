import { LogOut, User } from "lucide-react";
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

  useEffect(() => {
    const getUserData = async () => {
      const userDetails = await UserDetails();
      if (!userDetails) {
        throw new Error("Invalid user details");
      }

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


      setIsLoading(false);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div
      ref={dropdownRef}
      className="  mt-16 ml-20 w-64 bg-gray-950  border dark:border-gray-600 rounded-lg shadow-lg  "
    >
      <div className="p-4 border-b dark:border-gray-600 flex items-center">
        <div className="flex-1">
          {isloading ? (
            <div className="mt-2">
              <div className="dark:bg-neutral-700 bg-gray-100 animate-pulse h-3 w-32 rounded mb-2"></div>
              <div className="dark:bg-neutral-700 bg-gray-100 animate-pulse h-3 w-32 rounded mb-2"></div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-gray-700 dark:text-white">
                {userName || username}
              </p>
              {email && (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="py-1">
        <button
          className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={navigateProfile}
        >
          <User className="w-4 h-4 mr-3" /> Profile
        </button>
        <button
          className="w-full flex items-end px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <LogOut className="w-4 h-4 mr-3" /> Logout
          </div>
        </button>
      </div>
    </div>
  );
}
