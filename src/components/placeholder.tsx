import React from "react";

export function Placeholder({ title, description, height = "400px" }: { title: string, description?: string, height?: string }) {
  return (
    <section 
      className="relative w-full bg-black flex flex-col items-center justify-center border-t border-white/[0.04] p-12 text-center"
      style={{ minHeight: height }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center space-y-4">
        <h2 className="text-3xl font-medium tracking-tight text-white">{title}</h2>
        {description && (
          <p className="text-neutral-500 text-sm">{description}</p>
        )}
        <div className="px-3 py-1 mt-4 border border-dashed border-white/20 text-white/30 text-xs rounded uppercase tracking-widest font-mono">
          Placeholder Section
        </div>
      </div>
    </section>
  );
}
