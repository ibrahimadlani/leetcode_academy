import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Terms of Service - LeetCode Academy",
  description: "Terms of Service for LeetCode Academy",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="small" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using LeetCode Academy, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by these terms,
              please do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Description of Service</h2>
            <p>
              LeetCode Academy is an educational platform that provides interactive visualizations
              and explanations for algorithm and data structure problems. The service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interactive algorithm visualizations</li>
              <li>Step-by-step problem explanations</li>
              <li>Code solutions in multiple programming languages</li>
              <li>Progress tracking features</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. User Accounts</h2>
            <p>
              To access certain features of the service, you may be required to create an account.
              You are responsible for maintaining the confidentiality of your account information
              and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Copy, modify, or distribute content without permission</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of LeetCode Academy, including but not limited
              to text, graphics, logos, and software, are the exclusive property of LeetCode Academy
              and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranties of any kind, either express or implied.
              We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
            <p>
              In no event shall LeetCode Academy be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or relating to your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes by posting the new terms on this page. Your continued use of the
              service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:contact@leetcode-academy.com" className="text-primary hover:underline">
                contact@leetcode-academy.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
