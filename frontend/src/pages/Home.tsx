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
import { Newspaper, MessageSquare } from 'lucide-react';
import { TextRepel } from '../components/ui/text-repel';
import { ScrollSplitCard } from '../components/ui/scroll-split-card';
import { ScrollBasedVelocity } from '../components/ui/scroll-based-velocity';
import { Signature } from '../components/ui/signature';
import { MusicPlayer } from '../components/ui/music-player';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // State definitions for API data
  const [trendingMarkets, setTrendingMarkets] = useState<Market[]>([]);
  const [activeMarkets, setActiveMarkets] = useState<Market[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [communityHighlights, setCommunityHighlights] = useState<Post[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Homepage Data
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trendingRes, activeRes, newsRes, postsRes, allMarketsRes] = await Promise.all([
          api.get('/markets/trending'),
          api.get('/markets/active'),
          api.get('/news/latest'),
          api.get('/community/highlights'),
          api.get('/markets'),
        ]);

        const combined = [...(trendingRes.data?.data || [])];
        if (combined.length < 6 && allMarketsRes.data?.data) {
          const existingIds = new Set(combined.map((m: any) => m._id));
          for (const m of allMarketsRes.data.data) {
            if (!existingIds.has(m._id)) {
              combined.push(m);
              existingIds.add(m._id);
            }
            if (combined.length >= 6) break;
          }
        }

        setTrendingMarkets(combined.slice(0, 6));
        setActiveMarkets((activeRes.data?.data || []).slice(0, 3));
        setLatestNews((newsRes.data?.data || []).slice(0, 3));
        setCommunityHighlights((postsRes.data?.data || []).slice(0, 3));
      } catch (err: any) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to retrieve active predictions database feeds.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await getHomepageSummary();
        setSummaryData(data);
      } catch (err) {
        console.error('Failed to load user homepage summary:', err);
      }
    };

    fetchHomeData();
    fetchSummary();
  }, [isAuthenticated]);

  const handleHeroCTA = () => {
    if (isAuthenticated) {
      navigate('/markets');
    } else {
      navigate('/register');
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
        {/* 1. Logged-In Sleek Trading Workspace Hero */}
        {isAuthenticated && user ? (
          <section className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-b from-brand-purple/10 via-dark-card/40 to-transparent border-b border-dark-border/30">
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute top-10 right-0 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Workspace Header, AI Briefing, Motivation & Actions */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-3 py-0.5 rounded-full">
                        Trading Workspace
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Welcome Back, <span className="text-brand-purple">{user.username} 👋</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-dark-muted font-medium mt-1">
                      {(() => {
                        const hour = new Date().getHours();
                        if (hour >= 5 && hour < 12) return "🌅 Good Morning! Here's what's happening in today's prediction markets.";
                        if (hour >= 12 && hour < 17) return "☀️ Good Afternoon! Fresh opportunities are waiting for you.";
                        if (hour >= 17 && hour < 21) return "<ctrl42> Good Evening! Let's see how today's markets are performing.";
                        return "🌙 Good Night! Catch up on today's markets before they close.";
                      })()}
                    </p>
                  </div>

                  {/* Daily AI Briefing */}
                  {summaryData?.aiInsight && (
                    <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple" />
                      <span className="text-[9px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
                        🤖 AI Insight Briefing
                      </span>
                      <p className="text-xs text-dark-muted leading-relaxed font-medium line-clamp-2">
                        {summaryData.aiInsight}
                      </p>
                    </div>
                  )}

                  {/* Trading Motivation Pill */}
                  {summaryData?.tradingMotivation && (
                    <div className="flex items-center space-x-2 bg-dark-card/60 border border-dark-border/40 px-3.5 py-2 rounded-xl max-w-fit">
                      <span className="text-xs">⚡</span>
                      <span className="text-[10px] text-dark-muted font-bold tracking-wide">
                        {summaryData.tradingMotivation}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      to="/markets"
                      className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-purple/25"
                    >
                      Explore Markets →
                    </Link>
                    <Link
                      to="/dashboard"
                      className="bg-dark-card border border-dark-border/80 hover:border-brand-purple/50 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md"
                    >
                      View Portfolio →
                    </Link>
                  </div>
                </div>

                {/* Right Column: 4 Clean Quick-Stat Cards */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                  <div className="bg-dark-card/90 border border-dark-border/60 hover:border-brand-purple/40 p-4 rounded-2xl shadow-lg transition-colors">
                    <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block mb-1">💰 Available Balance</span>
                    <span className="text-xl font-black text-white">{(user?.mxpBalance ?? summaryData?.mxpBalance ?? 10000).toLocaleString()} <span className="text-xs text-brand-purple font-bold">MXP</span></span>
                  </div>

                  <div className="bg-dark-card/90 border border-dark-border/60 hover:border-brand-purple/40 p-4 rounded-2xl shadow-lg transition-colors">
                    <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block mb-1">📈 Active Trades</span>
                    <span className="text-xl font-black text-white">{summaryData?.activePositionsCount ?? 0}</span>
                  </div>

                  <div className="bg-dark-card/90 border border-dark-border/60 hover:border-brand-purple/40 p-4 rounded-2xl shadow-lg transition-colors">
                    <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block mb-1">🎯 Accuracy Rate</span>
                    <span className="text-xl font-black text-emerald-400">{summaryData?.winRate ?? 0}%</span>
                  </div>

                  <div className="bg-dark-card/90 border border-dark-border/60 hover:border-brand-purple/40 p-4 rounded-2xl shadow-lg transition-colors">
                    <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block mb-1">🏆 Global Rank</span>
                    <span className="text-xl font-black text-brand-purple">#{summaryData?.rank ?? 'Unranked'}</span>
                  </div>
                </div>

              </div>
            </div>
          </section>
        ) : (
          /* GUEST HERO SECTION */
          <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 text-center px-4 overflow-hidden border-b border-dark-border/20">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-purple/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[350px] h-[250px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative max-w-4xl mx-auto space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <span className="text-xs font-bold bg-dark-card border border-dark-border text-brand-purple px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Predict Future Events with MXP ✦
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.1]"
              >
                <TextRepel text="The Future Has Odds." className="text-white" />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm sm:text-base text-dark-muted max-w-2xl mx-auto leading-relaxed"
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
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-full px-8 py-3.5 text-sm font-bold tracking-wider hover:opacity-95 transform active:scale-95 transition-all shadow-xl shadow-brand-purple/20 hover:shadow-brand-purple/35 cursor-pointer"
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

        {/* ScrollBasedVelocity Section above Trending Markets */}
        <div className="pt-10 pb-4 overflow-hidden border-b border-dark-border/10">
          <ScrollBasedVelocity
            text="Trending markets "
            default_velocity={5}
            className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-white/90 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          />
        </div>

        {/* Trending Markets Grid (Displays 6 Markets) */}
        <section className="py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : trendingMarkets.length > 0 ? (
              trendingMarkets.slice(0, 6).map((market) => (
                <MarketCard key={market._id} market={market} />
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No trending markets active at this moment.
              </div>
            )}
          </div>

          {/* Button redirecting to prediction market page */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate('/markets')}
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shadow-brand-purple/25 hover:scale-[1.03] active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore All Prediction Markets</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* Scroll Split Card Section (Guest Mode Only - Removed After Login) */}
        {!isAuthenticated && (
          <div className="relative w-full border-b border-dark-border/20">
            <ScrollSplitCard
              imageSrc="https://wagr.co/og-image.jpg"
              cards={[
                {
                  title: "HERE COMES THE MONEY! 💰",
                  description: "Turn your real-world insights into instant profits. Predict upcoming events, bet smart, and watch your MXP balance explode!",
                  bgColor: "#6d28d9",
                  textColor: "#ffffff"
                },
                {
                  title: "I'M GOING TO BE #1! 🏆",
                  description: "Dominate the global leaderboards, outsmart the crowd, and reign supreme at the absolute top of the prediction rankings.",
                  bgColor: "#1d4ed8",
                  textColor: "#ffffff"
                },
                {
                  title: "WIN BIG ON EVERY ODDS 🚀",
                  description: "Feel the rush of real-time trading. Instant payouts, live probability shifts, and non-stop winning action!",
                  bgColor: "#047857",
                  textColor: "#ffffff"
                }
              ]}
            />
          </div>
        )}

        {/* Latest News Section */}
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
              latestNews.map((item) => (
                <motion.div 
                  key={item._id} 
                  whileHover={{ y: -8, scale: 1.025 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  onClick={() => navigate('/news')}
                  className="bg-dark-card border border-dark-border/60 hover:border-emerald-500/60 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Shine sweep overlay line */}
                  <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-dark-muted font-medium">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-dark-muted line-clamp-3 leading-relaxed mb-4 font-medium">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 group-hover:translate-x-1 transition-transform relative z-10">
                    <span>Read AI Briefing</span>
                    <span>→</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-dark-muted">
                No recent news briefings available.
              </div>
            )}
          </div>
        </section>

        {/* Community Highlights Section */}
        <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/25">
              <MessageSquare size={14} />
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Community Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(communityHighlights.length > 0 ? communityHighlights : [
              {
                _id: 'demo-1',
                content: "AI markets are surging! 🚀 I just went ALL IN on YES for OpenAI's next flagship model release. What's your prediction strategy?",
                userId: { fullName: 'Apurv Khairnar', username: 'apurv' } as any,
                likesCount: 24,
                commentsCount: 9,
              },
              {
                _id: 'demo-2',
                content: "The Fed interest rate cut odds just jumped to 82%! Market sentiment is shifting fast — don't miss out on early YES payouts.",
                userId: { fullName: 'Sarah Chen', username: 'sarah_quant' } as any,
                likesCount: 18,
                commentsCount: 5,
              },
              {
                _id: 'demo-3',
                content: "Just climbed to Rank #3 on the global leaderboard! 🏆 Consistent probability research pays off. Who's challenging for #1?",
                userId: { fullName: 'Rohan Sharma', username: 'rohan_trader' } as any,
                likesCount: 42,
                commentsCount: 14,
              },
            ]).map((post) => {
              const userObj = typeof post.userId === 'object' ? post.userId : { username: 'trader', fullName: 'Trader' };
              return (
                <div key={post._id} className="bg-dark-card border border-dark-border/60 hover:border-brand-purple/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-3.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue text-white flex items-center justify-center font-black text-xs border border-brand-purple/30 shadow-sm">
                        {userObj.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-bold">{userObj.fullName}</p>
                        <p className="text-[9px] text-dark-muted">@{userObj.username}</p>
                      </div>
                    </div>
                    <p className="text-xs text-dark-muted leading-relaxed line-clamp-4 mb-4 italic font-medium">
                      "{post.content}"
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-dark-muted border-t border-dark-border/20 pt-3 mt-1 font-semibold">
                    <div className="flex items-center space-x-3.5">
                      <span className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors">
                        <span>❤️</span> <span>{post.likesCount || 12}</span>
                      </span>
                      <span className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors">
                        <span>💬</span> <span>{post.commentsCount || 4}</span>
                      </span>
                    </div>
                    <span 
                      onClick={() => navigate(isAuthenticated ? '/community' : '/register')}
                      className="text-brand-purple text-[10px] font-bold group-hover:underline cursor-pointer"
                    >
                      View Discussion →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Discussion Banner */}
          <div className="mt-10 bg-gradient-to-r from-brand-purple/20 via-dark-card to-brand-blue/20 border border-brand-purple/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-2.5 py-0.5 rounded-full inline-block">
                Wagr Social Hub
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Meet cool forecasters like you — join the conversation! 💬
              </h3>
              <p className="text-xs text-dark-muted font-medium max-w-xl leading-relaxed">
                Share real-world event insights, debate contract probabilities, and climb the global podium leaderboards.
              </p>
            </div>

            <button
              onClick={() => navigate(isAuthenticated ? '/community' : '/register')}
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-brand-purple/30 hover:scale-[1.03] active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {isAuthenticated ? 'Join Discussion →' : 'Join Wagr Community →'}
            </button>
          </div>
        </section>

        {!isAuthenticated && (
          <>
            <section className="bg-dark/20 border-y border-dark-border/25">
              <CardStack />
            </section>
            <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-dark-border/20 mb-6">
              <FaqSection />
            </section>
          </>
        )}
      </div>

      {/* Music Player Section (Only Visible After Login) */}
      {isAuthenticated && (
        <div className="w-full flex flex-col items-center justify-center py-14 bg-dark/40 border-t border-dark-border/20 px-4">
          <div className="mb-8 text-center w-full max-w-5xl px-2 overflow-hidden">
            <TextRepel
              text="Song You Didn't Bet On"
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-widest uppercase whitespace-nowrap inline-block"
            />
            <p className="text-xs text-dark-muted font-medium mt-3">
              Unwind with our featured vinyl track before placing your next forecast
            </p>
          </div>

          <MusicPlayer 
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            coverArt="https://i.scdn.co/image/ab67616d0000b27315ebbedaacef61af244262a8"
            className="w-full max-w-sm"
          />
        </div>
      )}

      {/* Signature Section right above Footer */}
      <div className="w-full flex justify-center py-10 bg-dark/40 border-t border-dark-border/20">
        <Signature text="Wagr.io" fontSize={72} duration={1.5} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
