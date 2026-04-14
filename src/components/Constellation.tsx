import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { components } from '../data/components';
import { scaleIn } from '../animations/variants';

interface Props {
  dark: boolean;
  goToPage: (n: number) => void;
}

// Position nodes in a circle around center
function getNodePositions(cx: number, cy: number, r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * (i - 2)) / count - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

// Connections between components (bidirectional, non-pipeline)
// Indices: 0=Data Processing, 1=AutoML, 2=AutoRAG, 3=Eval, 4=SDG, 5=Training, 6=ITS
const connections: [number, number][] = [
  [0, 2], // Data Processing <-> AutoRAG: structured docs feed RAG pipelines
  [0, 3], // Data Processing <-> Eval: prepares evaluation corpora for benchmarks
  [0, 4], // Data Processing <-> SDG: processed data used in SDG workflows
  [0, 5], // Data Processing <-> Training: creates training-ready datasets
  [0, 1], // Data Processing <-> AutoML: processed data feeds ML model development
  [1, 3], // AutoML <-> Eval: ML models evaluated and benchmarked
  [2, 3], // AutoRAG <-> Eval: RAG pipelines scored by Eval Hub
  [2, 4], // AutoRAG <-> SDG: synthetic eval data for RAG quality testing
  [2, 6], // AutoRAG <-> ITS: ITS improves RAG response quality
  [3, 4], // Eval <-> SDG: SDG generates eval datasets for Eval Hub
  [3, 5], // Eval <-> Training: trained models validated by Eval Hub
  [4, 5], // SDG <-> Training: SDG produces fine-tuning data
  [5, 6], // Training <-> ITS: ITS enhances fine-tuned models
];

export function Constellation({ dark, goToPage }: Props) {
  const [autoSpotlight, setAutoSpotlight] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);

  // The active node is whichever is hovered, falling back to auto-cycle
  const active = hovered ?? autoSpotlight;

  // Auto-cycle spotlight
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSpotlight((prev) => (prev + 1) % components.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = useCallback((i: number) => setHovered(i), []);
  const handleLeave = useCallback(() => setHovered(null), []);

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
        const isActive = active === a || active === b;
        // When hovering, use the hovered node's color; otherwise use the auto-spotlit node's color
        const activeColor =
          hovered !== null
            ? components[hovered].color
            : active >= 0
              ? components[active].color
              : dark
                ? '#334155'
                : '#cbd5e1';

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
              strokeOpacity: isActive ? 0.7 : 0.15,
              stroke: isActive
                ? activeColor
                : dark
                  ? '#334155'
                  : '#cbd5e1',
              strokeWidth: isActive ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
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
        const isActive = active === i;
        // Dim non-connected nodes when hovering
        const isConnected =
          hovered === null ||
          hovered === i ||
          connections.some(
            ([a, b]) => (a === hovered && b === i) || (b === hovered && a === i),
          );
        const nodeW = 120;
        const nodeH = 56;

        return (
          <motion.g
            key={comp.id}
            variants={scaleIn}
            className="cursor-pointer"
            onClick={() => goToPage(comp.id)}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
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
                strokeOpacity: isActive ? 1 : isConnected ? 0.5 : 0.2,
                opacity: isConnected ? 1 : 0.4,
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
            <motion.text
              x={pos.x}
              y={pos.y - 8}
              textAnchor="middle"
              fontSize="16"
              animate={{ opacity: isConnected ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              {comp.icon}
            </motion.text>

            {/* Label */}
            <motion.text
              x={pos.x}
              y={pos.y + 12}
              textAnchor="middle"
              fill={isActive ? comp.color : textMain}
              fontSize="10"
              fontWeight="600"
              animate={{ opacity: isConnected ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              {comp.title}
            </motion.text>

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
