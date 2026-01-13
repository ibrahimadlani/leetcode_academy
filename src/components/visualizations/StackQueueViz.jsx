"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  push: "bg-green-500/20 border-green-500",
  pop: "bg-red-500/20 border-red-500",
  peek: "bg-blue-500/20 border-blue-500",
};

export default function StackQueueViz({ data, label, type = "stack" }) {
  const { values = [], highlight = [], states = {}, topLabel, bottomLabel } = data;

  const isStack = type === "stack";

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label} ({isStack ? "Stack - LIFO" : "Queue - FIFO"})
        </span>
      )}

      <div className={`flex ${isStack ? "flex-col" : "flex-row"} items-center gap-2`}>
        {isStack && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <ArrowDown className="h-4 w-4" />
            <span>Top (push/pop)</span>
          </div>
        )}

        {!isStack && (
          <div className="flex flex-col items-center gap-1 mr-2">
            <span className="text-xs text-muted-foreground">Front</span>
            <span className="text-xs text-muted-foreground">(dequeue)</span>
          </div>
        )}

        <div
          className={`
            flex ${isStack ? "flex-col" : "flex-row"} gap-1
            border-2 rounded-lg p-2 min-w-[60px]
            ${isStack ? "min-h-[200px]" : "min-w-[200px]"}
          `}
        >
          <AnimatePresence mode="popLayout">
            {values.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center p-4 text-sm text-muted-foreground"
              >
                Empty
              </motion.div>
            ) : (
              values.map((value, index) => {
                const isHighlighted = highlight.includes(index);
                const state = states[index] || (isHighlighted ? "highlight" : "default");
                const colorClass = stateColors[state] || stateColors.default;

                return (
                  <motion.div
                    key={`${value}-${index}`}
                    initial={{
                      opacity: 0,
                      [isStack ? "y" : "x"]: isStack ? -20 : 20,
                      scale: 0.8,
                    }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      [isStack ? "y" : "x"]: isStack ? -20 : -20,
                      scale: 0.8,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`
                      w-12 h-12 flex items-center justify-center
                      border-2 rounded-md font-mono text-sm
                      ${colorClass}
                    `}
                  >
                    {value}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {!isStack && (
          <div className="flex flex-col items-center gap-1 ml-2">
            <span className="text-xs text-muted-foreground">Rear</span>
            <span className="text-xs text-muted-foreground">(enqueue)</span>
          </div>
        )}

        {isStack && (
          <div className="text-xs text-muted-foreground mt-2">
            Bottom
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Size: {values.length}
      </div>
    </div>
  );
}
