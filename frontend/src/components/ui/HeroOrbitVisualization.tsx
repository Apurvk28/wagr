import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, DollarSign, Globe, Award, TrendingUp, Sparkles } from 'lucide-react';

export const HeroOrbitVisualization: React.FC = () => {
  return (
    <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] flex items-center justify-center select-none pointer-events-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 via-brand-blue/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Orbit 4 - Outermost (520px) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full border border-dark-border/40"
      >
        {/* Item 1 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-dark-card border border-brand-purple/40 flex items-center justify-center shadow-lg shadow-brand-purple/20 text-brand-purple"
          >
            <Cpu size={20} />
          </motion.div>
        </div>

        {/* Item 2 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-dark-card border border-brand-blue/40 flex items-center justify-center shadow-lg shadow-brand-blue/20 text-brand-blue"
          >
            <Globe size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Orbit 3 - Middle-outer (400px) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[230px] h-[230px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] rounded-full border border-dark-border/60"
      >
        {/* Item 1 */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
            className="bg-dark-card border border-brand-success/40 rounded-full px-3 py-1 text-[10px] sm:text-xs font-black text-brand-success shadow-lg shadow-brand-success/20 flex items-center space-x-1"
          >
            <TrendingUp size={12} />
            <span>YES +84%</span>
          </motion.div>
        </div>

        {/* Item 2 */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-dark-card border border-amber-500/40 flex items-center justify-center shadow-lg text-amber-400"
          >
            <Award size={18} />
          </motion.div>
        </div>
      </motion.div>

      {/* Orbit 2 - Inner (260px) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[270px] md:h-[270px] rounded-full border border-brand-purple/20"
      >
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-dark-card border border-brand-success/40 flex items-center justify-center text-brand-success shadow-lg"
          >
            <DollarSign size={16} />
          </motion.div>
        </div>
      </motion.div>

      {/* Orbit 1 - Core Center Badge */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-brand-purple via-brand-blue to-purple-600 p-[1.5px] shadow-2xl shadow-brand-purple/40 relative z-10">
        <div className="w-full h-full rounded-[22px] bg-dark-card flex flex-col items-center justify-center p-3 text-center">
          <Sparkles className="text-brand-purple mb-1 animate-pulse" size={24} />
          <span className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display tracking-tight">
            wagr<span className="text-brand-blue">.io</span>
          </span>
          <span className="text-[9px] font-bold text-dark-muted uppercase tracking-widest mt-0.5">
            AI EXCHANGE
          </span>
        </div>
      </div>
    </div>
  );
};
