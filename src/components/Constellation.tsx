import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { components } from '../data/components';
import { scaleIn } from '../animations/variants';

interface Props {
  dark: boolean;
  goToPage: (n: number) => void;
}

// Position nodes in a circle around center
function getNodePositions(cx: number, cy: number, r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

// Connections between components (bidirectional, non-pipeline)
const connections: [number, number][] = [
  [0, 2], // Data Processing <-> AutoRAG
  [0, 4], // Data Processing <-> SDG
  [1, 3], // AutoML <-> Eval
  [2, 3], // AutoRAG <-> Eval
  [2, 4], // AutoRAG <-> SDG
  [3, 4], // Eval <-> SDG
  [3, 5], // Eval <-> Training
  [4, 5], // SDG <-> Training
  [5, 6], // Training <-> ITS
  [1, 6], // AutoML <-> ITS
  [2, 6], // AutoRAG <-> ITS
  [0, 5], // Data Processing <-> Training
];

export function Constellation({ dark, goToPage }: Props) {
  const [spotlight, setSpotlight] = useState(-1);

  // Auto-cycle spotlight
  useEffect(() => {
    const timer = setInterval(() => {
      setSpotlight((prev) => (prev + 1) % components.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const cx = 400;
  const cy = 260;
  const radius = 185;
  const positions = getNodePositions(cx, cy, radius, components.length);

  const boxBg = dark ? '#0f172a' : '#ffffff';
  const textMain = dark ? '#94a3b8' : '#475569';
  const textBright = dark ? '#e2e8f0' : '#1e293b';

  return (
    <motion.svg
      viewBox="0 0 800 520"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={dark ? '#22d3ee' : '#0891b2'} stopOpacity="0.12" />
          <stop offset="100%" stopColor={dark ? '#22d3ee' : '#0891b2'} stopOpacity="0" />
        </radialGradient>
        {components.map((comp) => (
          <radialGradient key={`glow-${comp.id}`} id={`nodeGlow-${comp.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={comp.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={comp.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Background glow */}
      <circle cx={cx} cy={cy} r={radius + 60} fill="url(#hubGlow)" />

      {/* Connection lines */}
      {connections.map(([a, b], i) => {
        const pa = positions[a];
        const pb = positions[b];
        const isActive =
          spotlight === a || spotlight === b;

        return (
          <motion.line
            key={`conn-${i}`}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={dark ? '#334155' : '#cbd5e1'}
            strokeDasharray="4 4"
            animate={{
              strokeOpacity: isActive ? 0.6 : 0.15,
              stroke: isActive
                ? components[a].color
                : dark
                  ? '#334155'
                  : '#cbd5e1',
            }}
            transition={{ duration: 0.5 }}
          />
        );
      })}

      {/* Center hub */}
      <motion.g variants={scaleIn}>
        <circle
          cx={cx}
          cy={cy}
          r={52}
          fill={boxBg}
          stroke={dark ? '#334155' : '#e2e8f0'}
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill={textBright}
          fontSize="11"
          fontWeight="700"
        >
          Connecting Data
        </text>
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill={textBright}
          fontSize="11"
          fontWeight="700"
        >
          to Models
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill={textBright}
          fontSize="11"
          fontWeight="700"
        >
          and Agents
        </text>
      </motion.g>

      {/* Component nodes */}
      {components.map((comp, i) => {
        const pos = positions[i];
        const isActive = spotlight === i;
        const nodeW = 120;
        const nodeH = 56;

        return (
          <motion.g
            key={comp.id}
            variants={scaleIn}
            className="cursor-pointer"
            onClick={() => goToPage(comp.id)}
          >
            {/* Glow behind active node */}
            {isActive && (
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={50}
                fill={`url(#nodeGlow-${comp.id})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}

            {/* Node box */}
            <motion.rect
              x={pos.x - nodeW / 2}
              y={pos.y - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx="10"
              fill={boxBg}
              stroke={comp.color}
              animate={{
                strokeWidth: isActive ? 2.5 : 1.5,
                strokeOpacity: isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x={pos.x - nodeW / 2}
              y={pos.y - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx="10"
              fill={comp.color}
              animate={{ fillOpacity: isActive ? 0.12 : 0.03 }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon */}
            <text
              x={pos.x}
              y={pos.y - 8}
              textAnchor="middle"
              fontSize="16"
            >
              {comp.icon}
            </text>

            {/* Label */}
            <text
              x={pos.x}
              y={pos.y + 12}
              textAnchor="middle"
              fill={isActive ? comp.color : textMain}
              fontSize="10"
              fontWeight="600"
            >
              {comp.title}
            </text>

            {/* Tagline (shown when active) */}
            {isActive && (
              <motion.text
                x={pos.x}
                y={pos.y + nodeH / 2 + 14}
                textAnchor="middle"
                fill={comp.color}
                fontSize="8"
                fontWeight="500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {comp.tagline.length > 45
                  ? comp.tagline.slice(0, 45) + '...'
                  : comp.tagline}
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
