import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | krixai",
  description: "Terms of Service for krixai.",
};

export default function TermsOfServicePage() {
  return (
    <main className="flex-1 w-full bg-black min-h-screen pt-32 pb-24 px-6 lg:px-12 flex flex-col items-center">
      <div className="max-w-3xl w-full text-neutral-300">
        <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-8">
          Terms of Service
        </h1>
        <div className="text-sm text-neutral-500 mb-12">Last Updated: {new Date().toLocaleDateString()}</div>
        
        <div className="space-y-10 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Intellectual Property</h2>
            <p>
              The Service and its original content, features and functionality are and will remain the exclusive property of krixai and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mt-3">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall krixai, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@krixai.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
