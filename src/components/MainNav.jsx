"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookMarked,
  Brain,
  ChevronDown,
  GraduationCap,
  Layers,
  Target,
  Trophy,
} from "lucide-react";

const practiceItems = [
  {
    title: "LeetCode 75",
    description: "Les 75 problèmes essentiels",
    href: "/practices/leetcode75",
    icon: Target,
  },
  {
    title: "LeetCode 150",
    description: "150 problèmes pour maîtriser",
    href: "/practices/leetcode150",
    icon: Trophy,
  },
];

const courseItems = [
  {
    title: "DSA Débutant",
    description: "Fondamentaux des structures de données",
    href: "/courses/dsa-beginner",
    icon: GraduationCap,
  },
  {
    title: "DSA Avancé",
    description: "Algorithmes et structures avancées",
    href: "/courses/dsa-advanced",
    icon: Layers,
  },
];

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

function NavDropdown({
  label,
  href,
  icon: Icon,
  items,
  isActive,
  accentColor = "primary"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      hover: "hover:bg-primary/5",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-500",
      hover: "hover:bg-violet-500/5",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Link>

      {/* Invisible bridge to prevent gap closing */}
      {isOpen && <div className="absolute top-full left-0 h-2 w-full" />}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="w-64 rounded-lg border bg-popover p-1 shadow-lg">
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label === "Practice" ? "Entraînement" : "Formations"}
            </div>

            <div className="h-px bg-border my-1" />

            {items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className={cn("mt-0.5 p-1.5 rounded-md", colors.bg)}>
                    <ItemIcon className={cn("h-4 w-4", colors.text)} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}

            <div className="h-px bg-border my-1" />

            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors",
                colors.text
              )}
              onClick={() => setIsOpen(false)}
            >
              Voir tout
            </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MainNav() {
  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1">
      <NavDropdown
        label="Practice"
        href="/practices"
        icon={Brain}
        items={practiceItems}
        isActive={isActive("/practices")}
        accentColor="primary"
      />

      <NavDropdown
        label="Courses"
        href="/courses"
        icon={BookMarked}
        items={courseItems}
        isActive={isActive("/courses")}
        accentColor="violet"
      />
    </nav>
  );
}
