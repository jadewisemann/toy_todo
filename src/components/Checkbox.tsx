import React from "react";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-gray-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-blue-600 ${className}`}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
