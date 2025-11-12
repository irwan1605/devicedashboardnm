import * as React from "react";

export function Select({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm text-left hover:bg-gray-50 flex justify-between items-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-600">{placeholder}</span>;
}

export function SelectContent({ children, className = "", ...props }) {
  return (
    <div
      className={`absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ children, value, onClick }) {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
      onClick={() => onClick?.(value)}
    >
      {children}
    </div>
  );
}
