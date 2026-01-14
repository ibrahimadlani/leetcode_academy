import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { FirebaseProvider } from "@/components/FirebaseProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeetCode Academy - Blind75 Visualizer",
  description: "Interactive visualizations for Blind75 LeetCode problems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProvider>
          <FirebaseProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </FirebaseProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
