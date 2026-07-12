import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAdminDashboard,
  getAllAdminUsers,
  suspendUser,
  getPendingMarkets,
  getAllAdminPosts,
  deleteAdminPost,
} from '../services/adminService';
import { approveMarket, rejectMarket } from '../services/marketService';
import { formatDate, formatMXP } from '../utils';
import {
  Users,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

type Tab = 'overview' | 'markets' | 'users' | 'posts';

interface DashboardStats {
  totalUsers: number;
  recentUsers: number;
  totalMarkets: number;
  liveMarkets: number;
  resolvedMarkets: number;
  pendingMarkets: number;
  totalPositions: number;
  totalVolume: number;
  totalPosts: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingMarkets, setPendingMarkets] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Load tab data on switch
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 'overview') {
          const data = await getAdminDashboard();
          setStats(data);
        } else if (activeTab === 'markets') {
          const data = await getPendingMarkets();
          setPendingMarkets(data);
        } else if (activeTab === 'users') {
          const data = await getAllAdminUsers(searchTerm);
          setUsers(data);
        } else if (activeTab === 'posts') {
          const data = await getAllAdminPosts();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  // Debounced user search
  useEffect(() => {
    if (activeTab !== 'users') return;
    const delay = setTimeout(async () => {
      try {
        const data = await getAllAdminUsers(searchTerm);
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleApprove = async (marketId: string) => {
    try {
      await approveMarket(marketId);
      setPendingMarkets(prev => prev.filter(m => m._id !== marketId));
      showFeedback('success', 'Market approved and published.');
    } catch {
      showFeedback('error', 'Failed to approve market.');
    }
  };

  const handleReject = async (marketId: string) => {
    try {
      await rejectMarket(marketId);
      setPendingMarkets(prev => prev.filter(m => m._id !== marketId));
      showFeedback('success', 'Market rejected.');
    } catch {
      showFeedback('error', 'Failed to reject market.');
    }
  };

  const handleSuspend = async (userId: string, isSuspended: boolean) => {
    try {
      await suspendUser(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isSuspended: !isSuspended } : u));
      showFeedback('success', isSuspended ? 'User unsuspended.' : 'User suspended.');
    } catch {
      showFeedback('error', 'Failed to update user status.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deleteAdminPost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      showFeedback('success', 'Post deleted.');
    } catch {
      showFeedback('error', 'Failed to delete post.');
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { key: 'markets', label: 'Pending Markets', icon: <Activity size={14} /> },
    { key: 'users', label: 'Users', icon: <Users size={14} /> },
    { key: 'posts', label: 'Posts', icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold bg-brand-danger/10 text-brand-danger border border-brand-danger/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
              Admin Only
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">
            Admin Panel<span className="text-brand-danger">.</span>
          </h1>
          <p className="text-sm text-dark-muted mt-1">Platform management &amp; moderation dashboard</p>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div className={`mb-6 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-brand-success/10 border-brand-success/30 text-brand-success'
              : 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-dark-card border border-dark-border/60 rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-brand-danger text-white shadow-lg shadow-brand-danger/25'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.key === 'markets' && pendingMarkets.length > 0 && (
                <span className="bg-white text-brand-danger text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                  {pendingMarkets.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 animate-pulse h-16" />
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, sub: `+${stats.recentUsers} this week`, color: 'text-brand-blue', icon: <Users size={14} className="text-brand-blue" /> },
                { label: 'Live Markets', value: stats.liveMarkets, sub: `${stats.totalMarkets} total`, color: 'text-brand-purple', icon: <Activity size={14} className="text-brand-purple" /> },
                { label: 'Pending Approval', value: stats.pendingMarkets, sub: 'Awaiting review', color: 'text-yellow-400', icon: <AlertTriangle size={14} className="text-yellow-400" /> },
                { label: 'Total Volume', value: formatMXP(stats.totalVolume), sub: `${stats.totalPositions} trades`, color: 'text-brand-success', icon: <TrendingUp size={14} className="text-brand-success" /> },
                { label: 'Resolved Markets', value: stats.resolvedMarkets, sub: 'Completed markets', color: 'text-brand-success', icon: <CheckCircle2 size={14} className="text-brand-success" /> },
                { label: 'Community Posts', value: stats.totalPosts, sub: 'User posts', color: 'text-brand-blue', icon: <MessageSquare size={14} className="text-brand-blue" /> },
              ].map(card => (
                <div key={card.label} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 hover:border-dark-border transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    {card.icon}
                    <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">{card.label}</span>
                  </div>
                  <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                  <p className="text-[10px] text-dark-muted mt-1">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Markets Tab */}
        {!loading && activeTab === 'markets' && (
          <div className="space-y-4">
            {pendingMarkets.length === 0 ? (
              <div className="bg-dark-card border border-dark-border/40 rounded-2xl py-16 text-center">
                <CheckCircle2 size={28} className="mx-auto mb-3 text-brand-success" />
                <p className="text-sm font-bold text-white">No Pending Markets</p>
                <p className="text-xs text-dark-muted">All markets have been reviewed.</p>
              </div>
            ) : (
              pendingMarkets.map(market => (
                <div key={market._id} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2 py-0.5 rounded uppercase tracking-wider">
                          {market.category}
                        </span>
                        <span className="text-[10px] text-dark-muted">by @{market.createdBy?.username}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{market.title}</h3>
                      <p className="text-xs text-dark-muted line-clamp-2 leading-relaxed">{market.description}</p>
                      <p className="text-[10px] text-dark-muted mt-2">
                        Resolution: {formatDate(market.resolutionDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleReject(market._id)}
                        className="flex items-center space-x-1.5 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs font-bold px-3 py-2 rounded-xl hover:bg-brand-danger/20 transition-colors"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(market._id)}
                        className="flex items-center space-x-1.5 bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs font-bold px-3 py-2 rounded-xl hover:bg-brand-success/20 transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {!loading && activeTab === 'users' && (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-dark-muted">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search users by name, username, or email..."
                className="w-full bg-dark-card border border-dark-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
              />
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u._id} className="bg-dark-card border border-dark-border/60 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {u.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{u.fullName} <span className="text-dark-muted font-normal">@{u.username}</span></p>
                      <p className="text-[10px] text-dark-muted">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                      u.role === 'Admin'
                        ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
                        : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
                    }`}>
                      {u.role}
                    </span>
                    {u.role !== 'Admin' && (
                      <button
                        onClick={() => handleSuspend(u._id, u.isSuspended)}
                        className={`flex items-center space-x-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          u.isSuspended
                            ? 'bg-brand-success/10 border-brand-success/30 text-brand-success hover:bg-brand-success/20'
                            : 'bg-dark border-dark-border text-dark-muted hover:border-brand-danger/40 hover:text-brand-danger'
                        }`}
                      >
                        {u.isSuspended ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                        <span>{u.isSuspended ? 'Unsuspend' : 'Suspend'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {!loading && activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border/40 rounded-2xl py-16 text-center">
                <MessageSquare size={28} className="mx-auto mb-3 text-dark-muted" />
                <p className="text-sm font-bold text-white">No Posts Found</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-dark-card border border-dark-border/60 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-dark-muted mb-1">
                      @{post.userId?.username} &middot; {formatDate(post.createdAt)}
                    </p>
                    <p className="text-xs text-white leading-relaxed line-clamp-2">{post.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center space-x-1.5 text-[10px] font-bold text-brand-danger border border-brand-danger/30 px-3 py-1.5 rounded-lg hover:bg-brand-danger/10 transition-colors shrink-0"
                  >
                    <Trash2 size={11} />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
