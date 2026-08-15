import { Metadata } from "next";
import { PlaygroundClient } from "@/components/playground/playground-client";

export const metadata: Metadata = {
  title: "Playground",
  description: "Test the Krixai AI security engine live in your browser.",
};

export default function PlaygroundPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-black min-h-screen pt-24 lg:pt-32">
      <PlaygroundClient />
    </main>
  );
}
