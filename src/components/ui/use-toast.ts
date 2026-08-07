"use client";

import { useState, useEffect } from "react";

export type ToastType = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

type ToastState = {
  toasts: Toast[];
};

let memoryState: ToastState = { toasts: [] };
let listeners: Array<(state: ToastState) => void> = [];

const dispatch = (action: (state: ToastState) => ToastState) => {
  memoryState = action(memoryState);
  listeners.forEach((listener) => listener(memoryState));
};

export const toast = (props: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).slice(2, 9);
  
  dispatch((state) => ({
    ...state,
    toasts: [{ ...props, id }, ...state.toasts],
  }));

  setTimeout(() => {
    dispatch((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  }, props.duration || 5000);

  return id;
};

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return { toasts: state.toasts, toast };
}
