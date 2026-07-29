import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  as?: React.ElementType;
  className?: string;
}

const TextReveal: React.FC<Props> = ({ text, as: Component = 'span', className = '' }) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = containerRef.current.querySelectorAll('.reveal-word');
    
    const tween = gsap.fromTo(
      words,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <Component ref={containerRef} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="reveal-word inline-block mr-[0.25em] whitespace-nowrap opacity-0">
          {word}
        </span>
      ))}
    </Component>
  );
};

export default TextReveal;
