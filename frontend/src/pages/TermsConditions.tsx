import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldAlert, Cpu, Sparkles, Scale, Info, Globe, AlertCircle, FileText, CheckCircle2, Lock, Gavel, UserX, Download } from 'lucide-react';
import { exportTermsConditionsPDF } from '../utils/pdfExporter';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-extrabold bg-brand-danger/10 text-brand-danger border border-brand-danger/25 px-3.5 py-1 rounded-full uppercase tracking-widest">
            Binding Terms of Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-4 leading-none">
            Terms &amp; Conditions<span className="text-brand-danger">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted font-medium mt-2 mb-6">
            Last Updated: July 2026 &bull; Operational agreement, platform rules, and virtual exchange guidelines.
          </p>

          <button
            onClick={exportTermsConditionsPDF}
            className="bg-brand-danger/15 hover:bg-brand-danger/25 border border-brand-danger/40 text-brand-danger text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full inline-flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-brand-danger/10"
          >
            <Download size={14} />
            <span>Download Terms &amp; Conditions PDF</span>
          </button>
        </div>

        {/* Highlight Banner */}
        <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-danger/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
            <FileText className="text-brand-danger" size={20} />
            <span>Platform Usage Agreement Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium mb-4">
            Welcome to Wagr.io. By creating an account, accessing prediction contracts, trading virtual points, or interacting with community discussion streams, you agree to be bound by these Terms and Conditions. Wagr.io is a simulated prediction exchange built for educational, analytical, and social entertainment purposes. If you do not agree to every provision contained herein, you must refrain from accessing or using the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-dark-border/40 text-[11px] font-bold text-white/90">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-danger shrink-0" />
              <span>Zero Cash / Real Money Deposits</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-danger shrink-0" />
              <span>Non-Transferable Virtual MXP</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-danger shrink-0" />
              <span>Strict Code of Conduct Standards</span>
            </div>
          </div>
        </div>

        {/* Exhaustive Terms Sections */}
        <div className="space-y-8 text-sm text-dark-muted leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <ShieldAlert className="text-brand-danger shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                1. Absolute Virtual Currency Disclaimer (Zero Real Money Value)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io operates exclusively as a simulated forecasting marketplace. Market Exchange Points (MXP) serve as the sole medium of exchange within the platform. Users must strictly understand and accept the following binding virtual currency rules:
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">A. Zero Cash Value &amp; Non-Redeemability</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  MXP holds absolutely zero real-world cash, monetary, or economic value. Under no circumstances can MXP be converted, exchanged, withdrawn, or redeemed for fiat currency (USD, EUR, etc.), digital assets, cryptocurrencies, gift cards, or physical items.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">B. Prohibition of Secondary Markets &amp; Transfers</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  MXP points are strictly tied to individual user accounts. Selling, trading, bartering, or transferring MXP between user accounts—whether directly or via third-party secondary marketplaces—is strictly prohibited and will result in immediate permanent account termination.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">C. Terminology Clarification</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Any use of words such as "bet", "wager", "trade", "profit", "loss", "payout", "odds", or "balance" on Wagr.io refers solely to virtual point manipulations within our software sandbox and carries zero financial liability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Cpu className="text-brand-purple shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                2. AI Sentiment Engine &amp; Autonomous Market Simulation Declaration
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              To provide realistic liquidity depth and dynamic probability pricing, Wagr.io incorporates automated AI background processes and news sentiment integration:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2.5 leading-relaxed font-medium">
              <li>
                <strong className="text-white">Liquidity Pool Rebalancing:</strong> Automated sentiment routines may adjust YES/NO liquidity pools to simulate real-world market reactions to breaking news events within predefined safety bounds.
              </li>
              <li>
                <strong className="text-white">Short-Term Contract Volatility:</strong> Daily short-term prediction markets feature dynamic probability sensitivity designed to reflect fast-paced news shifts as resolution timers draw closer.
              </li>
              <li>
                <strong className="text-white">Outcome Integrity Safeguard:</strong> AI market sentiment simulations strictly influence probability pricing prior to expiration. AI routines DO NOT resolve final market outcomes. Final market resolutions are strictly governed by real-world event verification.
              </li>
              <li>
                <strong className="text-white">Balance Isolation:</strong> Autonomous sentiment algorithms are isolated from user balance calculations and cannot deduct MXP outside of explicit user trade submissions.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Scale className="text-brand-blue shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                3. Market Resolutions, Verification &amp; Cancellations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              All prediction markets listed on Wagr.io carry explicit resolution criteria specifying target dates, sources of truth, and binary outcome parameters:
            </p>
            <div className="space-y-3 text-xs text-dark-muted">
              <p><strong className="text-white">Official Settlement Protocol:</strong> Upon market expiration, designated administrators verify official news reports and resolve the contract to YES or NO. All correct position holders automatically receive proportional MXP payouts based on outcome odds.</p>
              <p><strong className="text-white">Ambiguity &amp; Event Cancellations:</strong> If a real-world event is cancelled, indefinitely postponed, or yields ambiguous results that cannot be conclusively verified, administrators will cancel the market. In such cases, all original invested MXP stakes are refunded to participants in full.</p>
              <p><strong className="text-white">Finality of Decisions:</strong> Administrative resolution decisions based on official primary sources are final and binding across the platform.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <UserX className="text-yellow-500 shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                4. User Code of Conduct, Anti-Abuse &amp; Account Suspensions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Users must maintain constructive and lawful behavior across all community streams and trading features. Wagr.io maintains zero tolerance for platform abuse:
            </p>
            <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Prohibited Actions:</h4>
              <ul className="list-disc pl-5 text-xs text-dark-muted space-y-1.5 leading-relaxed">
                <li>Posting hateful, harassing, discriminatory, pornographic, or illegal content in community discussion feeds.</li>
                <li>Creating multiple fake or automated accounts to farm initial MXP allocations or manipulate leaderboard rankings.</li>
                <li>Attempting to exploit software glitches, race conditions, or API flaws to falsify MXP balances or position metrics.</li>
                <li>Using automated bots or scraping tools without prior written administrative authorization.</li>
              </ul>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              Violations will result in formal warnings, comment deletions, temporary account suspensions, or permanent banishment from Wagr.io at the sole discretion of platform administrators.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Lock className="text-brand-success shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                5. Admin MXP Credit Requests &amp; Wallet Provisions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Newly registered users receive a welcome allocation of 10,000 MXP. Should your virtual balance diminish through prediction activity, users may submit formal credit requests via the `/wallet` portal specifying requested amounts and operational reasons:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed">
              <li><strong className="text-white">Admin Discretion:</strong> Credit request approvals are handled at the sole discretion of platform administrators based on active user engagement and request validity.</li>
              <li><strong className="text-white">Non-Entitlement:</strong> Submission of an MXP credit request does not guarantee approval. Abuse of credit requests may lead to request throttling.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Globe className="text-brand-purple shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                6. Intellectual Property &amp; Content Licensing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              All proprietary branding, logos, software source code, design systems, UI components, vinyl player integrations, and AI news synthesis algorithms are the exclusive intellectual property of Wagr.io.
            </p>
            <p className="text-xs text-dark-muted leading-relaxed">
              By posting comments, insights, or market linkages in community feeds, you grant Wagr.io a perpetual, non-exclusive, worldwide, royalty-free license to host, display, index, and format your content for platform operations.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <AlertCircle className="text-orange-500 shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                7. Limitation of Liability &amp; Disclaimers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
            </p>
            <p className="text-xs text-dark-muted leading-relaxed">
              In no event shall the creators, developers, or operators of Wagr.io be liable for any direct, indirect, incidental, or consequential damages arising from service interruptions, database downtime, lost virtual MXP points, inaccurate AI news summaries, or reliance on forecasting probabilities displayed on the platform.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Gavel className="text-brand-blue shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                8. Governing Terms &amp; Amendments
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              We reserve the right to revise or update these Terms &amp; Conditions at any time. Continued usage of Wagr.io following publication of updated terms signifies your agreement to comply with the revised agreement.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
