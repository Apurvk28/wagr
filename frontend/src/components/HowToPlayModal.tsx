import React from 'react';
import { X, Award, Zap, Globe, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { AnimatedBorderButton } from './ui/AnimatedBorderButton';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-dark-card border border-brand-purple/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-dark-border/40 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple border border-brand-purple/30">
              <Award size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">How to Play Wagr.io</h2>
              <p className="text-xs text-dark-muted font-medium">Your 4-step guide to mastering the prediction exchange</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-dark-border text-dark-muted hover:text-white hover:border-dark-border/100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="space-y-4">
          {/* Step 1: Initial Allocation */}
          <div className="bg-dark/50 border border-dark-border/60 hover:border-brand-purple/30 rounded-2xl p-4.5 flex gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-black text-sm border border-brand-blue/25 shrink-0">
              01
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Wallet size={14} className="text-brand-blue" />
                <span>Get 500 MXP Welcome Bonus</span>
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Every newly registered user instantly receives <strong className="text-white">500 Market Exchange Points (MXP)</strong>. Wagr operates entirely on virtual points — no real-money deposits, zero financial risk!
              </p>
            </div>
          </div>

          {/* Step 2: Choose Your Market */}
          <div className="bg-dark/50 border border-dark-border/60 hover:border-brand-purple/30 rounded-2xl p-4.5 flex gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-black text-sm border border-brand-purple/25 shrink-0">
              02
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Zap size={14} className="text-brand-purple" />
                <span>Short-Term vs. Long-Term Contracts</span>
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Explore two market categories: <strong className="text-white">Short-Term Daily Markets</strong> (reset daily at 12:05 AM and resolve intraday) or <strong className="text-white">Long-Term Strategic Markets</strong> (multi-month AI, tech, and economic predictions).
              </p>
            </div>
          </div>

          {/* Step 3: Trade Conviction */}
          <div className="bg-dark/50 border border-dark-border/60 hover:border-brand-purple/30 rounded-2xl p-4.5 flex gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-success/10 text-brand-success flex items-center justify-center font-black text-sm border border-brand-success/25 shrink-0">
              03
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Globe size={14} className="text-brand-success" />
                <span>Trade YES or NO Contracts</span>
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Allocate your MXP to <strong className="text-brand-success">YES</strong> or <strong className="text-brand-danger">NO</strong>. As market probabilities move, win returns when the market settles, or cash out your positions early for profit.
              </p>
            </div>
          </div>

          {/* Step 4: Leaderboard & Wallet Top-Up */}
          <div className="bg-dark/50 border border-dark-border/60 hover:border-brand-purple/30 rounded-2xl p-4.5 flex gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/25 shrink-0">
              04
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>Leaderboards &amp; Free Refills</span>
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Climb the global rank leaderboard with your portfolio gains! If your balance runs low, simply request additional MXP from administrators anytime via your <strong className="text-white">/wallet</strong> page.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-2 flex justify-end">
          <AnimatedBorderButton onClick={onClose} className="!py-3 !px-6">
            <span>Got It, Let's Predict!</span>
            <ArrowRight size={14} />
          </AnimatedBorderButton>
        </div>

      </div>
    </div>
  );
};
