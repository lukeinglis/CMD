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

const attractorNorm: { nx: number; ny: number }[] = [
  { nx: 0.15, ny: 0.58 },
  { nx: 0.24, ny: 0.28 },
  { nx: 0.50, ny: 0.20 },
  { nx: 0.76, ny: 0.28 },
  { nx: 0.38, ny: 0.65 },
  { nx: 0.62, ny: 0.65 },
  { nx: 0.85, ny: 0.58 },
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

interface SignalDot {
  connectionIdx: number;
  progress: number;
  speed: number;
  sourceIdx: number;
  targetIdx: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function quadBezierPoint(
  t: number,
  p0x: number, p0y: number,
  cpx: number, cpy: number,
  p1x: number, p1y: number,
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * p0x + 2 * mt * t * cpx + t * t * p1x,
    mt * mt * p0y + 2 * mt * t * cpy + t * t * p1y,
  ];
}

const RING_RADIUS = 24;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function Constellation({ dark, selected, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const signalDotsRef = useRef<SignalDot[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const activeRef = useRef(-1);
  const [spotlight, setSpotlight] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  ).current;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let paused = false;

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

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused && !prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (paused) return;

      const { w, h } = sizeRef.current;
      const active = activeRef.current;
      ctx.clearRect(0, 0, w, h);

      const attractors = attractorNorm.map((a) => ({ x: a.nx * w, y: a.ny * h }));

      // Pre-compute connection geometry
      const connectionGeom = connections.map(([a, b]) => {
        const pa = attractors[a];
        const pb = attractors[b];
        const midX = (pa.x + pb.x) / 2;
        const midY = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const off = Math.min(dist * 0.08, 25);
        return { pa, pb, cpx: midX + nx * off, cpy: midY + ny * off };
      });

      // Draw connection curves
      connectionGeom.forEach((geom, idx) => {
        const [a, b] = connections[idx];
        const isActive = active === a || active === b;

        ctx.beginPath();
        ctx.moveTo(geom.pa.x, geom.pa.y);
        ctx.quadraticCurveTo(geom.cpx, geom.cpy, geom.pb.x, geom.pb.y);

        if (isActive && active >= 0) {
          const [r1, g1, b1] = colors[active];
          const otherIdx = active === a ? b : a;
          const [r2, g2, b2] = colors[otherIdx];

          const grad = ctx.createLinearGradient(
            attractors[a].x, attractors[a].y,
            attractors[b].x, attractors[b].y,
          );
          if (active === a) {
            grad.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, 0.35)`);
            grad.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0.12)`);
          } else {
            grad.addColorStop(0, `rgba(${r2}, ${g2}, ${b2}, 0.12)`);
            grad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, 0.35)`);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = `rgba(${r1}, ${g1}, ${b1}, 0.2)`;
          ctx.shadowBlur = 6;
        } else {
          ctx.strokeStyle = dark ? 'rgba(30, 41, 59, 0.2)' : 'rgba(203, 213, 225, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Signal dots: spawn, update, draw
      if (active >= 0 && !prefersReducedMotion) {
        connections.forEach(([a, b], idx) => {
          if (a !== active && b !== active) return;
          const dotsOnConn = signalDotsRef.current.filter((d) => d.connectionIdx === idx);
          if (dotsOnConn.length < 3) {
            const isSource = a === active;
            signalDotsRef.current.push({
              connectionIdx: idx,
              progress: -(Math.random() * 0.3),
              speed: 0.004 + Math.random() * 0.003,
              sourceIdx: isSource ? a : b,
              targetIdx: isSource ? b : a,
            });
          }
        });
      }

      signalDotsRef.current = signalDotsRef.current.filter((d) => d.progress <= 1.1);

      signalDotsRef.current.forEach((dot) => {
        dot.progress += dot.speed;
        if (dot.progress < 0) return;

        let alpha = 1;
        if (dot.progress < 0.1) alpha = dot.progress / 0.1;
        if (dot.progress > 0.9) alpha = (1 - dot.progress) / 0.1;
        alpha = Math.max(0, Math.min(1, alpha));
        if (alpha <= 0) return;

        const geom = connectionGeom[dot.connectionIdx];
        const [ca, cb] = connections[dot.connectionIdx];
        const p0 = dot.sourceIdx === ca ? geom.pa : geom.pb;
        const p1 = dot.sourceIdx === ca ? geom.pb : geom.pa;
        const [cr, cg, cb2] = colors[dot.sourceIdx];

        // Trail
        const trailOffsets = [0.03, 0.06, 0.09];
        const trailAlphas = [0.45, 0.2, 0.08];
        const trailSizes = [2, 1.5, 1];
        trailOffsets.forEach((offset, ti) => {
          const tp = Math.max(0, dot.progress - offset);
          const [tx, ty] = quadBezierPoint(tp, p0.x, p0.y, geom.cpx, geom.cpy, p1.x, p1.y);
          ctx.beginPath();
          ctx.arc(tx, ty, trailSizes[ti], 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb2}, ${alpha * trailAlphas[ti]})`;
          ctx.fill();
        });

        // Main dot
        const [mx, my] = quadBezierPoint(dot.progress, p0.x, p0.y, geom.cpx, geom.cpy, p1.x, p1.y);
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb2}, ${alpha * 0.9})`;
        ctx.fill();

        // Glow
        const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 8);
        glowGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb2}, ${alpha * 0.25})`);
        glowGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb2}, 0)`);
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      });

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        const att = attractors[p.home];
        const isHomeActive = active === p.home;

        if (!prefersReducedMotion) {
          p.angle += p.speed * (isHomeActive ? 1.5 : 1);
          const activeRadius = isHomeActive ? p.radius * 1.2 : p.radius;
          const targetX = att.x + Math.cos(p.angle) * activeRadius;
          const targetY = att.y + Math.sin(p.angle) * activeRadius;
          p.vx += (targetX - p.x) * 0.02;
          p.vy += (targetY - p.y) * 0.02;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = att.x + Math.cos(p.angle) * p.radius;
          p.y = att.y + Math.sin(p.angle) * p.radius;
        }

        const [r, g, b2] = colors[p.home];
        const alpha = isHomeActive ? p.baseAlpha * 1.8 : p.baseAlpha * 0.7;
        const size = isHomeActive ? p.size * 1.6 : p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b2}, ${Math.min(alpha, 1)})`;
        ctx.fill();

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

        const glowSize = isActive ? 40 : 20;
        const centerGrad = ctx.createRadialGradient(att.x, att.y, 0, att.x, att.y, glowSize);
        centerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b2}, ${isActive ? 0.2 : 0.05})`);
        centerGrad.addColorStop(1, `rgba(${r}, ${g}, ${b2}, 0)`);
        ctx.beginPath();
        ctx.arc(att.x, att.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = centerGrad;
        ctx.fill();

        if (isActive && !prefersReducedMotion) {
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

      if (prefersReducedMotion) return;
      raf = requestAnimationFrame(draw);
    };

    if (prefersReducedMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dark, initParticles, prefersReducedMotion]);

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
      <div ref={containerRef} className="flex-1 relative overflow-hidden" role="region" aria-label="Component constellation. Use arrow keys to navigate between components.">
        <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

        {/* Component labels */}
        {attractorNorm.map((pos, i) => {
          const comp = components[i];
          const isActive = activeIdx === i;
          const isSelected = selected === comp.id;

          return (
            <motion.button
              key={comp.id}
              aria-label={`${comp.title}: ${comp.tagline}. Status: ${comp.demoStatus === 'live' ? 'Live demo' : comp.demoStatus === 'video' ? 'Video demo' : 'Coming soon'}`}
              className="absolute cursor-pointer flex flex-col items-center text-center"
              style={{
                left: `${pos.nx * 100}%`,
                top: `${pos.ny * 100}%`,
                transform: 'translate(-50%, -55%)',
                zIndex: isActive ? 20 : 10,
              }}
              onClick={() => onSelect(comp.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Scanner ring */}
              <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 400ms ease',
                    animation: isActive && !prefersReducedMotion ? 'segmented-ring-spin 14s linear infinite' : 'none',
                  }}
                  aria-hidden="true"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={comp.color}
                    strokeWidth="1.5"
                    strokeDasharray={`${RING_CIRCUMFERENCE * 0.19} ${RING_CIRCUMFERENCE * 0.06}`}
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>

                {/* Icon */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={comp.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: isActive ? 1 : 0.45,
                    transition: 'opacity 400ms ease',
                    filter: isActive ? `drop-shadow(0 0 6px ${comp.color}80)` : 'none',
                  }}
                  aria-hidden="true"
                >
                  <path d={comp.iconPath} />
                </svg>

                {/* Selected pulse ring */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `1px solid ${comp.color}` }}
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                  />
                )}
              </div>

              {/* Title */}
              <span
                className="font-display font-semibold whitespace-nowrap mt-1"
                style={{
                  fontSize: 'clamp(9px, 0.85vw, 11px)',
                  letterSpacing: '0.02em',
                  color: isActive ? comp.color : d ? '#94a3b8' : '#475569',
                  textShadow: isActive ? `0 0 12px ${comp.color}60` : d ? '0 1px 6px rgba(0,0,0,0.9)' : 'none',
                  transition: 'color 400ms ease, text-shadow 400ms ease',
                }}
              >
                {comp.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
