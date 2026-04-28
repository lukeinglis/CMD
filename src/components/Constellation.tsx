import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { components } from '../data/components';

interface Props {
  dark: boolean;
  selected: number | null;
  onSelect: (id: number) => void;
}

const connections: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 3], [1, 5], [2, 3], [2, 4], [2, 6],
  [3, 4], [3, 5], [4, 5], [5, 6],
];

// Layout positions for attractors (normalized 0-1)
// Ordered by component index (0=Data Processing, 1=AutoML, ... 6=ITS Hub)
const attractorNorm: { nx: number; ny: number }[] = [
  { nx: 0.15, ny: 0.58 },  // 0: Data Processing
  { nx: 0.24, ny: 0.28 },  // 1: AutoML (anchor)
  { nx: 0.50, ny: 0.20 },  // 2: AutoRAG (anchor)
  { nx: 0.76, ny: 0.28 },  // 3: Eval Hub (anchor)
  { nx: 0.38, ny: 0.65 },  // 4: SDG Hub
  { nx: 0.62, ny: 0.65 },  // 5: Training Hub
  { nx: 0.85, ny: 0.58 },  // 6: ITS Hub
];

const PARTICLE_COUNT = 280;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  home: number;
  size: number;
  baseAlpha: number;
  angle: number;
  speed: number;
  radius: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function Constellation({ dark, selected, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const activeRef = useRef(-1);
  const [spotlight, setSpotlight] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIdx = selected !== null
    ? components.findIndex((c) => c.id === selected)
    : hovered ?? spotlight;

  activeRef.current = activeIdx;

  useEffect(() => {
    if (selected !== null) return;
    const timer = setInterval(() => {
      setSpotlight((prev) => (prev + 1) % components.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [selected]);

  // Initialize particles
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const home = i % components.length;
      const pos = attractorNorm[home];
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 55;
      particles.push({
        x: pos.nx * w + Math.cos(angle) * radius,
        y: pos.ny * h + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        home,
        size: 0.8 + Math.random() * 2,
        baseAlpha: 0.2 + Math.random() * 0.5,
        angle,
        speed: 0.003 + Math.random() * 0.008,
        radius,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Canvas setup and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const colors = components.map((c) => hexToRgb(c.color));

    const draw = () => {
      const { w, h } = sizeRef.current;
      const active = activeRef.current;
      ctx.clearRect(0, 0, w, h);

      const attractors = attractorNorm.map((a) => ({ x: a.nx * w, y: a.ny * h }));

      // Draw connection curves
      connections.forEach(([a, b]) => {
        const pa = attractors[a];
        const pb = attractors[b];
        const isActive = active === a || active === b;
        const midX = (pa.x + pb.x) / 2;
        const midY = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / dist;
        const ny = dx / dist;
        const off = Math.min(dist * 0.08, 25);

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.quadraticCurveTo(midX + nx * off, midY + ny * off, pb.x, pb.y);

        if (isActive) {
          const [r, g, b2] = colors[active >= 0 ? active : 0];
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b2}, 0.25)`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b2}, 0.3)`;
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = dark ? 'rgba(30, 41, 59, 0.2)' : 'rgba(203, 213, 225, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        const att = attractors[p.home];
        const isHomeActive = active === p.home;

        // Orbital motion around attractor
        p.angle += p.speed * (isHomeActive ? 1.5 : 1);
        const targetX = att.x + Math.cos(p.angle) * p.radius;
        const targetY = att.y + Math.sin(p.angle) * p.radius;

        // Smooth attraction to orbit position
        p.vx += (targetX - p.x) * 0.02;
        p.vy += (targetY - p.y) * 0.02;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        // Draw
        const [r, g, b2] = colors[p.home];
        const alpha = isHomeActive ? p.baseAlpha * 1.8 : p.baseAlpha * 0.7;
        const size = isHomeActive ? p.size * 1.6 : p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b2}, ${Math.min(alpha, 1)})`;
        ctx.fill();

        // Soft glow on active particles
        if (isHomeActive && p.size > 1.5) {
          const glowR = size * 3;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b2}, ${alpha * 0.2})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b2}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // Draw attractor center glows
      attractors.forEach((att, i) => {
        const [r, g, b2] = colors[i];
        const isActive = active === i;

        // Soft ambient glow at attractor center
        const glowSize = isActive ? 40 : 20;
        const centerGrad = ctx.createRadialGradient(att.x, att.y, 0, att.x, att.y, glowSize);
        centerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b2}, ${isActive ? 0.2 : 0.05})`);
        centerGrad.addColorStop(1, `rgba(${r}, ${g}, ${b2}, 0)`);
        ctx.beginPath();
        ctx.arc(att.x, att.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = centerGrad;
        ctx.fill();

        if (isActive) {
          const t = Date.now() * 0.002;
          const pulseR = 25 + Math.sin(t) * 10;
          const pulseAlpha = 0.12 + Math.sin(t) * 0.08;
          const pulseGrad = ctx.createRadialGradient(att.x, att.y, pulseR - 4, att.x, att.y, pulseR + 4);
          pulseGrad.addColorStop(0, `rgba(${r}, ${g}, ${b2}, 0)`);
          pulseGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b2}, ${pulseAlpha})`);
          pulseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b2}, 0)`);
          ctx.beginPath();
          ctx.arc(att.x, att.y, pulseR + 4, 0, Math.PI * 2);
          ctx.fillStyle = pulseGrad;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dark, initParticles]);

  const d = dark;

  return (
    <div className="w-full h-full flex flex-col select-none">
      {/* Title */}
      <motion.div
        className="text-center pt-4 pb-2 flex-shrink-0 relative z-20"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="font-display font-bold tracking-tight leading-none"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
        >
          <span className={d ? 'text-slate-100' : 'text-slate-900'}>Connecting Data </span>
          <span className="rh-red">to Models</span>
          <span className={d ? ' text-slate-100' : ' text-slate-900'}> and Agents</span>
        </h2>
        <p className={`mt-1 text-xs tracking-wide ${d ? 'text-slate-500' : 'text-slate-400'}`}>
          Open source. Enterprise-grade. On OpenShift.
        </p>
      </motion.div>

      {/* Canvas + label overlay */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Component labels */}
        {attractorNorm.map((pos, i) => {
          const comp = components[i];
          const isActive = activeIdx === i;
          const isSelected = selected === comp.id;
          const isAnchor = !!comp.isAnchor;

          return (
            <motion.button
              key={comp.id}
              className="absolute cursor-pointer flex flex-col items-center text-center"
              style={{
                left: `${pos.nx * 100}%`,
                top: `${pos.ny * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 20 : 10,
              }}
              onClick={() => onSelect(comp.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Backdrop (appears on hover/active) */}
              <div
                className="absolute inset-[-12px] rounded-2xl transition-all duration-300"
                style={{
                  background: isActive
                    ? `radial-gradient(ellipse, ${comp.color}12, transparent 70%)`
                    : 'transparent',
                  backdropFilter: isActive ? 'blur(4px)' : 'none',
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="mx-auto mb-1 flex items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    width: isAnchor ? 40 : 32,
                    height: isAnchor ? 40 : 32,
                    background: `${comp.color}${isActive ? '25' : '10'}`,
                    border: `1.5px solid ${comp.color}${isActive ? '50' : '20'}`,
                    boxShadow: isActive ? `0 0 20px ${comp.color}25` : 'none',
                  }}
                >
                  <svg
                    width={isAnchor ? 20 : 16}
                    height={isAnchor ? 20 : 16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={comp.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={comp.iconPath} />
                  </svg>
                </div>

                {/* Title */}
                <span
                  className="font-display font-bold block leading-tight transition-colors duration-300"
                  style={{
                    fontSize: isAnchor ? 'clamp(12px, 1.2vw, 15px)' : 'clamp(10px, 1vw, 13px)',
                    color: isActive ? comp.color : d ? '#e2e8f0' : '#1e293b',
                    textShadow: d ? '0 1px 8px rgba(0,0,0,0.8)' : 'none',
                  }}
                >
                  {comp.title}
                </span>

                {/* Subtitle on active */}
                {isActive && (
                  <motion.span
                    className="block mt-0.5"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    style={{
                      fontSize: 'clamp(8px, 0.7vw, 10px)',
                      color: d ? '#94a3b8' : '#64748b',
                      textShadow: d ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
                    }}
                  >
                    {comp.tagline.length > 35 ? comp.tagline.slice(0, 35) + '...' : comp.tagline}
                  </motion.span>
                )}

                {/* Status */}
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: comp.demoStatus === 'coming-soon'
                        ? (d ? '#334155' : '#cbd5e1')
                        : comp.color,
                      boxShadow: comp.demoStatus !== 'coming-soon' ? `0 0 4px ${comp.color}` : 'none',
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      fontSize: 'clamp(7px, 0.6vw, 9px)',
                      color: comp.demoStatus === 'coming-soon'
                        ? (d ? '#475569' : '#94a3b8')
                        : comp.color,
                    }}
                  >
                    {comp.demoStatus === 'live' ? 'Live' : comp.demoStatus === 'video' ? 'Demo' : 'Soon'}
                  </span>
                </div>

                {/* Anchor badge */}
                {comp.isAnchor && (
                  <span
                    className="inline-block mt-1 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest"
                    style={{
                      fontSize: '6px',
                      background: '#EE000015',
                      color: '#EE0000',
                      border: '1px solid #EE000025',
                    }}
                  >
                    Anchor
                  </span>
                )}
              </div>

              {/* Selected ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-[-16px] rounded-2xl pointer-events-none"
                  style={{ border: `1.5px solid ${comp.color}40` }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
