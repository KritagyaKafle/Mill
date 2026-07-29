import React, { useEffect, useRef, useState, useMemo } from 'react';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',
  minFontSize = 24
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const cursorRef = useRef({ x: 0, y: 0 });

  const chars = text.split('');

  useEffect(() => {
    if (fontUrl) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [fontUrl]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    let isVisible = false;
    let raf = 0;

    const updateText = () => {
      spansRef.current.forEach((span) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const distance = dist(cursorRef.current, center);
        const maxDist = window.innerWidth / 2;

        const wght = weight ? getAttr(distance, maxDist, 100, 1000) : 400;
        const wdth = width ? getAttr(distance, maxDist, 25, 150) : 100;
        const ital = italic ? getAttr(distance, maxDist, 0, 1) : 0;
        const op = alpha ? getAttr(distance, maxDist, 0.2, 1) : 1;
        const sc = scale ? getAttr(distance, maxDist, 0.5, 1.5) : 1;

        span.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
        if (italic) {
          span.style.fontStyle = ital > 0.5 ? 'italic' : 'normal';
        }
        if (alpha) span.style.opacity = op.toString();
        if (scale) span.style.transform = `scale(${sc})`;
      });
    };

    const scheduleUpdate = () => {
      if (!isVisible || document.hidden || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateText();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      scheduleUpdate();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
      scheduleUpdate();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      scheduleUpdate();
    }, { rootMargin: '200px' });

    observer.observe(container);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    if (window.matchMedia('(pointer: coarse)').matches) {
      cursorRef.current.x = window.innerWidth / 2;
      cursorRef.current.y = window.innerHeight / 2;
    };
    scheduleUpdate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', scheduleUpdate);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [weight, width, italic, alpha, scale]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center ${className}`}
      style={{
        fontFamily,
        color: textColor,
        WebkitTextStroke: stroke ? `${strokeWidth}px ${strokeColor}` : 'none',
        display: flex ? 'flex' : 'block',
      }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => (spansRef.current[i] = el)}
          className="inline-block transition-transform duration-100 ease-out"
          style={{ fontSize: `max(${minFontSize}px, 6vw)` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default TextPressure;
