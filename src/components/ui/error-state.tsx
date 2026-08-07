"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "An error occurred while loading this content. Please try again.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-red-500/20 rounded-2xl bg-red-500/[0.02] w-full">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
      >
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </motion.div>
      <h3 className="text-base font-medium text-red-50 mb-1">
        {title}
      </h3>
      <p className="text-sm text-red-500/80 max-w-[300px] mb-5">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm">
          <RefreshCcw className="w-3.5 h-3.5 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}
