import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Target, Eye, ShieldAlert, Award, TrendingUp, Users, Cpu, 
  BarChart3, CheckCircle2, ShieldCheck, Sparkles, Globe, 
  Compass, Layers, Zap, Lock, Database, FileText, ArrowRight,
  Server, Scale
} from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in font-sans text-dark-muted selection:bg-brand-purple/30 selection:text-white">
      <Navbar />

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/10 text-brand-purple border border-brand-purple/30 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-lg shadow-brand-purple/5 backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            <span>INSTITUTIONAL PREDICTIVE PLATFORM &amp; ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-display uppercase leading-tight max-w-5xl mx-auto">
            Quantifying The Future Through <span className="bg-gradient-to-r from-brand-purple via-purple-400 to-brand-blue bg-clip-text text-transparent">Collective Intelligence</span>
          </h1>

          <p className="text-sm sm:text-lg text-dark-muted max-w-3xl mx-auto leading-relaxed font-medium">
            Wagr.io is an industry-defining AI-powered social prediction exchange. We synthesize human forecasting wisdom, real-time automated news indexing, and high-frequency liquidity bonding curves into a 100% risk-free virtual points economy.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-dark-border/40 mt-8">
            <div className="bg-dark-card/80 border border-dark-border/60 p-5 rounded-2xl shadow-lg hover:border-brand-purple/40 transition-all">
              <span className="text-3xl font-black text-white font-display block">100%</span>
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1 block">Risk-Free Virtual Economy</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-5 rounded-2xl shadow-lg hover:border-brand-purple/40 transition-all">
              <span className="text-3xl font-black text-brand-purple font-display block">500 MXP</span>
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1 block">Initial Welcome Capital</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-5 rounded-2xl shadow-lg hover:border-brand-blue/40 transition-all">
              <span className="text-3xl font-black text-brand-blue font-display block">&lt; 100ms</span>
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1 block">Groq AI Inference Speed</span>
            </div>
            <div className="bg-dark-card/80 border border-dark-border/60 p-5 rounded-2xl shadow-lg hover:border-emerald-400/40 transition-all">
              <span className="text-3xl font-black text-emerald-400 font-display block">AMM</span>
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mt-1 block">Virtual Pool Stability</span>
            </div>
          </div>
        </div>

        {/* Executive Overview Banner */}
        <div className="bg-gradient-to-r from-brand-purple/15 via-dark-card to-brand-blue/15 border border-brand-purple/30 rounded-3xl p-8 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-3xl text-left">
              <div className="flex items-center space-x-2 text-brand-purple text-xs font-extrabold uppercase tracking-widest">
                <Compass size={16} />
                <span>EXECUTIVE SUMMARY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display">
                Transforming Speculative Media Into Calibrated Odds
              </h2>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Standard news platforms tell you what happened yesterday. Opinion polls reflect raw emotional reactions. Wagr converts global uncertainty into actionable, quantitative probability curves. By requiring participants to back their predictions with virtual skin-in-the-game, we eliminate media noise and reveal true crowd consensus.
              </p>
            </div>
            <Link
              to="/markets"
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-brand-purple/25 shrink-0 transition-all hover:scale-[1.03] flex items-center space-x-2"
            >
              <span>Explore Live Markets</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Core Pillars - Deep Dive Sections */}
        <div className="space-y-12">
          
          {/* Section 1: The Core Philosophy */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0">
                <Award size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple uppercase tracking-wider block">PILLAR 1</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  1. The Science of Crowdsourced Forecasting &amp; Brier Calibration
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              In 1907, statistician Francis Galton observed that the average of hundreds of guesses for an ox's weight was more accurate than individual expert estimates. Wagr applies this fundamental principle to 21st-century global events — spanning Technology, Macroeconomics, Geopolitics, Artificial Intelligence, and Crypto markets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-dark/60 border border-dark-border/60 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Globe className="text-brand-purple" size={18} />
                  <span>The Crowd Wisdom Principle</span>
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  When hundreds of analytical minds aggregate their individual forecasts by placing virtual stakes on binary YES or NO outcomes, the resulting market price reflects a highly accurate consensus probability distribution — outperforming single expert predictions.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <BarChart3 className="text-brand-blue" size={18} />
                  <span>Brier Score &amp; Accuracy Calibration</span>
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Wagr tracks user forecasting accuracy over time. By measuring how your probability estimates align with settled real-world resolutions, we calculate your Brier Score and calibration curve — providing clean, objective feedback to refine your analytical decision-making skills.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Vision & Mission Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-blue/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-2">
                <Eye size={24} />
              </div>
              <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider block">GLOBAL LANDSCAPE</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Our Strategic Vision</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                To build the world's most accessible, transparent, and educational prediction market sandbox — proving that combined community intelligence, integrated with live AI sentiment analysis, generates superior predictive signals for complex global events.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs text-dark-muted">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-brand-blue shrink-0" />
                  <span>Zero-barrier entry for forecasters worldwide</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-brand-blue shrink-0" />
                  <span>Real-time sentiment alignment with global news streams</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-brand-blue shrink-0" />
                  <span>Open data export for educational &amp; research analytics</span>
                </li>
              </ul>
            </div>

            <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-emerald-400/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-2">
                <Target size={24} />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">CORE PURPOSE</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Our Operating Mission</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                To empower curious minds to master market dynamics, probability estimation, and risk management through a completely simulated virtual points economy (MXP) backed by active community debate and live AI intelligence feeds.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs text-dark-muted">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>100% simulated sandbox environment with zero cash risk</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Collaborative community feeds with @mentions &amp; discussions</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Transparent settlement protocols based on official primary sources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Virtual Currency Economy & MXP */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple uppercase tracking-wider block">RISK-FREE MODEL</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  2. The Virtual Economy &amp; Market Exchange Points (MXP)
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io operates exclusively on a virtual point system known as Market Exchange Points (MXP). Every verified account receives a complimentary welcome allocation of 500 MXP upon signup.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-medium">
              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple text-lg font-bold">
                  🛡️
                </div>
                <h4 className="font-extrabold text-white uppercase tracking-wider text-sm">Zero Cash Deposits</h4>
                <p className="text-dark-muted text-xs leading-relaxed">
                  We do not process credit cards, bank accounts, or crypto payments. MXP cannot be bought or sold for real money under any circumstances.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-lg font-bold">
                  💎
                </div>
                <h4 className="font-extrabold text-white uppercase tracking-wider text-sm">Non-Redeemable Token</h4>
                <p className="text-dark-muted text-xs leading-relaxed">
                  MXP holds zero cash value outside Wagr.io and cannot be transferred between accounts or converted into fiat currency.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 text-lg font-bold">
                  🔄
                </div>
                <h4 className="font-extrabold text-white uppercase tracking-wider text-sm">Admin Balance Requests</h4>
                <p className="text-dark-muted text-xs leading-relaxed">
                  If your virtual MXP balance runs low, users can request administrative credit top-ups directly via the <code className="text-brand-purple font-mono bg-brand-purple/10 px-1.5 py-0.5 rounded">/wallet</code> portal.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Algorithmic AMM Mechanics & Virtual Buffer */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-blue/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider block">FINANCIAL ENGINEERING</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  3. Automated Market Maker (AMM) &amp; Virtual Buffer Algorithm
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              In primitive prediction markets, small liquidity pools are vulnerable to extreme price distortion when a single large trader enters a position. Wagr solves this by engineering a custom Virtual Buffer AMM algorithm.
            </p>

            <div className="bg-dark/70 border border-dark-border/70 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center space-x-3 text-brand-purple font-extrabold text-xs uppercase tracking-wider">
                <Cpu size={18} />
                <span>The Virtual Pool Buffer Formula ($C = 1000$ MXP)</span>
              </div>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
                Our dynamic Automated Market Maker establishes a virtual buffer constant ($C = 1000$ MXP) on both YES and NO sides of every contract. When a trade is placed, the contract's probability moves smoothly along a bonding curve:
              </p>
              <div className="bg-dark/90 p-5 rounded-xl font-mono text-xs text-brand-purple border border-brand-purple/20 space-y-2 overflow-x-auto shadow-inner">
                <p><span className="text-white font-bold">YES Payout Multiplier</span> = 1 + (Effective NO Pool / Effective YES Pool)</p>
                <p><span className="text-white font-bold">NO Payout Multiplier</span>  = 1 + (Effective YES Pool / Effective NO Pool)</p>
                <p><span className="text-white font-bold">Effective Pool</span>         = Actual User Stake Pool + Virtual Buffer (1000 MXP)</p>
                <p><span className="text-white font-bold">YES Probability %</span>       = Math.round(((YES Pool + 1000) / (Total Pool + 2000)) * 100)</p>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">
                This mathematical structure guarantees that odds transition smoothly without erratic spikes, providing fair payout returns for early forecasters and late entrants alike.
              </p>
            </div>
          </section>

          {/* Section 5: AI Information Integration */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-emerald-400/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">ARTIFICIAL INTELLIGENCE</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  4. Groq LLM Inference &amp; Real-Time News Synthesis
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr integrates real-time news feeds powered by ultra-low-latency Groq LLM microservices. Our background processing pipeline operates continuously to provide context:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">1. News Indexing</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Scans global RSS feeds and news APIs, categorizing breaking developments in Tech, AI, Finance, Culture, and Politics.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">2. Briefing Generation</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Synthesizes multi-source reporting into concise 2-sentence AI Briefings linked directly to active prediction topics.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">3. Sentiment Alignment</span>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Simulates realistic background volume adjustments reflecting shift in overall media sentiment as resolution dates approach.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Resolution Oracle & Settlement Protocols */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0">
                <Scale size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple uppercase tracking-wider block">SETTLEMENT INTEGRITY</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  5. Resolution Oracle Protocol &amp; Primary Source Rules
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Every prediction market contract on Wagr.io features a unambiguous, objective resolution rule. Market settlements are verified against verified primary sources to guarantee 100% resolution integrity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-medium">
              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-2">
                <span className="text-brand-purple font-black uppercase tracking-wider text-[11px] block">Official Government Data</span>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Economic and interest rate markets resolve strictly against official releases from the Federal Reserve, SEC, BLS, and European Central Bank.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-2">
                <span className="text-brand-blue font-black uppercase tracking-wider text-[11px] block">Corporate Filings</span>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Tech &amp; AI product launches resolve via official corporate press releases, SEC Form 8-K filings, or verified executive keynotes.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-2">
                <span className="text-emerald-400 font-black uppercase tracking-wider text-[11px] block">Exchange Price Feeds</span>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Crypto and stock market price targets resolve using official 23:59 UTC closing prices from Nasdaq, NYSE, and Coinbase Index feeds.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Security & Infrastructure Architecture Grid */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue shrink-0">
                <Server size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider block">ENTERPRISE STACK</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  6. Technical Architecture &amp; Security Engineering
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-dark/60 border border-dark-border/60 p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-brand-purple font-extrabold text-xs">
                  <Lock size={16} />
                  <span>httpOnly JWT Cookies</span>
                </div>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Client authentication uses secure, `httpOnly` double-cookie flags (`wagr_jwt`), protecting sessions against XSS token extraction.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs">
                  <Database size={16} />
                  <span>MongoDB Transactions</span>
                </div>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Trade executions execute inside atomic Mongoose sessions (`startSession`), preventing wallet/pool state drift under race conditions.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs">
                  <ShieldCheck size={16} />
                  <span>Regex ReDoS Escaping</span>
                </div>
                <p className="text-dark-muted text-xs leading-relaxed">
                  All user-supplied search inputs pass through dedicated sanitizers (`escapeRegex`) before query compilation, immunizing the server against ReDoS attacks.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-pink-400 font-extrabold text-xs">
                  <FileText size={16} />
                  <span>Client-Side PDF Exports</span>
                </div>
                <p className="text-dark-muted text-xs leading-relaxed">
                  Generate downloadable, formatted PDF documents for Bets History, MXP Wallet Log, Privacy Policy, and Terms &amp; Conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Interactive 5-Step Workflow */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <Layers size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-wider block">USER EXPERIENCE</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  7. The Forecaster Journey (5-Step Workflow)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
              <div className="bg-dark/60 border border-dark-border/50 p-5 rounded-2xl text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">1</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Explore</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">Browse active contracts across AI, Tech, Crypto &amp; Finance.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-5 rounded-2xl text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">2</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Analyze</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">Read AI Briefings, news sources, and community debates.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-5 rounded-2xl text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">3</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Forecast</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">Select YES or NO and allocate your virtual MXP points.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-5 rounded-2xl text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">4</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Settle</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">Admin resolves event against official primary sources.</p>
              </div>

              <div className="bg-dark/60 border border-dark-border/50 p-5 rounded-2xl text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-black text-xs inline-flex items-center justify-center">5</span>
                <h4 className="text-xs font-extrabold text-white uppercase">Rank</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">Collect payouts, increase win rate &amp; climb leaderboards.</p>
              </div>
            </div>
          </section>

          {/* Section 9: Community Ecosystem & Social Layer */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-8 sm:p-10 shadow-xl hover:border-brand-purple/30 transition-all space-y-6">
            <div className="flex items-center space-x-4 border-b border-dark-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-brand-purple uppercase tracking-wider block">COMMUNITY ECOSYSTEM</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  8. Social Network &amp; Leaderboard Rankings
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Predictive analysis is richer when shared. Wagr features an integrated social network allowing users to publish insights, reply to trading hypotheses, mention fellow forecasters via <code className="text-brand-purple font-mono bg-brand-purple/10 px-1 py-0.5 rounded">@username</code>, and link commentary directly to active prediction markets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Globe className="text-brand-purple" size={18} />
                  <span>Global Podium Leaderboards</span>
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Competitors are ranked dynamically by Net Portfolio Value, Accuracy Percentage, and Total Settled Trade Volume. Top forecasters gain global visibility and podium badges.
                </p>
              </div>

              <div className="bg-dark/60 border border-dark-border/60 p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="text-brand-blue" size={18} />
                  <span>Constructive Debate Standards</span>
                </h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Our community guidelines enforce respectful, data-backed discussion. Multi-account farming, spamming, or toxic behavior leads to account restrictions.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[11px] font-extrabold bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-md">
            READY TO TEST YOUR FORECASTING ACCURACY?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-display max-w-3xl mx-auto">
            Join the Wagr Prediction Exchange Today
          </h2>
          <p className="text-xs sm:text-base text-dark-muted font-medium max-w-2xl mx-auto leading-relaxed">
            Claim your 500 MXP welcome allocation, explore active markets, and see how your predictions compare against global crowd wisdom.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4 relative z-10">
            <Link
              to="/register"
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-brand-purple/30 hover:scale-[1.03] transition-all flex items-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/markets"
              className="bg-dark-card border border-dark-border/80 hover:border-brand-purple/50 text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-2xl transition-all"
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
