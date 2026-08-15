"use client";

import NextTopLoader from 'nextjs-toploader';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader 
        color="#22c55e"
        height={3}
        showSpinner={false}
      />
      {children}
    </>
  );
}
