import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Badge from '@src/pages/components/clients/components/Badge';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/clients/styles/clients.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import useWindowSize from '@src/hooks/useWindowSize';

function Clients() {
  const isMobile = useIsMobile();
  const textRefs = useRef([]);
  const badgeRefs = useRef([]);
  const rootRef = useRef();
  const windowSize = useWindowSize();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      if (!isMobile) {
        const vw = (coef) => windowSize.height * (coef / 100);
        textRefs.current.forEach((textRef, index) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: rootRef.current,
                start: index === 0 ? `top-=${vw(35)}` : `top+=${vw(35 + 5.5555556 * index)}`,
                end: index === 0 ? `bottom-=${vw(35 + 5.5555556 * index)}` : `bottom+=${vw(25)}`,
                toggleActions: 'play none reverse none',
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            // Same end position as tweening `top` (CSS sets the start), but as a transform so
            // scrolling doesn't relayout the page every frame.
            .to(textRef, {
              y: () => ((10 + 30 * index + 5.5555556 * index) * window.innerWidth) / 100 - parseFloat(getComputedStyle(textRef).top),
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation(textRefs, rootRef, windowSize, isMobile);
    return () => ctx.kill();
  }, [isMobile, windowSize.height]);

  return (
    <section ref={rootRef} className={clsx(styles.root, 'layout-grid-inner')}>
      <h1 className={clsx(styles.sectionTitle, 'h1')}>
        <AppearByWords>Experience</AppearByWords>
      </h1>
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>2025</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[0] = el;
        }}
        data-header-theme="dark"
        className={styles.first}
      >
        <Badge name="company1" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Someli AI</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">Developed responsive web applications for</div>
            <div className="p-l">Someli AI&apos;s innovative social media content</div>
            <div className="p-l">generation platform using Vue.js, Nuxt.js,</div>
            <div className="p-l">and TypeScript. Implemented advanced front-end</div>
            <div className="p-l">architectures with Tailwind CSS, creating</div>
            <div className="p-l">dynamic and adaptive user interfaces.</div>
            <div className="p-l">Engineered AI-powered content creation tools</div>
            <div className="p-l">leveraging JavaScript and modern web tech.</div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.firstEmpty} />
          <div
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className={styles.firstText}
          >
            <AppearTitle>
              <h6 className="h6">2025</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>Someli AI</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Developed responsive web applications for</div>
              <div className="p-l">Someli AI&apos;s innovative social media content</div>
              <div className="p-l">generation platform using Vue.js, Nuxt.js,</div>
              <div className="p-l">and TypeScript. Implemented advanced front-end</div>
              <div className="p-l">architectures with Tailwind CSS, creating</div>
              <div className="p-l">dynamic and adaptive user interfaces.</div>
              <div className="p-l">Engineered AI-powered content creation tools</div>
              <div className="p-l">leveraging JavaScript and modern web tech.</div>
            </AppearTitle>
          </div>
        </>
      ) : null}
      {!isMobile ? <div className={styles.secondEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>2024</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[1] = el;
        }}
        data-header-theme="dark"
        className={styles.second}
      >
        <Badge name="company2" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>AK Info Park</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">Developed React-based Nike shoe e-commerce</div>
            <div className="p-l">platform. Implemented RESTful API integration,</div>
            <div className="p-l">fetching product data from designer mock API</div>
            <div className="p-l">with 99% accuracy. Optimized site performance,</div>
            <div className="p-l">achieving a 25% reduction in load time and</div>
            <div className="p-l">ensuring cross-browser compatibility.</div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className={styles.secondText}
          >
            <AppearTitle>
              <h6 className="h6">2024</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>AK Info Park</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Developed React-based Nike shoe e-commerce</div>
              <div className="p-l">platform. Implemented RESTful API integration,</div>
              <div className="p-l">fetching product data from designer mock API</div>
              <div className="p-l">with 99% accuracy. Optimized site performance,</div>
              <div className="p-l">achieving a 25% reduction in load time and</div>
              <div className="p-l">ensuring cross-browser compatibility.</div>
            </AppearTitle>
          </div>
          <div className={styles.fourthEmpty} />
        </>
      ) : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>2023</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[2] = el;
        }}
        data-header-theme="dark"
        className={styles.third}
      >
        <Badge name="company3" />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>Freelance Developer</h4>
          </AppearTitle>
          <AppearTitle>
            <div className="p-l">Handled clients across Australia, Malaysia,</div>
            <div className="p-l">and Abu Dhabi, creating front-end websites</div>
            <div className="p-l">and web applications. Delivered custom</div>
            <div className="p-l">solutions tailored to client requirements,</div>
            <div className="p-l">focusing on responsive design and optimal</div>
            <div className="p-l">user experience for diverse markets.</div>
          </AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.fifthEmpty} />
          <div
            ref={(el) => {
              textRefs.current[2] = el;
            }}
            className={styles.thirdText}
          >
            <AppearTitle>
              <h6 className="h6">2023</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>Freelance Developer</h4>
            </AppearTitle>
            <AppearTitle>
              <div className="p-l">Handled clients across Australia, Malaysia,</div>
              <div className="p-l">and Abu Dhabi, creating front-end websites</div>
              <div className="p-l">and web applications. Delivered custom</div>
              <div className="p-l">solutions tailored to client requirements,</div>
              <div className="p-l">focusing on responsive design and optimal</div>
              <div className="p-l">user experience for diverse markets.</div>
            </AppearTitle>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default Clients;
