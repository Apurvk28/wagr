import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap
} from 'framer-motion';

interface ScrollBasedVelocityProps {
  text: string;
  default_velocity?: number;
  className?: string;
  numCopies?: number;
}

export const ScrollBasedVelocity: React.FC<ScrollBasedVelocityProps> = ({
  text,
  default_velocity = 5,
  className = '',
  numCopies = 8,
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * default_velocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-6 select-none">
      <motion.div className={`inline-flex flex-nowrap ${className}`} style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="mr-8 inline-flex items-center">
            {text}
            <span className="ml-8 text-brand-purple/40">&bull;</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollBasedVelocity;
