import { DEFAULT_FLUID_COLOR, useStore } from '@src/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/components/workIndex/styles/workIndex.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import warmImages from '@src/utils/warmImages';

const pad = (n) => String(n).padStart(2, '0');

// Home "Index": every project on one line. On desktop a preview card follows the cursor,
// reels to the hovered project and tilts with pointer speed, while the fluid layer
// shifts to that project's colour.
function WorkIndex() {
  const isMobile = useIsMobile();
  const [setFluidColor] = useStore(useShallow((state) => [state.setFluidColor]));
  const [active, setActive] = useState(-1);

  const listRef = useRef();
  const previewRef = useRef();
  const reelRef = useRef();
  const pointer = useRef({ x: 0, y: 0, lastX: 0 });
  const movers = useRef(null);
  const activeRef = useRef(-1);

  const countries = useMemo(() => new Set(projects.map((project) => project.country)).size, []);
  const sectors = useMemo(() => new Set(projects.map((project) => project.sector)).size, []);

  const placePreview = useCallback(() => {
    if (!movers.current || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    movers.current.x(pointer.current.x - rect.left);
    movers.current.y(pointer.current.y - rect.top);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMobile) return undefined;
    const preview = previewRef.current;
    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
    movers.current = {
      x: gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' }),
      y: gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' }),
      rotate: gsap.quickTo(preview, 'rotation', { duration: 0.9, ease: 'power3' }),
    };

    const list = listRef.current;
    const onMove = (event) => {
      const dx = event.clientX - pointer.current.lastX;
      pointer.current = { x: event.clientX, y: event.clientY, lastX: event.clientX };
      movers.current.rotate(gsap.utils.clamp(-7, 7, dx * 0.35));
      placePreview();
    };
    const onStop = () => movers.current?.rotate(0);

    list.addEventListener('pointermove', onMove, { passive: true });
    list.addEventListener('pointerleave', onStop);
    const settle = setInterval(onStop, 220);

    return () => {
      clearInterval(settle);
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', onStop);
      movers.current = null;
    };
  }, [isMobile, placePreview]);

  // Keep the card glued to the cursor while the list scrolls underneath it.
  useScroll(placePreview);

  // Rows can be entered without a pointermove (the list scrolls under a still cursor, or
  // keyboard focus), so take the position from the event and jump there if the card was hidden.
  const activate = useCallback(
    (index, x, y) => {
      pointer.current = { ...pointer.current, x, y };
      if (!isMobile && activeRef.current < 0 && previewRef.current && listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        gsap.set(previewRef.current, { x: x - rect.left, y: y - rect.top });
      }
      placePreview();
      activeRef.current = index;
      setActive(index);
    },
    [isMobile, placePreview],
  );

  const deactivate = useCallback(() => {
    activeRef.current = -1;
    setActive(-1);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const isOn = active >= 0;
    gsap.to(previewRef.current, { autoAlpha: isOn ? 1 : 0, scale: isOn ? 1 : 0.6, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    if (isOn) gsap.to(reelRef.current, { yPercent: (-100 / projects.length) * active, duration: 0.9, ease: 'expo.out', overwrite: 'auto' });
    setFluidColor(isOn ? projects[active].fluidColor : DEFAULT_FLUID_COLOR);
  }, [active, isMobile, setFluidColor]);

  useEffect(() => () => setFluidColor(DEFAULT_FLUID_COLOR), [setFluidColor]);

  // Decode the preview reel before the first hover reveals it (otherwise all 8 covers decode
  // and rasterise in one frame on the first hover).
  useEffect(() => {
    if (isMobile || !listRef.current || !previewRef.current) return undefined;
    let cancel;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cancel = warmImages(previewRef.current.querySelectorAll('img'));
      },
      { rootMargin: '150% 0px' },
    );
    observer.observe(listRef.current);
    return () => {
      observer.disconnect();
      cancel?.();
    };
  }, [isMobile]);

  return (
    <section className={clsx(styles.root, 'layout-block-inner')}>
      <div className={clsx(styles.header, styles.grid)}>
        <h1 className={clsx('h1', styles.title)}>
          <AppearByWords>Index</AppearByWords>
          <sup className={clsx('h6', styles.count)}>({pad(projects.length)})</sup>
        </h1>
        <p className={clsx('p-l', styles.intro)}>
          {pad(projects.length)} businesses, {countries} countries, {sectors} industries. Every site started with the same question: what story does this business need to tell?{' '}
          {isMobile ? 'Tap a name to read how it was built.' : 'Hover a name to preview it, click to read how it was built.'}
        </p>
      </div>

      {!isMobile && (
        <div className={clsx(styles.grid, styles.legend)} aria-hidden="true">
          <span className="p-xs">No.</span>
          <span className="p-xs">Project</span>
          <span className="p-xs">Sector</span>
          <span className="p-xs">Location</span>
          <span className="p-xs">Year</span>
        </div>
      )}

      <div ref={listRef} className={clsx(styles.list, active >= 0 && styles.listActive)} onMouseLeave={deactivate} onBlur={deactivate}>
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href={project.link}
            scroll={false}
            aria-label={`Read the ${project.title} story`}
            className={clsx(styles.row, styles.grid, active === index && styles.rowActive)}
            style={{ '--rowColor': project.menuColor }}
            onMouseEnter={(event) => activate(index, event.clientX, event.clientY)}
            onFocus={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              activate(index, rect.left + rect.width * 0.62, rect.top + rect.height / 2);
            }}
          >
            {isMobile ? (
              <>
                <div className={styles.thumb}>
                  <Image src={project.img} fill sizes="30vw" alt="" />
                </div>
                <div className={styles.mobileText}>
                  <span className={clsx('p-x', styles.number)}>{pad(index + 1)}</span>
                  <span className={clsx('h4', styles.name)}>{project.title}</span>
                  <span className={clsx('p-x', styles.muted)}>
                    {project.sector} · {project.location}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className={clsx('p', styles.number)}>{pad(index + 1)}</span>
                <span className={clsx('h3', styles.name)}>
                  <i className={styles.dot} aria-hidden="true" />
                  {project.title}
                </span>
                <span className={clsx('p-l', styles.muted, styles.sector)}>{project.sector}</span>
                <span className={clsx('p-l', styles.muted, styles.location)}>{project.location}</span>
                <span className={clsx('p-l', styles.muted, styles.year)}>{project.date}</span>
              </>
            )}
          </Link>
        ))}

        {!isMobile && (
          <div ref={previewRef} className={styles.preview} aria-hidden="true">
            <div ref={reelRef} className={styles.reel} style={{ height: `${projects.length * 100}%` }}>
              {projects.map((project) => (
                <div key={project.id} className={styles.frame} style={{ height: `${100 / projects.length}%` }}>
                  <Image src={project.img} fill sizes="26vw" alt="" />
                  <span className={clsx('p-xs', styles.domain)}>{project.domain}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkIndex;
