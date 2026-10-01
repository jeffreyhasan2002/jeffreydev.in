import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@src/pages/projects/components/nextProject/styles/nextProject.module.scss';

function NextProject({ nextProject }) {
  return (
    <>
      <section className={clsx(styles.titleContainer, 'layout-block-inner')}>
        <h1 className={clsx(styles.title, 'h1')}>
          <AppearByWords>Next Project</AppearByWords>
        </h1>
      </section>
      <section data-header-theme="dark" className={clsx(styles.nextRoot, 'layout-block-inner')}>
        <div className={styles.innerContainer}>
          <Link aria-label={`Go ${nextProject.title}`} id={nextProject.id} scroll={false} href={nextProject.link} className={clsx(styles.card)}>
            <div className={styles.projectsWrap}>
              <div className={clsx(styles.container, 'layout-grid-inner')}>
                <div className={styles.projectsDetails}>
                  <h6 className={clsx(styles.text, 'h6')}>
                    {nextProject.date} — {nextProject.sector}
                  </h6>

                  <h3 className={clsx(styles.text, 'h3')}>{nextProject.title}</h3>
                </div>
                <div data-header-theme={nextProject.coverTone || 'light'} className={styles.imageContainer}>
                  <Image sizes="(max-width: 812px) 83vw, 48vw" src={nextProject.img} fill alt={nextProject.title} />
                </div>
              </div>
            </div>

            <div className={styles.canvas}>
              <Image sizes="100vw" quality={60} src={nextProject.img} fill alt="" />
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
export default NextProject;
