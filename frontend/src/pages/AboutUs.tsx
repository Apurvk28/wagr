import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Eye, ShieldAlert, Award, TrendingUp, Users } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between animate-fade-in">
      <Navbar />

      <div className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Our Mission &amp; Philosophy
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-4 leading-none">
            About Wagr<span className="text-brand-blue">.io</span>
          </h1>
          <p className="text-sm text-dark-muted mt-2 max-w-xl mx-auto">
            Wagr is an AI-powered social prediction exchange allowing users to forecast and trade outcomes of real-world events.
          </p>
        </div>

        <div className="space-y-12 text-sm text-dark-muted leading-relaxed">
          {/* Section 1: Philosophy */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-8 hover:border-brand-purple/20 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="text-brand-purple" size={20} />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">The Philosophy: "The Future Has Odds"</h2>
            </div>
            <p className="mb-4">
              Every future event carries inherent uncertainty. Instead of relying solely on isolated opinions or speculative hearsay, Wagr converts predictions into measurable probabilities. By trading YES and NO contracts, the collective intelligence of the community actively shapes market prices in real time.
            </p>
            <p>
              We believe forecasting should be structured, accountable, and educational. By tracking your historical win rates and accuracy metrics, Wagr gives you clean feedback on your analytical capabilities.
            </p>
          </section>

          {/* Section 2: Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
              <div className="flex items-center space-x-2.5 mb-3">
                <Eye className="text-brand-blue" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Vision</h3>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">
                To become the world's most trusted sandbox forecasting ecosystem, demonstrating that combined community intelligence, backed by AI information feeds, produces highly accurate predictive indicators for real-world events.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
              <div className="flex items-center space-x-2.5 mb-3">
                <Target className="text-brand-success" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Our Mission</h3>
              </div>
              <p className="text-xs text-dark-muted leading-relaxed">
                To provide a risk-free prediction exchange powered by a virtual currency economy (MXP). We aim to teach financial market mechanics and predictive analysis while building an active, collaborative social environment.
              </p>
            </div>
          </div>

          {/* Section 3: Virtual Economy */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-8 hover:border-brand-blue/20 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldAlert className="text-brand-blue" size={20} />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">Virtual Economy &amp; MXP</h2>
            </div>
            <p className="mb-4">
              Wagr operates entirely on virtual Market Exchange Points (MXP). Every new user is credited with 500 MXP upon verification. No real money, deposit channels, or digital tokens of monetary value are accepted or distributed. 
            </p>
            <p>
              This gamified structure removes financial barriers and regulatory complexities, maintaining a safe, friendly sandbox focusing entirely on learning, trading correctness, and cooperative community building.
            </p>
          </section>

          {/* Section 4: AI-Powered Probability Engineering */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-8 hover:border-brand-success/20 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="text-brand-success" size={20} />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">AI-Powered Probability Engineering</h2>
            </div>
            <p className="mb-4">
              Unlike traditional models that are prone to manipulation by single high-value traders, Wagr implements a custom virtual buffer algorithm. By establishing a virtual pool buffer (C = 1000 MXP) on both sides of prediction contracts, we guarantee stable, smooth price adjustments.
            </p>
            <p>
              AI sentiment simulators query global news feeds and update active contract volumes in the background. This ensures that the YES/NO odds dynamically adjust according to live sentiment data, creating a realistic simulation of standard market conditions.
            </p>
          </section>

          {/* Section 5: Our Team & Community Focus */}
          <section className="bg-dark-card border border-dark-border/60 rounded-2xl p-8 hover:border-brand-purple/20 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="text-brand-purple" size={20} />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">Our Team &amp; Community Focus</h2>
            </div>
            <p className="mb-4">
              We are a group of developers, data scientists, and prediction market analysts dedicated to build next-generation forecasting toolkits. We believe that structured crowdsourced forecasting is an important research field for financial analysis.
            </p>
            <p>
              By combining AI-generated insights, daily dynamic news, and community discussion boards, we allow our users to test strategies, learn behavioral economics, and connect with like-minded analytical minds.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
