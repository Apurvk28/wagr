import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Newspaper, DollarSign, Award, Sparkles } from 'lucide-react';

interface CardInfo {
  icon: React.ReactNode;
  title: string;
  desc: string;
  glow: string;
  border: string;
  badge: string;
}

const cardsData: CardInfo[] = [
  {
    icon: <Cpu className="text-brand-purple" size={32} />,
    title: 'AI Market Curation',
    desc: 'Wagr continuously scans real-world global news briefs to automatically formulate and launch live prediction contracts.',
    glow: 'shadow-brand-purple/30 shadow-2xl',
    border: 'border-brand-purple/40 hover:border-brand-purple/80',
    badge: 'AUTOMATED AI',
  },
  {
    icon: <Newspaper className="text-brand-blue" size={32} />,
    title: 'News Context Linking',
    desc: 'Deep sentiment analysis maps breaking headlines side-by-side with real-time probability charts and volume shifts.',
    glow: 'shadow-brand-blue/30 shadow-2xl',
    border: 'border-brand-blue/40 hover:border-brand-blue/80',
    badge: 'REAL-TIME NEWS',
  },
  {
    icon: <DollarSign className="text-brand-success" size={32} />,
    title: 'Risk-Free MXP Sandbox',
    desc: 'Forecast probability trends and master trading strategy using virtual Market Exchange Points (MXP) with zero financial risk.',
    glow: 'shadow-brand-success/30 shadow-2xl',
    border: 'border-brand-success/40 hover:border-brand-success/80',
    badge: 'ZERO RISK',
  },
  {
    icon: <Award className="text-amber-400" size={32} />,
    title: 'Gamified Leaderboards',
    desc: 'Compete against global forecasters, climb accuracy rankings, and unlock rare achievement badges on your profile.',
    glow: 'shadow-amber-500/30 shadow-2xl',
    border: 'border-amber-500/40 hover:border-amber-500/80',
    badge: 'RANKINGS & BADGES',
  },
];

const CardStack: React.FC = () => {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stacked rest positions (stacked neatly in center)
  const stackRotations = [-8, -3, 3, 8];
  const stackX = [-20, -6, 6, 20];
  const stackY = [12, 0, -6, -18];

  // Wide fan-out positions across the screen
  const fanX = isDesktop
    ? [-420, -140, 140, 420]
    : [-150, -50, 50, 150];
  const fanY = [0, 0, 0, 0];
  const fanRotations = [-6, -2, 2, 6];

  return (
    <div className="w-full py-20 lg:py-28 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center mb-14 px-4 relative z-10 max-w-3xl">
        <span className="inline-flex items-center space-x-1.5 text-xs font-black bg-brand-purple/15 text-brand-purple border border-brand-purple/30 px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
          <Sparkles size={13} />
          <span>Platform Capabilities</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
          How We Differ From Others
        </h2>
        <p className="text-sm sm:text-base text-dark-muted font-medium mt-3 max-w-xl mx-auto leading-relaxed">
          Explore what sets Wagr apart. Hover over the card deck below to fan out and inspect our core prediction engine features.
        </p>
      </div>

      {/* Stack Container */}
      <div
        className="relative w-full max-w-6xl h-[440px] sm:h-[480px] md:h-[520px] flex items-center justify-center cursor-pointer relative z-10"
        onMouseEnter={() => setIsDeckHovered(true)}
        onMouseLeave={() => {
          setIsDeckHovered(false);
          setHoveredCard(null);
        }}
      >
        {cardsData.map((card, idx) => {
          const isThisHovered = hoveredCard === idx;
          const isAnyCardHovered = hoveredCard !== null;

          let targetX = stackX[idx];
          let targetY = stackY[idx];
          let targetRotate = stackRotations[idx];
          let targetScale = 0.96;
          let targetZIndex = idx;
          let targetOpacity = 1;

          if (isThisHovered) {
            targetX = fanX[idx];
            targetY = -40;
            targetRotate = 0;
            targetScale = 1.12;
            targetZIndex = 100;
            targetOpacity = 1;
          } else if (isDeckHovered) {
            targetX = fanX[idx];
            targetY = fanY[idx];
            targetRotate = fanRotations[idx];
            targetScale = isAnyCardHovered ? 0.94 : 1;
            targetZIndex = 10 + idx;
            targetOpacity = isAnyCardHovered ? 0.82 : 1;
          }

          return (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              animate={{
                x: targetX,
                y: targetY,
                rotate: targetRotate,
                scale: targetScale,
                zIndex: targetZIndex,
                opacity: targetOpacity,
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className={`absolute w-[240px] sm:w-[270px] md:w-[310px] h-[340px] sm:h-[370px] md:h-[400px] bg-dark-card border ${
                isThisHovered
                  ? 'border-brand-purple ring-2 ring-brand-purple/60 shadow-2xl shadow-brand-purple/50'
                  : card.border
              } rounded-3xl p-6 md:p-7 flex flex-col justify-between shadow-2xl ${card.glow} select-none transition-colors duration-150 backdrop-blur-md`}
            >
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-dark/80 flex items-center justify-center border border-dark-border shadow-inner">
                    {card.icon}
                  </div>
                  <span className="text-[9px] font-black text-dark-muted bg-dark/60 border border-dark-border px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2.5">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] font-extrabold text-white/40 border-t border-dark-border/40 pt-4 uppercase tracking-widest">
                <span>Wagr Protocol</span>
                <span>0{idx + 1} / 04</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CardStack;
