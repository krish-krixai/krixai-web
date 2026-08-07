import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | krixai",
  description: "Privacy Policy for krixai.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 w-full bg-black min-h-screen pt-32 pb-24 px-6 lg:px-12 flex flex-col items-center">
      <div className="max-w-3xl w-full text-neutral-300">
        <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-8">
          Privacy Policy
        </h1>
        <div className="text-sm text-neutral-500 mb-12">Last Updated: {new Date().toLocaleDateString()}</div>
        
        <div className="space-y-10 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to krixai ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you, including:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-neutral-400">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes IP address, your login data, browser type and version, time zone setting and location, operating system and platform.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-neutral-400">
              <li>To register you as a new customer.</li>
              <li>To provide and manage your account and our services.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at support@krixai.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
