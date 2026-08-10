import { Metadata } from "next";
import { Mail, Shield, Briefcase } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { 
  title: "Contact Sales - Krixai | krixai",
  description: "Get in touch with the Krixai team to discuss enterprise AI security solutions, schedule a demo, or get support.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" }
};

export default function ContactPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-[#050505] overflow-hidden pt-32 lg:pt-40 min-h-screen relative">
      <div className="max-w-[75rem] mx-auto px-6 lg:px-12 w-full relative z-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Info & Value Prop */}
          <div className="flex flex-col pt-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
              Contact our team
            </h1>
            <p className="text-[17px] text-neutral-400 max-w-md leading-relaxed mb-12">
              Let us know how we can help. We're here for you.
            </p>
            
            <div className="space-y-10">
              <div className="flex flex-col">
                <div className="flex items-center text-white mb-3 font-medium text-[15px]">
                  <Briefcase className="w-4 h-4 mr-3 text-neutral-400" /> Sales
                </div>
                <p className="text-[14px] text-neutral-500 mb-3 max-w-sm leading-relaxed">
                  Discuss pricing plans or schedule a product demo to see how Krixai can help you.
                </p>
                <a href="mailto:sales@krixaisecurity.com" className="text-[14.5px] text-neutral-300 hover:text-white transition-colors font-medium">
                  sales@krixaisecurity.com
                </a>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center text-white mb-3 font-medium text-[15px]">
                  <Shield className="w-4 h-4 mr-3 text-neutral-400" /> Security
                </div>
                <p className="text-[14px] text-neutral-500 mb-3 max-w-sm leading-relaxed">
                  Report a vulnerability or inquire about our security practices.
                </p>
                <a href="mailto:security@krixaisecurity.com" className="text-[14.5px] text-neutral-300 hover:text-white transition-colors font-medium">
                  security@krixaisecurity.com
                </a>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center text-white mb-3 font-medium text-[15px]">
                  <Mail className="w-4 h-4 mr-3 text-neutral-400" /> General
                </div>
                <p className="text-[14px] text-neutral-500 mb-3 max-w-sm leading-relaxed">
                  For all other inquiries, feedback, or general assistance.
                </p>
                <a href="mailto:contact@krixaisecurity.com" className="text-[14.5px] text-neutral-300 hover:text-white transition-colors font-medium">
                  contact@krixaisecurity.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Side: Form */}
          <div className="w-full lg:max-w-md ml-auto">
            <div className="p-8 lg:p-10 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] shadow-2xl relative overflow-hidden">
              <h2 className="text-[20px] font-medium text-white mb-8">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
