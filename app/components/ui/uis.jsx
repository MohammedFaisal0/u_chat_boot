// app/components/ui/Skeleton.jsx
"use client";
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      {...props}
    />
  );
}

// app/components/ui/ErrorMessage.jsx
export function ErrorMessage({ message }) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
}

// app/components/ui/ConfirmationModal.jsx
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto p-5 border border-[#dbeafe]/30 w-96 shadow-lg rounded-md bg-[#f8fafc]">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-[#1e40af]">
            {title}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-[#60a5fa]">{message}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-[#dbeafe]/20 text-[#1e40af] text-base font-medium rounded-md w-full shadow-sm border border-[#dbeafe]/30 hover:bg-[#dbeafe]/30 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/components/ui/Tooltip.jsx
import { useState } from "react";

export function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 p-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
          {content}
        </div>
      )}
    </div>
  );
}

const Alert = ({ children, variant = "default" }) => {
  const baseClasses = "rounded-lg border p-4 mb-4";
  const variantClasses = {
    default: "bg-blue-100 border-blue-300 text-blue-800",
    destructive: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    success: "bg-green-100 border-green-300 text-green-800",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
      {children}
    </div>
  );
};

const AlertTitle = ({ children }) => (
  <h4 className="text-lg font-medium mb-2">{children}</h4>
);

const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

// components/ui/button.jsx
const Button = ({ children, variant = "default", onClick, ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Alert, AlertTitle, AlertDescription, Button };
