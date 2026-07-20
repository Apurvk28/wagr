import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Lock, Eye, Database, Globe, Trash2, Shield, AlertTriangle, FileText, CheckCircle2, Server, KeyRound, UserCheck, Download } from 'lucide-react';
import { exportPrivacyPolicyPDF } from '../utils/pdfExporter';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-extrabold bg-brand-success/10 text-brand-success border border-brand-success/25 px-3.5 py-1 rounded-full uppercase tracking-widest">
            Official Legal Document
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-4 leading-none">
            Privacy Policy<span className="text-brand-success">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted font-medium mt-2 mb-6">
            Last Updated: July 2026 &bull; Comprehensive specifications for user data protection, privacy controls, and security standards.
          </p>

          <button
            onClick={exportPrivacyPolicyPDF}
            className="bg-brand-success/15 hover:bg-brand-success/25 border border-brand-success/40 text-brand-success text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full inline-flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-brand-success/10"
          >
            <Download size={14} />
            <span>Download Privacy Policy PDF</span>
          </button>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-dark-card border border-dark-border/70 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-success/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
            <FileText className="text-brand-success" size={20} />
            <span>Executive Privacy Statement</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted leading-relaxed font-medium mb-4">
            At Wagr.io, we are committed to upholding transparency, security, and user data privacy. Because our prediction exchange operates exclusively on a virtual sandbox currency model (Market Exchange Points / MXP), we maintain a strict minimal data collection footprint. We do not process banking details, payment cards, or sensitive identity verification documents. This Privacy Policy details the precise mechanisms by which your electronic data is collected, stored, processed, and safeguarded when using Wagr.io.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-dark-border/40 text-[11px] font-bold text-white/90">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-success shrink-0" />
              <span>Zero Financial Record Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-success shrink-0" />
              <span>End-to-End Cryptographic Hashing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-brand-success shrink-0" />
              <span>Zero Third-Party Data Sales</span>
            </div>
          </div>
        </div>

        {/* Exhaustive Policy Sections */}
        <div className="space-y-8">
          
          {/* Section 1 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Database className="text-brand-purple shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                1. Information We Collect &amp; Data Classification
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              We collect information strictly necessary to operate the Wagr.io prediction exchange and community features. The categories of personal and technical data processed include:
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">A. Identity &amp; Account Credentials</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  When you register an account, we collect your Full Name, preferred Username, Email Address, and an encrypted hash of your chosen Account Password. Your password is encrypted prior to database storage using Bcrypt cryptographic algorithms and is never stored or transmitted in plaintext format.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">B. Virtual Portfolio &amp; Trading Histories</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  We log all virtual transactions occurring within the platform, including initial MXP welcome allocations, prediction positions opened or closed (YES / NO choices, invested amounts, entry probabilities), market resolution outcomes, and leaderboard rankings.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">C. Community Communications &amp; Forum Posts</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Any content you voluntarily submit in community discussion streams, including commentary, replies, user mentions (@username), post likes, and market linkages, is indexed and stored in our primary database to provide community interactions.
                </p>
              </div>
              <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-1">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">D. Technical Device Logs &amp; Metadata</h4>
                <p className="text-xs text-dark-muted leading-relaxed">
                  For security auditing and fraud prevention, our web servers automatically log device IP addresses, browser user-agent strings, HTTP request timestamps, and session token identifiers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Server className="text-brand-blue shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                2. Purpose &amp; Legal Basis for Processing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io processes your information under legitimate interest and contractual performance grounds to deliver our virtual forecasting platform. Specifically, data is used to:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed font-medium">
              <li>Authenticate your identity upon sign-in and maintain secure active sessions via JSON Web Tokens (JWT).</li>
              <li>Maintain real-time synchronization of your MXP virtual balance, portfolio valuation, and position P&amp;L stats.</li>
              <li>Calculate global leaderboard rankings, win rates, and prediction accuracy percentages dynamically based on settled event resolutions.</li>
              <li>Power the internal search engine allowing users to locate prediction topics, news briefs, and community profiles.</li>
              <li>Detect and prevent multi-account farming, spam posting, or automated platform exploitation attempts.</li>
              <li>Send critical system notifications regarding MXP request approvals, position settlements, or account security updates.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <KeyRound className="text-brand-success shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                3. Non-Financial Economy &amp; Zero Payment Processing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io is strictly a simulated educational forecasting exchange. Under no circumstances do we collect, process, request, or store:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-white/90">
              <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3 flex items-center space-x-2">
                <span className="text-brand-danger">✕</span>
                <span>Credit or Debit Card Numbers</span>
              </div>
              <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3 flex items-center space-x-2">
                <span className="text-brand-danger">✕</span>
                <span>Bank Account Details / Wire Transfers</span>
              </div>
              <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3 flex items-center space-x-2">
                <span className="text-brand-danger">✕</span>
                <span>Cryptocurrency Wallet Private Keys</span>
              </div>
              <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3 flex items-center space-x-2">
                <span className="text-brand-danger">✕</span>
                <span>Government Tax Identifiers / SSN</span>
              </div>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed pt-2">
              All references to points, trading, balances, returns, or wagers refer exclusively to Market Exchange Points (MXP). MXP holds zero real-world cash value, cannot be redeemed for fiat currency or physical goods, and cannot be transferred outside your personal account.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Eye className="text-amber-400 shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                4. Cookies &amp; Local Storage Technology
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              We utilize HTML5 Local Storage and minimal session cookie mechanisms to provide essential functionality:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed">
              <li>
                <strong className="text-white">Authentication State:</strong> We store an encrypted JWT auth token in browser local storage (`auth_token`) to allow seamless navigation without prompting re-authentication on every page refresh.
              </li>
              <li>
                <strong className="text-white">Zero Advertising Trackers:</strong> We do NOT employ ad-tracking pixels, third-party remarketing tags (e.g., Google Ads, Meta Pixel), or behavioral fingerprinting scripts.
              </li>
              <li>
                <strong className="text-white">Session Control:</strong> You can clear local storage data at any time via your browser settings, which will instantly terminate your active Wagr.io session.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Globe className="text-brand-purple shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                5. Third-Party Integrations &amp; Artificial Intelligence Processing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io leverages AI language models (such as Groq LLM completions) to automate news indexing, formulate event titles, and generate daily market briefings.
            </p>
            <div className="bg-dark/50 border border-dark-border/50 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Data Anonymization Guarantee</h4>
              <p className="text-xs text-dark-muted leading-relaxed">
                When communicating with external AI inference APIs, only public event titles, generic category names, and news headline strings are transmitted. <strong className="text-white">Zero personal user identifiers, email addresses, IP logs, or account metadata are ever shared with AI API providers.</strong>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <Shield className="text-brand-blue shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                6. Data Security &amp; Cryptographic Standards
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              We employ robust administrative, technical, and physical safeguards designed to protect your electronic information against unauthorized access, loss, or alteration:
            </p>
            <ul className="list-disc pl-5 text-xs text-dark-muted space-y-2 leading-relaxed">
              <li><strong className="text-white">TLS/SSL Encryption:</strong> All data in transit between your browser and Wagr.io servers is protected using 256-bit TLS transport encryption.</li>
              <li><strong className="text-white">Bcrypt Password Hashing:</strong> Passwords undergo salted Bcrypt hashing prior to storage in database collections.</li>
              <li><strong className="text-white">Access Control Protocols:</strong> Administrative database access is protected by multi-factor controls and strictly restricted to authorized engineering personnel.</li>
              <li><strong className="text-white">Automated Backups:</strong> Database states are backed up regularly to encrypted storage repositories with automated failure recovery.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <UserCheck className="text-brand-success shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                7. User Rights, Data Erasure &amp; Export
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Regardless of your geographic location, Wagr.io grants users full governance over their electronic data:
            </p>
            <div className="space-y-2 text-xs text-dark-muted">
              <p><strong className="text-white">Right to Access:</strong> You can view your full account profile, trade history, MXP requests, and community contributions directly within your user dashboard.</p>
              <p><strong className="text-white">Right to Correction:</strong> You can update your profile information at any time via account profile settings.</p>
              <p><strong className="text-white">Right to Erasure (Account Deletion):</strong> You may request complete account deletion by contacting support. Upon verification, your account record, active positions, comments, and profile data will be permanently scrubbed from production databases within 14 business days.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-dark-border/40 pb-4">
              <AlertTriangle className="text-orange-500 shrink-0" size={22} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                8. Protection of Minors &amp; Policy Revisions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Wagr.io is intended for general audiences. We do not knowingly collect personal data from children under the age of 13. If we discover an account registered by an individual under 13 without verified parental consent, we will purge the associated data immediately.
            </p>
            <p className="text-xs text-dark-muted leading-relaxed pt-2">
              We reserve the right to amend this Privacy Policy as our platform evolves. Any material changes will be reflected on this page with an updated "Last Modified" timestamp. Continued use of Wagr.io following revisions constitutes acceptance of the updated terms.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
