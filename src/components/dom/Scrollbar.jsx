import { useCallback, useEffect, useRef } from 'react';

import gsap from 'gsap';
import styles from '@src/components/dom/styles/scrollbar.module.scss';
import useScroll from '@src/hooks/useScroll';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

// Track is 80svh, thumb 6svh (see scrollbar.module.scss): travel in thumb-heights.
const TRAVEL_PERCENT = ((80 - 6) / 6) * 100;

function Scrollbar() {
  const progressBar = useRef();
  const scrollbarRef = useRef();
  const moveTo = useRef(null);
  const visible = useRef(false);
  const fadeTimeout = useRef();
  const [isLoading, isMenuOpen, introOut] = useStore(useShallow((state) => [state.isLoading, state.isMenuOpen, state.introOut]));

  // One reusable transform tween instead of a new `top` tween (layout) on every scroll frame.
  useIsomorphicLayoutEffect(() => {
    if (!progressBar.current) return undefined;
    moveTo.current = gsap.quickTo(progressBar.current, 'yPercent', { duration: 0.3, ease: 'power3' });
    return () => {
      moveTo.current = null;
    };
  }, [isLoading, introOut]);

  const setVisible = useCallback((next) => {
    if (visible.current === next || !scrollbarRef.current) return;
    visible.current = next;
    gsap.to(scrollbarRef.current, { opacity: next ? 1 : 0, duration: next ? 0.3 : 0.5, overwrite: 'auto' });
  }, []);

  const onScroll = useCallback(
    ({ scroll, limit }) => {
      if (isLoading || isMenuOpen || !limit) return;
      setVisible(true);
      moveTo.current?.(Math.min(1, Math.max(0, scroll / limit)) * TRAVEL_PERCENT);

      clearTimeout(fadeTimeout.current);
      fadeTimeout.current = setTimeout(() => setVisible(false), 1500);
    },
    [isLoading, isMenuOpen, setVisible],
  );

  useScroll(onScroll);

  useEffect(() => () => clearTimeout(fadeTimeout.current), []);

  if (isLoading && introOut) {
    return null;
  }

  return (
    <div id="scrollbar" ref={scrollbarRef} className={styles.scrollbar} aria-hidden="true">
      <div ref={progressBar} className={styles.inner} />
    </div>
  );
}

export default Scrollbar;
