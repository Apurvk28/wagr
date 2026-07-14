import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldAlert, Cpu, Sparkles, Scale, Info, Globe, AlertCircle } from 'lucide-react';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold bg-brand-danger/10 text-brand-danger border border-brand-danger/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Legal Terms &amp; Conditions
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-4 leading-none">
            Terms of Service<span className="text-brand-danger">.</span>
          </h1>
          <p className="text-sm text-dark-muted mt-2">Last Updated: July 2026 &bull; Operational guidelines and user disclaimers</p>
        </div>

        <div className="space-y-8 text-sm text-dark-muted leading-relaxed">
          {/* Section 1: Virtual Currency Disclaimer */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 hover:border-brand-danger/20 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <ShieldAlert className="text-brand-danger animate-pulse" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. No Real Money / Virtual Currency Disclaimer</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed mb-3">
              Wagr.io operates exclusively as a prediction simulation environment. The virtual currency, Market Exchange Points (MXP), holds absolutely no monetary value, cannot be redeemed for fiat currency, digital tokens, or items of real-world value, and cannot be transferred between user accounts.
            </p>
            <p className="text-xs text-dark-muted leading-relaxed">
              Users are credited with 500 MXP upon email verification. Any reference to "wagers", "profits", "losses", or "trading volume" is strictly virtual and intended solely for platform gamification, forecasting practice, and leaderboard rankings.
            </p>
          </section>

          {/* Section 2: AI Market Simulation Transparency */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 border-l-brand-purple border-l-2">
            <div className="flex items-center space-x-3 mb-3">
              <Cpu className="text-brand-purple" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. AI-Assisted Market Simulation Declaration</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed mb-3">
              To provide a realistic and engaging prediction exchange environment, Wagr.io utilizes AI agents and automated background jobs to simulate market sentiment and buying/selling activities:
            </p>
            <ul className="list-disc pl-4 text-xs text-dark-muted space-y-2 mb-3">
              <li>
                **Controlled Fluctuation:** The AI may programmatically adjust YES or NO liquidity pools within predefined, controlled bounds to simulate market momentum, excitement, and reaction to breaking news.
              </li>
              <li>
                **Volatile Short-Term Behavior:** Daily short-term markets are configured for higher volatility, meaning AI-driven adjustments react more strongly to linked daily news briefings.
              </li>
              <li>
                **Outcome Security:** AI-driven simulated sentiment does not decide final market outcomes. Final resolutions always depend on verified, real-world events approved by human administrators.
              </li>
              <li>
                **Safety Limits:** AI agents are strictly restricted from manipulating user balances, position payouts, or portfolio stats.
              </li>
            </ul>
          </section>

          {/* Section 3: Administrator-Controlled Resolutions */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Scale className="text-brand-blue" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Market Resolutions</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              All prediction contracts are resolved based on verified news outcomes. Administrators are responsible for verifying real-world event resolutions and settling contracts to either YES or NO. In the case of cancelled events or ambiguous resolution details, the market is cancelled, and all original user stakes are refunded in full. Decisions made by administrators regarding contract resolutions are final and binding.
            </p>
          </section>

          {/* Section 4: Community Moderation & Account Suspension */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Info className="text-yellow-500" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. User Account Suspension &amp; Rules</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed mb-3">
              Users participate in community discussion threads under clean code-of-conduct guidelines. Administrators reserves the right to suspend or block access to accounts that engage in:
            </p>
            <ul className="list-disc pl-4 text-xs text-dark-muted space-y-1">
              <li>Hateful, abusive, or threatening comments in community forums.</li>
              <li>Exploiting platform software bugs to manipulate balances or stats.</li>
              <li>Creating duplicate accounts to farm virtual currency.</li>
            </ul>
          </section>

          {/* Section 5: Intellectual Property & Content Ownership */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="text-brand-success" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">5. Intellectual Property &amp; Content Ownership</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              All original graphics, interface elements, styling systems, and AI-generated news briefs or contract summaries displayed on Wagr.io are the intellectual property of the Wagr team. User-submitted posts or comments in the community feed remain the property of the poster, but by submitting content, you grant Wagr a non-exclusive, royalty-free license to display, host, and index your content across the platform.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle className="text-orange-500" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">6. Limitation of Liability</h2>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              Wagr.io is provided on an "as-is" and "as-available" basis. We offer no warranties, express or implied, regarding system uptime, database integrity, correctness of probabilities, or automated AI sentiment activities. In no event shall the developers, contributors, or administrators of Wagr.io be liable for any claims, damages, or losses (virtual or otherwise) resulting from system malfunctions, data corruption, or temporary service downtime.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
