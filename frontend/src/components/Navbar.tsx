import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatMXP } from '../utils';
import api from '../services/api';
import { globalSearch, type SearchResults } from '../services/searchService';
import { Menu, X, Wallet, User as UserIcon, LogOut, ChevronDown, Search, ShieldAlert } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, reloadProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showBalanceControls, setShowBalanceControls] = useState(false);

  // Global Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchOpen) return;
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }
    const delay = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await globalSearch(searchQuery.trim());
        setSearchResults(data);
      } catch { /* ignore */ }
      finally { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, searchOpen]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setSearchQuery('');
      setSearchResults(null);
    }
  }, [searchOpen]);

  const closeSearch = () => setSearchOpen(false);

  const handleSearchNavigate = (url: string) => {
    closeSearch();
    navigate(url);
  };

  const handleAdjustBalance = async (amount: number) => {
    try {
      await api.post('/users/admin/balance', { amount });
      await reloadProfile();
      setShowBalanceControls(false);
    } catch (err) {
      console.error('Failed to adjust balance:', err);
    }
  };


  const toggleDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <nav className="bg-dark/80 backdrop-blur-md border-b border-dark-border/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-base shadow-lg shadow-brand-purple/10">
                W
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                wagr<span className="text-brand-blue">.io</span>
              </span>
            </Link>
          </div>

          {/* Centered Desktop Menu */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-8 lg:space-x-10 text-sm font-medium text-dark-muted">
              <Link to="/markets" className="hover:text-white transition-colors duration-150 py-2">
                Prediction Markets
              </Link>
              <Link to="/news" className="hover:text-white transition-colors duration-150 py-2">
                News Hub
              </Link>
              <Link to="/community" className="hover:text-white transition-colors duration-150 py-2">
                Community
              </Link>
              <Link to="/leaderboard" className="hover:text-white transition-colors duration-150 py-2">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* User Controls / Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3.5 pl-4 border-l border-dark-border/40">
                {/* Global Search Button */}
                <button
                  id="global-search-btn"
                  onClick={() => setSearchOpen(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-muted hover:text-white hover:bg-dark-card border border-transparent hover:border-dark-border/60 transition-all cursor-pointer"
                  title="Search markets, users, news..."
                >
                  <Search size={15} />
                </button>

                {/* Notification Bell */}
                <NotificationBell />

                {/* Wallet Balance Display (Links to /wallet) */}
                <Link
                  to="/wallet"
                  className="bg-dark-card/90 hover:bg-dark-card border border-dark-border/80 hover:border-brand-purple/40 rounded-full pl-3.5 pr-4 py-1.5 flex items-center space-x-2 shadow-inner text-xs font-semibold text-brand-blue transition-all cursor-pointer"
                  title="Open MXP Wallet"
                >
                  <Wallet size={14} className="text-brand-blue" />
                  <span>{formatMXP(user.mxpBalance)}</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-dark-card hover:bg-dark-card/80 border border-dark-border rounded-full px-3 py-1.5 transition-colors focus:outline-none"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-[10px] font-black text-white">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs text-white/90 font-medium">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown size={12} className={`text-dark-muted transform transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl py-1.5 shadow-2xl z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-dark-border/50">
                        <p className="text-xs text-white font-semibold truncate">{user.fullName}</p>
                        <p className="text-[10px] text-dark-muted truncate">@{user.username}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-white/80 hover:bg-dark/45 hover:text-white transition-colors"
                      >
                        <UserIcon size={13} />
                        <span>My Portfolio</span>
                      </Link>
                      {user.role === 'Admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-brand-danger/90 hover:bg-dark/45 hover:text-brand-danger transition-colors"
                        >
                          <ShieldAlert size={13} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-xs text-brand-danger/95 hover:bg-dark/45 hover:text-brand-danger transition-colors border-t border-dark-border/50"
                      >
                        <LogOut size={13} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-white/95 hover:text-white transition-colors py-2 px-3"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-full px-5 py-2 text-xs font-bold shadow-lg shadow-brand-purple/10 hover:opacity-95 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-card focus:outline-none focus:ring-1 focus:ring-dark-border"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border/40 bg-dark-card py-3.5 space-y-2.5 px-4 shadow-xl">
          <Link
            to="/markets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            Prediction Markets
          </Link>
          <Link
            to="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            News Hub
          </Link>
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            Community
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            Leaderboard
          </Link>

          {/* Guest or User actions for Mobile */}
          <div className="border-t border-dark-border/40 pt-3.5 space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                {user.role === 'Admin' ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue">
                      <Wallet size={14} />
                      <span>Wallet: {formatMXP(user.mxpBalance)} (Admin)</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          await handleAdjustBalance(10000);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-brand-success/15 hover:bg-brand-success/20 border border-brand-success/30 px-3 py-1 rounded-lg text-[9px] text-brand-success font-bold uppercase tracking-wider"
                      >
                        + 10k MXP
                      </button>
                      <button
                        onClick={async () => {
                          await handleAdjustBalance(-10000);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-brand-danger/15 hover:bg-brand-danger/20 border border-brand-danger/30 px-3 py-1 rounded-lg text-[9px] text-brand-danger font-bold uppercase tracking-wider"
                      >
                        - 10k MXP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue">
                    <Wallet size={14} />
                    <span>Wallet: {formatMXP(user.mxpBalance)}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-2 w-full text-xs text-brand-danger py-1"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs text-white/90 border border-dark-border rounded-xl py-2 font-semibold hover:bg-dark transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2 font-bold hover:opacity-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[9998] flex items-start justify-center pt-24 px-4"
          onClick={closeSearch}
        >
          <div
            className="w-full max-w-xl bg-dark-card border border-dark-border/60 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center space-x-3 px-4 py-3 border-b border-dark-border/40">
              <Search size={16} className="text-dark-muted shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search markets, users, news, posts..."
                className="flex-1 bg-transparent text-sm text-white placeholder-dark-muted focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-dark-muted hover:text-white">
                  <X size={14} />
                </button>
              )}
              <button onClick={closeSearch} className="text-dark-muted hover:text-white ml-1">
                <kbd className="text-[9px] border border-dark-border rounded px-1.5 py-0.5 text-dark-muted">ESC</kbd>
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[420px] overflow-y-auto">
              {searchLoading && (
                <div className="flex items-center justify-center py-10 text-xs text-dark-muted">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-purple/20 border-t-brand-purple animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {!searchLoading && searchResults && (
                <div className="divide-y divide-dark-border/20">
                  {/* Markets */}
                  {searchResults.markets.length > 0 && (
                    <div className="py-2 px-4">
                      <p className="text-[9px] font-bold text-dark-muted uppercase tracking-widest mb-2">Markets</p>
                      {searchResults.markets.map((m: any) => (
                        <button
                          key={m._id}
                          onClick={() => handleSearchNavigate(`/markets/${m._id}`)}
                          className="w-full text-left flex items-center justify-between py-2 px-2 rounded-xl hover:bg-dark/40 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{m.title}</p>
                            <p className="text-[10px] text-dark-muted">{m.category}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2 ${
                            m.status === 'Live' ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' : 'bg-dark-border text-dark-muted border border-dark-border'
                          }`}>{m.status}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Users */}
                  {searchResults.users.length > 0 && (
                    <div className="py-2 px-4">
                      <p className="text-[9px] font-bold text-dark-muted uppercase tracking-widest mb-2">Users</p>
                      {searchResults.users.map((u: any) => (
                        <button
                          key={u._id}
                          onClick={() => handleSearchNavigate(`/user/${u.username}`)}
                          className="w-full text-left flex items-center space-x-3 py-2 px-2 rounded-xl hover:bg-dark/40 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white text-[10px] font-black shrink-0">
                            {u.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{u.fullName}</p>
                            <p className="text-[10px] text-dark-muted">@{u.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* News */}
                  {searchResults.news.length > 0 && (
                    <div className="py-2 px-4">
                      <p className="text-[9px] font-bold text-dark-muted uppercase tracking-widest mb-2">News</p>
                      {searchResults.news.map((n: any) => (
                        <button
                          key={n._id}
                          onClick={() => handleSearchNavigate('/news')}
                          className="w-full text-left py-2 px-2 rounded-xl hover:bg-dark/40 transition-colors"
                        >
                          <p className="text-xs font-semibold text-white truncate">{n.headline}</p>
                          <p className="text-[10px] text-dark-muted">{n.source} &middot; {n.category}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Posts */}
                  {searchResults.posts.length > 0 && (
                    <div className="py-2 px-4">
                      <p className="text-[9px] font-bold text-dark-muted uppercase tracking-widest mb-2">Community Posts</p>
                      {searchResults.posts.map((p: any) => (
                        <button
                          key={p._id}
                          onClick={() => handleSearchNavigate('/community')}
                          className="w-full text-left py-2 px-2 rounded-xl hover:bg-dark/40 transition-colors"
                        >
                          <p className="text-[10px] text-dark-muted mb-0.5">@{p.userId?.username}</p>
                          <p className="text-xs text-white truncate">{p.content}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {searchResults.total === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-xs text-dark-muted">No results found for &ldquo;{searchResults.query}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hint */}
              {!searchLoading && !searchResults && searchQuery.length < 2 && (
                <div className="py-8 text-center text-xs text-dark-muted">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
