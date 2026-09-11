import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Eye, Database, Globe, Shield, AlertTriangle, FileText, CheckCircle2, 
  Server, KeyRound, UserCheck, Download, RefreshCw, Layers, Mail, Cpu
} from 'lucide-react';
import { exportPrivacyPolicyPDF } from '../utils/pdfExporter';
import { AnimatedBorderButton } from '../components/ui/AnimatedBorderButton';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in font-sans text-dark-muted selection:bg-brand-success/30 selection:text-white">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Document Header */}
        <div className="text-center mb-14 space-y-4">
          <span className="text-[10px] font-extrabold bg-brand-success/10 text-brand-success border border-brand-success/25 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
            OFFICIAL DATA PROTECTION &amp; PRIVACY SPECIFICATION ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-display">
            Privacy Policy<span className="text-brand-success">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted font-medium max-w-2xl mx-auto leading-relaxed">
            Effective Date: July 2026 &bull; Version 4.0 &bull; Exhaustive specifications governing user data protection, algorithmic boundary controls, cryptographic hashing, and privacy rights across Wagr.io.
          </p>

          <div className="pt-2">
            <AnimatedBorderButton
              onClick={exportPrivacyPolicyPDF}
              className="!px-6 !py-3 text-xs text-brand-success shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Download size={15} />
              <span>Download Official Privacy Policy PDF</span>
            </AnimatedBorderButton>
          </div>
        </div>

        {/* Executive Privacy Statement Banner */}
        <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-success/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mb-3 flex items-center space-x-2.5">
            <FileText className="text-brand-success" size={24} />
            <span>Executive Privacy Statement &amp; Commitment</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium mb-6">
            At Wagr.io, we believe user data privacy is a fundamental digital right. Because our prediction exchange operates exclusively on a virtual sandbox points model (Market Exchange Points / MXP), we maintain a strictly minimal data collection footprint. We do not accept, process, or store credit cards, bank accounts, or sensitive identity verification documents. This Privacy Policy details the exact specifications by which your data is processed, safeguarded, and governed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dark-border/40 text-[11px] font-bold text-white/90">
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-success shrink-0" />
              <span>Zero Banking / Payment Card Records</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-success shrink-0" />
              <span>End-to-End Cryptographic Protection</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-dark/50 p-3.5 rounded-xl border border-dark-border/40">
              <CheckCircle2 size={16} className="text-brand-success shrink-0" />
              <span>Zero Third-Party Data Monetization</span>
            </div>
          </div>
        </div>

        {/* 12 Exhaustive Policy Sections */}
        <div className="space-y-8">
          
          {/* Section 1 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-success/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Database className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                1. Information We Collect &amp; Data Classification Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              We collect information strictly necessary to provide the Wagr.io forecasting platform, maintain real-time MXP portfolio tracking, and facilitate community discussion streams:
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">A. Identity &amp; Authentication Credentials</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Upon registration, we collect your Full Name, preferred Username, Email Address, and an encrypted hash of your Password. Passwords undergo salted Bcrypt cryptographic hashing before database storage and are never stored or transmitted in plaintext.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">B. Virtual Portfolio &amp; Trading Telemetry</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  We log all virtual sandbox interactions, including initial welcome allocations, open/closed prediction positions (YES/NO choices, invested MXP amounts, entry probabilities), market resolution outcomes, and leaderboard rankings.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">C. Community Posts &amp; Forum Commentary</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Any content you voluntarily publish in community streams — including comments, replies, user mentions (@username), post likes, and market linkages — is indexed in our database to display community interactions.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">D. Technical Logs &amp; Security Telemetry</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  For security auditing, rate-limiting, and fraud prevention, our web servers log IP addresses, browser user-agent strings, HTTP request timestamps, and JSON Web Token (JWT) session IDs.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Server className="text-brand-blue shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                2. Purpose &amp; Lawful Basis for Data Processing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io processes data under Legitimate Interest and Contractual Performance grounds (GDPR Article 6) to deliver our simulated forecasting ecosystem:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2.5 leading-relaxed font-medium">
              <li>Authenticate sign-in requests and maintain active user sessions via secure `httpOnly` JWT cookies (`wagr_jwt`).</li>
              <li>Maintain real-time synchronization of your MXP virtual balance, active position P&amp;L stats, and trade history logs.</li>
              <li>Compute global leaderboard rankings, win rates, and prediction accuracy percentages based on settled resolutions.</li>
              <li>Power the internal search engine allowing users to locate prediction topics, news briefings, and community profiles.</li>
              <li>Detect and prevent multi-account farming, spam posting, bot automation, or platform exploitation.</li>
              <li>Deliver essential system updates regarding wallet requests, position settlements, or security notifications.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-success/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <KeyRound className="text-brand-success shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                3. Non-Financial Economy &amp; Zero Payment Processing Guarantee
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io is strictly a simulated educational prediction exchange. Under no circumstances do we collect, process, or store:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-white/90">
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-3.5 flex items-center space-x-2.5">
                <span className="text-brand-danger font-bold text-sm">✕</span>
                <span>Credit or Debit Card Numbers</span>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-3.5 flex items-center space-x-2.5">
                <span className="text-brand-danger font-bold text-sm">✕</span>
                <span>Bank Account Details / Wire Routing Numbers</span>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-3.5 flex items-center space-x-2.5">
                <span className="text-brand-danger font-bold text-sm">✕</span>
                <span>Cryptocurrency Private Keys or Wallet Seeds</span>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-3.5 flex items-center space-x-2.5">
                <span className="text-brand-danger font-bold text-sm">✕</span>
                <span>Social Security Numbers / Tax Identifiers</span>
              </div>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed pt-2 font-medium">
              All references to points, trading, balances, returns, or wagers refer exclusively to Market Exchange Points (MXP). MXP holds zero real-world cash value, cannot be redeemed for fiat currency or physical assets, and cannot be transferred outside your account.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Shield className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                4. Cryptographic Security Standards &amp; Infrastructure Safeguards
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              We employ military-grade technical, administrative, and physical security measures to safeguard user data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="bg-dark/50 border border-dark-border/50 p-4 rounded-2xl space-y-1">
                <h4 className="font-extrabold text-white uppercase tracking-wider">256-Bit TLS/SSL Encryption</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  All data in transit between client browsers and server endpoints is protected using modern TLS 1.3 encryption.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-4 rounded-2xl space-y-1">
                <h4 className="font-extrabold text-white uppercase tracking-wider">Salted Bcrypt Password Hashing</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  Passwords undergo 10-round salted Bcrypt hashing prior to storage in database collections.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-4 rounded-2xl space-y-1">
                <h4 className="font-extrabold text-white uppercase tracking-wider">httpOnly Cookie Authorization</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  User authentication is secured via `httpOnly` double-cookie flags (`wagr_jwt`), protecting sessions against XSS token theft.
                </p>
              </div>

              <div className="bg-dark/50 border border-dark-border/50 p-4 rounded-2xl space-y-1">
                <h4 className="font-extrabold text-white uppercase tracking-wider">MongoDB Atlas Security</h4>
                <p className="text-dark-muted text-[11px] leading-relaxed">
                  Production data is stored in isolated MongoDB Atlas clusters with automated encrypted backups and IP whitelisting.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-dark-card border-2 border-brand-success/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-success/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Cpu className="text-brand-success shrink-0" size={26} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                5. Artificial Intelligence (AI) Market Simulation &amp; Data Boundary Policy
              </h2>
            </div>

            {/* High-visibility Callout Banner */}
            <div className="bg-brand-success/15 border border-brand-success/40 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-brand-success font-black text-xs uppercase tracking-wider">
                <AlertTriangle size={16} />
                <span>AI MARKET SIMULATION &amp; SENTIMENT ADJUSTMENT DISCLOSURE</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-semibold">
                Wagr.io incorporates Artificial Intelligence (AI) microservices and Large Language Model (LLM) completion pipelines to index real-world news feeds, formulate market contract proposals, and autonomously simulate market probability shifts based on real-time news sentiment.
              </p>
            </div>

            <div className="bg-dark/50 border border-dark-border/50 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">AI API Boundary &amp; Privacy Isolation Guarantee:</h4>
              <p className="text-xs text-dark-muted leading-relaxed">
                While AI agents process news sentiment and adjust simulated probability metrics across prediction contracts, external AI processing pipelines strictly evaluate public data (headlines, market titles, and topic categories). <strong className="text-white">Zero Personal Identifiable Information (PII), email addresses, passwords, IP logs, or personal account metadata are ever transmitted to or processed by third-party AI API providers.</strong>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Layers className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                6. Automated Market Maker (AMM) Data Isolation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Our Automated Market Maker algorithm adjusts YES/NO odds based on liquidity pool balances ($C = 1000$ MXP). The AMM operates statelessly on aggregated pool totals and carries zero access to individual user profile information, IP logs, or personal account settings.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-amber-400/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Eye className="text-amber-400 shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                7. Cookies, Local Storage Telemetry &amp; Zero Ad-Tracker Guarantee
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              We utilize session cookies and minimal browser telemetry exclusively to provide core platform functionality:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed font-medium">
              <li><strong className="text-white">Session Authentication:</strong> We issue an `httpOnly` secure cookie (`wagr_jwt`) to maintain your session across page refreshes.</li>
              <li><strong className="text-white">Zero Advertising Trackers:</strong> We do NOT use advertising cookies, Google Remarketing pixels, Meta Pixels, or behavioral fingerprinting scripts.</li>
              <li><strong className="text-white">User Storage Control:</strong> You can clear browser cookies at any time, which immediately logs out your active session.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-success/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <RefreshCw className="text-brand-success shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                8. Data Retention Schedule &amp; Archival Schedules
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Account credentials, trade records, and forum contributions are retained as long as your account remains active. Server access logs are automatically rotated and purged after 90 days.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-purple/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <UserCheck className="text-brand-purple shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                9. User Data Rights &amp; Permanent Account Erasure (Right to be Forgotten)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Regardless of geographic residence, all Wagr users hold comprehensive rights over their data under GDPR and CCPA guidelines:
            </p>
            <div className="space-y-3 text-xs text-dark-muted">
              <p><strong className="text-white">Right to Access:</strong> Inspect your profile, trade history, MXP requests, and post logs via your dashboard.</p>
              <p><strong className="text-white">Right to Rectification:</strong> Edit profile information anytime via account settings.</p>
              <p><strong className="text-white">Right to Erasure:</strong> Request complete account deletion by contacting support. Upon verification, your profile, positions, comments, and transaction logs will be permanently scrubbed from production databases within 14 business days.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Globe className="text-brand-blue shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                10. International Transfers &amp; Global Infrastructure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io operates on secure global cloud infrastructure. Data is processed using industry-standard Data Processing Addendums (DPAs) and Standard Contractual Clauses (SCCs) to ensure cross-border compliance.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-danger/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <AlertTriangle className="text-brand-danger shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                11. Protection of Minors &amp; Children's Online Privacy (COPPA)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              Wagr.io is intended for general audiences aged 18 and older (or legal majority). We do not knowingly collect personal data from children under 13. Accounts discovered to belong to minors under 13 will be purged immediately.
            </p>
          </section>

          {/* Section 12 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 hover:border-brand-success/30 transition-all">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Mail className="text-brand-success shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                12. Data Protection Officer (DPO) Contact &amp; Escalation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium">
              For privacy inquiries, data export requests, or erasure submissions, please contact our dedicated Data Protection Officer via <span className="text-white font-bold">privacy@wagr.io</span> or submit a ticket via our Contact Support portal.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
