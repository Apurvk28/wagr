import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Clock, ShieldAlert, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const ContactSupport: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const supportFaqs = [
    {
      q: 'How do I replenish my MXP balance if it reaches zero?',
      a: 'Regular users start with 500 MXP. If your balance runs low, you can unlock achievements or gain daily virtual bonuses when implemented. Admin users can adjust balance using the wallet controls in the header.',
    },
    {
      q: 'How long does it take for a prediction market to resolve?',
      a: 'Prediction markets resolve once their resolution date passes and the outcome is verified by administrators. This usually happens within a few hours of the real-world event concluding.',
    },
    {
      q: 'I found a bug. Where should I report it?',
      a: 'Please send bug reports containing screenshot links, your browser specs, and steps to reproduce to support@wagr.io or submit them using the support form below.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Help Center
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-4 leading-none">
            Contact Support<span className="text-brand-blue">.</span>
          </h1>
          <p className="text-sm text-dark-muted mt-2">We are here to help you solve platform issues or report suggestions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Support Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="text-brand-purple" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Support Email</h3>
              </div>
              <p className="text-xs text-brand-purple font-semibold">support@wagr.io</p>
              <p className="text-[11px] text-dark-muted mt-1 leading-relaxed">
                Direct queries related to account verification, API issues, or administrator moderation.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="text-brand-success" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Expected Response</h3>
              </div>
              <p className="text-xs text-white font-bold">Within 24 Hours</p>
              <p className="text-[11px] text-dark-muted mt-1 leading-relaxed">
                Our support team is active Monday through Friday. We resolve critical bug reports and resolution audits on priority.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-3">
                <ShieldAlert className="text-brand-danger" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bug Reports</h3>
              </div>
              <p className="text-[11px] text-dark-muted leading-relaxed">
                Please attach detailed details including:
              </p>
              <ul className="list-disc pl-4 text-[10px] text-dark-muted mt-1.5 space-y-1">
                <li>Console logs screenshot links</li>
                <li>Your account username</li>
                <li>Device &amp; screen viewport width</li>
              </ul>
            </div>
          </div>

          {/* Form & Support FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form */}
            <div className="bg-dark-card border border-dark-border/60 rounded-3xl p-8">
              <h2 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
                <MessageSquare size={16} className="text-brand-blue" />
                <span>Submit Ticket</span>
              </h2>

              {submitted ? (
                <div className="bg-brand-success/10 border border-brand-success/30 rounded-2xl p-6 text-center animate-fade-in">
                  <CheckCircle2 className="text-brand-success mx-auto mb-3" size={28} />
                  <p className="text-sm font-bold text-white mb-1">Message Received!</p>
                  <p className="text-xs text-dark-muted">We have queued your ticket. A support agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-dark-muted uppercase mb-1.5">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/70 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-dark-muted uppercase mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/70 transition-colors"
                        placeholder="yourname@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dark-muted uppercase mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/70 transition-colors"
                      placeholder="Summary of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dark-muted uppercase mb-1.5">Message Body</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/70 transition-colors resize-none"
                      placeholder="Please explain the details of the issue..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-bold rounded-xl py-3 shadow-lg shadow-brand-purple/10 transition-opacity"
                  >
                    <Send size={12} />
                    <span>Send Ticket</span>
                  </button>
                </form>
              )}
            </div>

            {/* Support FAQs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Frequently Asked Support FAQs</h3>
              <div className="space-y-3">
                {supportFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-dark-card border border-dark-border/60 rounded-xl p-5">
                    <p className="text-xs font-bold text-white mb-1.5">❓ {faq.q}</p>
                    <p className="text-xs text-dark-muted leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactSupport;
