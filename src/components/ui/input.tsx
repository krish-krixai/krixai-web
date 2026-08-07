import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: "default" | "success" | "warning" | "error" | "loading";
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state = "default", helperText, disabled, ...props }, ref) => {
    
    const stateStyles = {
      default: "border-white/[0.1] focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white",
      success: "border-green-500/30 focus:border-green-500/50 focus:ring-green-500/20 text-green-50",
      warning: "border-amber-500/30 focus:border-amber-500/50 focus:ring-amber-500/20 text-amber-50",
      error: "border-red-500/30 focus:border-red-500/50 focus:ring-red-500/20 text-red-50",
      loading: "border-white/[0.1] focus:border-white/[0.2] focus:ring-white/10 text-white/[0.7]",
    };

    const iconColors = {
      success: "text-green-500",
      warning: "text-amber-500",
      error: "text-red-500",
      loading: "text-neutral-400",
    };

    return (
      <div className="w-full flex flex-col space-y-1.5">
        <div className="relative flex items-center">
          <input
            ref={ref}
            disabled={disabled || state === "loading"}
            className={cn(
              "flex w-full rounded-xl bg-white/[0.03] border px-4 py-2.5 text-sm transition-all duration-200 outline-none",
              "focus:ring-2 placeholder:text-neutral-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              stateStyles[state],
              (state !== "default") && "pr-10",
              className
            )}
            {...props}
          />
          {state === "loading" && (
            <div className="absolute right-3">
              <Loader2 className={cn("w-4 h-4 animate-spin", iconColors.loading)} />
            </div>
          )}
          {state === "success" && (
            <div className="absolute right-3">
              <CheckCircle2 className={cn("w-4 h-4", iconColors.success)} />
            </div>
          )}
          {state === "warning" && (
            <div className="absolute right-3">
              <AlertCircle className={cn("w-4 h-4", iconColors.warning)} />
            </div>
          )}
          {state === "error" && (
            <div className="absolute right-3">
              <AlertCircle className={cn("w-4 h-4", iconColors.error)} />
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(
            "text-[13px] pl-1",
            state === "error" ? "text-red-500/90" :
            state === "success" ? "text-green-500/90" :
            state === "warning" ? "text-amber-500/90" :
            "text-neutral-400"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
