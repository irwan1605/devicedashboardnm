import * as React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 focus:ring-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
