import { useState, useCallback, useEffect, useRef } from 'react';
import { components } from '../data/components';

const DEFAULT_INTERVAL = 25;

export function useNavigation() {
  const getInitialSelection = (): number | null => {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    const comp = components.find((c) => c.slug === hash);
    return comp ? comp.id : null;
  };

  const [selected, setSelected] = useState<number | null>(getInitialSelection);
  const [autoplay, setAutoplay] = useState(true);
  const [intervalSec, setIntervalSec] = useState(DEFAULT_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectComponent = useCallback((id: number | null) => {
    setAutoplay(false);
    setSelected(id);
    if (id !== null) {
      const comp = components.find((c) => c.id === id);
      window.location.hash = comp ? comp.slug : '';
    } else {
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const toggleAutoplay = useCallback(() => setAutoplay((prev) => !prev), []);
  const resumeAutoplay = useCallback(() => setAutoplay(true), []);

  useEffect(() => {
    if (!autoplay) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      setSelected((prev) => {
        const currentIdx = prev === null ? -1 : components.findIndex((c) => c.id === prev);
        const nextIdx = (currentIdx + 1) % components.length;
        const next = components[nextIdx];
        window.location.hash = next.slug;
        return next.id;
      });
    }, intervalSec * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoplay, intervalSec, selected]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        selectComponent(null);
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoplay();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setAutoplay(false);
        setSelected((prev) => {
          const currentIdx = prev === null ? -1 : components.findIndex((c) => c.id === prev);
          const nextIdx = (currentIdx + 1) % components.length;
          const next = components[nextIdx];
          window.location.hash = next.slug;
          return next.id;
        });
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setAutoplay(false);
        setSelected((prev) => {
          const currentIdx = prev === null ? 0 : components.findIndex((c) => c.id === prev);
          const nextIdx = (currentIdx - 1 + components.length) % components.length;
          const next = components[nextIdx];
          window.location.hash = next.slug;
          return next.id;
        });
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectComponent, toggleAutoplay]);

  return {
    selected,
    selectComponent,
    autoplay,
    toggleAutoplay,
    resumeAutoplay,
    intervalSec,
    setIntervalSec,
  };
}
