import React, { useId } from "react";

interface InputProps {
  label?: string;
  placeholder: string;
  reference?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  id?: string;
  isTextArea?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  name?: string;
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
  rows = 4,
  required = false,
  disabled = false,
  name,
}: InputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  const commonClasses = `
      w-full px-4 py-2 rounded-md 
    text-black placeholder-gray-500 
    bg-white border border-gray-300
    dark:bg-gray-950 dark:text-white dark:placeholder-gray-400 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-purple-500
    ${className || ""} 
    ${error ? "border-red-500 focus:ring-red-500" : ""}
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {isTextArea ? (
        <textarea
          id={id}
          ref={reference as React.Ref<HTMLTextAreaElement>}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          className={`${commonClasses} resize-vertical`}
        />
      ) : (
        <input
          id={id}
          ref={reference as React.Ref<HTMLInputElement>}
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

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
