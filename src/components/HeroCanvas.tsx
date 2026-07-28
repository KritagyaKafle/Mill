import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from './ScrollFloat';

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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const loadedImages: HTMLImageElement[] = [];
    let imagesLoaded = 0;

    const render = (frameIndex: number) => {
      if (loadedImages[frameIndex]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use object-cover behavior to eliminate any borders (fill the entire screen)
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
        end: '+=400%',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      }
    });

    tl.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(playhead.frame)
    }, 0);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(playhead.frame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero-canvas" className={`relative w-full ${reducedMotion ? 'min-h-[50vh] py-20' : 'h-screen'} overflow-hidden flex items-center justify-center bg-white`}>
      
      {/* Background canvas layer */}
      <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
        {reducedMotion ? (
           <img src="/images/hero-frames/001.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Mustard processing" />
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full mix-blend-multiply opacity-90 filter contrast-125 saturate-150 transition-all duration-700"
          />
        )}
      </div>

      {/* Frosted Glass Text Overlay Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-20 z-20 pointer-events-none">
        
        {/* Top Text Panel */}
        <div className="mt-8 px-10 py-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl">
          <div className="font-display text-[4vw] md:text-[3vw] font-bold text-[var(--color-leaf-green-900)]">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom-=10%"
              scrollEnd="bottom center"
              stagger={0.03}
            >
              Pure Mustard
            </ScrollFloat>
          </div>
        </div>

        {/* Center Main Text Panel */}
        <div className="px-12 py-8 rounded-[40px] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] transform scale-110">
          <div className="font-display text-[8vw] md:text-[6vw] font-black tracking-widest text-[var(--color-charcoal)] uppercase text-center">
            <ScrollFloat
              animationDuration={1.2}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="center center"
              stagger={0.04}
            >
              React Bits
            </ScrollFloat>
          </div>
        </div>

        {/* Bottom Text Panel */}
        <div className="mb-8 px-10 py-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl">
          <div className="font-display text-[4vw] md:text-[3vw] font-bold text-[var(--color-leaf-green-800)]">
            <ScrollFloat
              animationDuration={1.2}
              ease="power2.out"
              scrollStart="bottom bottom"
              scrollEnd="bottom top+=20%"
              stagger={0.04}
            >
              Locally Pressed
            </ScrollFloat>
          </div>
        </div>

      </div>
      
    </section>
  );
};

export default HeroCanvas;
