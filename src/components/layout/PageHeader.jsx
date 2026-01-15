"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";
import MainNav from "@/components/MainNav";

export default function PageHeader({ backHref = "/" }) {
  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        {/* Left section */}
        <div className="flex items-center gap-3 flex-1">
          <Logo size="small" />
        </div>

        {/* Center section - Navigation */}
        <MainNav />

        {/* Right section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button asChild variant="ghost" size="sm" className="text-pink-700 hover:text-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/20">
            <Link href="/pricing">Get premium</Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
