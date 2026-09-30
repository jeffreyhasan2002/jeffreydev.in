import { useEffect, useMemo, useRef, useState } from 'react';

import CustomHead from '@src/components/dom/CustomHead';
import NextProject from '@src/pages/projects/components/nextProject/NextProject';
import ProjectDetails from '@src/pages/projects/components/projectDetails/ProjectDetails';
import ProjectStory from '@src/pages/projects/components/projectStory/ProjectStory';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/projects/project.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { DEFAULT_FLUID_COLOR, useStore } from '@src/store';
import useWindowSize from '@src/hooks/useWindowSize';

function Page({ id }) {
  const isMobile = useIsMobile();
  const rightContainerRef = useRef();
  const leftContainerRef = useRef();
  const [isLoading, setFluidColor] = useStore(useShallow((state) => [state.isLoading, state.setFluidColor]));
  const windowSize = useWindowSize();
  const [activeChapter, setActiveChapter] = useState(0);

  const projectIndex = useMemo(() => projects.findIndex((project) => project.id === id), [id]);
  const currentProject = useMemo(() => projects[projectIndex], [projectIndex]);
  const chapters = useMemo(() => [...currentProject.story.map((chapter) => chapter.label), 'Every Screen', 'In Numbers'], [currentProject]);

  const updateCSSVariables = (project) => {
    gsap.set('html', {
      '--black': project.primary,
      '--white': project.secondary,
      '--accentColor': project.accentColor,
      '--fillColor': project.fillColor,
      '--menuColor': project.menuColor,
      '--menuFontColor': project.menuFontColor,
    });
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!isLoading && !isMobile) {
        ScrollTrigger.create({
          id: 'project',
          trigger: rightContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftContainerRef.current,
          scrub: true,
          scroller: document?.querySelector('main'),
          invalidateOnRefresh: true,
          pinSpacing: false,
        });
      }
    });

    return () => {
      ctx.kill();
      ScrollTrigger.getById('project')?.kill();
    };
  }, [isMobile, isLoading, windowSize.width]);

  useEffect(() => {
    if (currentProject) {
      updateCSSVariables(currentProject);
      setFluidColor(currentProject.fluidColor);
    }
    return () => {
      updateCSSVariables({
        primary: '#28282b',
        secondary: '#f0f4f1',
        accentColor: '#f9f9f9',
        fillColor: '#f2ffbd',
        menuColor: '#28282b',
        menuFontColor: '#f0f4f1',
      });
      setFluidColor(DEFAULT_FLUID_COLOR);
    };
  }, [currentProject]);

  const seo = useMemo(
    () => ({
      title: `Jeffrey - ${currentProject.title} | ${currentProject.sector}`,
      description: `${currentProject.tagline} The story of designing and building ${currentProject.domain} for ${currentProject.company} (${currentProject.location}).`,
      image: currentProject.img,
      keywords: [
        currentProject.title,
        `${currentProject.title} website`,
        `${currentProject.sector} website`,
        `${currentProject.company} web design`,
        `Jeffrey Hasan ${currentProject.title}`,
        ...currentProject.stack,
      ],
    }),
    [currentProject],
  );

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.root, 'layout-grid-inner')}>
        <div ref={leftContainerRef} className={styles.leftContainer}>
          <ProjectDetails project={currentProject} index={projectIndex} total={projects.length} chapters={chapters} activeChapter={activeChapter} />
        </div>
        <div ref={rightContainerRef} className={styles.rightContainer}>
          <ProjectStory project={currentProject} onChapterChange={setActiveChapter} />
        </div>
      </section>
      <NextProject nextProject={projectIndex === projects.length - 1 ? projects[0] : projects[projectIndex + 1]} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = projects.map((project) => ({ params: { id: project.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { params } = context;
  return { props: { id: params.id } };
}

export default Page;
