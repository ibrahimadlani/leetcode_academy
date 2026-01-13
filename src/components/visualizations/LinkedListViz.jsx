"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  current: "bg-blue-500/20 border-blue-500",
  prev: "bg-purple-500/20 border-purple-500",
  next: "bg-green-500/20 border-green-500",
  reversed: "bg-green-500/20 border-green-500",
};

export default function LinkedListViz({ data, label }) {
  const { nodes = [], pointers = {}, states = {} } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      <div className="flex items-center gap-2">
        {nodes.map((node, index) => {
          const state = states[index] || "default";
          const colorClass = stateColors[state] || stateColors.default;
          const nodePointers = Object.entries(pointers)
            .filter(([_, idx]) => idx === index)
            .map(([name]) => name);

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                {nodePointers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-1"
                  >
                    {nodePointers.map((name) => (
                      <span
                        key={name}
                        className="text-xs font-medium text-blue-500 px-1"
                      >
                        {name}
                      </span>
                    ))}
                  </motion.div>
                )}

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center border-2 rounded-md overflow-hidden
                    ${colorClass}
                  `}
                >
                  <div className="w-12 h-12 flex items-center justify-center font-mono text-sm border-r">
                    {node.value}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center">
                    {index < nodes.length - 1 ? (
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                    ) : (
                      <span className="text-xs text-muted-foreground">/</span>
                    )}
                  </div>
                </motion.div>
              </div>

              {index < nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                  className="mx-1"
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </div>
          );
        })}

        {nodes.length > 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground ml-2"
          >
            null
          </motion.span>
        )}
      </div>
    </div>
  );
}
