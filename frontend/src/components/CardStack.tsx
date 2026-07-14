import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Newspaper, DollarSign, Award } from 'lucide-react';

interface CardInfo {
  icon: React.ReactNode;
  title: string;
  desc: string;
  glow: string;
  border: string;
}

const cardsData: CardInfo[] = [
  {
    icon: <Cpu className="text-brand-purple" size={24} />,
    title: 'AI Market Curation',
    desc: 'Wagr scans global news briefs to automatically formulate and draft real-world prediction contracts.',
    glow: 'shadow-brand-purple/20',
    border: 'border-brand-purple/30 hover:border-brand-purple/70'
  },
  {
    icon: <Newspaper className="text-brand-blue" size={24} />,
    title: 'News Context Linking',
    desc: 'AI sentiment engines map news developments directly side-by-side with active contract probability charts.',
    glow: 'shadow-brand-blue/20',
    border: 'border-brand-blue/30 hover:border-brand-blue/70'
  },
  {
    icon: <DollarSign className="text-brand-success" size={24} />,
    title: 'Risk-Free MXP Sandbox',
    desc: 'Forecast outcomes and learn market analytics with virtual currency (MXP), completely free of financial risk.',
    glow: 'shadow-brand-success/20',
    border: 'border-brand-success/30 hover:border-brand-success/70'
  },
  {
    icon: <Award className="text-yellow-500" size={24} />,
    title: 'Gamified Achievements',
    desc: 'Climb the global podium leaderboards and unlock rare badge achievements for prediction accuracy.',
    glow: 'shadow-yellow-500/20',
    border: 'border-yellow-500/30 hover:border-yellow-500/70'
  }
];

const CardStack: React.FC = () => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Platform Highlights
        </span>
        <h3 className="text-xl font-black text-white mt-3 uppercase tracking-tight">
          How We Differ From Others
        </h3>
        <p className="text-xs text-dark-muted mt-1.5 max-w-sm mx-auto">
          Hover over the card deck below to fan out and explore our core value highlights.
        </p>
      </div>

      {/* Stack Container */}
      <motion.div 
        className="relative w-full max-w-sm h-[320px] flex items-center justify-center cursor-pointer group"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {cardsData.map((card, idx) => {
          // Define custom stacked transformations
          const rotations = [-6, -2, 2, 6];
          const xOffsets = [-12, -4, 4, 12];
          const yOffsets = [8, 0, -4, -12];

          // Fan out offsets on hover
          const fanX = [-160, -55, 50, 155];
          const fanY = [0, 0, 0, 0];
          const fanRot = [-4, -1, 1, 4];

          return (
            <motion.div
              key={idx}
              variants={{
                rest: {
                  x: xOffsets[idx],
                  y: yOffsets[idx],
                  rotate: rotations[idx],
                  zIndex: idx,
                  scale: 0.95
                },
                hover: {
                  x: fanX[idx],
                  y: fanY[idx],
                  rotate: fanRot[idx],
                  zIndex: 10 + idx,
                  scale: 1
                }
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={`absolute w-[180px] sm:w-[200px] h-[240px] bg-dark-card border ${card.border} rounded-2xl p-5 flex flex-col justify-between shadow-xl ${card.glow} select-none`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-dark/65 flex items-center justify-center border border-dark-border mb-4">
                  {card.icon}
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  {card.title}
                </h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="text-[9px] font-bold text-white/30 text-right uppercase tracking-widest">
                Wagr &bull; 0{idx + 1}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CardStack;
