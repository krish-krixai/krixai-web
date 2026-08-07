import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AppContainer({ children, className, ...props }: AppContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto w-full max-w-[var(--container-max-width)] px-[var(--container-padding)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
