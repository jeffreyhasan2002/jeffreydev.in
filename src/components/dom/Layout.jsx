import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Transition as ReactTransition, SwitchTransition } from 'react-transition-group';

import Footer from '@src/components/dom/Footer';
import PreFooter from '@src/components/dom/PreFooter';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import styles from '@src/components/dom/styles/layout.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

// Page transition timing (seconds). Exit: the page card shrinks, then slides out as the loader
// slides in. Enter: the loader slides out as the new page slides in, then it grows to full size.
const EXIT = { shrink: 0.4, slideAt: 0.35, slide: 0.45 };
const ENTER = { slide: 0.45, growAt: 0.35, grow: 0.35, headerAt: 0.45 };
const EXIT_TOTAL = EXIT.slideAt + EXIT.slide;
const ENTER_TOTAL = ENTER.growAt + ENTER.grow;
// Brief hold behind the loader so the new page mounts and paints before it slides in.
const HOLD_MS = 150;

// The incoming page sits off-screen (translateX 100%) during the hold, so lazy images near the
// top would not start loading until it slides in; promote them so they load in parallel.
const primeImages = (root) => {
  if (!root) return;
  const viewport = window.innerHeight * 1.5;
  root.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.getBoundingClientRect().top < viewport) img.loading = 'eager';
  });
};

const historyKey = () => window.history.state?.key || window.location.pathname;

function Layout({ children, layoutRef, mainRef, router }) {
  const [lenis, introOut, isLoading, setIsLoading, isMenuOpen, setIsMenuOpen, setIsAbout] = useStore(
    useShallow((state) => [state.lenis, state.introOut, state.isLoading, state.setIsLoading, state.isMenuOpen, state.setIsMenuOpen, state.setIsAbout]),
  );

  const enterTimelineRef = useRef();
  const exitTimelineRef = useRef();

  // Back/forward restores the scroll position the page was left at; normal links open at the top.
  const scrollMemory = useRef(new Map());
  const pageKeyRef = useRef(null);
  const isPopRef = useRef(false);
  const targetScrollRef = useRef(0);

  const [isEntering, setIsEntering] = useState(false);

  const menuTime = useMemo(() => (isMenuOpen ? 0.8 : 0), [isMenuOpen]);

  useEffect(() => {
    pageKeyRef.current = historyKey();
    const onPopState = () => {
      isPopRef.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Jump (not animate) to the target. A smooth scroll from deep in a long page gets cut short
  // when the old page unmounts, which used to leave the next page opened half-way down.
  const jumpTo = useCallback(
    (y) => {
      lenis?.resize();
      lenis?.scrollTo(y, { immediate: true, force: true });
      if (mainRef.current) mainRef.current.scrollTop = y;
    },
    [lenis, mainRef],
  );

  // Once a page is live, re-measure: Lenis picks up the new content height and every
  // ScrollTrigger (stacks, footer, story chapters) is computed for the new page.
  useEffect(() => {
    if (isLoading || !lenis) return undefined;
    const id = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [isLoading, lenis]);

  const handleEnter = useCallback(
    () => {
      if (introOut) {
        if (exitTimelineRef.current) exitTimelineRef.current.pause();

        const key = historyKey();
        targetScrollRef.current = isPopRef.current && scrollMemory.current.has(key) ? scrollMemory.current.get(key) : 0;
        pageKeyRef.current = key;
        isPopRef.current = false;
        jumpTo(targetScrollRef.current);

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            setIsAbout(router.asPath === '/about');
            jumpTo(targetScrollRef.current);
            setIsLoading(false);
            lenis.start();
          },
        });

        enterTimelineRef.current = tl;
        setIsEntering(true);

        // Transform/opacity only while things move (no layout or repaint per frame).
        tl.call(
          () => {
            setIsAbout(router.asPath === '/about');
            setIsEntering(false);
          },
          null,
          0,
        )
          .set(layoutRef.current, { opacity: 1 }, 0)
          .to('#loader', { x: '-100%', ease: 'power2.inOut', duration: ENTER.slide }, 0)
          .to(mainRef.current, { x: '0px', ease: 'power2.inOut', duration: ENTER.slide }, 0)
          .to(mainRef.current, { scale: 1, ease: 'power2.inOut', duration: ENTER.grow }, ENTER.growAt)
          .to('#siteHeader', { autoAlpha: 1, ease: 'power2.inOut', duration: 0.3 }, ENTER.headerAt)
          // Frame is an outline, not a border: a border shrinks main's content box and relays out the whole page.
          .set(mainRef.current, { borderRadius: 0, outline: 'none', pointerEvents: 'auto' }, ENTER_TOTAL);

        primeImages(mainRef.current);
        setTimeout(() => {
          if (enterTimelineRef.current === tl) tl.play();
        }, HOLD_MS);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, jumpTo],
  );

  const handleExit = useCallback(
    () => {
      if (introOut) {
        if (enterTimelineRef.current) {
          enterTimelineRef.current.pause();
          enterTimelineRef.current = null;
        }

        if (pageKeyRef.current && lenis) scrollMemory.current.set(pageKeyRef.current, lenis.scroll);
        lenis.stop();
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
        if (isEntering === false) {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsLoading(true);
              jumpTo(0);
            },
          });

          exitTimelineRef.current = tl;

          if (document?.getElementById('scrollbar')) {
            tl.to(document.getElementById('scrollbar'), { autoAlpha: 0, ease: 'power2.inOut', duration: 0.3 }, menuTime);
          }

          tl.to(
            '#siteHeader',
            {
              autoAlpha: 0,
              ease: 'power2.inOut',
              duration: 0.3,
              onComplete: () => {
                gsap.set('#loader', {
                  scale: 0.9,
                  x: '100%',
                  borderRadius: '1.3888888889vw',
                });
                gsap.set('#siteHeader', {
                  x: 0,
                  y: 0,
                  left: 0,
                  top: 0,
                  scale: 1,
                  duration: 0,
                });
              },
              overwrite: true,
            },
            menuTime,
          )
            .set(mainRef.current, { outline: '2px solid #f0f4f1', outlineOffset: '-2px', borderRadius: '1.3888888889vw' }, menuTime)
            .to(mainRef.current, { scale: 0.9, opacity: 1, ease: 'power2.inOut', duration: EXIT.shrink }, menuTime)
            .to(mainRef.current, { x: '-100%', ease: 'power2.inOut', duration: EXIT.slide }, EXIT.slideAt + menuTime)
            .to('#loader', { x: '0px', ease: 'power2.inOut', duration: EXIT.slide }, EXIT.slideAt + menuTime)
            .set(mainRef.current, { x: '100%' });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, menuTime, isEntering, jumpTo],
  );

  return (
    <>
      <SwitchTransition>
        <ReactTransition
          key={router.asPath}
          // react-transition-group needs a real DOM node: with React 19 there is no findDOMNode, and
          // with an empty ref it silently skips the timeouts (pages swapped instantly, no animation,
          // scroll locked until the invisible enter finished). The timelines animate <main> anyway.
          nodeRef={mainRef}
          in={false}
          unmountOnExit
          timeout={{
            enter: introOut ? HOLD_MS + Math.round(ENTER_TOTAL * 1000) + 200 : 0,
            exit: introOut ? Math.round((EXIT_TOTAL + menuTime) * 1000) + 30 : 0,
          }}
          onEnter={handleEnter}
          onExit={handleExit}
        >
          {children}
        </ReactTransition>
      </SwitchTransition>

      <PreFooter />
      <footer data-header-theme="dark" className={styles.footer}>
        <Footer />
      </footer>
    </>
  );
}

export default Layout;
