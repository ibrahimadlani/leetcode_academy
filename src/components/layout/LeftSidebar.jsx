"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function LeftSidebar({ isOpen, chapters, currentLesson }) {
  if (!isOpen) return null;

  return (
    <aside className="w-72 border-r h-full flex flex-col">
      <div className="p-4">
        <h2 className="font-semibold text-sm">Chapters</h2>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="datastructures" className="border-none">
              <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-accent rounded-md">
                <span className="text-sm font-medium">Data Structures</span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="flex flex-col gap-1 pl-2">
                  {chapters.dataStructures?.map((ds) => (
                    <Link
                      key={ds.id}
                      href={`/lesson/${ds.slug}`}
                      className={cn(
                        "text-sm py-1.5 px-2 rounded-md hover:bg-accent",
                        currentLesson === ds.slug && "bg-accent"
                      )}
                    >
                      {ds.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <Separator className="my-2" />

            {chapters.blind75?.map((category) => (
              <AccordionItem
                key={category.category}
                value={category.category}
                className="border-none"
              >
                <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-accent rounded-md">
                  <span className="text-sm font-medium">{category.category}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col gap-1 pl-2">
                    {category.problems.map((problem) => (
                      <Link
                        key={problem.id}
                        href={`/lesson/${problem.id}`}
                        className={cn(
                          "flex items-center justify-between text-sm py-1.5 px-2 rounded-md hover:bg-accent",
                          currentLesson === problem.id && "bg-accent"
                        )}
                      >
                        <span className="truncate">{problem.title}</span>
                        <Badge
                          variant="secondary"
                          className={cn("ml-2 text-xs", difficultyColors[problem.difficulty])}
                        >
                          {problem.difficulty}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </aside>
  );
}
