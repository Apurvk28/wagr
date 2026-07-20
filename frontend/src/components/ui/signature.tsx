import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SignatureProps {
  text?: string;
  fontSize?: number;
  duration?: number;
  className?: string;
}

export const Signature: React.FC<SignatureProps> = ({
  text = 'Wagr.io',
  fontSize = 72,
  duration = 1.5,
  className = '',
}) => {
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawn(true);
    }, duration * 1000 * 0.7);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`w-full flex items-center justify-center select-none py-10 px-4 ${className}`}>
      <svg
        viewBox="0 0 600 160"
        className="w-full max-w-[480px] sm:max-w-[650px] md:max-w-[800px] h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="signature-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Animated Stroke & Fill */}
        <motion.text
          x="50%"
          y="62%"
          textAnchor="middle"
          fill={isDrawn ? 'url(#signature-gradient)' : 'transparent'}
          stroke="url(#signature-gradient)"
          strokeWidth="2.2"
          strokeDasharray="1200"
          initial={{ strokeDashoffset: 1200, opacity: 0 }}
          whileInView={{ strokeDashoffset: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            strokeDashoffset: { duration: duration, ease: 'easeInOut' },
            fill: { duration: 0.6, delay: duration * 0.7 },
            opacity: { duration: 0.3 }
          }}
          style={{
            fontFamily: "'LastoriaBoldRegular', cursive, sans-serif",
            fontSize: `${fontSize}px`,
            letterSpacing: '2px',
          }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
};

export default Signature;
