// InputBox.tsx
import React, { useId } from "react"; // Import useId for automatic ID generation

interface InputProps {
  label?: string; // Optional label text
  placeholder: string;
  reference?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; // Accept refs for both types
  className?: string;
  type?: string; // e.g., "text", "url", "email"
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Handle both event types
  error?: string;
  id?: string; // Allow providing a specific ID
  isTextArea?: boolean; // Flag to render a textarea
  rows?: number; // Number of rows for textarea
  required?: boolean; // Add required prop
  disabled?: boolean; // Add disabled prop
  name?: string; // Add name prop
}

export function InputBox({
  label,
  placeholder,
  reference,
  className,
  type = "text",
  value,
  onChange,
  error,
  id: providedId,
  isTextArea = false,
  rows = 4, // Default rows for textarea
  required = false,
  disabled = false,
  name,
}: InputProps) {
  // Generate a unique ID if none is provided, useful for label association
  const generatedId = useId();
  const id = providedId || generatedId;

  // Common classes for both input and textarea
  const commonClasses = `w-full border rounded-md px-4 py-2 bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""} ${error ? "border-red-500 focus:ring-red-500" : "border-gray-700"}`;

  return (
    <div className="w-full">
      {/* Render label if provided */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Conditionally render input or textarea */}
      {isTextArea ? (
        <textarea
          id={id}
          ref={reference as React.Ref<HTMLTextAreaElement>} // Cast ref type
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          className={`${commonClasses} resize-vertical`} // Allow vertical resize
        />
      ) : (
        <input
          id={id}
          ref={reference as React.Ref<HTMLInputElement>} // Cast ref type
          name={name}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={commonClasses}
        />
      )}

      {/* Display error message if provided */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}