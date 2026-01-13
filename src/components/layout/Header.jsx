"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Moon, Sun } from "lucide-react";

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export default function Header({ onToggleSidebar, language, onLanguageChange }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="h-14 border-b flex items-center px-4 gap-4">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-lg font-semibold">LeetCode Academy</h1>
      <span className="text-sm text-muted-foreground hidden sm:inline">
        Blind75 Visualizer
      </span>

      <div className="flex-1" />

      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {mounted && (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      )}
    </header>
  );
}
