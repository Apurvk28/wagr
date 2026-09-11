import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Wallet, Zap, Globe, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface QuickHowToPlayPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickHowToPlayPopover: React.FC<QuickHowToPlayPopoverProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-dark-card border border-brand-purple/40 rounded-3xl p-5 shadow-2xl z-[999] animate-fade-in text-xs space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-dark-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple border border-brand-purple/30">
            <Award size={15} />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">How to Play Wagr.io</h3>
            <p className="text-[10px] text-dark-muted font-medium">Quick 4-step prediction guide</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-dark-muted hover:text-white hover:bg-dark/40 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* 4 Steps */}
      <div className="space-y-2.5">
        {/* Step 1 */}
        <div className="bg-dark/50 border border-dark-border/60 rounded-xl p-3 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-lg bg-brand-blue/15 text-brand-blue flex items-center justify-center font-black text-[10px] border border-brand-blue/30 shrink-0 mt-0.5">
            01
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center space-x-1">
              <Wallet size={12} className="text-brand-blue inline" />
              <span>Get 500 MXP</span>
            </h4>
            <p className="text-[11px] text-dark-muted leading-snug">Start with your free virtual balance. Zero financial risk!</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-dark/50 border border-dark-border/60 rounded-xl p-3 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-lg bg-brand-purple/15 text-brand-purple flex items-center justify-center font-black text-[10px] border border-brand-purple/30 shrink-0 mt-0.5">
            02
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center space-x-1">
              <Zap size={12} className="text-brand-purple inline" />
              <span>Choose a Market</span>
            </h4>
            <p className="text-[11px] text-dark-muted leading-snug">Trade Short-Term daily (12:05 AM – 11:00 PM) or Long-Term 24/7 strategic predictions.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-dark/50 border border-dark-border/60 rounded-xl p-3 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-lg bg-brand-success/15 text-brand-success flex items-center justify-center font-black text-[10px] border border-brand-success/30 shrink-0 mt-0.5">
            03
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center space-x-1">
              <Globe size={12} className="text-brand-success inline" />
              <span>Trade YES or NO</span>
            </h4>
            <p className="text-[11px] text-dark-muted leading-snug">Use MXP to take a position or cash out early for profit.</p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-dark/50 border border-dark-border/60 rounded-xl p-3 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-black text-[10px] border border-amber-500/30 shrink-0 mt-0.5">
            04
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center space-x-1">
              <ShieldCheck size={12} className="text-amber-400 inline" />
              <span>Climb the Leaderboard</span>
            </h4>
            <p className="text-[11px] text-dark-muted leading-snug">Grow your portfolio and compete with top global traders.</p>
          </div>
        </div>
      </div>

      {/* Button to Detailed Guide */}
      <div className="pt-1 border-t border-dark-border/40 flex justify-end">
        <button
          onClick={() => {
            onClose();
            navigate('/how-to-play');
          }}
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-xs flex items-center justify-center space-x-1.5 hover:opacity-90 transition-all shadow-md cursor-pointer"
        >
          <span>View Detailed Guide</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
