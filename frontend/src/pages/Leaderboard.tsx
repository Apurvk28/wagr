import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getLeaderboardData, type LeaderboardUser } from '../services/leaderboardService';
import { formatMXP } from '../utils';
import { Trophy, Search, Sparkles, TrendingUp, Award, ArrowUp, ArrowDown } from 'lucide-react';

type SortBy = 'profit' | 'accuracy';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('profit');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardData(sortBy);
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [sortBy]);

  // Filter users by search term
  const filteredUsers = users.filter(
    u =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = filteredUsers.slice(0, 3);
  // Sort podium items specifically as [2nd, 1st, 3rd] for classic podium display layout
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push(topThree[1]); // 2nd Place
  if (topThree[0]) podiumOrder.push(topThree[0]); // 1st Place
  if (topThree[2]) podiumOrder.push(topThree[2]); // 3rd Place

  const tableList = filteredUsers.slice(3);

  const renderPodiumItem = (user: LeaderboardUser, idx: number) => {
    // Determine podium rank based on user.rank
    const rank = user.rank;
    let cardHeight = 'h-52';
    let ringColor = 'border-brand-purple/20';
    let bgGlow = 'bg-brand-purple/5';
    let medalIcon = '🏆';
    let rankText = '1st';
    let labelColor = 'text-yellow-400';

    if (rank === 2) {
      cardHeight = 'h-44';
      ringColor = 'border-slate-400/40';
      bgGlow = 'bg-slate-400/5';
      medalIcon = '🥈';
      rankText = '2nd';
      labelColor = 'text-slate-300';
    } else if (rank === 3) {
      cardHeight = 'h-40';
      ringColor = 'border-amber-600/30';
      bgGlow = 'bg-amber-600/5';
      medalIcon = '🥉';
      rankText = '3rd';
      labelColor = 'text-amber-500';
    } else {
      cardHeight = 'h-52';
      ringColor = 'border-yellow-400/40';
      bgGlow = 'bg-yellow-400/10 shadow-lg shadow-yellow-500/5';
      medalIcon = '🥇';
      rankText = '1st';
      labelColor = 'text-yellow-400';
    }

    return (
      <Link
        to={`/user/${user.username}`}
        key={user.id}
        className={`flex-1 flex flex-col justify-end items-center text-center p-5 rounded-3xl bg-dark-card border ${ringColor} ${bgGlow} transition-all duration-300 hover:scale-[1.03] group relative`}
      >
        <span className="absolute -top-4 text-2xl">{medalIcon}</span>
        
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white text-base font-black mb-3 border-2 border-white/10 shadow-lg shadow-brand-purple/10">
          {user.fullName.charAt(0)}
        </div>

        <h3 className="text-xs font-black text-white truncate max-w-[120px] group-hover:text-brand-purple transition-colors">
          {user.fullName}
        </h3>
        <p className="text-[10px] text-dark-muted mb-3">@{user.username}</p>

        {/* Podium Base */}
        <div className={`w-full bg-dark/60 border border-dark-border/40 rounded-2xl p-2.5 flex flex-col items-center justify-center ${cardHeight}`}>
          <span className={`text-base font-black ${labelColor} tracking-tight leading-none mb-1.5`}>
            {rankText}
          </span>
          <p className="text-xs font-bold text-white leading-none">
            {sortBy === 'profit' ? formatMXP(user.portfolioValue) : `${user.predictionAccuracy}%`}
          </p>
          <span className="text-[8px] text-dark-muted font-semibold uppercase tracking-wider mt-1 leading-none">
            {sortBy === 'profit' ? 'Portfolio Value' : 'Accuracy'}
          </span>
          <span className="text-[9px] bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2 py-0.5 rounded-full mt-3 font-black">
            🏅 {user.badgesCount}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest leading-none">Global Rankings</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              Leaderboards<span className="text-brand-blue">.</span>
            </h1>
            <p className="text-sm text-dark-muted mt-1.5">Trade probabilities, correct predictions, and rank among the best.</p>
          </div>

          {/* Quick Stats Mini Panel */}
          <div className="flex justify-center space-x-4 bg-dark-card border border-dark-border/60 p-1.5 rounded-2xl w-fit mx-auto md:mx-0">
            <button
              onClick={() => setSortBy('profit')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-all ${
                sortBy === 'profit'
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <TrendingUp size={13} />
              <span>By Profit</span>
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-all ${
                sortBy === 'accuracy'
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <Award size={13} />
              <span>By Accuracy</span>
            </button>
          </div>
        </div>

        {/* Podium Display (Top 3) */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-end gap-5 max-w-3xl mx-auto mb-14 pt-8">
            {/* Show podium order: 2nd place, 1st place, 3rd place */}
            {podiumOrder.map((user, idx) => renderPodiumItem(user, idx))}
          </div>
        )}

        {/* Search & Listing */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rankings Table</h2>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-4 flex items-center text-dark-muted">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search competitors..."
                className="w-full bg-dark-card border border-dark-border/60 rounded-xl pl-11 pr-4 py-2 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-dark-card/50 border border-dark-border/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-dark-card border border-dark-border/40 rounded-2xl py-16 text-center">
              <Trophy size={28} className="mx-auto mb-3 text-dark-muted" />
              <p className="text-sm font-bold text-white mb-1">No Competitors Found</p>
              <p className="text-xs text-dark-muted">Try searching another user.</p>
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border/60 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dark-border/40 text-[10px] font-bold text-dark-muted uppercase tracking-wider bg-dark/20">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th className="py-4 px-6">Trader</th>
                      <th className="py-4 px-6 text-right">Badges</th>
                      <th className="py-4 px-6 text-right">Accuracy</th>
                      <th className="py-4 px-6 text-right">Portfolio Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/20 text-xs">
                    {tableList.map(user => (
                      <tr
                        key={user.id}
                        className="hover:bg-dark/45 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6 text-center font-bold text-dark-muted w-16 group-hover:text-white">
                          #{user.rank}
                        </td>
                        <td className="py-4 px-6">
                          <Link to={`/user/${user.username}`} className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-brand-purple transition-colors">
                                {user.fullName}
                              </p>
                              <p className="text-[10px] text-dark-muted">@{user.username}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-white">
                          <span className="inline-flex items-center space-x-1 bg-brand-purple/5 border border-brand-purple/10 px-2 py-0.5 rounded text-[10px] text-brand-purple">
                            <span>🏅</span>
                            <span>{user.badgesCount}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-brand-success">
                          {user.predictionAccuracy}%
                        </td>
                        <td className="py-4 px-6 text-right font-black text-white">
                          {formatMXP(user.portfolioValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
