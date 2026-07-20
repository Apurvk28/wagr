import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EyeTracking } from './ui/eye-tracking';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'What is Wagr?',
    answer: 'Wagr is an AI-powered social prediction exchange that enables users to forecast the outcomes of real-world events by trading probabilities using a virtual currency known as Market Exchange Points (MXP). Rather than a gambling platform, Wagr transforms forecasting into an interactive, data-driven experience.',
  },
  {
    question: 'What are Market Exchange Points (MXP)?',
    answer: 'Market Exchange Points (MXP) represent Wagr\'s official virtual currency. Every newly registered user receives 10,000 MXP upon account creation, allowing immediate participation in prediction markets without any financial deposit or risk.',
  },
  {
    question: 'Is real money involved?',
    answer: 'No. Wagr operates entirely on a virtual economy using MXP. There are no real-money deposits or withdrawals. MXP is purely for educational, social, and analytical forecasting.',
  },
  {
    question: 'How do prediction markets work?',
    answer: 'Prediction markets represent binary contracts (YES or NO) about future outcomes. When you allocate MXP to a YES or NO position, you influence the overall probability. If a probability moves in your favor, the position\'s value increases, allowing you to close it out early or hold it until final settlement.',
  },
  {
    question: 'Who creates prediction markets?',
    answer: 'Markets are drafted using our automated AI Engine, which continuously monitors trusted news sources for significant forecasting-worthy events. Additionally, registered users can submit custom market proposals.',
  },
  {
    question: 'How are markets resolved?',
    answer: 'When a market reaches its resolution date, outcomes are verified. The winning positions are settled automatically, distributing payouts to correct forecasters and updating wallet balances immediately.',
  },
  {
    question: 'What happens if I run low on Market Exchange Points (MXP)?',
    answer: 'If your MXP balance runs low, you can submit a credit request directly to system administrators through your Wallet page (/wallet). Admin approvals credit extra MXP to your balance instantly.',
  },
  {
    question: 'How does AI news linking work on Wagr?',
    answer: 'Wagr continuously indexes verified news articles using natural language processing to extract market sentiment. These breaking news briefs are linked directly to related prediction topics, providing instant context before placing positions.',
  },
];

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left Column: Heading, Subtext & Interactive Eye Tracking Animation */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-purple/10 text-brand-purple border border-brand-purple/25 px-3 py-1 rounded-full inline-block mb-4">
            Platform Help Center
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-[1.05] mb-4">
            Frequently <br />
            <span className="text-brand-purple">Asked</span> <br />
            Questions
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted font-medium leading-relaxed mb-6 max-w-md">
            Got questions about prediction trading on Wagr? We've got answers. Move your cursor around to watch our eyes follow your every step!
          </p>
        </div>

        {/* Eye Tracking Animation Component */}
        <div className="pt-4 flex justify-start items-center">
          <EyeTracking eyeSize={130} gap={36} />
        </div>
      </div>

      {/* Right Column: FAQ Accordion Deck */}
      <div className="lg:col-span-7 space-y-3.5">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`bg-dark-card border ${
                isOpen ? 'border-brand-purple/50 shadow-lg shadow-brand-purple/10' : 'border-dark-border/60 hover:border-brand-purple/30'
              } rounded-2xl overflow-hidden shadow-md transition-all duration-200 cursor-pointer`}
            >
              <div
                className="w-full px-5 py-4 flex items-center justify-between text-left select-none"
              >
                <span className={`text-xs md:text-sm font-bold ${isOpen ? 'text-white' : 'text-white/90'}`}>
                  {item.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-dark-muted transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-purple' : ''}`}
                />
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-4 text-xs text-dark-muted leading-relaxed border-t border-dark-border/20 pt-3 font-medium">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;
