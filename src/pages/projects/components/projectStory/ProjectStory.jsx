import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/projects/components/projectStory/styles/projectStory.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { memo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import useWindowSize from '@src/hooks/useWindowSize';
import warmImages from '@src/utils/warmImages';

const pad = (n) => String(n).padStart(2, '0');

function BrowserFrame({ src, domain, alt, preload }) {
  return (
    <figure data-reveal data-header-theme="light" className={styles.browser}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={clsx('p-xs', styles.url)}>{domain}</span>
      </div>
      <div className={styles.shot}>
        <Image data-shot src={src} fill preload={preload} sizes="(max-width: 812px) 92vw, 58vw" alt={alt} />
      </div>
    </figure>
  );
}

function ProjectStory({ project, onChapterChange }) {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));
  const rootRef = useRef();

  const chapterCount = project.story.length;

  useIsomorphicLayoutEffect(() => {
    if (isLoading) return undefined;
    const scroller = document.querySelector('main');

    const ctx = gsap.context(() => {
      // Frames rise and settle as they scroll in (transform-only, so no per-frame repaint).
      gsap.utils.toArray('[data-reveal]').forEach((frame) => {
        const shot = frame.querySelector('img');
        gsap
          .timeline({
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'top 40%',
              scrub: 0.6,
              scroller,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(frame, { y: 80, scale: 0.94 }, { y: 0, scale: 1, ease: 'power2.out' }, 0)
          .fromTo(shot, { scale: 1.1 }, { scale: 1, ease: 'power2.out' }, 0);
      });

      // Text blocks rise in.
      gsap.utils.toArray('[data-rise]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            duration: 1,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse', scroller },
          },
        );
      });

      // Phones drift at different speeds.
      gsap.utils.toArray('[data-phone]').forEach((phone, i) => {
        const distance = [70, -50, 30][i % 3];
        gsap.fromTo(
          phone,
          { y: distance },
          {
            y: -distance,
            ease: 'none',
            scrollTrigger: { trigger: phone.parentElement, start: 'top bottom', end: 'bottom top', scrub: true, scroller },
          },
        );
      });

      // Report the chapter crossing the middle of the viewport.
      gsap.utils.toArray('[data-chapter]').forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 55%',
          end: 'bottom 55%',
          scroller,
          onToggle: (self) => {
            if (self.isActive) onChapterChange?.(i);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, isMobile, windowSize.width, project.id]);

  // Once the page is live, quietly load + decode the rest of the screenshots so scrolling
  // never waits on a large image decode.
  useIsomorphicLayoutEffect(() => {
    if (isLoading || !rootRef.current) return undefined;
    return warmImages(rootRef.current.querySelectorAll('img'));
  }, [isLoading, project.id]);

  return (
    <div ref={rootRef} data-header-theme="dark" className={styles.root}>
      {project.story.map((chapter, i) => (
        <article key={chapter.label} id={`chapter-${i}`} data-chapter className={styles.chapter}>
          <header data-rise className={styles.text}>
            <p className={clsx('p-x', styles.eyebrow)}>
              <span>Chapter {pad(i + 1)}</span>
              <span className={styles.line} />
              <span>{chapter.label}</span>
            </p>
            <h4 className={clsx('h4', styles.title)}>{chapter.title}</h4>
            <p className={clsx('p-l', styles.body)}>{chapter.text}</p>
          </header>
          <BrowserFrame preload={i === 0} src={chapter.image} domain={project.domain} alt={`${project.title}: ${chapter.title}`} />
        </article>
      ))}

      <article id={`chapter-${chapterCount}`} data-chapter className={styles.chapter}>
        <header data-rise className={styles.text}>
          <p className={clsx('p-x', styles.eyebrow)}>
            <span>Chapter {pad(chapterCount + 1)}</span>
            <span className={styles.line} />
            <span>Every Screen</span>
          </p>
          <h4 className={clsx('h4', styles.title)}>Designed for the phone in your hand.</h4>
          <p className={clsx('p-l', styles.body)}>{project.mobileText}</p>
        </header>
        <div className={styles.phones}>
          {project.mobile.map((src, i) => (
            <div key={src} data-phone data-header-theme="light" className={styles.phone}>
              <span className={styles.notch} aria-hidden="true" />
              <div className={styles.phoneScreen}>
                <Image src={src} fill sizes="(max-width: 812px) 30vw, 16vw" alt={`${project.title} on mobile, view ${i + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article id={`chapter-${chapterCount + 1}`} data-chapter className={clsx(styles.chapter, styles.outcome)}>
        <header data-rise className={styles.text}>
          <p className={clsx('p-x', styles.eyebrow)}>
            <span>Chapter {pad(chapterCount + 2)}</span>
            <span className={styles.line} />
            <span>In Numbers</span>
          </p>
          <h4 className={clsx('h4', styles.title)}>{project.company}, at a glance.</h4>
        </header>
        <ul className={styles.facts}>
          {project.facts.map((fact) => (
            <li data-rise key={fact.label} className={styles.fact}>
              <span className={clsx('h2', styles.factValue)}>{fact.value}</span>
              <span className={clsx('p', styles.factLabel)}>{fact.label}</span>
            </li>
          ))}
        </ul>
        <div data-rise className={styles.cta}>
          <p className={clsx('p-x', styles.note)}>Figures as published by {project.company}.</p>
          <ButtonLink target href={project.liveLink} label="VISIT THE LIVE SITE" />
        </div>
      </article>
    </div>
  );
}

// Memoised: the page re-renders when the active chapter changes (left column highlight);
// the story itself (images, triggers) doesn't need to.
export default memo(ProjectStory);
