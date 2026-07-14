import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Lock, Eye, Database, Globe, Trash2, Shield, AlertTriangle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: <Database className="text-brand-purple" size={18} />,
      title: 'Information We Collect',
      desc: 'Wagr.io collects account registration data necessary to provide prediction exchange services. This includes your name, username, email address, and encrypted password hash. Since Wagr operates entirely as a sandbox virtual currency economy, we do NOT collect financial details, bank accounts, billing records, or credit card numbers. Your balance updates and trading history are recorded purely on our secure database servers.',
    },
    {
      icon: <Lock className="text-brand-blue" size={18} />,
      title: 'Authentication Data Security',
      desc: 'Your access credentials are securely guarded. Passwords are encrypted before database insertion using Bcrypt hashing algorithms. We use JSON Web Tokens (JWT) for secure authentication. Tokens are stored locally on your device and are never sent over unencrypted channels. We carry out automatic token expiration audits to safeguard active sessions.',
    },
    {
      icon: <Eye className="text-brand-success" size={18} />,
      title: 'Cookies & Local Storage',
      desc: 'We use local storage keys (such as auth token key) and small browser files to maintain user sessions and store state configurations. This helps keep track of your session so you do not have to re-enter details on page loads. Third-party advertisement trackers, telemetry packages, and targeting scripts are strictly disabled on Wagr.io.',
    },
    {
      icon: <Globe className="text-yellow-500" size={18} />,
      title: 'Third-Party Services',
      desc: 'Wagr.io utilizes AI engines (such as Groq completions API) to generate event news briefing content and evaluate probability impacts. No personal identifiers or user credentials are shared with these external AI systems. The only information shared consists of generic prediction market titles and categories for news matching.',
    },
    {
      icon: <Trash2 className="text-brand-danger" size={18} />,
      title: 'Data Retention & Account Deletion',
      desc: 'We retain your personal information for as long as your account is active. If you wish to delete your account, you can make a request to our support desk. Upon confirmation, all your credentials, transaction history, liked posts, and statistics will be permanently scrubbed from our active databases within 14 business days.',
    },
    {
      icon: <Shield className="text-brand-purple" size={18} />,
      title: 'Information Security Audits',
      desc: 'We implement standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data. All traffic to and from the Wagr server is encrypted via SSL/TLS. Database files are backed up daily using encrypted object storage with access strictly limited to administrators.',
    },
    {
      icon: <AlertTriangle className="text-orange-500" size={18} />,
      title: 'Children\'s Online Privacy Protection',
      desc: 'Wagr.io does not knowingly collect or solicit personal information from children under the age of 13. If we discover that we have collected information from a child under 13 without verification of parental consent, we will delete that account immediately. Parents are encouraged to monitor their children\'s online activity.',
    }
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold bg-brand-success/10 text-brand-success border border-brand-success/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Legal Document
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-4 leading-none">
            Privacy Policy<span className="text-brand-success">.</span>
          </h1>
          <p className="text-sm text-dark-muted mt-2">Last Updated: July 2026 &bull; Rules for protecting your electronic records</p>
        </div>

        <div className="bg-dark-card border border-dark-border/60 rounded-3xl p-8 mb-8">
          <p className="text-xs text-dark-muted leading-relaxed">
            At Wagr.io, we prioritize user privacy. Since our exchange operates purely on a virtual economy (using simulated points), we maintain a minimal data footprint. We collect only what is functionally required to secure your account, track your prediction portfolio, and support collaborative community activities. By registering on Wagr, you consent to the data practices outlined in this policy.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 hover:border-dark-border transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                {sec.icon}
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{sec.title}</h3>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
