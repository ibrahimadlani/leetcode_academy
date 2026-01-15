"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookMarked,
  Brain,
  GraduationCap,
  Layers,
  Target,
  Trophy,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

export default function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Practice Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Practice</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[400px] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Brain className="h-4 w-4" />
                Entraînement
              </div>

              <ul className="grid gap-3">
                {practiceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-accent",
                            pathname === item.href && "bg-accent"
                          )}
                        >
                          <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 border-t pt-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/practices"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Voir tout l'entraînement
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Courses Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[400px] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BookMarked className="h-4 w-4" />
                Formations
              </div>

              <ul className="grid gap-3">
                {courseItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-accent",
                            pathname === item.href && "bg-accent"
                          )}
                        >
                          <div className="mt-0.5 rounded-md bg-violet-500/10 p-2">
                            <Icon className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 border-t pt-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/courses"
                    className="flex items-center gap-2 text-sm font-medium text-violet-500 hover:underline"
                  >
                    Voir toutes les formations
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
