import { useState, useEffect } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number; // duration in ms
  delay?: number; // delay before start in ms
  decimals?: number;
}

export function useCountUp({
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
}: UseCountUpOptions): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = easeProgress * end;

        setCount(Number(currentCount.toFixed(decimals)));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, delay, decimals]);

  return count;
}
