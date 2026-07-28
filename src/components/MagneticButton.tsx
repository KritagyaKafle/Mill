import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const MagneticButton: React.FC<Props> = ({ children, className = '', href }) => {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  
  useEffect(() => {
    // Disable magnetic effect for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const h = rect.width / 2;
      const w = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - w;

      gsap.to(button, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: 'power3.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (href) {
    return (
      <a href={href} ref={buttonRef as any} className={`inline-block transition-colors ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button ref={buttonRef as any} className={`inline-block transition-colors ${className}`}>
      {children}
    </button>
  );
};

export default MagneticButton;
