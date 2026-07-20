import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getPortfolio, getTradingHistory } from '../services/userService';
import { formatMXP, formatDate } from '../utils';
import { exportBetsHistoryPDF } from '../utils/pdfExporter';
import {
  Wallet,
  TrendingUp,
  Award,
  Activity,
  BarChart3,
  ChevronRight,
  Plus,
  Users,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Lock,
  Compass,
  Eye,
  Footprints,
  Sparkles,
  Target,
  Trophy,
  Download,
} from 'lucide-react';

// --- Types ---
interface OpenPosition {
  _id: string;
  market: { _id: string; title: string; category: string; status: string; resolutionDate: string } | null;
  outcome: 'YES' | 'NO';
  investedAmount: number;
  entryProbability: number;
  currentValue: number;
  unrealizedPnL: number;
  status: string;
  createdAt: string;
}

interface UserAchievement {
  code: string;
  unlockedAt: string;
}

interface PortfolioData {
  mxpBalance: number;
  portfolioValue: number;
  predictionAccuracy: number;
  winRate: number;
  totalResolved: number;
  wins: number;
  openPositionsCount: number;
  totalUnrealizedPnL: number;
  achievements: UserAchievement[];
  openPositions: OpenPosition[];
}

type ActiveTab = 'positions' | 'history' | 'achievements';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('positions');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const data = await getPortfolio();
        setPortfolio(data);
      } catch (err) {
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleTabChange = async (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'history' && tradeHistory.length === 0) {
      setHistoryLoading(true);
      try {
        const data = await getTradingHistory();
        setTradeHistory(data);
      } catch (err) {
        console.error('Trade history fetch error:', err);
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  // --- Skeleton loader ---
  const SkeletonCard = () => (
    <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="h-3 bg-dark-border/60 rounded w-1/2" />
      <div className="h-6 bg-dark-border/60 rounded w-3/4" />
      <div className="h-3 bg-dark-border/60 rounded w-1/3" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
              Portfolio<span className="text-brand-purple">.</span>
            </h1>
            <p className="text-xs text-dark-muted font-medium">
              Real-time forecast holdings, trading metrics, and account credentials
            </p>
          </div>
        </div>

        {/* User Account Details Banner */}
        <div className="mb-8 bg-dark-card border border-dark-border/70 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-lg shadow-lg shadow-brand-purple/20 shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white tracking-tight">{user?.fullName}</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-purple/15 text-brand-purple border border-brand-purple/30 px-2 py-0.5 rounded-full">
                  {user?.role || 'Predictor'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-dark-muted font-medium mt-1">
                <span className="text-brand-blue font-bold">@{user?.username}</span>
                <span className="text-dark-border">&middot;</span>
                <span className="text-white/80 font-mono text-[11px]">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative z-10 shrink-0">
            <button
              onClick={() => exportBetsHistoryPDF(user || {}, portfolio?.openPositions || [])}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl hover:opacity-95 shadow-md shadow-brand-purple/20 transition-all cursor-pointer"
              title="Download Bets & Positions History as PDF"
            >
              <Download size={13} />
              <span>Download Bets PDF</span>
            </button>
            <Link
              to="/wallet"
              className="inline-flex items-center space-x-1.5 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl hover:bg-brand-blue/20 transition-all"
            >
              <Wallet size={13} />
              <span>Wallet: {formatMXP(user?.mxpBalance || 0)}</span>
            </Link>
            <Link
              to="/markets"
              className="inline-flex items-center space-x-1.5 bg-dark border border-dark-border text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl hover:border-brand-purple/40 transition-colors"
            >
              <BarChart3 size={13} />
              <span>Browse Markets</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards Row */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : portfolio ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* MXP Balance */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 relative overflow-hidden group hover:border-brand-purple/30 transition-colors">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-blue" />
              <div className="flex items-center space-x-2 mb-3">
                <Wallet size={14} className="text-brand-purple" />
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">MXP Balance</span>
              </div>
              <p className="text-2xl font-black text-white">{formatMXP(portfolio.mxpBalance)}</p>
              <p className="text-[10px] text-dark-muted mt-1">Available to trade</p>
            </div>

            {/* Portfolio Value */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 relative overflow-hidden hover:border-brand-blue/30 transition-colors">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-blue to-brand-purple" />
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp size={14} className="text-brand-blue" />
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Portfolio Value</span>
              </div>
              <p className="text-2xl font-black text-white">{formatMXP(portfolio.portfolioValue)}</p>
              <p className={`text-[10px] mt-1 font-semibold flex items-center space-x-0.5 ${portfolio.totalUnrealizedPnL >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                {portfolio.totalUnrealizedPnL >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                <span>{portfolio.totalUnrealizedPnL >= 0 ? '+' : ''}{portfolio.totalUnrealizedPnL} MXP unrealized</span>
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 relative overflow-hidden hover:border-brand-success/30 transition-colors">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-brand-success" />
              <div className="flex items-center space-x-2 mb-3">
                <Award size={14} className="text-brand-success" />
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Win Rate</span>
              </div>
              <p className="text-2xl font-black text-white">{portfolio.winRate}%</p>
              <p className="text-[10px] text-dark-muted mt-1">{portfolio.wins} / {portfolio.totalResolved} resolved</p>
            </div>

            {/* Open Positions */}
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 relative overflow-hidden hover:border-brand-purple/30 transition-colors">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-brand-purple/60" />
              <div className="flex items-center space-x-2 mb-3">
                <Activity size={14} className="text-brand-purple" />
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Open Positions</span>
              </div>
              <p className="text-2xl font-black text-white">{portfolio.openPositionsCount}</p>
              <p className="text-[10px] text-dark-muted mt-1">Active bets</p>
            </div>
          </div>
        ) : null}

        {/* Quick Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <BarChart3 size={16} />, label: 'Browse Markets', sub: 'Find new opportunities', to: '/markets', color: 'text-brand-purple' },
            { icon: <Users size={16} />, label: 'Community', sub: 'Discuss & share insights', to: '/community', color: 'text-brand-blue' },
            { icon: <Newspaper size={16} />, label: 'News Hub', sub: 'AI-curated market news', to: '/news', color: 'text-brand-success' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-dark-card border border-dark-border/60 rounded-xl p-4 flex items-center justify-between hover:border-dark-border transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className={item.color}>{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-dark-muted">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-dark-muted group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-dark-card border border-dark-border/60 rounded-xl p-1 mb-6 w-fit">
          {([
            { key: 'positions', label: 'Open Positions' },
            { key: 'history', label: 'Trade History' },
            { key: 'achievements', label: 'Achievements' },
          ] as { key: ActiveTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/25'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'positions' && (
          <div>
            {loading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : portfolio && portfolio.openPositions.length > 0 ? (
              <div className="space-y-3">
                {portfolio.openPositions.map(pos => (
                  <div key={pos._id} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-dark-border transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          pos.outcome === 'YES'
                            ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                            : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                        }`}>
                          {pos.outcome}
                        </span>
                        <span className="text-[10px] text-dark-muted uppercase tracking-wider">{pos.market?.category}</span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">
                        {pos.market?.title ?? 'Market Unavailable'}
                      </p>
                      <div className="flex items-center space-x-1 mt-1 text-[10px] text-dark-muted">
                        <Clock size={10} />
                        <span>Resolves {pos.market?.resolutionDate ? formatDate(pos.market.resolutionDate) : '—'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-right shrink-0">
                      <div>
                        <p className="text-[10px] text-dark-muted uppercase tracking-wider">Staked</p>
                        <p className="text-sm font-bold text-white">{pos.investedAmount} MXP</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-dark-muted uppercase tracking-wider">Current Value</p>
                        <p className="text-sm font-bold text-white">{pos.currentValue} MXP</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-dark-muted uppercase tracking-wider">P&amp;L</p>
                        <p className={`text-sm font-black flex items-center justify-end space-x-0.5 ${pos.unrealizedPnL >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                          {pos.unrealizedPnL >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          <span>{pos.unrealizedPnL >= 0 ? '+' : ''}{pos.unrealizedPnL}</span>
                        </p>
                      </div>
                      {pos.market && (
                        <Link
                          to={`/markets/${pos.market._id}`}
                          className="text-[10px] font-bold text-brand-purple border border-brand-purple/30 px-3 py-1.5 rounded-lg hover:bg-brand-purple/10 transition-colors"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border/40 rounded-2xl py-16 text-center">
                <Activity size={28} className="mx-auto mb-3 text-dark-muted" />
                <p className="text-sm font-bold text-white mb-1">No Open Positions</p>
                <p className="text-xs text-dark-muted mb-5">Start trading to build your portfolio.</p>
                <Link
                  to="/markets"
                  className="inline-block bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Browse Markets
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {historyLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : tradeHistory.length > 0 ? (
              <div className="space-y-3">
                {tradeHistory.map((trade: any) => {
                  const pnl = trade.profitLoss ?? 0;
                  return (
                    <div key={trade._id} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            trade.outcome === 'YES'
                              ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                              : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                          }`}>
                            {trade.outcome}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            trade.status === 'Resolved' ? 'bg-brand-success/10 text-brand-success border border-brand-success/20' : 'bg-dark-border text-dark-muted border border-dark-border'
                          }`}>
                            {trade.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white truncate">
                          {trade.marketId?.title ?? 'Market Unavailable'}
                        </p>
                        <p className="text-[10px] text-dark-muted mt-0.5">{trade.marketId?.category}</p>
                      </div>
                      <div className="flex items-center space-x-6 text-right shrink-0">
                        <div>
                          <p className="text-[10px] text-dark-muted uppercase tracking-wider">Staked</p>
                          <p className="text-sm font-bold text-white">{trade.investedAmount} MXP</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-dark-muted uppercase tracking-wider">Exit Value</p>
                          <p className="text-sm font-bold text-white">{trade.exitValue ?? '—'} MXP</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-dark-muted uppercase tracking-wider">Profit/Loss</p>
                          <p className={`text-sm font-black flex items-center justify-end space-x-0.5 ${pnl >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                            {pnl >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            <span>{pnl >= 0 ? '+' : ''}{pnl}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border/40 rounded-2xl py-16 text-center">
                <Clock size={28} className="mx-auto mb-3 text-dark-muted" />
                <p className="text-sm font-bold text-white mb-1">No Trade History</p>
                <p className="text-xs text-dark-muted">Closed and resolved trades will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[
              {
                code: 'FIRST_STEP',
                title: 'First Step',
                desc: 'Place your first prediction position on wagr.io.',
                icon: <Footprints size={24} className="text-emerald-400" />,
                theme: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400',
              },
              {
                code: 'PROPHET_1',
                title: 'Prophet I',
                desc: 'Predict 5 resolved markets correctly.',
                icon: <Sparkles size={24} className="text-purple-400" />,
                theme: 'from-purple-500/10 to-indigo-500/5 border-purple-500/20 text-purple-400',
              },
              {
                code: 'ACCURACY_ELITE',
                title: 'Accuracy Elite',
                desc: 'Maintain an accuracy rate of >= 80% (min 5 resolved trades).',
                icon: <Target size={24} className="text-amber-400" />,
                theme: 'from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-400',
              },
              {
                code: 'MXP_TYCOON',
                title: 'MXP Tycoon',
                desc: 'Reach a portfolio value of 10,000 MXP or more.',
                icon: <Trophy size={24} className="text-rose-400" />,
                theme: 'from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-400',
              },
              {
                code: 'MARKET_PIONEER',
                title: 'Market Pioneer',
                desc: 'Propose a market that gets approved by an administrator.',
                icon: <Compass size={24} className="text-cyan-400" />,
                theme: 'from-cyan-500/10 to-sky-500/5 border-cyan-500/20 text-cyan-400',
              },
              {
                code: 'INFLUENCER',
                title: 'Influencer',
                desc: 'Gain 3 or more followers on wagr.io.',
                icon: <Users size={24} className="text-blue-400" />,
                theme: 'from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-400',
              },
            ].map(badge => {
              const unlockInfo = portfolio.achievements?.find(a => a.code === badge.code);
              const isUnlocked = !!unlockInfo;

              return (
                <div
                  key={badge.code}
                  className={`relative overflow-hidden bg-dark-card border rounded-2xl p-5 flex items-start space-x-4 transition-all duration-300 ${
                    isUnlocked
                      ? `border-opacity-100 bg-gradient-to-br ${badge.theme}`
                      : 'border-dark-border/40 opacity-40 hover:opacity-50 grayscale'
                  }`}
                >
                  <div className={`p-3 rounded-xl bg-dark/60 border ${isUnlocked ? 'border-current' : 'border-dark-border/60'} shrink-0`}>
                    {isUnlocked ? badge.icon : <Lock size={24} className="text-dark-muted" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-black text-white truncate">{badge.title}</h4>
                      {isUnlocked && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-dark-muted">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                      {badge.desc}
                    </p>
                    {isUnlocked && unlockInfo.unlockedAt ? (
                      <p className="text-[9px] text-dark-muted flex items-center space-x-1 font-semibold uppercase tracking-wider">
                        <span>Unlocked {formatDate(unlockInfo.unlockedAt)}</span>
                      </p>
                    ) : (
                      <p className="text-[9px] text-dark-muted font-semibold uppercase tracking-wider flex items-center space-x-1">
                        <span>Locked</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
