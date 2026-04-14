import { motion } from 'framer-motion';
import type { ComponentDefinition } from '../types';
import { fadeInUp, staggerContainer } from '../animations/variants';

interface Props {
  component: ComponentDefinition;
  darkMode: boolean;
  columns?: number;
}

export function ExplanationPanel({ component, darkMode: d, columns }: Props) {
  return (
    <motion.div
      className={`p-5 rounded-xl ${
        d
          ? 'glass-card'
          : 'glass-card-light'
      }`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      key={component.id}
    >
      {component.description && (
        <motion.p
          className={`text-sm leading-relaxed mb-4 ${
            d ? 'text-slate-300' : 'text-slate-600'
          }`}
          variants={fadeInUp}
        >
          {component.description}
        </motion.p>
      )}
      <motion.ul
        className={`${columns === 2 ? 'columns-2 gap-6' : 'space-y-2.5'}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {component.bullets.map((bullet, i) => (
          <motion.li
            key={i}
            className={`flex items-start gap-2.5 ${
              columns === 2 ? 'mb-2 break-inside-avoid' : ''
            }`}
            variants={fadeInUp}
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: component.color }}
            />
            <span
              className={`text-sm ${d ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {bullet}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Relationships */}
      {component.relationships.length > 0 && (
        <motion.div className="mt-5 pt-4 border-t border-slate-700/50" variants={fadeInUp}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            d ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Connects with
          </p>
          <ul className="space-y-1.5">
            {component.relationships.map((rel, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-1 text-xs ${d ? 'text-slate-600' : 'text-slate-400'}`}>&#x2194;</span>
                <span className={`text-xs ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                  {rel}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Demo button */}
      {component.demoStatus !== 'coming-soon' && component.demoUrl && (
        <motion.div className="mt-5" variants={fadeInUp}>
          <a
            href={component.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ backgroundColor: component.color }}
          >
            {component.demoStatus === 'live' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><path d="M21 3l-9 9"/><path d="M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            )}
            {component.demoLabel}
          </a>
        </motion.div>
      )}
      {component.demoStatus === 'coming-soon' && (
        <motion.div className="mt-5" variants={fadeInUp}>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            d ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-300'
          }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Demo Coming Soon
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
