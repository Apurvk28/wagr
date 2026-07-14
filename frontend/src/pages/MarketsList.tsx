import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarketCard from '../components/MarketCard';
import { getMarkets } from '../services/marketService';
import { toggleFollowCategory } from '../services/communityService';
import type { Market } from '../types';
import { Search, SlidersHorizontal, Plus, Bell, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Categories = [
  'All',
  'Artificial Intelligence',
  'Technology',
  'Finance',
  'Sports',
  'Politics'
];

const MarketsList: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [marketType, setMarketType] = useState<'All' | 'Long-Term' | 'Short-Term'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'volume'>('newest');

  // Category follow state
  const [followedCategories, setFollowedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (marketType !== 'All') params.marketType = marketType;

        const data = await getMarkets(params);
        setMarkets(data);
      } catch (err: any) {
        console.error('Error fetching markets:', err);
        setError('Failed to fetch prediction contracts.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMarkets();
    }, 300); // 300ms debounce on keystrokes

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, marketType]);

  const handleToggleCategoryFollow = async (category: string) => {
    if (!isAuthenticated || category === 'All') return;
    try {
      const result = await toggleFollowCategory(category);
      setFollowedCategories(prev => {
        const next = new Set(prev);
        if (result.isFollowing) {
          next.add(category);
        } else {
          next.delete(category);
        }
        return next;
      });
    } catch (err) {
      console.error('Category follow toggle failed:', err);
    }
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="w-full bg-dark-card/60 border border-dark-border/40 rounded-2xl p-5 space-y-4 animate-pulse">
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
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-3">
              Event Contracts<span className="text-brand-purple">.</span>
            </h1>
            <p className="text-sm text-dark-muted max-w-md">
              Trade dynamic probabilities on real-world events. Express your conviction on future outcomes.
            </p>
          </div>

          {isAuthenticated && user?.role === 'Admin' && (
            <Link
              to="/markets/create"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl hover:opacity-95 transform active:scale-98 transition-all shadow-lg shadow-brand-purple/20"
            >
              <Plus size={14} />
              <span>Create Market</span>
            </Link>
          )}
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-4 flex items-center text-dark-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contracts by title, description or keywords..."
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center space-x-2 border rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                showFilters 
                  ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                  : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white hover:border-dark-border'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>

          {/* Collapsible Filter Panel Drawer */}
          {showFilters && (
            <div className="pt-4 border-t border-dark-border/20 space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sort markets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                    Sort Markets
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                        sortBy === 'newest'
                          ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => setSortBy('volume')}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                        sortBy === 'volume'
                          ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                      }`}
                    >
                      High Volume
                    </button>
                  </div>
                </div>

                {/* Market Type Sector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                    Market Type
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setMarketType('All')}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                        marketType === 'All'
                          ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setMarketType('Long-Term')}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                        marketType === 'Long-Term'
                          ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                      }`}
                    >
                      Long-Term
                    </button>
                    <button
                      onClick={() => setMarketType('Short-Term')}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                        marketType === 'Short-Term'
                          ? 'bg-brand-purple/10 border-brand-purple/45 text-brand-purple'
                          : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                      }`}
                    >
                      Short-Term
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag Categories Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                  Filter by Tag
                </span>
                <div className="flex flex-wrap gap-2">
                  {Categories.map((category) => {
                    const active = selectedCategory === category;
                    const isFollowingCat = followedCategories.has(category);
                    return (
                      <div key={category} className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200 ${
                            active
                              ? 'bg-brand-purple/20 border-brand-purple/60 text-brand-purple'
                              : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white hover:border-dark-border'
                          }`}
                        >
                          {category}
                        </button>
                        {isAuthenticated && category !== 'All' && (
                          <button
                            id={`follow-cat-${category.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => handleToggleCategoryFollow(category)}
                            title={isFollowingCat ? `Unfollow ${category}` : `Follow ${category} for new market alerts`}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFollowingCat
                                ? 'bg-brand-purple/15 border-brand-purple/50 text-brand-purple'
                                : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-brand-purple hover:border-brand-purple/40'
                            }`}
                          >
                            {isFollowingCat ? <BellOff size={11} /> : <Bell size={11} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2 mb-8 animate-fade-in">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Markets Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : markets.length > 0 ? (
          (() => {
            // 1. Sort markets
            const sortedMarkets = [...markets].sort((a, b) => {
              if (sortBy === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              } else {
                return (b.volume || 0) - (a.volume || 0);
              }
            });

            // 2. Partition markets
            const shortTerm = sortedMarkets.filter(m => m.marketType === 'Short-Term');
            const longTerm = sortedMarkets.filter(m => m.marketType === 'Long-Term' || !m.marketType);

            // 3. Apply Market Type filters
            const showShortTerm = marketType === 'All' || marketType === 'Short-Term';
            const showLongTerm = marketType === 'All' || marketType === 'Long-Term';

            return (
              <div className="space-y-12 animate-fade-in">
                {/* Short-Term Markets Section */}
                {showShortTerm && (
                  <div className="space-y-5">
                    <div className="flex items-center space-x-2 border-b border-dark-border/20 pb-2">
                      <span className="text-xl">⚡</span>
                      <h2 className="text-base font-extrabold text-white tracking-tight leading-none uppercase">
                        Short-Term Markets
                      </h2>
                      <span className="text-[10px] bg-brand-danger/10 border border-brand-danger/35 text-brand-danger font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        closes in 24h
                      </span>
                    </div>
                    {shortTerm.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {shortTerm.map((market) => (
                          <MarketCard key={market._id} market={market} isDailyFlash={true} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-10 text-center">
                        <p className="text-xs text-dark-muted">No active Short-Term markets available today.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Long-Term Markets Section */}
                {showLongTerm && (
                  <div className="space-y-5">
                    <div className="flex items-center space-x-2 border-b border-dark-border/20 pb-2">
                      <span className="text-xl">🌐</span>
                      <h2 className="text-base font-extrabold text-white tracking-tight leading-none uppercase">
                        Long-Term Markets
                      </h2>
                      <span className="text-[10px] bg-brand-purple/10 border border-brand-purple/35 text-brand-purple font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        strategic
                      </span>
                    </div>
                    {longTerm.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {longTerm.map((market) => (
                          <MarketCard key={market._id} market={market} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-10 text-center">
                        <p className="text-xs text-dark-muted">No active Long-Term markets available right now.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-20 text-center flex flex-col items-center justify-center">
            <span className="text-3xl mb-4">🔍</span>
            <p className="text-sm text-white font-bold mb-1">No markets found</p>
            <p className="text-xs text-dark-muted max-w-xs leading-relaxed">
              We couldn't find any event contracts matching your criteria. Try adjusting your search query or selected category.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MarketsList;
