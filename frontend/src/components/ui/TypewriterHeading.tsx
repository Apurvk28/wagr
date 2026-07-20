import React, { useState, useEffect } from 'react';

interface TypewriterHeadingProps {
  text: string;
  className?: string;
  speed?: number; // ms per char
  delay?: number; // initial delay
  onComplete?: () => void;
}

export const TypewriterHeading: React.FC<TypewriterHeadingProps> = ({
  text,
  className = '',
  speed = 35,
  delay = 300,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayedText(text);
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      {isTyping && (
        <span className="inline-block ml-1 w-1.5 h-[0.9em] bg-brand-purple animate-pulse align-baseline" />
      )}
    </span>
  );
};
