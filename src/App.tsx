import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from './hooks/useNavigation';
import { components } from './data/components';
import { Timeline } from './components/Timeline';
import { Constellation } from './components/Constellation';
import { ExplanationPanel } from './components/ExplanationPanel';
import { SummaryPage } from './components/SummaryPage';

const BASE = import.meta.env.BASE_URL;

function App() {
  const {
    currentPage,
    currentComponent,
    direction,
    goToPage,
    nextPage,
    prevPage,
    totalPages,
    autoplay,
    toggleAutoplay,
    intervalSec,
    setIntervalSec,
  } = useNavigation();

  const component = useMemo(
    () =>
      currentComponent
        ? components.find((c) => c.id === currentComponent) ?? null
        : null,
    [currentComponent],
  );
  const [darkMode, setDarkMode] = useState(true);
  const d = darkMode;

  const isIntro = currentPage === 0;
  const isSummary = currentPage === totalPages - 1;
  const isComponent = !!component;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        d ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      {/* Header */}
      <header
        className={`border-b px-6 py-4 ${
          d ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className={`text-xl font-bold ${
                d ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Connecting Data to Models and Agents
              <span
                className={`text-sm font-normal ml-3 ${
                  d ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Red Hat AI
              </span>
            </h1>
          </div>
          <div
            className={`flex items-center gap-4 text-xs ${
              d ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoplay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  autoplay
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : d
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                      : 'bg-slate-100 text-slate-500 border border-slate-300 hover:border-slate-400'
                }`}
              >
                {autoplay ? (
                  <>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="currentColor"
                    >
                      <rect x="1" y="1" width="3" height="8" rx="0.5" />
                      <rect x="6" y="1" width="3" height="8" rx="0.5" />
                    </svg>
                    Autoplay
                  </>
                ) : (
                  <>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="currentColor"
                    >
                      <polygon points="2,1 9,5 2,9" />
                    </svg>
                    Autoplay
                  </>
                )}
              </button>
              {autoplay && (
                <select
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className={`text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none ${
                    d
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 focus:border-emerald-500/50'
                      : 'bg-slate-100 text-slate-600 border border-slate-300 focus:border-emerald-500/50'
                  }`}
                >
                  {[10, 15, 20, 30, 45, 60].map((s) => (
                    <option key={s} value={s}>
                      {s}s
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                d
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                  : 'bg-slate-100 text-slate-600 border border-slate-300 hover:border-slate-400'
              }`}
            >
              {d ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              {d ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <div
        className={`border-b pt-2 pb-6 ${
          d ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <Timeline currentPage={currentPage} goToPage={goToPage} darkMode={d} />
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-3">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Intro page */}
            {isIntro && (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="text-center">
                  <h2
                    className={`text-2xl font-bold ${
                      d ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    Connecting Data to Models and Agents
                  </h2>
                  <p
                    className={`text-sm mt-1 ${
                      d ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Seven components. One cohesive pillar. Click any node to
                    explore.
                  </p>
                </div>
                <div
                  className={`w-full rounded-xl border overflow-hidden ${
                    d ? 'glass-card' : 'glass-card-light'
                  }`}
                >
                  <Constellation dark={d} goToPage={goToPage} />
                </div>
              </div>
            )}

            {/* Component pages */}
            {isComponent && component && (
              <>
                {/* Component header */}
                <div className="mb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${component.color}20`,
                        color: component.color,
                      }}
                    >
                      {component.icon} {component.title}
                    </span>
                    <span
                      className={`text-sm ${
                        d ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {component.id} of {components.length}
                    </span>
                  </div>
                  <h2
                    className={`text-2xl font-bold ${
                      d ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    {component.title}
                  </h2>
                  <p className="text-sm" style={{ color: component.color }}>
                    {component.subtitle}
                  </p>
                </div>

                {/* Content layout */}
                {component.layout === 'stacked' ? (
                  <div className="space-y-3">
                    {component.videoSrc ? (
                      <motion.div
                        className={`overflow-hidden rounded-xl ${
                          d ? 'glass-card' : 'glass-card-light'
                        }`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <video
                          key={component.videoSrc}
                          src={`${BASE}${component.videoSrc}`}
                          className="w-full aspect-video"
                          controls
                          preload="metadata"
                          title={`${component.title} demo`}
                        />
                      </motion.div>
                    ) : component.image ? (
                      <motion.div
                        className={`overflow-hidden rounded-xl ${
                          d ? 'glass-card' : 'glass-card-light'
                        }`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <img
                          src={`${BASE}${component.image}`}
                          alt={component.title}
                          className="w-full object-contain"
                        />
                      </motion.div>
                    ) : null}
                    <ExplanationPanel
                      component={component}
                      darkMode={d}
                      columns={2}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {/* Media area */}
                    <div className="lg:col-span-5">
                      {component.videoSrc ? (
                        <motion.div
                          className={`overflow-hidden rounded-xl ${
                            d ? 'glass-card' : 'glass-card-light'
                          }`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <video
                            key={component.videoSrc}
                            src={`${BASE}${component.videoSrc}`}
                            className="w-full aspect-video"
                            controls
                            preload="metadata"
                            title={`${component.title} demo`}
                          />
                        </motion.div>
                      ) : component.image ? (
                        <motion.div
                          className={`overflow-hidden rounded-xl ${
                            d ? 'glass-card' : 'glass-card-light'
                          }`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <img
                            src={`${BASE}${component.image}`}
                            alt={component.title}
                            className="w-full object-contain"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className={`flex items-center justify-center h-80 rounded-xl ${
                            d ? 'glass-card' : 'glass-card-light'
                          }`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="text-center">
                            <div className="text-5xl mb-3">{component.icon}</div>
                            <div
                              className="text-lg font-bold mb-1"
                              style={{ color: component.color }}
                            >
                              {component.title}
                            </div>
                            <div
                              className={`text-sm ${
                                d ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              {component.subtitle}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {component.image2 && (
                        <motion.div
                          className={`overflow-hidden rounded-xl mt-4 ${
                            d ? 'glass-card' : 'glass-card-light'
                          }`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <img
                            src={`${BASE}${component.image2}`}
                            alt={`${component.title} (continued)`}
                            className="w-full object-contain"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Description panel */}
                    <div className="lg:col-span-2">
                      <ExplanationPanel component={component} darkMode={d} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Summary page */}
            {isSummary && <SummaryPage darkMode={d} goToPage={goToPage} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
      <footer
        className={`border-t px-6 py-4 ${
          d ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 0
                ? d
                  ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                : d
                  ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 cursor-pointer'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            &larr; Previous
          </button>
          <div className={`text-xs ${d ? 'text-slate-500' : 'text-slate-400'}`}>
            {isIntro
              ? 'Overview'
              : isSummary
                ? 'Summary'
                : component
                  ? component.title
                  : ''}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages - 1
                ? d
                  ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                : component
                  ? `text-white cursor-pointer hover:brightness-110`
                  : d
                    ? 'text-white bg-cyan-600 hover:bg-cyan-500 cursor-pointer'
                    : 'text-white bg-cyan-600 hover:bg-cyan-500 cursor-pointer'
            }`}
            style={
              component
                ? { backgroundColor: component.color }
                : undefined
            }
          >
            Next &rarr;
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
