import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
    answer: 'Market Exchange Points (MXP) represent Wagr\'s official virtual currency. Every newly registered user receives 500 MXP upon verifying their account email, allowing immediate participation in prediction markets without any financial deposit or risk.',
  },
  {
    question: 'Is real money involved?',
    answer: 'No. Version 1 of Wagr operates entirely on a virtual economy using MXP. There are no deposits, withdrawals, cryptocurrencies, or real-money transactions. MXP is purely for educational, social, and analytical forecasting.',
  },
  {
    question: 'How do prediction markets work?',
    answer: 'Prediction markets represent binary contracts (YES or NO) about future outcomes. When you allocate MXP to a YES or NO position, you influence the overall probability. If a probability moves in your favor, the position\'s value increases, allowing you to close it out early or hold it until final settlement.',
  },
  {
    question: 'Who creates prediction markets?',
    answer: 'Markets are drafted using our automated AI Engine, which continuously monitors trusted news sources for significant forecasting-worthy events. Additionally, registered users can submit custom market proposals. All drafted or proposed markets must be approved by an administrator before going live.',
  },
  {
    question: 'How are markets resolved?',
    answer: 'When a market reaches its resolution date, administrators verify the official outcome using predefined, trusted external sources. The winning positions are settled, distributing profits to correct forecasters and updating wallet balances immediately.',
  },
  {
    question: 'Can users create their own markets?',
    answer: 'Yes! Registered users can submit custom prediction market proposals using the submission form. The proposal is screened by the AI to detect duplicates and review structure, and then reviewed by administrators for publication.',
  },
  {
    question: 'How do I earn or use MXP?',
    answer: 'You spend MXP to buy positions in live markets. You earn MXP by closing profitable positions before resolution or holding correct predictions until administrators settle the market. Future updates will introduce daily login rewards and tournament achievements.',
  },
];

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {faqData.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className="bg-dark-card border border-dark-border/80 rounded-xl overflow-hidden shadow-md transition-all duration-200"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none select-none hover:bg-dark-card/90"
            >
              <span className="text-xs md:text-sm font-semibold text-white/95">{item.question}</span>
              <ChevronDown
                size={16}
                className={`text-dark-muted transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-purple' : ''}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-5 pb-4 text-xs text-dark-muted leading-relaxed border-t border-dark-border/20 pt-3">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqSection;
