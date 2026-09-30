import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import clsx from 'clsx';
import styles from '@src/pages/about/components/overview/styles/overview.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';

function Overview() {
  const isMobile = useIsMobile();

  return (
    <section className={clsx(styles.root, 'layout-grid-inner')}>
      <div className={styles.title}>
        {isMobile ? (
          <AppearTitle key="mobile-queto">
            <h3 className="h3">The front-end developer&apos;s role </h3>
            <h3 className="h3">
              is like a kind host, <span className="medium">ensuring</span>
            </h3>
            <h3 className="h3">
              visitors have a <span className="medium">smooth</span> and
            </h3>
            <h3 className="h3">
              <span className="medium">enjoyable</span> experience.
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">The front-end developer&apos;s role is like a</h3>
            <h3 className="h3">
              kind host, <span className="medium">ensuring</span> visitors have
            </h3>
            <h3 className="h3">
              a <span className="medium">smooth</span> and <span className="medium">enjoyable</span> experience.
            </h3>
          </AppearTitle>
        )}
      </div>
      <div className={clsx(styles.text, 'p-l', styles.myStory)}>
        <AppearTitle>
          <span>Some words</span>
        </AppearTitle>
      </div>
      <div className={styles.desc}>
        {!isMobile ? (
          <AppearTitle key="desktop-overview">
            <h6 className="h6">Hey there! I&apos;m Jeffrey, a passionate full-stack developer from Nagercoil, </h6>
            <h6 className="h6">India, with expertise in modern web technologies like Vue.js, React, and</h6>
            <h6 className="h6">TypeScript. I love building innovative digital experiences that merge AI</h6>
            <h6 className="h6">with intuitive user interfaces.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Currently working as a Front-End Developer at Someli Ai, I specialize</h6>
            <h6 className="h6">in creating responsive web applications and AI-powered content generation</h6>
            <h6 className="h6">platforms. My recent projects include machine learning solutions and IoT</h6>
            <h6 className="h6">integrations that solve real-world problems.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not coding, I&apos;m behind the camera capturing life&apos;s beautiful</h6>
            <h6 className="h6">moments through photography. I love exploring new places, documenting</h6>
            <h6 className="h6">my travels, and finding inspiration in different cultures and landscapes.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Whether it&apos;s developing the next innovative web application or</h6>
            <h6 className="h6">capturing the perfect shot during my travels, I&apos;m always excited to</h6>
            <h6 className="h6">create something meaningful and impactful.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Let&apos;s collaborate and build something amazing together!</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Jeffrey Hasan.</h6>
          </AppearTitle>
        ) : (
          <AppearTitle key="mobile-overview">
            <h6 className="h6">Hey there! I&apos;m Jeffrey, a passionate full-stack developer </h6>
            <h6 className="h6">from Nagercoil, India, with expertise in modern web </h6>
            <h6 className="h6">technologies like Vue.js, React, and TypeScript. I love </h6>
            <h6 className="h6">building innovative digital experiences that merge AI with </h6>
            <h6 className="h6">intuitive user interfaces.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Currently working as a Front-End Developer at Someli Ai, </h6>
            <h6 className="h6">I specialize in creating responsive web applications and </h6>
            <h6 className="h6">AI-powered content generation platforms. My recent projects </h6>
            <h6 className="h6">include machine learning solutions and IoT integrations.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not coding, I&apos;m behind the camera capturing </h6>
            <h6 className="h6">life&apos;s beautiful moments through photography. I love </h6>
            <h6 className="h6">exploring new places, documenting my travels, and finding </h6>
            <h6 className="h6">inspiration in different cultures and landscapes.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Whether it&apos;s developing the next innovative web application </h6>
            <h6 className="h6">or capturing the perfect shot during my travels, I&apos;m always </h6>
            <h6 className="h6">excited to create something meaningful and impactful.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Let&apos;s collaborate and build something amazing together!</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Jeffrey Hasan.</h6>
          </AppearTitle>
        )}
      </div>
    </section>
  );
}
export default Overview;
