"use client";

import { motion, AnimatePresence } from "framer-motion";
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

const sidebarVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2 },
    },
  },
  visible: {
    width: 288, // w-72 = 18rem = 288px
    opacity: 1,
    transition: {
      width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.15 },
  },
};

export default function LeftSidebar({ isOpen, chapters, currentLesson }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          key="sidebar"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="border-r h-full flex flex-col overflow-hidden bg-background"
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col h-full min-w-[288px]"
          >
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
                              "text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors",
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
                                "flex items-center gap-2 text-sm py-1.5 px-2 rounded-md hover:bg-accent overflow-hidden transition-colors",
                                currentLesson === problem.id && "bg-accent"
                              )}
                            >
                              <span className="truncate flex-1 min-w-0">{problem.title}</span>
                              <Badge
                                variant="secondary"
                                className={cn("text-xs shrink-0", difficultyColors[problem.difficulty])}
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
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
