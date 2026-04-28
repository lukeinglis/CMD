import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigation } from './hooks/useNavigation';
import { components } from './data/components';
import { Constellation } from './components/Constellation';
import { DetailPanel } from './components/DetailPanel';

const IDLE_TIMEOUT_MS = 20000;

function App() {
  const {
    selected,
    selectComponent,
    autoplay,
    toggleAutoplay,
    resumeAutoplay,
    intervalSec,
    setIntervalSec,
  } = useNavigation();

  const component = useMemo(
    () => (selected !== null ? components.find((c) => c.id === selected) ?? null : null),
    [selected],
  );

  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [textScale, setTextScale] = useState(() => {
    const saved = localStorage.getItem('cmd-text-scale');
    return saved ? parseFloat(saved) : 1;
  });
  const [progressKey, setProgressKey] = useState(0);
  const d = darkMode;

  useEffect(() => {
    localStorage.setItem('cmd-text-scale', String(textScale));
    document.documentElement.style.setProperty('--text-scale', String(textScale));
  }, [textScale]);

  // Reset CSS progress bar on each autoplay cycle
  useEffect(() => {
    if (autoplay) setProgressKey((k) => k + 1);
  }, [autoplay, selected]);

  // Idle timeout to resume autoplay
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => resumeAutoplay(), IDLE_TIMEOUT_MS);
  }, [resumeAutoplay]);

  useEffect(() => {
    if (autoplay) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }
    resetIdleTimer();
    const events = ['click', 'keydown', 'mousemove'];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [autoplay, resetIdleTimer]);

  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [showSettings]);

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        d ? 'bg-slate-950' : 'bg-white'
      }`}
      style={{ fontSize: `calc(1rem * var(--text-scale, 1))` }}
    >
      {/* CSS-driven progress bar */}
      <div className={`w-full h-[3px] flex-shrink-0 ${d ? 'bg-slate-900' : 'bg-slate-100'}`}>
        {autoplay && (
          <div
            key={progressKey}
            className="h-full bg-rh-red"
            style={{
              width: '100%',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              animation: `progressFill ${intervalSec}s linear forwards`,
            }}
          />
        )}
      </div>

      {/* Header */}
      <header
        className={`flex-shrink-0 border-b px-6 py-3 ${
          d ? 'border-slate-800/50' : 'border-slate-200'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-bold tracking-tight" style={{ fontSize: '1.15rem' }}>
              <span className="rh-red">Red Hat</span>
              <span className={d ? ' text-slate-100' : ' text-slate-900'}> OpenShift AI</span>
            </h1>
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                d ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'
              }`}
              style={{ fontSize: '9px', letterSpacing: '0.06em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rh-red" />
              CONNECTING DATA TO MODELS AND AGENTS
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '11px' }}>
            <button
              onClick={toggleAutoplay}
              aria-label="Toggle autoplay"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                autoplay
                  ? 'bg-rh-red/10 rh-red border border-[#EE0000]/20'
                  : d
                    ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 hover:border-slate-600'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
              style={{ fontSize: '11px' }}
            >
              {autoplay ? (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                  <rect x="1" y="1" width="3" height="8" rx="0.5" />
                  <rect x="6" y="1" width="3" height="8" rx="0.5" />
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              )}
              Auto
            </button>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
                d
                  ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 hover:border-slate-600'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
              aria-label={d ? 'Light mode' : 'Dark mode'}
            >
              {d ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
                d
                  ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 hover:border-slate-600'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
              aria-label="Settings"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main: constellation + panel */}
      <div className="flex-1 relative overflow-hidden constellation-bg">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-[1100px] max-h-[800px]">
            <Constellation
              dark={d}
              selected={selected}
              onSelect={(id) => selectComponent(id)}
            />
          </div>
        </div>

        <AnimatePresence>
          {component && (
            <div className="absolute right-0 top-0 bottom-0 flex" style={{ width: 'min(480px, 45%)' }}>
              <DetailPanel
                key={component.id}
                component={component}
                darkMode={d}
                onClose={() => selectComponent(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className={`flex-shrink-0 border-t px-6 py-2 ${
          d ? 'border-slate-800/50' : 'border-slate-200'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className={`text-[11px] ${d ? 'text-slate-500' : 'text-slate-400'}`}>
            {component ? (
              <span style={{ color: component.color }}>{component.icon} {component.title}</span>
            ) : (
              <span>7 components, 1 platform</span>
            )}
          </div>
          <div className={`hidden sm:flex items-center gap-4 text-[10px] ${d ? 'text-slate-600' : 'text-slate-300'}`}>
            <span>Click to explore</span>
            <span>&middot;</span>
            <span>Arrow keys to cycle</span>
            <span>&middot;</span>
            <span>Space for autoplay</span>
            <span>&middot;</span>
            <span>Esc to close</span>
          </div>
          <a
            href="https://red.ht/rhai-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-semibold bg-rh-red/10 rh-red border border-[#EE0000]/20 transition-all hover:bg-rh-red/20"
          >
            Book a demo &rarr;
          </a>
        </div>
      </footer>

      {/* Settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center settings-backdrop"
          onClick={() => setShowSettings(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
        >
          <div
            className={`w-full max-w-sm mx-4 p-6 rounded-2xl ${
              d ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200 shadow-xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-display text-lg font-bold ${d ? 'text-slate-100' : 'text-slate-900'}`}>
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer ${
                  d ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="mb-5">
              <label className={`block text-xs font-medium mb-2 ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                Autoplay interval: {intervalSec}s
              </label>
              <input type="range" min="5" max="60" step="5" value={intervalSec}
                onChange={(e) => setIntervalSec(Number(e.target.value))} className="w-full accent-[#EE0000]" />
              <div className={`flex justify-between text-[10px] mt-1 ${d ? 'text-slate-600' : 'text-slate-400'}`}>
                <span>5s</span><span>60s</span>
              </div>
            </div>
            <div className="mb-6">
              <label className={`block text-xs font-medium mb-2 ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                Text size: {Math.round(textScale * 100)}%
              </label>
              <input type="range" min="0.85" max="2" step="0.05" value={textScale}
                onChange={(e) => setTextScale(parseFloat(e.target.value))} className="w-full accent-[#EE0000]" />
              <div className={`flex justify-between text-[10px] mt-1 ${d ? 'text-slate-600' : 'text-slate-400'}`}>
                <span>85%</span><span>200%</span>
              </div>
            </div>
            <button
              onClick={() => { setIntervalSec(25); setTextScale(1); }}
              className={`w-full py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                d ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
