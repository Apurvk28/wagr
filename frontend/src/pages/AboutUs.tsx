import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Target, Eye, ShieldAlert, Award, TrendingUp, Users, Cpu, 
  BarChart3, CheckCircle2, ShieldCheck, Sparkles, Globe, 
  Compass, Layers
} from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Hero */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <span className="text-[11px] font-extrabold bg-brand-purple/10 text-brand-purple border border-brand-purple/30 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              OUR MISSION, ARCHITECTURE &amp; PHILOSOPHY ✦
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display uppercase leading-tight">
            Democratizing <span className="text-brand-purple">Predictive Intelligence</span>
          </h1>
          <p className="text-sm sm:text-base text-dark-muted mt-3 max-w-3xl mx-auto leading-relaxed font-medium">
            Wagr.io is a next-generation AI-powered social prediction exchange where collective human wisdom meets real-time algorithmic news synthesis in a 100% risk-free virtual economy.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-dark-border/40 mt-8">
            <div className="bg-dark-card/80 border border-dark-border/60 p-4 rounded-2xl">
              <span className="text-2xl font-black text-white font-display">100%</span>
              <span className="block text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1">Risk-Free Sandbox</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-4 rounded-2xl">
              <span className="text-2xl font-black text-brand-purple font-display">500 MXP</span>
              <span className="block text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1">Welcome Allocation</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-4 rounded-2xl">
              <span className="text-2xl font-black text-brand-blue font-display">24/7</span>
              <span className="block text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1">AI News Ingestion</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-4 rounded-2xl">
              <span className="text-2xl font-black text-emerald-400 font-display">AMM</span>
              <span className="block text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1">Virtual Pool Stability</span>
            </div>
          </div>
        </div>

        {/* Executive Overview Banner */}
        <div className="bg-gradient-to-r from-brand-purple/15 via-dark-card to-brand-blue/15 border border-brand-purple/30 rounded-3xl p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center space-x-2 text-brand-purple text-xs font-bold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>What Drives Wagr.io</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">
                The Future Has Odds. We Help You Read Them.
              </h2>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Traditional news headlines tell you what happened yesterday. Traditional surveys reflect subjective emotion. Prediction exchanges turn future uncertainty into dynamic, quantitative probabilities — backed by skin-in-the-game forecasts, transparent performance tracking, and live sentiment analysis.
              </p>
            </div>
            <Link
              to="/markets"
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-brand-purple/25 shrink-0 transition-all hover:scale-[1.03]"
            >
              Explore Markets Now →
            </Link>
          </div>
        </div>

        {/* Exhaustive Deep-Dive Sections */}
        <div className="space-y-12">
          
          {/* Section 1: The Core Philosophy */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <Award size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">FOUNDATIONAL PILLAR</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  1. The Philosophy of Crowdsourced Forecasting
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Every future event — whether an upcoming interest rate decision, an AI model launch, a space mission landing, or a major geopolitical shift — carries inherent probabilistic uncertainty. For centuries, individuals relied on isolated opinions, pundit commentary, or speculative media noise to evaluate what might happen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="text-brand-purple" size={16} />
                  <span>The Crowd Wisdom Principle</span>
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  When hundreds of analytical minds aggregate their individual forecasts by placing virtual stakes on binary YES or NO outcomes, the resulting market price reflects a highly accurate consensus probability distribution — outperforming single expert predictions.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <BarChart3 className="text-brand-blue" size={16} />
                  <span>Brier Score &amp; Accuracy Calibration</span>
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Wagr tracks user forecasting accuracy over time. By measuring how your probability estimates align with settled real-world resolutions, we provide clean, objective feedback to refine your analytical decision-making skills.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Vision & Mission Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-blue/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-2">
                <Eye size={22} />
              </div>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">FUTURE LANDSCAPE</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Our Vision</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                To build the world's most accessible, transparent, and educational prediction market sandbox — proving that combined community intelligence, integrated with live AI sentiment analysis, generates superior predictive signals for complex global events.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-dark-muted">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0" />
                  <span>Zero-barrier entry for forecasters worldwide</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0" />
                  <span>Real-time sentiment alignment with global news streams</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-blue shrink-0" />
                  <span>Open data for educational &amp; research analytics</span>
                </li>
              </ul>
            </div>

            <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-success/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-success/10 border border-brand-success/30 flex items-center justify-center text-brand-success mb-2">
                <Target size={22} />
              </div>
              <span className="text-[10px] font-bold text-brand-success uppercase tracking-wider block">OUR DIRECT GOAL</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Our Mission</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                To empower curious minds to master market dynamics, probability estimation, and risk management through a completely simulated virtual points economy (MXP) backed by active community debate and live AI intelligence feeds.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-dark-muted">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                  <span>100% simulated sandbox environment with zero cash risk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                  <span>Collaborative community feeds with @mentions &amp; discussions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                  <span>Transparent settlement protocols based on official primary sources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Virtual Currency Economy & MXP */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <ShieldAlert size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">RISK-FREE MODEL</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  2. The Virtual Economy &amp; Market Exchange Points (MXP)
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io operates exclusively on a virtual point system known as Market Exchange Points (MXP). Every verified account receives a complimentary welcome allocation of 500 MXP upon signup. 
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-lg">🛡️</span>
                <h4 className="font-extrabold text-white uppercase tracking-wider">Zero Cash Deposits</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  We do not process credit cards, bank accounts, or crypto payments. MXP cannot be bought or sold for real money.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-lg">💎</span>
                <h4 className="font-extrabold text-white uppercase tracking-wider">Non-Redeemable Token</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  MXP holds zero cash value outside Wagr.io and cannot be transferred between accounts or converted to fiat.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-lg">🔄</span>
                <h4 className="font-extrabold text-white uppercase tracking-wider">Admin Balance Top-Ups</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  If your virtual MXP balance runs low, users can request administrative credit top-ups via the `/wallet` portal.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Algorithmic AMM Mechanics & Virtual Buffer */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-blue/30 transition-all space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">FINANCIAL ENGINEERING</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  3. Automated Market Maker (AMM) &amp; Virtual Buffer Algorithm
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              In primitive prediction markets, small liquidity pools are vulnerable to price distortion when a single high-capital trader enters a large position. Wagr solves this by engineering a custom Virtual Buffer AMM algorithm.
            </p>

            <div className="bg-dark/60 border border-dark-border/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3 text-brand-purple font-extrabold text-xs uppercase tracking-wider">
                <Cpu size={16} />
                <span>The Virtual Pool Buffer Formula ($C = 1000$ MXP)</span>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed font-medium">
                Our dynamic Automated Market Maker establishes a virtual buffer constant ($C = 1000$ MXP) on both YES and NO sides of every contract. When a trade is placed, the contract's probability moves smoothly along a bonding curve:
              </p>
              <div className="bg-dark p-4 rounded-xl font-mono text-[11px] text-brand-purple border border-brand-purple/20 space-y-1">
                <p>YES Payout = 1 + (Effective NO Pool / Effective YES Pool)</p>
                <p>NO Payout  = 1 + (Effective YES Pool / Effective NO Pool)</p>
                <p>Effective Pool = Actual Stake Pool + Virtual Buffer (1000 MXP)</p>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">
                This mathematical structure guarantees that odds transition smoothly without erratic spikes, providing fair payout returns for early forecasters and late entrants alike.
              </p>
            </div>
          </section>

          {/* Section 5: AI Information Integration */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-emerald-500/30 transition-all space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">ARTIFICIAL INTELLIGENCE</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  4. AI News Synthesis &amp; Sentiment Ingestion
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr integrates real-time news feeds powered by Groq LLM inference microservices. Our background processing pipeline operates continuously to provide context:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">1. News Indexing</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Scans global RSS feeds and news APIs, categorizing breaking developments in Tech, AI, Finance, Culture, and Politics.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">2. Briefing Generation</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Synthesizes multi-source reporting into concise 2-sentence AI Briefings linked directly to active prediction topics.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">3. Sentiment Alignment</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Simulates realistic background volume adjustments reflecting shift in overall media sentiment as resolution dates approach.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: How Wagr Works (Interactive 5-Step Workflow) */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Layers size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">USER EXPERIENCE</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  5. How Wagr Predictions Work (5-Step Workflow)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
              <div className="bg-dark/60 border border-dark-border/50 p-4 rounded-2xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">1</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Explore</h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">Browse active contracts across AI, Tech, Crypto &amp; Finance.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-4 rounded-2xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">2</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Analyze</h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">Read AI Briefings, news sources, and community debates.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-4 rounded-2xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">3</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Forecast</h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">Select YES or NO and allocate your virtual MXP points.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-4 rounded-2xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">4</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Settle</h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">Admin resolves event against official primary sources.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-4 rounded-2xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">5</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Rank</h4>
                <p className="text-[10px] text-dark-muted leading-relaxed">Collect payouts, increase win rate &amp; climb leaderboards.</p>
              </div>
            </div>
          </section>

          {/* Section 7: Community Focus & Social Layer */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <Users size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">SOCIAL ECOSYSTEM</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  6. Community Discussion &amp; Leaderboards
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Predictive analysis is richer when shared. Wagr features an integrated social network allowing users to publish insights, reply to trading hypotheses, mention fellow forecasters via `@username`, and link commentary directly to active prediction markets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 p-6 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Globe className="text-brand-purple" size={16} />
                  <span>Global Podium Leaderboards</span>
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Competitors are ranked dynamically by Net Portfolio Value, Accuracy Percentage, and Total Settled Trade Volume. Top forecasters gain global visibility and podium badges.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-6 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="text-brand-blue" size={16} />
                  <span>Constructive Debate Standards</span>
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Our community guidelines enforce respectful, data-backed discussion. Multi-account farming, spamming, or toxic behavior leads to account restrictions.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <span className="text-[11px] font-extrabold bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            READY TO TEST YOUR FORECASTING SKILLS?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display">
            Join the Wagr Prediction Exchange Today
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted font-medium max-w-2xl mx-auto leading-relaxed">
            Claim your 500 MXP welcome allocation, explore live markets, and see how your insights compare against global crowd wisdom.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-brand-purple/30 hover:scale-[1.03] transition-all"
            >
              Create Free Account →
            </Link>
            <Link
              to="/markets"
              className="bg-dark-card border border-dark-border/80 hover:border-brand-purple/50 text-white text-xs font-extrabold uppercase tracking-wider px-8 py-4 rounded-2xl transition-all"
            >
              Browse Active Markets
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
