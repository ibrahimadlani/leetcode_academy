"use client";

import { motion } from "framer-motion";

const stateColors = {
  default: "bg-background border-border",
  highlight: "bg-yellow-500/20 border-yellow-500",
  swapping: "bg-purple-500/20 border-purple-500",
  comparing: "bg-blue-500/20 border-blue-500",
  root: "bg-green-500/20 border-green-500",
};

export default function HeapViz({ data, label, type = "max" }) {
  const { values = [], highlight = [], states = {} } = data;

  const getLevel = (index) => Math.floor(Math.log2(index + 1));
  const maxLevel = values.length > 0 ? getLevel(values.length - 1) : 0;

  const getNodePosition = (index, level) => {
    const totalNodesInLevel = Math.pow(2, level);
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const spacing = 100 / (totalNodesInLevel + 1);
    return (positionInLevel + 1) * spacing;
  };

  const renderNode = (index) => {
    if (index >= values.length) return null;

    const level = getLevel(index);
    const x = getNodePosition(index, level);
    const isHighlighted = highlight.includes(index);
    const state = states[index] || (isHighlighted ? "highlight" : "default");
    const colorClass = stateColors[state] || stateColors.default;

    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;

    return (
      <g key={index}>
        {leftChild < values.length && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={`${x}%`}
            y1={level * 70 + 25}
            x2={`${getNodePosition(leftChild, level + 1)}%`}
            y2={(level + 1) * 70 + 25}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        )}
        {rightChild < values.length && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={`${x}%`}
            y1={level * 70 + 25}
            x2={`${getNodePosition(rightChild, level + 1)}%`}
            y2={(level + 1) * 70 + 25}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        )}

        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <circle
            cx={`${x}%`}
            cy={level * 70 + 25}
            r="20"
            className={`stroke-2 ${colorClass.replace("bg-", "fill-").replace("border-", "stroke-")}`}
            fill="currentColor"
            stroke="currentColor"
          />
          <text
            x={`${x}%`}
            y={level * 70 + 30}
            textAnchor="middle"
            className="text-sm font-mono fill-foreground"
          >
            {values[index]}
          </text>
        </motion.g>
      </g>
    );
  };

  const svgHeight = (maxLevel + 1) * 70 + 50;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label} ({type === "max" ? "Max" : "Min"} Heap)
        </span>
      )}

      {values.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground p-4">
          Empty Heap
        </div>
      ) : (
        <svg
          width="400"
          height={svgHeight}
          className="overflow-visible"
        >
          {values.map((_, index) => renderNode(index))}
        </svg>
      )}

      <div className="flex gap-1 mt-2">
        <span className="text-xs text-muted-foreground">Array:</span>
        <span className="text-xs font-mono">
          [{values.join(", ")}]
        </span>
      </div>
    </div>
  );
}
