import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/projects/projects.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import useWindowSize from '@src/hooks/useWindowSize';

const seo = {
  title: 'Jeffrey - Projects',
  description: 'Eight websites for eight very different businesses, from data centres in Frankfurt to a wedding photographer in Kanyakumari. Each one told as a short story.',
  keywords: [
    'Jeffrey Hasan Projects',
    'Portfolio Showcase',
    'Frontend Development Examples',
    'Web Design Portfolio',
    'Responsive Web Projects',
    'Web Applications Portfolio',
    'HTML and CSS Projects',
    'JavaScript Development',
    'React Work',
    'Next.js Projects',
    'React Three Fiber Projects',
    'Electron Projects',
    'Professional Web Development',
    'Jeffrey Hasan Projects',
  ],
};

function Page() {
  const isMobile = useIsMobile();

  const windowSize = useWindowSize();
  const rootRef = useRef();
  const projectRefs = useRef([]);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const setupProjectAnimations = () => {
    const ctx = gsap.context(() => {
      if (!isLoading) {
        projectRefs.current.slice(0, -1).forEach((projectRef, index) => {
          gsap.set(projectRef, { yPercent: 0 });
          gsap
            .timeline({
              scrollTrigger: {
                id: `projectRef-${index}`,
                trigger: rootRef.current,
                start: `top+=${windowSize.height * index}`,
                end: () => `+=${(projectRefs.current.length - 2) * windowSize.height}`,
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(projectRef, {
              yPercent: 100,
              stagger: 1,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupProjectAnimations();
    return () => ctx.kill();
  }, [isLoading, windowSize.height]);

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.titleContainer, 'layout-block-inner')}>
        <h1 className={clsx(styles.title, 'h1')}>All Projects</h1>
      </section>
      <section ref={rootRef} data-header-theme="dark" className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.innerContainer}>
          {projects.map((project, index) => (
            <Link aria-label={`Go ${project.title}`} id={project.id} key={project.id} scroll={false} href={project.link} className={clsx(styles.card)}>
              <div
                style={
                  !isMobile
                    ? {
                        height: index === projects.length - 1 ? '200svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-100svh',
                      }
                    : {
                        height: index === projects.length - 1 ? '100svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-50svh',
                      }
                }
                className={styles.projectsWrap}
              >
                <div className={clsx(styles.container, 'layout-grid-inner')}>
                  <div className={styles.projectsDetails}>
                    <h6 className={clsx(styles.text, 'h6')}>
                      {project.date} — {project.sector}
                    </h6>
                    <h3 className={clsx(styles.text, 'h3')}>{project.title}</h3>
                  </div>
                  <div data-header-theme={project.coverTone || 'light'} className={styles.imageContainer}>
                    <Image preload={index === 0} sizes="(max-width: 812px) 83vw, 48vw" src={project.img} fill alt={project.title} />
                  </div>
                </div>
              </div>
              <div
                ref={(el) => {
                  projectRefs.current[index] = el;
                }}
                className={styles.canvas}
              >
                <Image
                  preload={index === 0}
                  quality={60}
                  sizes="100vw"
                  className={index === 0 ? styles.firstCard : index === projects.length - 1 ? styles.lastCard : undefined}
                  src={project.img}
                  fill
                  alt={project.title}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Page;
