"use client";

import { motion, AnimatePresence } from "framer-motion";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  new: "bg-green-500/20 border-green-500",
  found: "bg-blue-500/20 border-blue-500",
  duplicate: "bg-red-500/20 border-red-500",
};

export default function HashSetViz({ data, label }) {
  const { values = [], highlightValues = [], states = {} } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      <div className="border rounded-lg p-4 min-w-[200px]">
        <AnimatePresence mode="popLayout">
          {values.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground"
            >
              Empty Set
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {values.map((value) => {
                const isHighlighted = highlightValues.includes(value);
                const state = states[value] || (isHighlighted ? "highlight" : "default");
                const colorClass = stateColors[state] || stateColors.default;

                return (
                  <motion.div
                    key={value}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`
                      px-3 py-1.5 border-2 rounded-full font-mono text-sm
                      ${colorClass}
                    `}
                  >
                    {value}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {values.length > 0 && (
        <span className="text-xs text-muted-foreground">
          Size: {values.length}
        </span>
      )}
    </div>
  );
}
