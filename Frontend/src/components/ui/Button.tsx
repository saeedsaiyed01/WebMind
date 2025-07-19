// Button.tsx
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "Auth" | "orange" | "purple";
  size: "sm" | "md" | "lg";
  text: string;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Add event type
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  btnType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
}

const variantStyles = {
  primary:
    "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500",

  secondary:
    " bg-gray-300 dark:bg-gray-800 text-gray-800  dark:text-gray-300  hover:bg-gray- dark:hover:bg-gray-700  focus-visible:ring-gray-500",
  Auth: "bg-black text-black hover:bg-gray-800 focus-visible:ring-gray-500",

  orange:
    "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500",

  purple:
    "bg-purple-500 text-white dark:text-black hover:bg-purple-600 focus-visible:ring-purple-500",
};

const sizeVariant = {
  sm: "py-1 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
};
const defaultStyles =
  "rounded-md m-1 flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"; // Adjusted focus offset for dark bg

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  text,
  icon,
  startIcon,
  endIcon,
  onClick,
  fullWidth,
  loading = false,
  disabled = false,
  btnType = "button",
  className = "",
}) => {
  const finalStartIcon = startIcon || icon;

  return (
    <button
      type={btnType}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantStyles[variant]}
        ${defaultStyles}
        ${sizeVariant[size]}
        ${fullWidth ? "w-full" : ""}
        ${
          loading || disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:opacity-90"
        } // Adjusted hover slightly
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          className="animate-spin"
          style={{
            height: sizeVariant[size].includes("text-sm")
              ? "16px"
              : sizeVariant[size].includes("text-lg")
              ? "24px"
              : "20px",
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          {finalStartIcon}
          <span>{text}</span> {endIcon}
        </div>
      )}
    </button>
  );
};
