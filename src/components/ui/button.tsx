import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-white/50 border border-transparent",
      secondary: "bg-neutral-800 text-white hover:bg-neutral-700 active:bg-neutral-600 focus-visible:ring-neutral-500 border border-transparent",
      outline: "bg-transparent text-white border-white/[0.1] hover:bg-white/[0.05] active:bg-white/[0.1] focus-visible:ring-white/50",
      ghost: "bg-transparent text-white hover:bg-white/[0.08] active:bg-white/[0.12] focus-visible:ring-white/50 border border-transparent",
      danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 active:bg-red-500/30 focus-visible:ring-red-500/50 border border-red-500/20",
    };

    const sizes = {
      sm: "min-h-[44px] px-4 text-xs",
      md: "min-h-[44px] px-5 text-sm",
      lg: "min-h-[48px] px-6 text-base",
      icon: "min-h-[44px] min-w-[44px] flex items-center justify-center p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
