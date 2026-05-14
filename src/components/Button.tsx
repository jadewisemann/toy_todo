import React from "react";
import { cn } from "../utils";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" | "destructive" }>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
    const variants = {
      default: "bg-blue-600 text-white shadow hover:bg-blue-700",
      ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
      destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
    };
    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";
