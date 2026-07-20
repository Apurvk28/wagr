import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Market } from '../types';
import { formatMXP, formatDate } from '../utils';

interface MarketCardProps {
  market: Market;
  isDailyFlash?: boolean;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, isDailyFlash }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    if (!isDailyFlash) return;

    const calculateTimeLeft = () => {
      const difference = new Date(market.resolutionDate).getTime() - Date.now();
      if (difference <= 0) {
        return 'LOCKED';
      }
      const hrs = Math.floor(difference / (1000 * 60 * 60));
      const mins = Math.floor((difference / 1000 / 60) % 60);
      const secs = Math.floor((difference / 1000) % 60);
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [market.resolutionDate, isDailyFlash]);

  // Category badge colors map
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'artificial intelligence':
      case 'ai':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'technology':
      case 'tech':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'finance':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const tradersCount = market.participants > 0 
    ? market.participants 
    : Math.floor((market.volume || 100) / 120) + 12;

  const hoverGlow = isDailyFlash
    ? 'hover:border-brand-blue hover:ring-2 hover:ring-brand-blue/50 hover:shadow-2xl hover:shadow-brand-blue/30'
    : 'hover:border-brand-purple hover:ring-2 hover:ring-brand-purple/50 hover:shadow-2xl hover:shadow-brand-purple/30';

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.055, zIndex: 40 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="w-full relative"
    >
      <Link
        to={`/markets/${market._id}`}
        className={`block w-full bg-dark-card border border-dark-border/60 rounded-2xl p-5 shadow-xl ${hoverGlow} transition-all duration-200 ease-out group relative overflow-hidden`}
      >
        {/* Shine highlight line on hover */}
        <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none" />

        {/* Top Details: Category Badge & Expiry */}
        <div className="flex justify-between items-center mb-3 relative z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(market.category)}`}>
            {market.category}
          </span>
          {isDailyFlash ? (
            <span className="text-[10px] text-brand-danger font-black uppercase tracking-wider flex items-center space-x-1 bg-brand-danger/10 border border-brand-danger/25 px-2 py-0.5 rounded animate-pulse">
              <span className="text-xs">⏱️</span> <span>{timeLeft}</span>
            </span>
          ) : (
            <span className="text-[10px] text-dark-muted font-medium">
              Ends {formatDate(market.resolutionDate)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors leading-snug mb-5 min-h-[40px] relative z-10">
          {market.title}
        </h3>

        {/* Probabilities Widgets */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 relative z-10">
          {/* YES Side */}
          <div className="bg-dark/40 hover:bg-brand-success/15 border border-dark-border/60 hover:border-brand-success/50 rounded-xl p-3 flex flex-col items-center justify-center transition-colors group/btn cursor-pointer">
            <span className="text-[10px] font-bold text-brand-success uppercase tracking-wider mb-1">YES Payout</span>
            <span className="text-base font-black text-white group-hover/btn:text-brand-success transition-colors">
              +{100 - market.yesProbability}%
            </span>
          </div>

          {/* NO Side */}
          <div className="bg-dark/40 hover:bg-brand-danger/15 border border-dark-border/60 hover:border-brand-danger/50 rounded-xl p-3 flex flex-col items-center justify-center transition-colors group/btn cursor-pointer">
            <span className="text-[10px] font-bold text-brand-danger uppercase tracking-wider mb-1">NO Payout</span>
            <span className="text-base font-black text-white group-hover/btn:text-brand-danger transition-colors">
              +{100 - market.noProbability}%
            </span>
          </div>
        </div>

        {/* Bottom Info: Volume & Participant Count */}
        <div className="flex justify-between items-center border-t border-dark-border/20 pt-3 text-[11px] text-dark-muted font-medium relative z-10">
          <div className="flex items-center space-x-1">
            <span>📊</span>
            <span>Vol: {formatMXP(market.volume)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👥</span>
            <span>{tradersCount} Traders</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MarketCard;
