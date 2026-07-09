import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import {
  getMarketById,
  openTrade,
  closeTrade,
  getUserPositionInMarket,
  resolveMarket,
  cancelMarket,
  toggleFollowMarket,
} from '../services/marketService';
import type { Market } from '../types';
import { formatDate, formatMXP, formatProbability } from '../utils';
import {
  ChevronLeft,
  Calendar,
  Layers,
  Award,
  Wallet,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';

const MarketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateProfile } = useAuth(); // Profile can reload user balance

  const [market, setMarket] = useState<Market | null>(null);
  const [userPositions, setUserPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trading form states
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>('YES');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);

  // Administrative states
  const [resolutionOutcome, setResolutionOutcome] = useState<'YES' | 'NO'>('YES');
  const [resolutionSource, setResolutionSource] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Linked news & posts
  const [linkedNews, setLinkedNews] = useState<any[]>([]);
  const [linkedPosts, setLinkedPosts] = useState<any[]>([]);

  // 1. Initial Data Load
  useEffect(() => {
    const fetchMarketData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [marketData, newsRes, postsRes] = await Promise.all([
          getMarketById(id),
          api.get('/news/latest'),
          api.get('/community/highlights'),
        ]);
        setMarket(marketData);

        // Filter linked items
        const news = newsRes.data.data.filter((n: any) => n.relatedMarket === id);
        const posts = postsRes.data.data.filter((p: any) => p.linkedMarket === id);
        setLinkedNews(news);
        setLinkedPosts(posts);

        // Fetch user positions if authenticated
        if (isAuthenticated) {
          const positions = await getUserPositionInMarket(id);
          setUserPositions(positions || []);
        }
      } catch (err: any) {
        console.error('Error fetching market details:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [id, isAuthenticated]);

  // 2. WebSockets Integration (Socket.IO client connection)
  useEffect(() => {
    if (!id) return;
    const socket = io('http://localhost:5050');

    socket.on('market_update', (data) => {
      if (data.marketId === id) {
        setMarket((prev) => (prev ? { ...prev, ...data } : null));
      }
    });

    socket.on('market_resolved', (data) => {
      if (data.marketId === id) {
        setMarket((prev) =>
          prev
            ? {
                ...prev,
                status: 'Resolved',
                resolvedOutcome: data.outcome,
                yesProbability: data.yesProbability,
                noProbability: data.noProbability,
              }
            : null
        );
        // Refresh positions state
        if (isAuthenticated) {
          getUserPositionInMarket(id).then(setUserPositions);
        }
      }
    });

    socket.on('market_cancelled', (data) => {
      if (data.marketId === id) {
        setMarket((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
        if (isAuthenticated) {
          getUserPositionInMarket(id).then(setUserPositions);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, isAuthenticated]);

  // 3. Trade Submission
  const handleOpenTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setTradeError(null);
    setTradeSuccess(null);

    const amount = Number(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      setTradeError('Please enter a valid amount.');
      return;
    }

    if (user && user.mxpBalance < amount) {
      setTradeError('Insufficient MXP balance.');
      return;
    }

    setTradeLoading(true);
    try {
      await openTrade(id, selectedOutcome, amount);
      setTradeSuccess(`Successfully purchased ${selectedOutcome} contracts for ${amount} MXP!`);
      setTradeAmount('');

      // Refetch user positions array
      const positions = await getUserPositionInMarket(id);
      setUserPositions(positions || []);
      
      // Update global context wallet states by triggering profile reload
      await updateProfile(user?.fullName || '');
    } catch (err: any) {
      setTradeError(err.response?.data?.message || 'Trade execution failed.');
    } finally {
      setTradeLoading(false);
    }
  };

  // 4. Position manual sale (Close trade)
  const handleCloseTrade = async (positionId: string) => {
    if (!id) return;
    setTradeError(null);
    setTradeSuccess(null);
    setTradeLoading(true);
    try {
      const response = await closeTrade(id, positionId);
      setTradeSuccess(`Position closed successfully! Settled for ${response.position.exitValue} MXP.`);
      
      // Refetch user positions array
      const positions = await getUserPositionInMarket(id);
      setUserPositions(positions || []);

      // Trigger profile reload to update header wallet
      await updateProfile(user?.fullName || '');
    } catch (err: any) {
      setTradeError(err.response?.data?.message || 'Failed to close position.');
    } finally {
      setTradeLoading(false);
    }
  };

  // 5. Admin Resolve
  const handleResolveMarket = async () => {
    if (!id) return;
    setAdminError(null);
    setAdminLoading(true);
    try {
      await resolveMarket(id, resolutionOutcome, resolutionSource);
      setTradeSuccess(`Market resolved successfully to outcome: ${resolutionOutcome}.`);
    } catch (err: any) {
      setAdminError(err.response?.data?.message || 'Failed to resolve market.');
    } finally {
      setAdminLoading(false);
    }
  };

  // 6. Admin Cancel
  const handleCancelMarket = async () => {
    if (!id) return;
    setAdminError(null);
    setAdminLoading(true);
    try {
      await cancelMarket(id);
      setTradeSuccess('Market cancelled. All funds refunded.');
    } catch (err: any) {
      setAdminError(err.response?.data?.message || 'Failed to cancel market.');
    } finally {
      setAdminLoading(false);
    }
  };

  // 7. Toggle market follow
  const handleToggleFollow = async () => {
    if (!isAuthenticated) return;
    setFollowLoading(true);
    try {
      if (!id) return;
      const result = await toggleFollowMarket(id);
      setIsFollowing(result.isFollowing);
    } catch (err: any) {
      console.error('Follow toggle failed:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-brand-purple/20 border-t-brand-purple animate-spin"></div>
          <p className="mt-4 text-xs text-dark-muted font-semibold uppercase tracking-wider">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="min-h-screen bg-dark flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow max-w-lg w-full mx-auto px-4 py-20 text-center">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-lg font-bold text-white mt-4 mb-2">Error Loading Market</h2>
          <p className="text-xs text-dark-muted mb-8">{error || 'Prediction contract could not be found.'}</p>
          <Link to="/markets" className="bg-dark-card border border-dark-border px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider hover:border-white transition-colors">
            Return to Markets
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Format chart line data
  const chartData = market.probabilityHistory?.map((h: any) => ({
    time: new Date(h.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    YES: h.yesProbability,
    NO: 100 - h.yesProbability,
  })) || [];

  // Current statistics calculation
  const isMarketLive = market.status === 'Live';
  const hasExpired = new Date(market.resolutionDate) <= new Date();



  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/markets"
          className="inline-flex items-center space-x-1.5 text-xs text-dark-muted hover:text-white font-bold tracking-wider uppercase mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Back to Markets</span>
        </Link>

        {/* Master Details Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Details Panel */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 relative overflow-hidden">
              <div className={`absolute top-0 inset-x-0 h-1 ${
                market.status === 'Live' ? 'bg-brand-purple' :
                market.status === 'Resolved' ? 'bg-brand-success' : 'bg-dark-border/80'
              }`}></div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {market.category}
                </span>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <button
                      id="market-follow-btn"
                      onClick={handleToggleFollow}
                      disabled={followLoading}
                      title={isFollowing ? 'Unfollow market' : 'Follow market for updates'}
                      className={`flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all disabled:opacity-50 ${
                        isFollowing
                          ? 'bg-brand-purple/15 border-brand-purple text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:border-brand-purple/50 hover:text-brand-purple'
                      }`}
                    >
                      {isFollowing ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                    market.status === 'Live' ? 'bg-brand-purple/10 border-brand-purple/25 text-brand-purple' :
                    market.status === 'Resolved' ? 'bg-brand-success/10 border-brand-success/25 text-brand-success' :
                    'bg-dark-border text-dark-muted border-dark-border/60'
                  }`}>
                    {market.status}
                  </span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-4">
                {market.title}
              </h1>

              <p className="text-xs text-dark-muted leading-relaxed mb-6">
                {market.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-dark-border/20 text-xs font-semibold">
                <div className="flex items-center space-x-2 text-dark-muted">
                  <span>📊</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider">Volume</p>
                    <p className="text-white font-bold">{formatMXP(market.volume)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-dark-muted">
                  <span>👥</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider">Traders</p>
                    <p className="text-white font-bold">
                      {market.participants > 0 ? market.participants : Math.floor((market.volume || 100) / 120) + 24} Users
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-dark-muted col-span-2">
                  <span>📅</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider">Ends on</p>
                    <p className="text-white font-bold">{formatDate(market.resolutionDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Probability Chart */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
                <TrendingUp size={14} className="text-brand-purple" />
                <span>Probability History</span>
              </h3>

              <div className="h-64 sm:h-72 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222530" />
                      <XAxis dataKey="time" stroke="#5d6275" fontSize={9} />
                      <YAxis domain={[0, 100]} stroke="#5d6275" fontSize={9} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1b1d28',
                          borderColor: '#2d3142',
                          borderRadius: '12px',
                        }}
                        labelStyle={{ color: '#888ea8', fontSize: '10px', fontWeight: 'bold' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="YES" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
                      <Line type="monotone" dataKey="NO" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-dark-muted">
                    No probability updates recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Linked news briefs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>📰</span>
                <span>Associated News Briefings</span>
              </h3>
              
              {linkedNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {linkedNews.map((news) => (
                    <div key={news._id} className="bg-dark-card border border-dark-border/60 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-[9px] text-dark-muted mb-2">
                          <span className="font-bold text-brand-purple">{news.source}</span>
                          <span>{formatDate(news.publishedDate)}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1.5 hover:text-brand-blue">
                          <a href={news.url} target="_blank" rel="noopener noreferrer">{news.headline}</a>
                        </h4>
                        <p className="text-[10px] text-dark-muted line-clamp-3 leading-relaxed mb-3">{news.summary}</p>
                      </div>
                      <div className="bg-dark/40 border border-dark-border/40 rounded-lg p-2.5 text-[9px] text-dark-muted leading-relaxed">
                        <span className="font-bold text-brand-blue uppercase tracking-wider block mb-0.5">AI Sentiment Analysis</span>
                        {news.aiSummary}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-dark-muted italic">No AI-curated news linked to this market yet.</p>
              )}
            </div>
          </div>

          {/* Side Panel Column */}
          <div className="space-y-8">
            {/* Trading Card */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
                <Activity size={14} className="text-brand-blue" />
                <span>Trading Deck</span>
              </h3>

              {tradeSuccess && (
                <div className="mb-4 bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                  <span className="font-bold">✓</span>
                  <span>{tradeSuccess}</span>
                </div>
              )}

              {tradeError && (
                <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                  <span className="font-bold">⚠️</span>
                  <span>{tradeError}</span>
                </div>
              )}

              {/* Live Odds Widget (Showing Return Rates) */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${
                  selectedOutcome === 'YES' ? 'bg-purple-500/10 border-brand-purple text-white' : 'bg-dark/40 border-dark-border/60 text-dark-muted'
                } cursor-pointer`} onClick={() => isMarketLive && setSelectedOutcome('YES')}>
                  <span className="text-[10px] font-bold text-brand-success mb-1">YES Return</span>
                  <span className="text-xl font-black">+{100 - market.yesProbability}%</span>
                </div>

                <div className={`border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${
                  selectedOutcome === 'NO' ? 'bg-blue-500/10 border-brand-blue text-white' : 'bg-dark/40 border-dark-border/60 text-dark-muted'
                } cursor-pointer`} onClick={() => isMarketLive && setSelectedOutcome('NO')}>
                  <span className="text-[10px] font-bold text-brand-danger mb-1">NO Return</span>
                  <span className="text-xl font-black">+{100 - market.noProbability}%</span>
                </div>
              </div>

              {/* Render based on authentication & market status */}
              {!isAuthenticated ? (
                <div className="text-center bg-dark/40 border border-dark-border/40 rounded-xl p-5">
                  <p className="text-xs text-dark-muted mb-4 leading-relaxed">
                    Guest visitors can browse prediction events. Please sign in or register to trade probabilities using MXP points.
                  </p>
                  <Link to="/login" className="block w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-95 text-center">
                    Sign In
                  </Link>
                </div>
              ) : market.status !== 'Live' || hasExpired ? (
                <div className="text-center bg-dark/40 border border-dark-border/40 rounded-xl p-5 text-xs text-dark-muted">
                  <Clock size={18} className="mx-auto mb-2 text-dark-muted" />
                  <p className="font-semibold text-white mb-1">Trading Closed</p>
                  <p className="leading-relaxed">
                    {market.status === 'Resolved'
                      ? `This event contract has been resolved to ${market.resolutionResult}.`
                      : 'This event contract has closed and is locked pending administrative resolution.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Purchase Form (Always rendered so users can make multiple bets) */}
                  <form onSubmit={handleOpenTrade} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-white/95 uppercase tracking-wider" htmlFor="stake">
                          Investment Amount
                        </label>
                        <span className="text-[10px] text-dark-muted font-bold flex items-center">
                          <Wallet size={10} className="mr-1 text-brand-blue" />
                          {user?.mxpBalance || 0} MXP
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          id="stake"
                          type="number"
                          min="1"
                          value={tradeAmount}
                          onChange={(e) => {
                            setTradeAmount(e.target.value);
                            setTradeError(null);
                          }}
                          placeholder="0"
                          required
                          className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
                        />
                      </div>
                    </div>

                    {tradeAmount && Number(tradeAmount) > 0 && (
                      (() => {
                        const rate = selectedOutcome === 'YES' ? (100 - market.yesProbability) : (100 - market.noProbability);
                        const estPayout = Math.round(Number(tradeAmount) * (1 + rate / 100));
                        const estProfit = estPayout - Number(tradeAmount);

                        return (
                          <div className="bg-dark/60 border border-dark-border/80 rounded-xl p-3.5 space-y-2.5 text-xs animate-fade-in">
                            <div className="flex justify-between items-center text-[10px] text-dark-muted uppercase tracking-wider">
                              <span>Order Summary</span>
                              <span className="font-bold text-brand-blue">
                                {selectedOutcome} @ +{rate}% Return
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                              <div className="flex justify-between border-r border-dark-border/20 pr-2">
                                <span className="text-dark-muted">Stake</span>
                                <span className="text-white font-bold">
                                  {tradeAmount} MXP
                                </span>
                              </div>
                              <div className="flex justify-between pl-2">
                                <span className="text-dark-muted">Est. Rate</span>
                                <span className="text-white font-bold">
                                  +{rate}%
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-dark-border/20 pt-2.5 space-y-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-brand-success font-semibold">If Win (Payout)</span>
                                <span className="text-brand-success font-black">
                                  {estPayout} MXP 
                                  <span className="text-[10px] font-medium ml-1">
                                    (+{estProfit} MXP)
                                  </span>
                                </span>
                              </div>
                              
                              <div className="flex justify-between text-[11px]">
                                <span className="text-brand-danger font-semibold">If Lose (Max Loss)</span>
                                <span className="text-brand-danger font-black">
                                  -{tradeAmount} MXP
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}

                    <button
                      type="submit"
                      disabled={tradeLoading}
                      className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {tradeLoading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                          <span>Executing...</span>
                        </>
                      ) : (
                        <span>Place {selectedOutcome} Bet</span>
                      )}
                    </button>
                  </form>

                  {/* Active Positions List Deck (Render all user bets in this market) */}
                  {userPositions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-dark-border/40 space-y-4">
                      <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                        Your Active Bets ({userPositions.length})
                      </span>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {userPositions.map((pos) => {
                          const currentProb = pos.outcome === 'YES' ? market.yesProbability : market.noProbability;
                          const currentExitValue = Math.round(pos.investedAmount * (currentProb / pos.entryProbability));
                          const currentPnL = currentExitValue - pos.investedAmount;
                          const entryRate = 100 - pos.entryProbability;

                          return (
                            <div key={pos._id} className="bg-dark/40 border border-dark-border/80 rounded-xl p-3.5 space-y-3 text-xs">
                              <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  pos.outcome === 'YES' 
                                    ? 'bg-purple-500/10 text-brand-purple border border-brand-purple/20' 
                                    : 'bg-blue-500/10 text-brand-blue border border-brand-blue/20'
                                }`}>
                                  {pos.outcome} Bet
                                </span>
                                <span className="text-[10px] text-dark-muted font-bold">
                                  Entry: +{entryRate}%
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-dark-muted">Stake:</span> <span className="text-white font-bold">{pos.investedAmount} MXP</span>
                                </div>
                                <div>
                                  <span className="text-dark-muted">Current Value:</span> <span className="text-white font-bold">{currentExitValue} MXP</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2.5 border-t border-dark-border/20">
                                <span className={`font-bold ${currentPnL >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                                  {currentPnL >= 0 ? '+' : ''}{currentPnL} MXP
                                </span>
                                
                                <button
                                  onClick={() => handleCloseTrade(pos._id)}
                                  disabled={tradeLoading}
                                  className="bg-dark border border-dark-border hover:border-white text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Sell Bet
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Administrator resolution panel */}
            {user?.role === 'Admin' && (
              <div className="bg-dark-card border border-brand-danger/35 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-danger"></div>
                <h3 className="text-xs font-bold text-brand-danger uppercase tracking-wider mb-6 flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Administrative Resolution</span>
                </h3>

                {adminError && (
                  <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{adminError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2">
                      Correct Outcome
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setResolutionOutcome('YES')}
                        className={`text-xs font-bold py-2 rounded-lg border ${
                          resolutionOutcome === 'YES'
                            ? 'bg-brand-success/15 border-brand-success text-brand-success'
                            : 'bg-dark/40 border-dark-border/60 text-dark-muted'
                        }`}
                      >
                        YES Win
                      </button>
                      <button
                        onClick={() => setResolutionOutcome('NO')}
                        className={`text-xs font-bold py-2 rounded-lg border ${
                          resolutionOutcome === 'NO'
                            ? 'bg-brand-success/15 border-brand-success text-brand-success'
                            : 'bg-dark/40 border-dark-border/60 text-dark-muted'
                        }`}
                      >
                        NO Win
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2" htmlFor="source">
                      Verification Source Description
                    </label>
                    <input
                      id="source"
                      type="text"
                      value={resolutionSource}
                      onChange={(e) => setResolutionSource(e.target.value)}
                      placeholder="e.g. Verified by official AP News release dated..."
                      className="w-full bg-dark/60 border border-dark-border rounded-xl px-4.5 py-2 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <button
                      onClick={handleResolveMarket}
                      disabled={adminLoading}
                      className="bg-brand-success text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={handleCancelMarket}
                      disabled={adminLoading}
                      className="bg-brand-danger text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketDetails;
