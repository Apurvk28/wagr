import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FaqSection from '../components/FaqSection';
import CardStack from '../components/CardStack';
import MarketCard from '../components/MarketCard';
import { useAuth } from '../context/AuthContext';
import { getHomepageSummary } from '../services/userService';
import api from '../services/api';
import type { Market, News, Post } from '../types';
import { motion } from 'framer-motion';
import { formatDate } from '../utils';
import { TrendingUp, Activity, Newspaper, MessageSquare, HelpCircle } from 'lucide-react';
import { TextRepel } from '../components/ui/text-repel';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // State definitions for API data
  const [trendingMarkets, setTrendingMarkets] = useState<Market[]>([]);
  const [activeMarkets, setActiveMarkets] = useState<Market[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [communityHighlights, setCommunityHighlights] = useState<Post[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Homepage Data
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trendingRes, activeRes, newsRes, postsRes] = await Promise.all([
          api.get('/markets/trending'),
          api.get('/markets/active'),
          api.get('/news/latest'),
          api.get('/community/highlights'),
        ]);

        setTrendingMarkets(trendingRes.data.data);
        setActiveMarkets(activeRes.data.data);
        setLatestNews(newsRes.data.data);
        setCommunityHighlights(postsRes.data.data);
      } catch (err: any) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to retrieve active predictions database feeds.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      if (!isAuthenticated) return;
      setSummaryLoading(true);
      try {
        const data = await getHomepageSummary();
        setSummaryData(data);
      } catch (err) {
        console.error('Failed to load user homepage summary:', err);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchHomeData();
    fetchSummary();
  }, [isAuthenticated]);

  const handleHeroCTA = () => {
    if (isAuthenticated) {
      navigate('/markets'); // If logged in, go to markets listing
    } else {
      navigate('/register'); // If guest, signup
    }
  };

  // Reusable loading skeleton
  const SkeletonCard = () => (
    <div className="w-full bg-dark-card/60 border border-dark-border/40 rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-16 h-4 bg-dark-border rounded"></div>
        <div className="w-20 h-3 bg-dark-border rounded"></div>
      </div>
      <div className="w-full h-5 bg-dark-border rounded"></div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 bg-dark-border rounded-xl"></div>
        <div className="h-10 bg-dark-border rounded-xl"></div>
      </div>
      <div className="flex justify-between">
        <div className="w-24 h-3 bg-dark-border rounded"></div>
        <div className="w-16 h-3 bg-dark-border rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      {/* Navigation */}
      <Navbar />

      {/* Main Body container */}
      <div className="flex-grow">
        {/* 1. Hero Section */}
        {isAuthenticated && user && summaryData ? (
          <section className="relative overflow-hidden py-16 md:py-24 border-b border-dark-border/30">
            {/* Animated soft glow particles & glowing background */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute top-20 right-0 w-85 h-85 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-brand-success/5 rounded-full blur-3xl -z-10 animate-bounce" style={{ animationDuration: '8s' }}></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Greeting, Motivation, AI Insight, Highlights & Buttons */}
                <div className="lg:col-span-7 space-y-6">
                  {/* First Line: Welcome Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-dark-muted block mb-1">Trading Workspace</span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                      Welcome Back,{' '}
                      <span className="text-brand-purple hover:scale-105 transition-transform inline-block cursor-default select-none">
                        {user.username} 👋
                      </span>
                    </h1>
                  </motion.div>

                  {/* Second Line: Dynamic Time-based Greeting */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xs sm:text-sm text-dark-muted font-medium"
                  >
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour >= 5 && hour < 12) {
                        return "🌅 Good Morning! Here's what's happening in today's prediction markets.";
                      } else if (hour >= 12 && hour < 17) {
                        return "☀️ Good Afternoon! Fresh opportunities are waiting for you.";
                      } else if (hour >= 17 && hour < 21) {
                        return "🌆 Good Evening! Let's see how today's markets are performing.";
                      } else {
                        return "🌙 Good Night! Catch up on today's markets before they close.";
                      }
                    })()}
                  </motion.p>

                  {/* Daily AI Insight */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-brand-purple/5 border border-brand-purple/20 hover:border-brand-purple/35 p-5 rounded-2xl relative overflow-hidden transition-all group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple"></div>
                    <span className="text-[9px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
                      🤖 AI Insight
                    </span>
                    <p className="text-xs text-dark-muted leading-relaxed font-medium">
                      {summaryData.aiInsight}
                    </p>
                  </motion.div>

                  {/* Personalized Trading Motivation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-center space-x-2 bg-dark-card/45 border border-dark-border/40 px-4 py-2.5 rounded-xl max-w-fit"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-success animate-ping"></span>
                    <span className="text-[10px] text-dark-muted font-bold tracking-wide">
                      {summaryData.tradingMotivation}
                    </span>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 pt-2"
                  >
                    <Link
                      to="/markets"
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl hover:opacity-95 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-purple/20 text-center"
                    >
                      Explore Markets →
                    </Link>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center space-x-2 bg-dark-card border border-dark-border/80 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-dark-card/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                    >
                      View Portfolio →
                    </Link>
                  </motion.div>

                  {/* Dynamic Daily Highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="pt-6 border-t border-dark-border/25 space-y-3.5"
                  >
                    <span className="text-[9px] font-bold text-dark-muted uppercase tracking-wider block">Daily Market Focus</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex items-start space-x-2">
                        <span className="text-xs">🔥</span>
                        <div>
                          <span className="text-[9px] text-dark-muted uppercase font-bold block">Trending Category</span>
                          <span className="text-[11px] font-extrabold text-white">{summaryData.highlights.trendingCategory}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <span className="text-xs">📈</span>
                        <div>
                          <span className="text-[9px] text-dark-muted uppercase font-bold block">Highest Probability</span>
                          <span className="text-[11px] font-extrabold text-white truncate max-w-[200px] block">{summaryData.highlights.highestProbabilityMarket}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <span className="text-xs">⚡</span>
                        <div>
                          <span className="text-[9px] text-dark-muted uppercase font-bold block">Most Active</span>
                          <span className="text-[11px] font-extrabold text-white truncate max-w-[200px] block">{summaryData.highlights.mostActiveMarket}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <span className="text-xs">🏆</span>
                        <div>
                          <span className="text-[9px] text-dark-muted uppercase font-bold block">Best Position</span>
                          <span className="text-[11px] font-extrabold text-brand-success">{summaryData.highlights.bestPerformingPosition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-1 border-t border-dark-border/10">
                      <span className="text-xs">📰</span>
                      <div>
                        <span className="text-[9px] text-dark-muted uppercase font-bold block">Breaking Topic</span>
                        <span className="text-[11px] font-extrabold text-white leading-relaxed block">{summaryData.highlights.breakingTopic}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column: Today's Summary Card Grid */}
                <div className="lg:col-span-5">
                  <div className="bg-dark-card/55 border border-dark-border/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-brand-purple to-brand-blue"></div>
                    
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center justify-between border-b border-dark-border/20 pb-3">
                      <span>📊 Today's Summary</span>
                      <span className="text-[9px] text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded uppercase font-extrabold">Real-Time</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Live Markets Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-purple/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">Live Markets</span>
                        <span className="text-lg font-black text-white">{summaryData.summary.liveMarkets}</span>
                      </motion.div>

                      {/* Markets Closing Today Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-danger/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">Closing Today</span>
                        <span className="text-lg font-black text-brand-danger animate-pulse">{summaryData.summary.marketsClosingToday}</span>
                      </motion.div>

                      {/* New Articles Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-blue/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">New Articles</span>
                        <span className="text-lg font-black text-brand-blue">{summaryData.summary.newArticles}</span>
                      </motion.div>

                      {/* AI Generated Markets Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.45 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-purple/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">AI Generated</span>
                        <span className="text-lg font-black text-white">{summaryData.summary.aiGeneratedMarkets}</span>
                      </motion.div>

                      {/* MXP Balance Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-success/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">MXP Balance</span>
                        <span className="text-lg font-black text-brand-success">
                          {summaryData.summary.mxpBalance.toLocaleString()}
                        </span>
                      </motion.div>

                      {/* Global Rank Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.55 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-yellow-500/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">Global Rank</span>
                        <span className="text-lg font-black text-yellow-500">#{summaryData.summary.globalRank}</span>
                      </motion.div>

                      {/* Prediction Accuracy Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-blue/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">Accuracy</span>
                        <span className="text-lg font-black text-white">{summaryData.summary.predictionAccuracy}%</span>
                      </motion.div>

                      {/* Active Positions Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.65 }}
                        className="bg-dark/45 border border-dark-border/40 hover:border-brand-purple/20 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <span className="text-[9px] text-dark-muted font-bold uppercase tracking-wider block mb-1">Active Positions</span>
                        <span className="text-lg font-black text-white">{summaryData.summary.activePositions}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        ) : (
          <section className="relative overflow-hidden py-20 md:py-28 border-b border-dark-border/30">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-20 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-dark-card border border-dark-border/80 text-dark-muted px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6 shadow-inner"
              >
                <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                <span>Predict Future Events with MXP </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6"
              >
                The Future Has Odds<span className="text-brand-purple">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-lg text-dark-muted max-w-xl mx-auto leading-relaxed mb-10"
              >
                Predict real-world events, trade probabilities using Market Exchange Points (MXP), and explore the future through AI-powered prediction markets and community-driven forecasting.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <button
                  onClick={handleHeroCTA}
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-full px-8 py-3.5 text-sm font-bold tracking-wider hover:opacity-95 transform active:scale-95 transition-all shadow-xl shadow-brand-purple/20 hover:shadow-brand-purple/35"
                >
                  Start Predicting
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-6xl mx-auto px-4 mt-6">
            <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 2. Trending Markets Section */}
        <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/25">
              <TrendingUp size={14} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Trending Markets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : trendingMarkets.length > 0 ? (
              trendingMarkets.map((market) => (
                <MarketCard key={market._id} market={market} />
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No trending markets active at this moment.
              </div>
            )}
          </div>
        </section>

        {/* 3. Most Active Markets Section */}
        <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/25">
              <Activity size={14} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Most Active Markets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : activeMarkets.length > 0 ? (
              activeMarkets.map((market) => (
                <MarketCard key={market._id} market={market} />
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No active markets experiencing transaction volume.
              </div>
            )}
          </div>
        </section>

        {/* 4. Latest News Section */}
        <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/25">
              <Newspaper size={14} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Latest News</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-dark-card/60 border border-dark-border/40 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="flex justify-between"><div className="w-12 h-3 bg-dark-border rounded"></div><div className="w-20 h-3 bg-dark-border rounded"></div></div>
                  <div className="w-full h-8 bg-dark-border rounded"></div>
                  <div className="w-full h-12 bg-dark-border rounded"></div>
                  <div className="w-24 h-4 bg-dark-border rounded"></div>
                </div>
              ))
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => (
                <div
                  key={news._id}
                  className="bg-dark-card border border-dark-border/60 hover:border-dark-border/100 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:scale-[1.01] transition-all duration-200"
                >
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-dark-muted font-medium mb-3">
                      <span className="text-brand-purple font-semibold">{news.source}</span>
                      <span>{formatDate(news.publishedDate)}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-2 leading-snug hover:text-brand-blue transition-colors">
                      <a href={news.url} target="_blank" rel="noopener noreferrer">
                        {news.headline}
                      </a>
                    </h3>
                    <p className="text-[11px] text-dark-muted leading-relaxed line-clamp-3 mb-4">
                      {news.summary}
                    </p>
                  </div>
                  {news.relatedMarket && (
                    <Link
                      to={`/markets/${news.relatedMarket}`}
                      className="inline-flex items-center text-[10px] font-bold text-brand-blue hover:underline"
                    >
                      View related prediction market →
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No active news briefings processed by AI.
              </div>
            )}
          </div>
        </section>

        {/* 5. Community Highlights Section */}
        <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/25">
              <MessageSquare size={14} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Community Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-dark-card/60 border border-dark-border/40 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="flex items-center space-x-2"><div className="w-6 h-6 bg-dark-border rounded-full"></div><div className="w-20 h-3 bg-dark-border rounded"></div></div>
                  <div className="w-full h-12 bg-dark-border rounded"></div>
                  <div className="w-24 h-4 bg-dark-border rounded"></div>
                </div>
              ))
            ) : communityHighlights.length > 0 ? (
              communityHighlights.map((post) => {
                const userObj = post.userId as { fullName: string; username: string };
                return (
                  <div
                    key={post._id}
                    className="bg-dark-card border border-dark-border/60 hover:border-dark-border/100 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:scale-[1.01] transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center space-x-2.5 mb-3.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-[9px] font-black text-white">
                          {userObj.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[11px] text-white font-bold">{userObj.fullName}</p>
                          <p className="text-[9px] text-dark-muted">@{userObj.username}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-dark-muted leading-relaxed line-clamp-4 mb-4 italic">
                        "{post.content}"
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-dark-muted border-t border-dark-border/20 pt-3 mt-1 font-semibold">
                      <div className="flex items-center space-x-3.5">
                        <span className="flex items-center space-x-1 hover:text-white cursor-pointer">
                          <span>❤️</span> <span>{post.likesCount}</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-white cursor-pointer">
                          <span>💬</span> <span>{post.commentsCount}</span>
                        </span>
                      </div>
                      {post.linkedMarket && (
                        <Link
                          to={`/markets/${post.linkedMarket}`}
                          className="text-brand-purple hover:underline"
                        >
                          Forecast contract →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No active community highlight discussions.
              </div>
            )}
          </div>
        </section>

        {!isAuthenticated && (
          <>
            {/* 6. Card Stack Platform Highlights */}
            <section className="bg-dark/20 border-y border-dark-border/25">
              <CardStack />
            </section>

            {/* 7. FAQ Accordion Section */}
            <section className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-10 text-center">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/25">
                  <HelpCircle size={14} />
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
              </div>
              <FaqSection />
            </section>
          </>
        )}
      </div>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
