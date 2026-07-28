import React, { useEffect, useRef, useState } from 'react';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

export default function TrueFocus({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#5227FF",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}: TrueFocusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  return (
    <div ref={containerRef} className="flex gap-4 flex-wrap justify-start items-center">
      {words.map((word, i) => {
        const isActive = i === currentIndex;
        return (
          <span
            key={i}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold transition-all cursor-pointer"
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              color: isActive ? 'var(--color-leaf-green-900)' : 'var(--color-leaf-green-800)',
              borderBottom: isActive ? `3px solid ${borderColor}` : '3px solid transparent',
              transitionDuration: `${animationDuration}s`,
              opacity: isActive ? 1 : 0.4,
              transform: isActive ? 'scale(1.1)' : 'scale(1)'
            }}
            onClick={() => manualMode && setCurrentIndex(i)}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
