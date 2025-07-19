// components/ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-14 h-8 flex items-center px-1
             border border-gray-300 dark:border-neutral-950 
             bg-gray-100 dark:bg-neutral-900 // Background color for the track
             rounded-full relative transition-colors duration-300"
    >
      <div
        className={`absolute left-1 w-6 h-6 rounded-full flex items-center justify-center
                shadow-md 
                transition-transform duration-300 // Smooth movement
                ${darkMode ? "translate-x-6 bg-gray-500" : "bg-gray-300"}`}
      >
        {darkMode ? (
          <Moon size={16} className="text-white" />
        ) : (
          <Sun size={16} className="text-gray-800" />
        )}
      </div>
    </button>
  );
}
