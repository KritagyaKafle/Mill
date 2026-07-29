import React, { useRef, useEffect } from 'react';

export default function MagicRings({
  color = "#A855F7",
  colorTwo = "#6366F1",
  ringCount = 6,
  speed = 1,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  opacity = 1,
}: {
  color?: string;
  colorTwo?: string;
  ringCount?: number;
  speed?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  opacity?: number;
  attenuation?: number;
  scaleRate?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let animationFrameId: number;
    let time = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;

    const drawFrame = () => {
      time += 0.01 * speed;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < ringCount; i++) {
        const r = minDim * (baseRadius + i * radiusStep);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.lineWidth = lineThickness;
        const gradient = ctx.createLinearGradient(
          cx - r, cy - r, cx + r, cy + r
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, colorTwo);
        
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = opacity * (1 - (i / ringCount) * 0.5);
        ctx.setLineDash([10 + i * 5, 20]);
        ctx.lineDashOffset = -time * 50 * (i % 2 === 0 ? 1 : -1);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const render = () => {
      if (isVisible && isPageVisible) drawFrame();
      animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame();
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: '200px' });

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    observer.observe(canvas);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, colorTwo, ringCount, speed, lineThickness, baseRadius, radiusStep, opacity]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
