import '@src/styles/global.scss';
import '@src/styles/global.css';

import * as THREE from 'three';

import { memo, useMemo, useRef } from 'react';

import { Analytics } from '@vercel/analytics/next';
import Background from '@src/components/canvas/background/Index';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import Fluid from '@src/components/canvas/fluid/Fluid';
import Layout from '@src/components/dom/Layout';
import Lenis from 'lenis';
import Loader from '@src/components/dom/Loader';
import Navbar from '@src/components/dom/navbar/Index';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scrollbar from '@src/components/dom/Scrollbar';
// import Stats from '@src/components/stats/Index';
import { View } from '@react-three/drei';
import { gsap } from 'gsap';
import styles from '@src/pages/app.module.scss';
import useFoucFix from '@src/hooks/useFoucFix';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' });
  gsap.registerPlugin(ScrollTrigger);

  // Lenis is driven from the GSAP ticker (see below), so both share one rAF loop.
  gsap.ticker.lagSmoothing(0);

  window.scrollTo(0, 0);
  window.history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration);
}

const updateScrollTrigger = () => ScrollTrigger.update();

// Memoised and colour-free: if this re-rendered, <EffectComposer> would get new children and
// rebuild its EffectPass, recompiling the fluid shader (~100-200ms) on every route change.
// <Fluid> reads the colour from the store itself, so only it updates on colour changes.
const FluidLayer = memo(function FluidLayer({ mainRef }) {
  return (
    <Canvas
      id="fluidCanvas"
      flat
      gl={{
        antialias: false,
        stencil: false,
        depth: false,
        pixelRatio: 0.1,
      }}
      style={{ mixBlendMode: 'difference', background: 'black' }}
      linear
      className={styles.canvasContainer}
      eventSource={mainRef}
      resize={{ debounce: { resize: 200, scroll: 50 } }}
      dpr={[0.1, 0.5]}
    >
      <EffectComposer>
        <Fluid mainRef={mainRef} />
      </EffectComposer>
    </Canvas>
  );
});

function MyApp({ Component, pageProps, router }) {
  const [lenis, setLenis, isAbout] = useStore(useShallow((state) => [state.lenis, state.setLenis, state.isAbout]));

  const mainRef = useRef();
  const mainContainerRef = useRef();
  const layoutRef = useRef();

  useFoucFix();
  useScroll(updateScrollTrigger);

  useIsomorphicLayoutEffect(() => {
    // Phones/tablets scroll natively (momentum handled by the OS, see .main in app.module.scss).
    // Lenis still tracks that scroll (and provides scrollTo/start/stop), but its wheel/touch
    // listeners go on a detached element: a non-passive touchmove on <main> would make every
    // touch-scroll frame wait on the main thread, which is busy with WebGL.
    // Fine-pointer devices get smoothed wheel, and synced touch for touchscreen laptops.
    const isCoarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: !isCoarsePointer,
      syncTouch: !isCoarsePointer,
      wrapper: mainRef.current || undefined,
      content: mainContainerRef.current || undefined,
      eventsTarget: isCoarsePointer ? document.createElement('div') : mainRef.current || undefined,
    });

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    setLenis(lenis);
    lenis.stop();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
    }
  }, [lenis]);

  const domElements = useMemo(
    () => (
      <>
        <Loader />
        <div className={styles.background}>
          <Background />
        </div>
        <Scrollbar />
        <Navbar />
        <Analytics />
      </>
    ),
    [],
  );

  const canvasElements = useMemo(
    () => (
      <Canvas
        gl={{
          pixelRatio: 0.5,
          outputColorSpace: isAbout === false ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace,
        }}
        style={{ zIndex: 0 }}
        // Debounced: page transitions animate #layout's height, which would otherwise resize the
        // WebGL drawing buffer on every frame.
        resize={{ debounce: { resize: 200, scroll: 0 } }}
        className={styles.canvasContainer}
        dpr={[0.5, 1.5]}
      >
        <View.Port />
      </Canvas>
    ),
    [isAbout],
  );

  return (
    <>
      {/* <Stats /> */}
      <div className={styles.root}>
        {domElements}
        <div ref={layoutRef} id="layout" className={styles.layout}>
          {canvasElements}
          <FluidLayer mainRef={mainRef} />
          <main ref={mainRef} className={styles.main}>
            <div ref={mainContainerRef} id="mainContainer" className={styles.mainContainer}>
              <Layout layoutRef={layoutRef} mainRef={mainRef} router={router}>
                <Component {...pageProps} />
              </Layout>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default MyApp;
