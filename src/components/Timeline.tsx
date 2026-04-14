import { motion } from 'framer-motion';
import { components, TOTAL_PAGES } from '../data/components';

interface PageDef {
  id: number;
  label: string;
  color: string;
}

const pages: PageDef[] = [
  { id: 0, label: 'Overview', color: '#94a3b8' },
  ...components.map((c) => ({
    id: c.id,
    label: c.title.length > 14 ? c.title.slice(0, 14) + '\u2026' : c.title,
    color: c.color,
  })),
  { id: TOTAL_PAGES - 1, label: 'Summary', color: '#94a3b8' },
];

interface Props {
  currentPage: number;
  goToPage: (n: number) => void;
  darkMode: boolean;
}

export function Timeline({ currentPage, goToPage, darkMode: d }: Props) {
  const progress = currentPage / (pages.length - 1);

  return (
    <div className="w-full px-4 py-3">
      <div className="relative max-w-7xl mx-auto" style={{ height: 32 }}>
        {/* Background line */}
        <div
          className={`absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 ${
            d ? 'bg-slate-700' : 'bg-slate-300'
          }`}
        />

        {/* Progress line */}
        {currentPage > 0 && (
          <div
            className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              background:
                'linear-gradient(to right, #94a3b8, #fbbf24, #a78bfa, #60a5fa, #34d399, #fb7185, #f97316, #22d3ee, #94a3b8)',
            }}
          />
        )}

        {/* Nodes */}
        <div className="relative flex justify-between items-center h-full px-0">
          {pages.map((page) => {
            const isActive = page.id === currentPage;
            const isPast = page.id < currentPage;

            return (
              <button
                key={page.id}
                onClick={() => goToPage(page.id)}
                className="relative flex flex-col items-center cursor-pointer z-10"
              >
                <motion.div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors duration-300 border-2 ${
                    isActive
                      ? 'text-slate-950'
                      : isPast
                        ? 'opacity-80'
                        : d
                          ? 'bg-slate-800 border-slate-600 text-slate-400'
                          : 'bg-white border-slate-300 text-slate-500'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: page.color, borderColor: page.color }
                      : isPast
                        ? {
                            backgroundColor: `${page.color}30`,
                            borderColor: page.color,
                            color: page.color,
                          }
                        : undefined
                  }
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={
                    isActive ? { repeat: Infinity, duration: 2 } : {}
                  }
                >
                  {page.id === 0
                    ? '\u2B1F'
                    : page.id < TOTAL_PAGES - 1
                      ? page.id
                      : '\u25C8'}
                </motion.div>
                <span
                  className={`absolute top-9 text-[9px] whitespace-nowrap font-medium transition-colors ${
                    isActive
                      ? d
                        ? 'text-slate-200'
                        : 'text-slate-700'
                      : isPast
                        ? d
                          ? 'text-slate-400'
                          : 'text-slate-500'
                        : d
                          ? 'text-slate-600'
                          : 'text-slate-400'
                  }`}
                >
                  {page.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
