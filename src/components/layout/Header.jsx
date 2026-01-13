"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="h-14 border-b flex items-center px-4 gap-4">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold">LeetCode Academy</h1>
      <span className="text-sm text-muted-foreground">Blind75 Visualizer</span>
    </header>
  );
}
