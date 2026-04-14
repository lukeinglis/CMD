import { useState, useCallback, useEffect, useRef } from 'react';
import { components, TOTAL_PAGES } from '../data/components';

const DEFAULT_INTERVAL = 20;

function getPageDuration(page: number, globalInterval: number): number {
  if (page >= 1 && page <= components.length) {
    const comp = components[page - 1];
    if (comp?.autoplaySeconds) return comp.autoplaySeconds;
  }
  return globalInterval;
}

export function useNavigation() {
  const getInitialPage = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#page-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n >= 0 && n < TOTAL_PAGES) return n;
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [intervalSec, setIntervalSec] = useState(DEFAULT_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(
    0 as unknown as ReturnType<typeof setTimeout>,
  );

  const goToPage = useCallback(
    (n: number) => {
      if (n < 0 || n >= TOTAL_PAGES || n === currentPage) return;
      setAutoplay(false);
      setDirection(n > currentPage ? 1 : -1);
      setCurrentPage(n);
      window.location.hash = `page-${n}`;
    },
    [currentPage],
  );

  const nextPage = useCallback(() => {
    setAutoplay(false);
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    setAutoplay(false);
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const toggleAutoplay = useCallback(() => setAutoplay((prev) => !prev), []);

  // Autoplay timer with per-page duration, loops back to 0
  useEffect(() => {
    if (!autoplay) {
      clearTimeout(timerRef.current);
      return;
    }
    const duration = getPageDuration(currentPage, intervalSec);
    timerRef.current = setTimeout(() => {
      setCurrentPage((prev) => {
        const next = prev < TOTAL_PAGES - 1 ? prev + 1 : 0;
        setDirection(next > prev ? 1 : -1);
        window.location.hash = `page-${next}`;
        return next;
      });
    }, duration * 1000);
    return () => clearTimeout(timerRef.current);
  }, [autoplay, intervalSec, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage]);

  // Current component (1-7) or null for intro/summary
  const currentComponent =
    currentPage >= 1 && currentPage <= components.length ? currentPage : null;

  return {
    currentPage,
    currentComponent,
    direction,
    goToPage,
    nextPage,
    prevPage,
    totalPages: TOTAL_PAGES,
    autoplay,
    toggleAutoplay,
    intervalSec,
    setIntervalSec,
  };
}
