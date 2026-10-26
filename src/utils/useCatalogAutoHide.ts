import { useState, useEffect, useRef, useCallback } from 'react';
import { isViewportInCatalog, computeCatalogSidebarHidden } from './animationMath';

export interface CatalogAutoHideState {
  isScrolled: boolean;
  isInCatalog: boolean;
  isCatalogHidden: boolean;
  setIsHovered: (hovered: boolean) => void;
}

const SCROLL_STOP_DELAY_MS = 1100;
const SCROLL_DELTA_THRESHOLD_PX = 0.4;

export function useCatalogAutoHide(): CatalogAutoHideState {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInCatalog, setIsInCatalog] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingStopped, setIsScrollingStopped] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProgrammaticNav, setIsProgrammaticNav] = useState(false);

  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const stopTimerRef = useRef<number | null>(null);

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const triggerScrollUpReveal = useCallback(() => {
    setIsScrollingUp(true);
    setIsScrollingStopped(false);
    clearStopTimer();
    stopTimerRef.current = window.setTimeout(() => {
      setIsScrollingStopped(true);
      setIsScrollingUp(false);
      stopTimerRef.current = null;
    }, SCROLL_STOP_DELAY_MS);
  }, [clearStopTimer]);

  const triggerScrollDownHide = useCallback(() => {
    clearStopTimer();
    setIsScrollingUp(false);
    setIsScrollingStopped(true);
  }, [clearStopTimer]);

  const evaluateScroll = useCallback(() => {
    const currentY = window.scrollY;
    const scrolled = currentY > 40;
    setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

    const catalogEl =
      document.querySelector('.bemie-catalog-section') || document.querySelector('#page3');
    const rect = catalogEl ? catalogEl.getBoundingClientRect() : null;
    const inCatalog = isViewportInCatalog(rect, 140);
    setIsInCatalog((prev) => (prev !== inCatalog ? inCatalog : prev));

    const navFlag = Boolean(
      (window as unknown as { __bemieNavigating?: boolean }).__bemieNavigating
    );
    setIsProgrammaticNav((prev) => (prev !== navFlag ? navFlag : prev));

    const delta = currentY - lastScrollYRef.current;
    lastScrollYRef.current = currentY;

    if (navFlag) {
      triggerScrollDownHide();
      return;
    }

    if (delta < -SCROLL_DELTA_THRESHOLD_PX) {
      triggerScrollUpReveal();
    } else if (delta > SCROLL_DELTA_THRESHOLD_PX) {
      triggerScrollDownHide();
    }
  }, [triggerScrollUpReveal, triggerScrollDownHide]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    evaluateScroll();

    const handleWheel = (e: WheelEvent) => {
      const navFlag = Boolean(
        (window as unknown as { __bemieNavigating?: boolean }).__bemieNavigating
      );
      if (navFlag) {
        triggerScrollDownHide();
        return;
      }
      if (e.deltaY < -1) {
        triggerScrollUpReveal();
      } else if (e.deltaY > 1) {
        triggerScrollDownHide();
      }
    };

    window.addEventListener('scroll', evaluateScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', evaluateScroll, { passive: true });
    return () => {
      clearStopTimer();
      window.removeEventListener('scroll', evaluateScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', evaluateScroll);
    };
  }, [evaluateScroll, clearStopTimer, triggerScrollUpReveal, triggerScrollDownHide]);

  const isCatalogHidden = computeCatalogSidebarHidden({
    isInCatalog,
    isScrollingUp,
    isScrollingStopped,
    isHovered,
    isProgrammaticNav,
    hoverOnly: true,
  });

  return {
    isScrolled,
    isInCatalog,
    isCatalogHidden,
    setIsHovered,
  };
}
