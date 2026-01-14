import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Privacy Policy - LeetCode Academy",
  description: "Privacy Policy for LeetCode Academy",
};

const privacyData = [
  {
    id: "introduction",
    title: "Introduction",
    content:
      "At LeetCode Academy, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.",
  },
  {
    id: "information",
    title: "Information We Collect",
    content:
      "We collect account information (name, email, profile picture) when you sign in using Google or GitHub. We also track your learning progress and use Google Analytics to understand platform usage.",
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    content:
      "We use collected information to provide and maintain our service, save your learning progress, improve and personalize your experience, analyze usage patterns, and communicate updates.",
  },
  {
    id: "storage",
    title: "Data Storage",
    content:
      "Your data is stored securely using Firebase, a Google Cloud service. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access.",
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content:
      "We use Google OAuth, GitHub OAuth, Firebase, and Google Analytics. Each service has their own privacy policies governing the use of your data.",
  },
  {
    id: "rights",
    title: "Your Rights",
    content:
      "You have the right to access your personal data, request correction of inaccurate data, request deletion, withdraw consent, and export your data in a portable format.",
  },
  {
    id: "cookies",
    title: "Cookies",
    content:
      "We use essential cookies to maintain your session and preferences. Analytics cookies help us understand platform usage. You can control cookie settings through your browser.",
  },
  {
    id: "children",
    title: "Children's Privacy",
    content:
      "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.",
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content:
      'We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last updated" date.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="small" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {privacyData.map((item, index) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {index + 1}. {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              Questions? Contact us at{" "}
              <a
                href="mailto:privacy@leetcode-academy.com"
                className="text-primary hover:underline"
              >
                privacy@leetcode-academy.com
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
