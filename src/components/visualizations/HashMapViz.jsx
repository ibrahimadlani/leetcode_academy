"use client";

import { motion, AnimatePresence } from "framer-motion";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  new: "bg-green-500/20 border-green-500",
  found: "bg-blue-500/20 border-blue-500",
  checking: "bg-purple-500/20 border-purple-500",
};

export default function HashMapViz({ data, label }) {
  const { entries = [], highlightKeys = [], states = {} } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      <div className="border rounded-lg overflow-hidden min-w-[200px]">
        <div className="flex bg-muted px-3 py-2 border-b">
          <span className="flex-1 text-xs font-medium">Key</span>
          <span className="flex-1 text-xs font-medium text-right">Value</span>
        </div>

        <AnimatePresence mode="popLayout">
          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-4 text-center text-sm text-muted-foreground"
            >
              Empty
            </motion.div>
          ) : (
            entries.map((entry, index) => {
              const isHighlighted = highlightKeys.includes(entry.key);
              const state = states[entry.key] || (isHighlighted ? "highlight" : "default");
              const colorClass = stateColors[state] || stateColors.default;

              return (
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex px-3 py-2 border-b last:border-b-0 ${colorClass}`}
                >
                  <span className="flex-1 font-mono text-sm">{entry.key}</span>
                  <span className="flex-1 font-mono text-sm text-right">
                    {entry.value}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {entries.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      )}
    </div>
  );
}
