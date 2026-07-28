import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollFloat from './ScrollFloat';
import TextPressure from './TextPressure';

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLImageElement>(null);
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
        
        // Use object-cover behavior to eliminate borders
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

    // Master Timeline for canvas frames
    tl.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(playhead.frame)
    }, 0);

    // Fade sequences for the text wrappers (adjusted to switch sooner)
    tl.to(text1Ref.current, { opacity: 0, duration: 0.1, ease: 'power2.inOut' }, 0.15);
    
    tl.fromTo(text2Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'power2.inOut' }, 0.20);
    tl.to(text2Ref.current, { opacity: 0, duration: 0.1, ease: 'power2.inOut' }, 0.45);
    
    tl.fromTo(text3Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'power2.inOut' }, 0.55);

    // Grand Reveal: Fade in the crisp foreground product PNG
    tl.fromTo(productRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 0.50);

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
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
        {reducedMotion ? (
           <img src="/images/hero-frames/001.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Mustard processing" />
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full mix-blend-multiply opacity-100 transition-all duration-700"
          />
        )}
      </div>

      {/* Full Canvas Liquid Glass Overlay (Warm Tint) */}
      <div className="absolute inset-0 z-10 backdrop-blur-md pointer-events-none mix-blend-normal" style={{ backgroundColor: 'rgba(255, 249, 230, 0.4)' }}></div>

      {/* TextPressure Sequence 3 - Placed BEHIND the bottle (z-14) */}
      <div className="absolute inset-0 flex items-center justify-center z-14 pointer-events-none">
        <div ref={text3Ref} className="absolute flex flex-col items-center justify-center opacity-0 w-full px-4" style={{ pointerEvents: 'auto' }}>
          <div className="w-full" style={{ position: 'relative', height: '300px' }}>
            <TextPressure
              text="Golden Purity"
              flex
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              scale={false}
              italic={false}
              textColor="var(--color-charcoal)"
              className="gap-1 md:gap-3"
              minFontSize={96}
            />
          </div>
        </div>
      </div>

      {/* Crisp Foreground Product PNG (Grand Reveal) */}
      <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
        <img 
          ref={productRef}
          src="/images/product_nobg.png" 
          alt="Golden Purity Mustard Oil" 
          className="absolute w-full h-full object-cover opacity-0 drop-shadow-2xl" 
        />
      </div>

      {/* Clean Mask-Style Typography Layer */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        
        {/* Sequence 1 */}
        <div ref={text1Ref} className="absolute flex flex-col items-center justify-center">
          <div className="font-display text-[8vw] md:text-[6vw] font-black tracking-tight text-[var(--color-charcoal)] leading-none drop-shadow-sm">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom-=20%"
              scrollEnd="bottom center"
              stagger={0.03}
            >
              Pure Mustard
            </ScrollFloat>
          </div>
        </div>

        {/* Sequence 2 */}
        <div ref={text2Ref} className="absolute flex flex-col items-center justify-center opacity-0">
          <div className="font-display text-[8vw] md:text-[6vw] font-black tracking-tight text-[var(--color-charcoal)] leading-none drop-shadow-sm">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="+=50%"
              scrollEnd="+=150%"
              stagger={0.03}
            >
              Cold-Pressed
            </ScrollFloat>
          </div>
        </div>

      </div>
      
    </section>
  );
};

export default HeroCanvas;
