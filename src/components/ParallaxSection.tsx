import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ParallaxSection: React.FC<Props> = ({ children, className = '', id }) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Smooth subtle parallax depth on background elements
    const tween = gsap.to(bgRef.current, {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      <div ref={bgRef} className="absolute inset-0 w-full h-[120%] -top-[10%] -z-10 bg-inherit" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </section>
  );
};

export default ParallaxSection;
