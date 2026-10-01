import { useCallback, useEffect, useRef, useState } from 'react';

import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

// Regions mark their tone with data-header-theme="dark" | "light" (nearest one wins), so the
// fixed logo stays readable over dark windows, project cards and the footer.
const toneUnder = (el) => {
  if (!el) return 'light';
  const r = el.getBoundingClientRect();
  const x = r.left + r.width * 0.3;
  const y = r.top + r.height * 0.5;
  const under = document.elementsFromPoint(x, y).find((node) => !node.closest('#siteHeader'));
  return under?.closest('[data-header-theme]')?.getAttribute('data-header-theme') || 'light';
};

function Navbar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [lenis, isLoading] = useStore(useShallow((state) => [state.lenis, state.isLoading]));
  const logoRef = useRef(null);
  const frame = useRef(0);
  const [onDark, setOnDark] = useState(false);

  const updateTone = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setOnDark(toneUnder(logoRef.current) === 'dark'));
  }, []);

  useScroll(updateTone);

  useEffect(() => {
    updateTone();
    return () => cancelAnimationFrame(frame.current);
  }, [updateTone, isLoading, router.asPath]);

  const scrollToPosition = useCallback(
    (position, duration = 1.5) => {
      if (lenis) {
        lenis.scrollTo(position, {
          duration,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis.start();
          },
        });
      }
    },
    [lenis],
  );

  const goToTop = useCallback(() => {
    if (router.pathname === '/') {
      scrollToPosition(0);
    }
  }, [router.pathname, scrollToPosition]);

  return (
    <>
      <MenuLinks />

      <header id="siteHeader" className={clsx(styles.root, onDark && styles.onDark)} role="banner">
        <div className={styles.innerHeader}>
          <Link ref={logoRef} className={styles.logo} onClick={goToTop} aria-label="Go home" scroll={false} href="/">
            <h4 className={clsx('bold', 'h4')}>JEFFREY</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile && <ButtonLink href="mailto:jefyjery10@gmail.com" label="GET IN TOUCH" />}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
