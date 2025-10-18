import { Loader, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetails } from "../../services/userDetails";

export default function UserModal({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserData = async () => {
      const userDetails = await UserDetails();
      if (!userDetails || !userDetails.username) {
        throw new Error("Invalid user details");
      }
      // If username is an email, split it
      let displayName = userDetails.username;
      let displayEmail = "";
      if (userDetails.username.includes("@")) {
        displayEmail = userDetails.username;
        displayName = userDetails.username.split("@")[0];
      } else if (userDetails.email) {
        displayEmail = userDetails.email;
      }
      setUsername(displayName);
      setEmail(displayEmail);
      setIsLoading(false);
    };
    getUserData();
  }, []);
  const getUserCredentials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
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
      <div className="p-4 border-b dark:border-gray-600 flex  items-center">
        <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3">
          {isloading ? (
            <Loader className="animate-spin" />
          ) : (
            getUserCredentials(username)
          )}
        </div>
        {isloading ? (
          <div className="mt-2 ">
            <div className="dark:bg-neutral-700 bg-gray-100 animate-pulse h-3 w-32 rounded mb-2"></div>
            <div className="dark:bg-neutral-700 bg-gray-100 animate-pulse h-3 w-32 rounded mb-2"></div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-gray-700 dark:text-white">
              {username}
            </p>
            {email && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {email}
              </p>
            )}
          </div>
        )}
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
