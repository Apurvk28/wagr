import React from 'react';
import { motion } from 'framer-motion';

interface TextRepelProps {
  text: string;
  className?: string;
}

export const TextRepel: React.FC<TextRepelProps> = ({ text, className }) => {
  const characters = text.split('');

  return (
    <div className={`inline-flex flex-wrap justify-center ${className || ''}`}>
      {characters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block w-4 sm:w-6 md:w-8">&nbsp;</span>;
        }

        return (
          <motion.span
            key={index}
            className="inline-block cursor-default select-none"
            whileHover={{
              y: -10,
              scale: 1.3,
              color: '#A855F7', // brand-purple
              textShadow: '0px 0px 12px rgba(168, 85, 247, 0.8)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
};
