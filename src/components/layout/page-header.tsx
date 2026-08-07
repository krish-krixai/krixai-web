import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, eyebrow, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 py-8 mb-4 border-b border-[var(--color-border)]", className)} {...props}>
      <div className="flex flex-col gap-2">
        {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
        <h1 className="text-page-title">{title}</h1>
        {subtitle && <div className="text-body max-w-2xl">{subtitle}</div>}
      </div>
      {action && (
        <div className="flex-shrink-0 mt-4 md:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}
