import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Image from 'next/image';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/about/styles/about.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';

function About() {
  const isMobile = useIsMobile();
  const rootRef = useRef();
  const animatedImageRef = useRef();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      // Parallax via transform (y), not `top`: `top` forces a page layout on every scroll frame.
      gsap.set(animatedImageRef.current, { y: !isMobile ? '-20vw' : 0 });
      if (!isMobile) {
        gsap.to(animatedImageRef.current, {
          y: '20vw',
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            scroller: document?.querySelector('main'),
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation();
    return () => ctx.kill();
  }, [isMobile]);

  const renderImageContainer = () => (
    <div className={styles.imageContainer}>
      <Image
        preload
        quality={85}
        src="/giats/front.jpeg"
        sizes="(max-width: 812px) 90vw, 46vw"
        fill
        alt="Jeffrey Hasan"
        // The frame is wider than the portrait, so `cover` crops vertically. Anchor to the top so
        // the crop only ever trims the bottom and the head is never cut.
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
    </div>
  );

  return (
    <section ref={rootRef} className={styles.root}>
      <div className={clsx(styles.nameContainer, 'layout-block-inner')}>
        <AppearTitle>
          <h1 className={clsx('h1', 'medium')}>Hey, My name&apos;s</h1>
          <h1 className={clsx('h1', 'medium')}>Jeffrey Hasan!</h1>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, 'layout-grid-inner')}>
        {isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <div className="p-l">“My solo learning journey as a self-taught</div>
            <div className="p-l">developer empowers me to solve problems</div>
            <div className="p-l">creatively and efficiently, supporting the</div>
            <div className="p-l">successful completion of your project goals”</div>
          </AppearTitle>
        </div>
        {!isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapperBottom)}>
          {!isMobile ? (
            <AppearTitle key="desktop-descWrapperBottom">
              <h6 className="h6">A passionate front-end developer hailing from India.</h6>
              <h6 className="h6">With a strong eye for design and a dedication to</h6>
              <h6 className="h6">creating seamless user experiences. I specialize in</h6>
              <h6 className="h6">bringing web applications to life with clean and efficient</h6>
              <h6 className="h6">code.</h6>
            </AppearTitle>
          ) : (
            <AppearTitle key="mobile-descWrapperBottom">
              <h6 className="h6"> A passionate front-end developer hailing from India. With a</h6>
              <h6 className="h6">strong eye for design and a dedication to creating seamless</h6>
              <h6 className="h6">user experiences. I specialize in bringing web applications to life</h6>
              <h6 className="h6">with clean and efficient code.</h6>
            </AppearTitle>
          )}
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="/about" label="ABOUT ME" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
