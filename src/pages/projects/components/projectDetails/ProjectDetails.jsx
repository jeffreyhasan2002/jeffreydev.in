import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import clsx from 'clsx';
import styles from '@src/pages/projects/components/projectDetails/styles/projectDetails.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

const pad = (n) => String(n).padStart(2, '0');

function ProjectDetails({ project, index, total, chapters, activeChapter }) {
  const isMobile = useIsMobile();
  const [lenis] = useStore(useShallow((state) => [state.lenis]));

  const meta = [
    ['Client', project.company],
    ['Sector', project.sector],
    ['Location', project.location],
    ['Year', project.date],
  ];

  const goToChapter = (i) => {
    const target = document.getElementById(`chapter-${i}`);
    if (!lenis || !target) return;
    lenis.scrollTo(target, {
      offset: -window.innerHeight * 0.18,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <p className={clsx('p-x', styles.counter)}>
          Project {pad(index + 1)} <span>/ {pad(total)}</span>
        </p>
        <h3 className={clsx(styles.title, 'h3')}>{project.title}</h3>
        <p className={clsx('p-l', styles.tagline)}>{project.tagline}</p>
      </div>

      <dl className={styles.meta}>
        {meta.map(([label, value]) => (
          <div key={label} className={styles.metaItem}>
            <dt className="p-xs">{label}</dt>
            <dd className="p">{value}</dd>
          </div>
        ))}
        <div className={clsx(styles.metaItem, styles.metaWide)}>
          <dt className="p-xs">Built with</dt>
          <dd className={styles.stack}>
            {project.stack.map((item) => (
              <span key={item} className={clsx('p-xs', styles.chip)}>
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      {!isMobile && (
        <nav aria-label="Chapters" className={styles.chapters}>
          {chapters.map((label, i) => (
            <button key={label} type="button" onClick={() => goToChapter(i)} className={clsx('p', styles.chapter, activeChapter === i && styles.chapterActive)}>
              <span className={styles.chapterIndex}>{pad(i + 1)}</span>
              <span className={styles.chapterLabel}>{label}</span>
            </button>
          ))}
        </nav>
      )}

      {project.liveLink ? (
        <div className={styles.buttonContainer}>
          <ButtonLink target href={project.liveLink} label="VISIT LIVE SITE" />
        </div>
      ) : null}
    </div>
  );
}

export default ProjectDetails;
