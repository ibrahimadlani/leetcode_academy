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
  title: "Terms of Service - LeetCode Academy",
  description: "Terms of Service for LeetCode Academy",
};

const termsData = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing and using LeetCode Academy, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.",
  },
  {
    id: "description",
    title: "Description of Service",
    content:
      "LeetCode Academy is an educational platform that provides interactive visualizations and explanations for algorithm and data structure problems, including step-by-step problem explanations, code solutions in multiple programming languages, and progress tracking features.",
  },
  {
    id: "accounts",
    title: "User Accounts",
    content:
      "To access certain features of the service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content:
      "You agree not to use the service for any unlawful purpose, attempt to gain unauthorized access to any part of the service, interfere with or disrupt the service or servers, or copy, modify, or distribute content without permission.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content:
      "All content, features, and functionality of LeetCode Academy, including but not limited to text, graphics, logos, and software, are the exclusive property of LeetCode Academy and are protected by copyright and other intellectual property laws.",
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranties",
    content:
      'The service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.',
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content:
      "In no event shall LeetCode Academy be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.",
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the service after such modifications constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
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
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {termsData.map((item, index) => (
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
                href="mailto:contact@leetcode-academy.com"
                className="text-primary hover:underline"
              >
                contact@leetcode-academy.com
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
