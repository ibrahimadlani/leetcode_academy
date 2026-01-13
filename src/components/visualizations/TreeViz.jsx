"use client";

import { motion } from "framer-motion";

const stateColors = {
  default: { fill: "var(--background)", stroke: "var(--border)" },
  highlight: { fill: "rgba(234, 179, 8, 0.2)", stroke: "rgb(234, 179, 8)" },
  current: { fill: "rgba(59, 130, 246, 0.2)", stroke: "rgb(59, 130, 246)" },
  visited: { fill: "rgba(34, 197, 94, 0.2)", stroke: "rgb(34, 197, 94)" },
  target: { fill: "rgba(168, 85, 247, 0.2)", stroke: "rgb(168, 85, 247)" },
};

export default function TreeViz({ data, label }) {
  const { root, highlightIds = [], states = {} } = data;

  if (!root) {
    return (
      <div className="flex flex-col items-center gap-4">
        {label && (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        )}
        <div className="text-center text-sm text-muted-foreground p-4">
          Empty Tree
        </div>
      </div>
    );
  }

  const getTreeDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  const depth = getTreeDepth(root);
  const svgWidth = Math.pow(2, depth) * 60;
  const svgHeight = depth * 80 + 50;

  const renderNode = (node, x, y, level, spread, index = 0) => {
    if (!node) return null;

    const isHighlighted = highlightIds.includes(node.id);
    const state = states[node.id] || (isHighlighted ? "highlight" : "default");
    const colors = stateColors[state] || stateColors.default;

    const childSpread = spread / 2;
    const childY = y + 70;

    return (
      <g key={node.id || index}>
        {node.left && (
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: level * 0.1 }}
            x1={x}
            y1={y + 20}
            x2={x - childSpread}
            y2={childY - 20}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        {node.right && (
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: level * 0.1 }}
            x1={x}
            y1={y + 20}
            x2={x + childSpread}
            y2={childY - 20}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}

        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: level * 0.1 + 0.05 }}
        >
          <circle
            cx={x}
            cy={y}
            r="22"
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth="2"
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            className="text-sm font-mono fill-foreground"
          >
            {node.value}
          </text>
        </motion.g>

        {node.left && renderNode(node.left, x - childSpread, childY, level + 1, childSpread, index * 2 + 1)}
        {node.right && renderNode(node.right, x + childSpread, childY, level + 1, childSpread, index * 2 + 2)}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      <svg
        width={svgWidth}
        height={svgHeight}
        className="overflow-visible"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {renderNode(root, svgWidth / 2, 40, 0, svgWidth / 4)}
      </svg>
    </div>
  );
}
