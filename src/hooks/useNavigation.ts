import { useState, useCallback, useEffect, useRef } from 'react';
import { components } from '../data/components';

const DEFAULT_INTERVAL = 25;

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, onSwipeDown?: () => void) {
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    touchRef.current = null;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx < 40 && absDy < 40) return;
    if (absDx > absDy) {
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    } else if (dy > 0 && onSwipeDown) {
      onSwipeDown();
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeDown]);

  useEffect(() => {
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);
}

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

  const goNext = useCallback(() => {
    setAutoplay(false);
    setSelected((prev) => {
      const currentIdx = prev === null ? -1 : components.findIndex((c) => c.id === prev);
      const nextIdx = (currentIdx + 1) % components.length;
      const next = components[nextIdx];
      window.location.hash = next.slug;
      return next.id;
    });
  }, []);

  const goPrev = useCallback(() => {
    setAutoplay(false);
    setSelected((prev) => {
      const currentIdx = prev === null ? 0 : components.findIndex((c) => c.id === prev);
      const nextIdx = (currentIdx - 1 + components.length) % components.length;
      const next = components[nextIdx];
      window.location.hash = next.slug;
      return next.id;
    });
  }, []);

  const closePanel = useCallback(() => selectComponent(null), [selectComponent]);

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
        goNext();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectComponent, toggleAutoplay, goNext, goPrev]);

  useSwipe(goNext, goPrev, closePanel);

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
