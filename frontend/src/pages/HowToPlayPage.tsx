import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Award, Wallet, Zap, Globe, ShieldCheck, ArrowRight, HelpCircle, 
  TrendingUp, Cpu, RefreshCw, Layers, CheckCircle2, Scale, BookOpen
} from 'lucide-react';
import { AnimatedBorderButton } from '../components/ui/AnimatedBorderButton';

const HowToPlayPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in font-sans text-dark-muted selection:bg-brand-purple/30 selection:text-white">
      <Navbar />

      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/10 border border-brand-purple/30 text-brand-purple px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            <BookOpen size={14} />
            <span>EXHAUSTIVE PLATFORM SPECIFICATION &amp; TRADING MANUAL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display leading-tight">
            Mastering Wagr<span className="text-brand-blue">.io</span>
          </h1>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed font-medium max-w-2xl mx-auto">
            Your in-depth, step-by-step guide to navigating virtual prediction contracts, probability dynamics, AI sentiment analysis, position management, and global leaderboards.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link to="/markets">
              <AnimatedBorderButton className="!px-6 !py-3 text-xs font-bold shadow-lg">
                <span>Explore Prediction Markets</span>
                <ArrowRight size={14} />
              </AnimatedBorderButton>
            </Link>
          </div>
        </div>

        {/* Quick Nav Anchor Bar */}
        <div className="bg-dark-card/90 border border-dark-border/60 rounded-2xl p-3 flex flex-wrap justify-center gap-2 text-xs font-bold text-dark-muted shadow-xl">
          <a href="#section-mxp" className="px-3.5 py-1.5 rounded-xl hover:bg-dark hover:text-white transition-all flex items-center space-x-1.5">
            <Wallet size={13} className="text-brand-blue" />
            <span>01. Virtual MXP Economy</span>
          </a>
          <a href="#section-lifecycles" className="px-3.5 py-1.5 rounded-xl hover:bg-dark hover:text-white transition-all flex items-center space-x-1.5">
            <Zap size={13} className="text-brand-purple" />
            <span>02. Short vs Long Term</span>
          </a>
          <a href="#section-trading" className="px-3.5 py-1.5 rounded-xl hover:bg-dark hover:text-white transition-all flex items-center space-x-1.5">
            <Globe size={13} className="text-brand-success" />
            <span>03. Probability Trading</span>
          </a>
          <a href="#section-ai" className="px-3.5 py-1.5 rounded-xl hover:bg-dark hover:text-white transition-all flex items-center space-x-1.5">
            <Cpu size={13} className="text-emerald-400" />
            <span>04. AI Sentiment</span>
          </a>
          <a href="#section-leaderboard" className="px-3.5 py-1.5 rounded-xl hover:bg-dark hover:text-white transition-all flex items-center space-x-1.5">
            <ShieldCheck size={13} className="text-amber-400" />
            <span>05. Ranks &amp; Refills</span>
          </a>
        </div>

        {/* SECTION 1: VIRTUAL ECONOMY & MXP */}
        <section id="section-mxp" className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 text-brand-blue flex items-center justify-center font-black text-lg border border-brand-blue/30 shrink-0">
              01
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Wallet size={20} className="text-brand-blue" />
                <span>Virtual Economy &amp; Market Exchange Points (MXP)</span>
              </h2>
              <p className="text-xs text-dark-muted font-medium">Zero-risk simulated forecasting sandbox</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-dark-muted leading-relaxed font-medium">
            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <Award className="text-brand-blue" size={16} />
                <span>500 MXP Welcome Bonus</span>
              </h3>
              <p>
                Every registered user automatically receives <strong className="text-white">500 Market Exchange Points (MXP)</strong> upon account creation. MXP serves as the universal medium of exchange across all prediction markets, community feeds, and ranking systems.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <ShieldCheck className="text-brand-success" size={16} />
                <span>Zero Real-Money Risk Guarantee</span>
              </h3>
              <p>
                Wagr.io operates exclusively on a non-monetary points system. MXP carries <strong className="text-white">zero fiat or cash value</strong> and cannot be bought, sold, withdrawn, or exchanged for real currency. You can test high-conviction predictions with total peace of mind.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: MARKET LIFECYCLES */}
        <section id="section-lifecycles" className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center font-black text-lg border border-brand-purple/30 shrink-0">
              02
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Zap size={20} className="text-brand-purple" />
                <span>Short-Term vs. Long-Term Market Lifecycles</span>
              </h2>
              <p className="text-xs text-dark-muted font-medium">Daily intraday cycles vs event-driven strategic timelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-dark-muted leading-relaxed font-medium">
            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-6 space-y-3 relative">
              <span className="text-[9px] font-extrabold bg-brand-danger/10 text-brand-danger border border-brand-danger/30 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                Intraday Daily Cycle
              </span>
              <h3 className="text-base font-extrabold text-white">Short-Term Daily Markets</h3>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-purple shrink-0 mt-0.5" />
                  <span><strong>Opens Daily at 12:05 AM:</strong> Fresh short-term event contracts are generated every morning at 12:05 AM in Wagr application timezone.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-purple shrink-0 mt-0.5" />
                  <span><strong>Closes &amp; Expires at 11:00 PM:</strong> All short-term markets for the day lock trading and resolve at 11:00 PM on the exact same calendar day.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-purple shrink-0 mt-0.5" />
                  <span><strong>65-Minute Daily Break (11:00 PM – 12:05 AM):</strong> From 11:00 PM to 12:05 AM, short-term markets enter settlement &amp; maintenance. No active short-term trading occurs during this gap.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-purple shrink-0 mt-0.5" />
                  <span><strong>Fast Payout Turnover:</strong> Immediate daily resolution for traders forecasting economic indicators, daily asset closes, or breaking tech releases.</span>
                </li>
              </ul>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-6 space-y-3 relative">
              <span className="text-[9px] font-extrabold bg-brand-purple/10 text-brand-purple border border-brand-purple/30 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                Multi-Day Strategic Timeline
              </span>
              <h3 className="text-base font-extrabold text-white">Long-Term Strategic Markets</h3>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <span><strong>24/7 Continuous Trading:</strong> Long-term markets remain open 24 hours a day, 7 days a week, without daily resets.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <span><strong>Fixed Event Target Dates:</strong> Resolution dates correspond directly to major real-world event milestones (e.g., Dec 31, 2026, Q4 AI Releases, Fed Rate Decisions).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <span><strong>Macro Sector Coverage:</strong> Predict major AI breakthroughs (GPT-5, Gemini 2.0), global economic policies, space missions, and elections.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <span><strong>Strategic Position Building:</strong> Accumulate or cash out positions over weeks or months as macro news develops.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROBABILITY TRADING & EARLY EXIT */}
        <section id="section-trading" className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-success/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-success/15 text-brand-success flex items-center justify-center font-black text-lg border border-brand-success/30 shrink-0">
              03
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Globe size={20} className="text-brand-success" />
                <span>YES vs. NO Contracts &amp; Early Position Exit</span>
              </h2>
              <p className="text-xs text-dark-muted font-medium">Dynamic probability bonding curves and cashing out for profit</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-dark-muted leading-relaxed font-medium">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-extrabold text-brand-success flex items-center space-x-1.5">
                  <TrendingUp size={16} />
                  <span>Trading YES (Long Position)</span>
                </h3>
                <p>
                  Buy YES shares if you believe the prediction event will occur. When market probability is low (e.g. 25%), buying YES offers massive payout multipliers (e.g. +300% return upon settlement).
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-extrabold text-brand-danger flex items-center space-x-1.5">
                  <TrendingUp size={16} className="rotate-180" />
                  <span>Trading NO (Short Position)</span>
                </h3>
                <p>
                  Buy NO shares if you believe the prediction event will NOT occur. As trading volume accumulates on the NO side, probability shifts to reflect market skepticism.
                </p>
              </div>
            </div>

            {/* Early Position Exit Highlight */}
            <div className="bg-gradient-to-r from-brand-purple/15 via-dark/60 to-brand-blue/15 border border-brand-purple/35 rounded-2xl p-6 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-brand-purple font-extrabold text-sm">
                <Layers size={18} />
                <span>Early Position Exit (Cash Out Anytime Before Expiration)</span>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">
                You do <strong className="text-white">NOT</strong> need to wait until the final resolution date to close your trade! As new news breaks and market probabilities move, your position's value updates in real time. You can click <strong className="text-white">"Close Trade"</strong> on any open position to instantly cash out your MXP, locking in profits when probabilities swing in your favor or cutting losses if sentiment shifts.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: AI MARKET SENTIMENT & NEWS SIMULATION */}
        <section id="section-ai" className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/30 shrink-0">
              04
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Cpu size={20} className="text-emerald-400" />
                <span>AI Sentiment Simulation &amp; Dynamic Probabilities</span>
              </h2>
              <p className="text-xs text-dark-muted font-medium">Autonomous news analysis, LLM completions, and probability adjustments</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-dark-muted leading-relaxed font-medium">
            <p>
              Wagr.io incorporates dedicated Artificial Intelligence (AI) pipelines (powered by Groq LLMs) to dynamically reflect real-world momentum:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-extrabold text-white flex items-center space-x-1.5">
                  <RefreshCw size={14} className="text-emerald-400" />
                  <span>AI News Briefings</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  Our news service continuously indexes breaking tech and financial news, generating concise AI briefings and impact analyses for linked contracts.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-extrabold text-white flex items-center space-x-1.5">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span>Probability Sentiment Shifts</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  AI sentiment routines dynamically simulate probability fluctuations across active markets, ensuring market odds reflect current real-world momentum.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-extrabold text-white flex items-center space-x-1.5">
                  <Scale size={14} className="text-emerald-400" />
                  <span>Verifiable Outcomes</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  While AI influences market probability pricing prior to expiration, final outcome resolutions strictly depend on verifiable real-world primary sources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: LEADERBOARDS & WALLET REFILLS */}
        <section id="section-leaderboard" className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/30 shrink-0">
              05
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck size={20} className="text-amber-400" />
                <span>Global Leaderboards, Ranks &amp; Free Refills</span>
              </h2>
              <p className="text-xs text-dark-muted font-medium">Compete with global traders and request balance refills</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-dark-muted leading-relaxed font-medium">
            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center space-x-2">
                <Award size={16} />
                <span>Climbing the Leaderboard</span>
              </h3>
              <p>
                Your global trader rank is calculated based on total portfolio value (available MXP balance + value of open trades) and settled prediction win rates. Compete to reach the Top 10 on the global leaderboard!
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <Wallet size={16} className="text-brand-purple" />
                <span>Free MXP Refill Requests</span>
              </h3>
              <p>
                If your MXP balance runs low after a series of unsuccessful trades, don't worry! You can visit your <strong className="text-white">/wallet</strong> page anytime to submit a free credit request to administrators.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center space-x-2 border-b border-dark-border/40 pb-4">
            <HelpCircle size={20} className="text-brand-purple" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-4 text-xs text-dark-muted font-medium">
            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">When do Short-Term markets open and close?</h3>
              <p>
                Short-Term daily markets open every morning at <strong className="text-white">12:05 AM</strong> in the Wagr application timezone and close/expire at <strong className="text-white">11:00 PM</strong> on the exact same calendar day. From 11:00 PM to 12:05 AM (a 65-minute break), short-term trading is paused for settlement while the next day's market drop is prepared.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">How do Long-Term strategic markets work?</h3>
              <p>
                Long-Term markets remain open 24/7 without daily resets. They track multi-week or multi-month macro milestones (e.g., AI model releases, Federal Reserve rate decisions, elections) with fixed target resolution dates.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">Can I lose real money on Wagr.io?</h3>
              <p>
                No. Wagr.io operates 100% on Market Exchange Points (MXP), a virtual simulation currency. Wagr does not accept real money deposits or process cash withdrawals.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">How are market outcomes resolved?</h3>
              <p>
                Markets resolve to YES or NO based on verified primary sources (official press releases, Fed statements, company announcements). Admin resolutions are final.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">What happens if a market event is cancelled or postponed?</h3>
              <p>
                If a real-world event is cancelled or indefinitely postponed, administrators declare the market cancelled, and 100% of invested MXP is refunded to all participants.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <div className="bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-brand-purple/15 text-brand-purple border border-brand-purple/30 mb-1">
            <Award size={28} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Ready to Build Your Prediction Portfolio?</h2>
          <p className="text-xs sm:text-sm text-dark-muted max-w-md mx-auto leading-relaxed font-medium">
            Explore active prediction markets, express your conviction on future events, and start trading now.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/markets">
              <AnimatedBorderButton className="!px-8 !py-3.5 text-xs font-extrabold">
                <span>Start Trading Now</span>
                <ArrowRight size={14} />
              </AnimatedBorderButton>
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HowToPlayPage;
