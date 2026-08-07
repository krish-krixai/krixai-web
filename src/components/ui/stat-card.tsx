import React from "react";
import { Card } from "./card";
import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, className }: StatCardProps) {
  return (
    <Card className={cn("flex flex-col gap-2 h-full min-h-[140px]", className)} padding="md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted" />}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
      </div>
      {description && (
        <p className="text-xs text-muted mt-auto pt-2">{description}</p>
      )}
    </Card>
  );
}
