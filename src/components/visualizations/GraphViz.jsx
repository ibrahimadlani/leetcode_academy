"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

const stateColors = {
  default: { fill: "var(--background)", stroke: "var(--border)" },
  highlight: { fill: "rgba(234, 179, 8, 0.2)", stroke: "rgb(234, 179, 8)" },
  visited: { fill: "rgba(34, 197, 94, 0.2)", stroke: "rgb(34, 197, 94)" },
  current: { fill: "rgba(59, 130, 246, 0.2)", stroke: "rgb(59, 130, 246)" },
  path: { fill: "rgba(168, 85, 247, 0.2)", stroke: "rgb(168, 85, 247)" },
};

export default function GraphViz({ data, label, directed = false }) {
  const svgRef = useRef(null);
  const [dimensions] = useState({ width: 400, height: 300 });

  const { nodes = [], edges = [], highlightNodes = [], highlightEdges = [], states = {} } = data;

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(30));

    if (directed) {
      svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .append("path")
        .attr("d", "M 0,-5 L 10,0 L 0,5")
        .attr("fill", "currentColor")
        .attr("class", "text-muted-foreground");
    }

    const link = svg.append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        const edgeKey = `${d.source.id || d.source}-${d.target.id || d.target}`;
        return highlightEdges.includes(edgeKey) ? "rgb(234, 179, 8)" : "currentColor";
      })
      .attr("stroke-width", 2)
      .attr("class", "text-muted-foreground")
      .attr("marker-end", directed ? "url(#arrowhead)" : null);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", 22)
      .attr("fill", (d) => {
        const state = states[d.id] || (highlightNodes.includes(d.id) ? "highlight" : "default");
        return stateColors[state]?.fill || stateColors.default.fill;
      })
      .attr("stroke", (d) => {
        const state = states[d.id] || (highlightNodes.includes(d.id) ? "highlight" : "default");
        return stateColors[state]?.stroke || stateColors.default.stroke;
      })
      .attr("stroke-width", 2);

    node.append("text")
      .text((d) => d.label || d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("class", "text-sm font-mono fill-foreground");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [nodes, edges, highlightNodes, highlightEdges, states, directed, dimensions]);

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}

      {nodes.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground p-4">
          Empty Graph
        </div>
      ) : (
        <motion.svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border rounded-lg"
        />
      )}

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Nodes: {nodes.length}</span>
        <span>Edges: {edges.length}</span>
      </div>
    </div>
  );
}
