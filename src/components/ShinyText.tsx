import React from 'react';

interface ShinyTextProps {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  speed = 2,
  delay = 0,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = '',
}) => {
  const gradientDirection = direction === 'left' ? '110deg' : '-110deg';

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${gradientDirection}, transparent, transparent ${50 - spread / 2}%, ${shineColor} 50%, transparent ${50 + spread / 2}%, transparent)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: disabled ? color : 'transparent',
        color: color,
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
        animationDelay: `${delay}s`,
        animationDirection: yoyo ? 'alternate' : 'normal',
      }}
    >
      {text}
      <style>
        {`
          @keyframes shine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>
    </span>
  );
};

export default ShinyText;
