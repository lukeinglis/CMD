import { motion } from 'framer-motion';
import { components } from '../data/components';
import { fadeInUp, staggerContainer } from '../animations/variants';

interface Props {
  darkMode: boolean;
  goToPage: (n: number) => void;
}

export function SummaryPage({ darkMode: d, goToPage }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center max-w-2xl" variants={fadeInUp}>
        <h2
          className={`text-2xl font-bold mb-2 ${
            d ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          Connecting Data to Models and Agents
        </h2>
        <p className={`text-sm ${d ? 'text-slate-400' : 'text-slate-500'}`}>
          Seven components. One cohesive pillar. Each delivers value
          independently. Together they form a comprehensive foundation for
          enterprise AI.
        </p>
      </motion.div>

      {/* Component grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {components.map((comp) => (
          <motion.button
            key={comp.id}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              d
                ? 'glass-card hover:border-slate-600'
                : 'glass-card-light hover:border-slate-300'
            }`}
            variants={fadeInUp}
            whileHover={{ scale: 1.03 }}
            onClick={() => goToPage(comp.id)}
          >
            <div className="text-xl mb-2">{comp.icon}</div>
            <div
              className="text-sm font-semibold mb-1"
              style={{ color: comp.color }}
            >
              {comp.title}
            </div>
            <div
              className={`text-xs ${d ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {comp.tagline}
            </div>
            {comp.demoStatus !== 'coming-soon' && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: comp.color }}
                />
                <span className="text-[10px]" style={{ color: comp.color }}>
                  {comp.demoStatus === 'live' ? 'Live demo' : 'Video demo'}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Pillar message */}
      <motion.div
        className={`max-w-2xl text-center mt-2 p-6 rounded-xl ${
          d ? 'glass-card' : 'glass-card-light'
        }`}
        variants={fadeInUp}
      >
        <p
          className={`text-sm leading-relaxed ${
            d ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Each component stands on its own. Adopt any one without needing the
          others. When you combine them, they complement each other to
          accelerate your AI journey across data preparation, model development,
          evaluation, and inference.
        </p>
      </motion.div>
    </motion.div>
  );
}
