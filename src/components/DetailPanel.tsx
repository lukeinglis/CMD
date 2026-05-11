import { motion } from 'framer-motion';
import type { ComponentDefinition } from '../types';

interface Props {
  component: ComponentDefinition;
  darkMode: boolean;
  onClose: () => void;
}

export function DetailPanel({ component, darkMode: d, onClose }: Props) {
  return (
    <motion.div
      className={`h-full flex w-full ${
        d ? 'bg-slate-900 md:bg-slate-900/95 md:backdrop-blur-xl' : 'bg-white md:bg-white/95 md:backdrop-blur-xl'
      }`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      <div
        className="w-1.5 flex-shrink-0"
        style={{ backgroundColor: component.color }}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Top gradient stripe */}
        <div
          className="h-16 w-full"
          style={{ background: `linear-gradient(to bottom, ${component.color}10, transparent)` }}
        />

        <div className="px-6 -mt-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onClose}
              className={`md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                d ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Back to overview"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <button
              onClick={onClose}
              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                d ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Close panel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={component.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={component.iconPath} />
            </svg>
            {component.isAnchor && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rh-red/10 rh-red">
                <span className="w-1 h-1 rounded-full bg-rh-red" />
                Anchor
              </span>
            )}
          </div>
          <h2
            className={`font-display text-2xl font-bold tracking-tight mb-1 ${
              d ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {component.title}
          </h2>
          <p className="text-sm font-medium" style={{ color: component.color }}>
            {component.subtitle}
          </p>
        </div>

        {/* Stats */}
        {component.stats && component.stats.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-5 pb-5 border-b ${
            d ? 'border-slate-700/40' : 'border-slate-200'
          }`}>
            {component.stats.map((stat, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg ${
                  d ? 'bg-slate-800/60 border border-slate-700/40' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div className={`text-[10px] uppercase tracking-wider mb-0.5 ${
                  d ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {stat.label}
                </div>
                <div className="text-xs font-semibold" style={{ color: component.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-5 ${
          d ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {component.description}
        </p>

        {/* Capabilities */}
        <ul className="space-y-2.5 mb-5">
          {component.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: component.color }}
              />
              <span className={`text-sm leading-relaxed ${d ? 'text-slate-300' : 'text-slate-600'}`}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        {/* Relationships */}
        {component.relationships.length > 0 && (
          <div className={`pt-4 border-t mb-5 ${
            d ? 'border-slate-700/40' : 'border-slate-200'
          }`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${
              d ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Works with
            </p>
            <ul className="space-y-2">
              {component.relationships.map((rel, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${component.color}60` }}
                  />
                  <span className={`text-xs leading-relaxed ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                    {rel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Video */}
        {component.videoSrc && (
          <div className={`rounded-xl overflow-hidden mb-5 border ${
            d ? 'border-slate-700/40' : 'border-slate-200'
          }`}>
            <video
              key={component.videoSrc}
              src={`${import.meta.env.BASE_URL}${component.videoSrc}`}
              className="w-full aspect-video"
              controls
              preload="metadata"
              title={`${component.title} demo`}
            />
          </div>
        )}

        {/* Demo CTA */}
        {component.demoStatus !== 'coming-soon' && component.demoUrl && (
          <a
            href={component.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 hover:shadow-lg"
            style={{ backgroundColor: component.color }}
          >
            {component.demoStatus === 'live' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><path d="M21 3l-9 9"/><path d="M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            )}
            {component.demoLabel}
          </a>
        )}
        {component.demoStatus === 'coming-soon' && (
          <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
            d ? 'bg-slate-800/60 text-slate-500 border border-slate-700/40' : 'bg-slate-50 text-slate-400 border border-slate-200'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: component.color }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: `${component.color}80` }} />
            </span>
            Preview available on request
          </span>
        )}

        {/* Why Red Hat */}
        <div className={`mt-8 pt-4 border-t ${
          d ? 'border-slate-800/60' : 'border-slate-100'
        }`}>
          <p className={`text-[9px] font-semibold uppercase tracking-wider mb-2.5 ${
            d ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Why Red Hat OpenShift AI
          </p>
          <div className="space-y-1.5 mb-4">
            {[
              'Open source foundations, no vendor lock-in',
              '24x7 enterprise support + Red Hat certified supply chain',
              'Deploy on-prem, hybrid, multi-cloud, or air-gapped',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-rh-red/50" />
                <span className={`text-[11px] ${d ? 'text-slate-600' : 'text-slate-400'}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
          <a
            href="https://red.ht/rhai-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rh-red transition-all hover:brightness-110 cursor-pointer"
          >
            Schedule a conversation
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><path d="M21 3l-9 9"/><path d="M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>
          </a>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
