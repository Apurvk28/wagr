import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface EyeTrackingProps {
  eyeSize?: number;
  gap?: number;
  className?: string;
}

export const EyeTracking: React.FC<EyeTrackingProps> = ({
  eyeSize = 140,
  gap = 50,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // Track global mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic blinking effect for realistic animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Helper function to compute pupil offset for each eye
  const calculatePupilOffset = (eyeRef: React.RefObject<HTMLDivElement>) => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = mousePos.x - eyeCenterX;
    const dy = mousePos.y - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.hypot(dx, dy), eyeSize * 0.35);

    const pupilX = Math.cos(angle) * (distance * 0.5);
    const pupilY = Math.sin(angle) * (distance * 0.5);

    return { x: pupilX, y: pupilY };
  };

  const leftOffset = calculatePupilOffset(leftEyeRef);
  const rightOffset = calculatePupilOffset(rightEyeRef);

  const pupilSize = eyeSize * 0.48;
  const irisSize = eyeSize * 0.28;

  return (
    <div className={`inline-flex items-center justify-center select-none py-4 ${className}`} style={{ gap: `${gap}px` }}>
      {/* Left Eye */}
      <div
        ref={leftEyeRef}
        className="relative bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-dark-card overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{
          width: `${eyeSize}px`,
          height: `${eyeSize}px`,
          boxShadow: 'inset 0 6px 16px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(139, 92, 246, 0.35)',
        }}
      >
        {/* Eyelid for Blinking */}
        <motion.div
          animate={{ scaleY: isBlinking ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-dark-bg z-20 origin-top pointer-events-none"
        />

        {/* Outer Iris & Pupil Container */}
        <motion.div
          animate={{ x: leftOffset.x, y: leftOffset.y }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className="relative rounded-full bg-gradient-to-br from-brand-purple via-brand-blue to-emerald-400 flex items-center justify-center shadow-md"
          style={{ width: `${pupilSize}px`, height: `${pupilSize}px` }}
        >
          {/* Inner Black Pupil */}
          <div
            className="rounded-full bg-dark-bg relative flex items-center justify-center"
            style={{ width: `${irisSize}px`, height: `${irisSize}px` }}
          >
            {/* Catchlight Reflection Dot */}
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-white opacity-95 shadow-sm" />
          </div>
        </motion.div>
      </div>

      {/* Right Eye */}
      <div
        ref={rightEyeRef}
        className="relative bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-dark-card overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{
          width: `${eyeSize}px`,
          height: `${eyeSize}px`,
          boxShadow: 'inset 0 6px 16px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(139, 92, 246, 0.35)',
        }}
      >
        {/* Eyelid for Blinking */}
        <motion.div
          animate={{ scaleY: isBlinking ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-dark-bg z-20 origin-top pointer-events-none"
        />

        {/* Outer Iris & Pupil Container */}
        <motion.div
          animate={{ x: rightOffset.x, y: rightOffset.y }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className="relative rounded-full bg-gradient-to-br from-brand-purple via-brand-blue to-emerald-400 flex items-center justify-center shadow-md"
          style={{ width: `${pupilSize}px`, height: `${pupilSize}px` }}
        >
          {/* Inner Black Pupil */}
          <div
            className="rounded-full bg-dark-bg relative flex items-center justify-center"
            style={{ width: `${irisSize}px`, height: `${irisSize}px` }}
          >
            {/* Catchlight Reflection Dot */}
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-white opacity-95 shadow-sm" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EyeTracking;
