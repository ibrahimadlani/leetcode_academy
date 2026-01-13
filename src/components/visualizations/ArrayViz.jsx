"use client";

import { motion } from "framer-motion";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  success: "bg-green-500/20 border-green-500",
  error: "bg-red-500/20 border-red-500",
  current: "bg-blue-500/20 border-blue-500",
  comparing: "bg-purple-500/20 border-purple-500",
};

export default function ArrayViz({ data, label }) {
  const { values = [], highlight = [], pointers = {}, states = {} } = data;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      <div className="flex gap-1">
        {values.map((value, index) => {
          const isHighlighted = highlight.includes(index);
          const state = states[index] || (isHighlighted ? "highlight" : "default");
          const colorClass = stateColors[state] || stateColors.default;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {Object.entries(pointers)
                .filter(([_, idx]) => idx === index)
                .map(([name]) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-blue-500"
                  >
                    {name}
                  </motion.span>
                ))}

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  w-12 h-12 flex items-center justify-center
                  border-2 rounded-md font-mono text-sm
                  ${colorClass}
                `}
              >
                {value}
              </motion.div>

              <span className="text-xs text-muted-foreground">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
