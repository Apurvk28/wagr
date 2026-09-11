import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShieldAlert, Cpu, Scale, Globe, AlertCircle, FileText, CheckCircle2, 
  Lock, Gavel, UserX, Download, ShieldCheck
} from 'lucide-react';
import { exportTermsConditionsPDF } from '../utils/pdfExporter';
import { AnimatedBorderButton } from '../components/ui/AnimatedBorderButton';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in font-sans text-dark-muted selection:bg-brand-danger/30 selection:text-white">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Document Header */}
        <div className="text-center mb-14 space-y-4">
          <span className="text-[10px] font-extrabold bg-brand-danger/10 text-brand-danger border border-brand-danger/25 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
            BINDING PLATFORM USAGE AGREEMENT ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-display">
            Terms &amp; Conditions<span className="text-brand-danger">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted font-medium max-w-2xl mx-auto leading-relaxed">
            Effective Date: July 2026 &bull; Version 4.5 &bull; Operational agreement, virtual points governance, AMM liquidity simulation rules, and platform code of conduct.
          </p>

          <div className="pt-2">
            <AnimatedBorderButton
              onClick={exportTermsConditionsPDF}
              className="!px-6 !py-3 text-xs text-brand-danger shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Download size={15} />
              <span>Download Official Terms &amp; Conditions PDF</span>
            </AnimatedBorderButton>
          </div>
        </div>

        {/* Master Operating Agreement Overview Banner */}
        <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-danger/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mb-3 flex items-center space-x-2.5">
            <FileText className="text-brand-danger" size={24} />
            <span>Master Platform Operating Agreement Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium mb-6">
            Welcome to Wagr.io. By registering an account, placing virtual predictions, requesting MXP credit allocations, or interacting with community feeds, you agree to be bound by these Terms &amp; Conditions. Wagr.io is a simulated prediction exchange built strictly for educational, analytical, and social entertainment purposes. If you do not agree with every provision herein, you must refrain from accessing or using the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dark-border/40 text-[11px] font-bold text-white/90">
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-danger shrink-0" />
              <span>Zero Cash / Real Money Liabilities</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-danger shrink-0" />
              <span>Non-Transferable Virtual MXP Points</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-danger shrink-0" />
              <span>Strict Anti-Abuse Code of Conduct</span>
            </div>
          </div>
        </div>

        {/* 12 Exhaustive Terms Sections */}
        <div className="space-y-8 text-sm text-dark-muted leading-relaxed font-medium">
          
          {/* Section 1 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-danger/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <ShieldAlert className="text-brand-danger shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                1. Absolute Virtual Currency Disclaimer (Zero Real Money Value)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io operates exclusively as a simulated forecasting exchange. Market Exchange Points (MXP) serve as the sole medium of exchange within the platform. Users must strictly accept the following binding virtual currency rules:
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">A. Zero Cash Value &amp; Non-Redeemability</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  MXP holds zero real-world monetary or cash value. Under no circumstances can MXP be converted, exchanged, withdrawn, or redeemed for fiat currency (USD, EUR, etc.), digital assets, cryptocurrencies, gift cards, or physical items.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">B. Prohibition of Secondary Markets &amp; Transfers</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  MXP points are strictly tied to individual user accounts. Selling, bartering, trading, or transferring MXP between user accounts — whether directly or via third-party secondary marketplaces — is strictly prohibited and leads to immediate permanent account termination.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">C. Terminology Clarification</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Any use of words such as "bet", "wager", "trade", "profit", "loss", "payout", "odds", or "balance" on Wagr.io refers solely to virtual point manipulations within our software sandbox and carries zero financial liability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <UserX className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                2. User Eligibility, Account Registration &amp; Credential Security
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              To register an account on Wagr.io, you represent and warrant that you meet all eligibility criteria:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed">
              <li>You are at least 18 years of age (or the legal age of majority in your jurisdiction).</li>
              <li>You will provide accurate, truthful registration information (Full Name, Username, Email).</li>
              <li>You are responsible for maintaining the confidentiality of your sign-in credentials and password.</li>
              <li>Creating multiple accounts for the purpose of farming MXP welcome allocations or manipulating leaderboards is strictly prohibited.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Cpu className="text-brand-blue shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                3. Automated Market Maker (AMM) Mechanics &amp; Virtual Pool Buffer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io utilizes an Automated Market Maker (AMM) algorithm incorporating a virtual buffer constant ($C = 1000$ MXP) on both YES and NO sides of prediction contracts:
            </p>
            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Smooth Probability Bonding Curves:</h4>
              <p className="text-xs text-dark-muted leading-relaxed">
                The AMM establishes dynamic payout multipliers based on pool depth while preventing severe price impact from single large trades. Odds automatically rebalance as users buy or sell YES/NO shares. You acknowledge that AMM probability and payout adjustments are conducted solely for entertainment and gamified simulation.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-dark-card border-2 border-brand-purple/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Cpu className="text-brand-purple shrink-0" size={26} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                4. AI Market Simulation &amp; Probability Adjustments Disclosure (Binding Notice)
              </h2>
            </div>

            {/* High-visibility Callout Banner */}
            <div className="bg-brand-purple/15 border border-brand-purple/40 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-brand-purple font-black text-xs uppercase tracking-wider">
                <AlertCircle size={16} />
                <span>PROMINENT LEGAL DISCLOSURE — AUTOMATED AI MARKET MANIPULATION &amp; SENTIMENT ADJUSTMENT</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-semibold">
                Wagr.io utilizes Artificial Intelligence (AI) algorithms, Large Language Models (LLM microservices), and automated background agents to analyze news feeds, simulate probability movements, generate new market proposals, and dynamically adjust YES/NO contract liquidity pools and market probabilities.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              By accessing or trading on Wagr.io, users explicitly acknowledge, understand, and agree to the following AI integration terms:
            </p>

            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2.5 leading-relaxed font-medium">
              <li><strong className="text-white">AI-Driven Probability Adjustments:</strong> AI sentiment algorithms continuously evaluate breaking news and market momentum, automatically adjusting contract odds and liquidity pool ratios prior to market resolution.</li>
              <li><strong className="text-white">Synthetic Market Sentiment:</strong> Contract probabilities displayed on Wagr.io reflect a combination of user trade volumes and automated AI sentiment simulations.</li>
              <li><strong className="text-white">Grounding in Verifiable Facts:</strong> While AI routines dynamically simulate probability fluctuations prior to expiration, final outcome resolutions (YES/NO settlement) remain strictly grounded in verifiable real-world primary sources and are verified by administrators.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Scale className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                5. Market Resolutions, Primary Sources &amp; Settlement Protocols
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              All prediction contracts specify target resolution dates, sources of truth, and binary outcome parameters:
            </p>
            <div className="space-y-2 text-xs text-dark-muted">
              <p><strong className="text-white">Official Settlement Protocol:</strong> Upon expiration, designated administrators verify official news reports and resolve contracts to YES or NO. Correct position holders automatically receive proportional MXP payouts based on odds.</p>
              <p><strong className="text-white">Finality of Decisions:</strong> Administrative resolution decisions based on primary official sources are final across the platform.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-amber-400/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <AlertCircle className="text-amber-400 shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                6. Ambiguous Events, Postponements, Cancellations &amp; Refund Policy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              If a real-world event is cancelled, indefinitely postponed, or yields ambiguous results that cannot be conclusively verified, administrators will cancel the market. In such cases, all original invested MXP stakes are refunded to participants in full.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-danger/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <UserX className="text-brand-danger shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                7. User Code of Conduct, Anti-Abuse &amp; Account Termination
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Users must maintain respectful behavior in all community feeds. Prohibited activities include:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-1.5 leading-relaxed">
              <li>Posting hateful, harassing, discriminatory, pornographic, or illegal content.</li>
              <li>Creating multiple accounts to farm MXP or manipulate leaderboard rankings.</li>
              <li>Attempting to exploit software glitches or API vulnerabilities to falsify balances.</li>
              <li>Using automated scraping bots without prior written administrative authorization.</li>
            </ul>
            <p className="text-xs text-dark-muted pt-2">
              Violations lead to content deletion, temporary suspensions, or permanent banishment at administrative discretion.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-success/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Lock className="text-brand-success shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                8. Wallet Credit Requests &amp; Admin Allocation Discretion
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Newly registered users receive 500 MXP. Should your virtual balance diminish, users may submit credit top-up requests via `/wallet`. Approvals are handled at the sole discretion of platform administrators based on active user engagement.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Globe className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                9. Intellectual Property &amp; User Content Licensing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              All proprietary branding, logos, software code, UI components, vinyl player integrations, and AI news algorithms belong exclusively to Wagr.io. By posting commentary in social streams, you grant Wagr a royalty-free, worldwide license to display and format your content for platform operations.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-amber-400/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <AlertCircle className="text-amber-400 shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                10. Limitation of Liability &amp; "AS IS" Warranty Disclaimer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Developers carry zero liability for database downtime, lost virtual points, inaccurate AI news summaries, or reliance on forecasting probabilities displayed on the exchange.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <ShieldCheck className="text-brand-blue shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                11. User Indemnification Agreement
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              You agree to indemnify, defend, and hold harmless Wagr.io, its creators, operators, and developers from any claims, damages, liabilities, or expenses arising from your violation of these Terms &amp; Conditions or platform misuse.
            </p>
          </section>

          {/* Section 12 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-danger/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Gavel className="text-brand-danger shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                12. Governing Law, Amendments &amp; Binding Dispute Resolution
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              We reserve the right to revise or update these Terms &amp; Conditions at any time. Continued usage of Wagr.io following publication of updated terms signifies your agreement to comply with the revised terms.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
