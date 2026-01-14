import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Privacy Policy - LeetCode Academy",
  description: "Privacy Policy for LeetCode Academy",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              At LeetCode Academy, we respect your privacy and are committed to protecting your
              personal data. This privacy policy explains how we collect, use, and safeguard
              your information when you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> When you sign in using Google or GitHub,
                we receive your name, email address, and profile picture.
              </li>
              <li>
                <strong>Usage Data:</strong> We track your progress through lessons, including
                completed exercises and current step in each lesson.
              </li>
              <li>
                <strong>Analytics Data:</strong> We use Google Analytics to understand how users
                interact with our platform.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Save your learning progress across sessions</li>
              <li>Improve and personalize your experience</li>
              <li>Analyze usage patterns to enhance our platform</li>
              <li>Communicate with you about updates or changes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Data Storage</h2>
            <p>
              Your data is stored securely using Firebase, a Google Cloud service. We implement
              appropriate technical and organizational measures to protect your personal data
              against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google OAuth:</strong> For authentication purposes
              </li>
              <li>
                <strong>GitHub OAuth:</strong> For authentication purposes
              </li>
              <li>
                <strong>Firebase:</strong> For data storage and analytics
              </li>
              <li>
                <strong>Google Analytics:</strong> For usage analytics
              </li>
            </ul>
            <p>
              Each of these services has their own privacy policies governing the use of your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. Analytics cookies
              help us understand how you use our platform. You can control cookie settings through
              your browser preferences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@leetcode-academy.com" className="text-primary hover:underline">
                privacy@leetcode-academy.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
