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
  const [liteEffects, setLiteEffects] = useState(false);
  const totalFrames = 80;

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallTouchScreen = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-width: 900px)').matches;
    const shouldUseLiteEffects = memory <= 4 || window.matchMedia('(max-width: 1200px)').matches;
    const shouldUseStaticHero = prefersReducedMotion || smallTouchScreen;

    setReducedMotion(shouldUseStaticHero);
    setLiteEffects(shouldUseLiteEffects);

    if (shouldUseStaticHero) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameStep = shouldUseLiteEffects ? 2 : 1;
    const frameNumbers: number[] = [];
    for (let frame = 1; frame <= totalFrames; frame += frameStep) {
      frameNumbers.push(frame);
    }
    if (frameNumbers[frameNumbers.length - 1] !== totalFrames) {
      frameNumbers.push(totalFrames);
    }

    const loadedImages: Array<HTMLImageElement | undefined> = [];
    let idleHandle: number | undefined;
    let isCancelled = false;

    const resizeCanvas = () => {
      const maxRenderWidth = shouldUseLiteEffects ? 1100 : 1600;
      const scale = Math.min(1, maxRenderWidth / window.innerWidth);
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
    };

    const getNearestLoadedImage = (frameIndex: number) => {
      for (let offset = 0; offset < frameNumbers.length; offset++) {
        const previous = loadedImages[frameIndex - offset];
        if (previous) return previous;

        const next = loadedImages[frameIndex + offset];
        if (next) return next;
      }
      return undefined;
    };

    const render = (frameIndex: number) => {
      const image = getNearestLoadedImage(Math.round(frameIndex));
      if (image) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use object-cover behavior to eliminate borders
        const hRatio = canvas.width / image.width;
        const vRatio = canvas.height / image.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - image.width * ratio) / 2;
        const centerShift_y = (canvas.height - image.height * ratio) / 2;
        
        ctx.drawImage(
           image, 0, 0, image.width, image.height,
           centerShift_x, centerShift_y, image.width * ratio, image.height * ratio
        );
      }
    };

    const playhead = { frame: 0 };

    const loadFrame = (imageIndex: number) => {
      if (loadedImages[imageIndex]) return;
      const img = new Image();
      img.decoding = 'async';
      const frameStr = String(frameNumbers[imageIndex]).padStart(3, '0');
      img.src = `/images/hero-frames/${frameStr}.webp`;
      img.onload = () => {
        if (isCancelled) return;
        loadedImages[imageIndex] = img;
        if (imageIndex === 0 || Math.abs(imageIndex - playhead.frame) <= 2) {
          render(playhead.frame);
        }
      };
    };

    let nextImageIndex = 0;
    const scheduleFrameLoad = () => {
      const loadBatch = () => {
        if (isCancelled) return;

        let loadedInBatch = 0;
        while (nextImageIndex < frameNumbers.length && loadedInBatch < 4) {
          loadFrame(nextImageIndex);
          nextImageIndex++;
          loadedInBatch++;
        }

        if (nextImageIndex < frameNumbers.length) {
          if ('requestIdleCallback' in window) {
            idleHandle = window.requestIdleCallback(loadBatch, { timeout: 500 });
          } else {
            idleHandle = window.setTimeout(loadBatch, 80);
          }
        }
      };

      loadBatch();
    };

    resizeCanvas();
    scheduleFrameLoad();

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
      frame: frameNumbers.length - 1,
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
      resizeCanvas();
      render(playhead.frame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', handleResize);
      if (idleHandle !== undefined) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
      tl.kill();
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
      <div className={`absolute inset-0 z-10 pointer-events-none mix-blend-normal ${liteEffects ? '' : 'backdrop-blur-md'}`} style={{ backgroundColor: 'rgba(255, 249, 230, 0.4)' }}></div>

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
