import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const frameCount = 80;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    const loadedImages: HTMLImageElement[] = [];
    let imagesLoaded = 0;

    const render = (frameIndex: number) => {
      if (loadedImages[frameIndex]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image covering the canvas completely
        const hRatio = canvas.width / loadedImages[frameIndex].width;
        const vRatio = canvas.height / loadedImages[frameIndex].height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - loadedImages[frameIndex].width * ratio) / 2;
        const centerShift_y = (canvas.height - loadedImages[frameIndex].height * ratio) / 2;
        ctx.drawImage(
           loadedImages[frameIndex], 0, 0, loadedImages[frameIndex].width, loadedImages[frameIndex].height,
           centerShift_x, centerShift_y, loadedImages[frameIndex].width * ratio, loadedImages[frameIndex].height * ratio
        );
      }
    };

    // Preload frames
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameStr = String(i + 1).padStart(3, '0');
      img.src = `/images/hero-frames/${frameStr}.webp`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) {
          render(0);
        }
      };
      loadedImages.push(img);
    }

    const playhead = { frame: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
      }
    });

    tl.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(playhead.frame)
    }, 0);

    // Text animations mapping to timeline progress
    tl.to('.text-1', { opacity: 1, y: 0, duration: 0.1 }, 0.05)
      .to('.text-1', { opacity: 0, y: -20, duration: 0.1 }, 0.25);

    tl.to('.text-2', { opacity: 1, y: 0, duration: 0.1 }, 0.3)
      .to('.text-2', { opacity: 0, y: -20, duration: 0.1 }, 0.5);

    tl.to('.text-3', { opacity: 1, y: 0, duration: 0.1 }, 0.55)
      .to('.text-3', { opacity: 0, y: -20, duration: 0.1 }, 0.75);

    tl.to('.text-4', { opacity: 1, y: 0, duration: 0.1 }, 0.8);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero-canvas" className={`relative w-full ${reducedMotion ? 'min-h-[50vh] py-20' : 'h-screen'} bg-[var(--color-leaf-green-900)] overflow-hidden flex items-center justify-center`}>
      
      {reducedMotion ? (
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="/images/hero-frames/001.webp" className="w-full h-full object-cover" alt="Mustard processing" />
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      )}

      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 ${reducedMotion ? 'space-y-4' : ''}`}>
        <h2 className={`${reducedMotion ? 'static opacity-100 mb-2' : 'text-1 absolute opacity-0 translate-y-5'} font-display text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-wide drop-shadow-lg`}>
          From Seed...
        </h2>
        <h2 className={`${reducedMotion ? 'static opacity-100 mb-2' : 'text-2 absolute opacity-0 translate-y-5'} font-display text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-wide drop-shadow-lg`}>
          ...To Press
        </h2>
        <h2 className={`${reducedMotion ? 'static opacity-100 mb-2' : 'text-3 absolute opacity-0 translate-y-5'} font-display text-3xl md:text-5xl lg:text-6xl text-[var(--color-mustard-gold)] font-bold tracking-wide drop-shadow-lg`}>
          Mustard Oil
        </h2>
        <h2 className={`${reducedMotion ? 'hidden' : 'text-4 absolute opacity-0 translate-y-5'} font-display text-3xl md:text-5xl lg:text-6xl text-[var(--color-paper-ivory)] font-bold tracking-wide drop-shadow-lg`}>
          Thank You Oil Mill
        </h2>
      </div>
    </section>
  );
};

export default HeroCanvas;
