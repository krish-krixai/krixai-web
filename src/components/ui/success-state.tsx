"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./button";

interface SuccessStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessState({ 
  title, 
  description,
  actionLabel,
  onAction 
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-green-500/20 rounded-2xl bg-green-500/[0.02] w-full">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.6 }}
        className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      </motion.div>
      <h3 className="text-base font-medium text-green-50 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-green-500/80 max-w-[300px] mb-5">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="border-green-500/20 hover:bg-green-500/10 text-green-400 hover:text-green-300">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
