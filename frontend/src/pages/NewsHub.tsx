import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNewsFeed, syncAiNews } from '../services/newsService';
import type { NewsArticle } from '../services/newsService';
import { useAuth } from '../context/AuthContext';
import { Search, SlidersHorizontal, RefreshCw, Calendar, Link2, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils';

const NewsCategories = [
  'All',
  'Artificial Intelligence',
  'Technology',
  'Finance',
  'Business',
  'Startups',
  'Sports',
  'Global Affairs'
];

interface ExtendedNewsArticle extends NewsArticle {
  views?: number;
}

const NewsHub: React.FC = () => {
  const { user } = useAuth();
  
  const [articles, setArticles] = useState<ExtendedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'visited'>('newest');
  
  // Administrative States
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      
      const data = await getNewsFeed(params);
      
      // Inject mock views for sorting by popularity/visits
      const enrichedData = data.map((art) => {
        // Deterministic views based on ID to avoid shifts on re-renders
        const seed = parseInt(art._id.substring(art._id.length - 6), 16) || 12345;
        const views = (seed % 840) + 110;
        return { ...art, views };
      });

      setArticles(enrichedData);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Failed to retrieve recent news briefings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews();
    }, 300); // 300ms search debounce
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory]);

  const handleSyncNews = async () => {
    setSyncing(true);
    setError(null);
    setSyncSuccess(null);
    try {
      const response = await syncAiNews();
      setSyncSuccess(response.message);
      // Reload listings
      await fetchNews();
    } catch (err: any) {
      console.error('Error syncing AI news:', err);
      setError(err.response?.data?.message || 'AI news synchronization failed.');
    } finally {
      setSyncing(false);
    }
  };

  // Perform dynamic client-side sorting
  const getProcessedArticles = () => {
    return [...articles].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      } else {
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        return viewsB - viewsA;
      }
    });
  };

  const processedArticles = getProcessedArticles();

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-dark-card border border-dark-border/40 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-20 h-4 bg-dark-border rounded"></div>
            <div className="w-16 h-3 bg-dark-border rounded"></div>
          </div>
          <div className="w-3/4 h-5 bg-dark-border rounded"></div>
          <div className="w-full h-12 bg-dark-border rounded-lg"></div>
          <div className="w-full h-16 bg-dark-border rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block - Centered */}
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-3">
            News Hub<span className="text-brand-blue">.</span>
          </h1>
          <p className="text-sm text-dark-muted max-w-md mb-6">
            AI-curated news briefings mapping real-world developments directly to forecasting probabilities.
          </p>

          {user?.role === 'Admin' && (
            <button
              onClick={handleSyncNews}
              disabled={syncing}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-95 transform active:scale-98 transition-all disabled:opacity-60 shadow-lg shadow-brand-blue/15 mx-auto"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing news...' : 'Sync AI News'}</span>
            </button>
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
                placeholder="Search briefings by keyword, topic or publication..."
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-blue/70 transition-colors"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center space-x-2 border rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                showFilters 
                  ? 'bg-brand-blue/10 border-brand-blue/45 text-brand-blue'
                  : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white hover:border-dark-border'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-dark-border/20 space-y-5 animate-fade-in">
              {/* Other Filters (Sorting Criteria) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                  Sort Articles
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                      sortBy === 'newest'
                        ? 'bg-brand-blue/10 border-brand-blue/45 text-brand-blue'
                        : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy('visited')}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                      sortBy === 'visited'
                        ? 'bg-brand-blue/10 border-brand-blue/45 text-brand-blue'
                        : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white'
                    }`}
                  >
                    Most Visited
                  </button>
                </div>
              </div>

              {/* Tags Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                  Filter by Tag
                </span>
                <div className="flex flex-wrap gap-2">
                  {NewsCategories.map((category) => {
                    const active = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200 ${
                          active
                            ? 'bg-brand-blue/20 border-brand-blue/60 text-brand-blue'
                            : 'bg-dark/40 border-dark-border/60 text-dark-muted hover:text-white hover:border-dark-border'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Overlays */}
        {syncSuccess && (
          <div className="bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs px-4 py-3 rounded-xl flex items-center space-x-2 mb-8 animate-fade-in">
            <span className="font-bold">✓</span>
            <span>{syncSuccess}</span>
          </div>
        )}

        {error && (
          <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2 mb-8 animate-fade-in">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* News Feed Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : processedArticles.length > 0 ? (
          (() => {
            const shortTermNews = processedArticles.filter(
              (art) => art.relatedMarket && art.relatedMarket.marketType === 'Short-Term'
            );
            const longTermNews = processedArticles.filter(
              (art) => !art.relatedMarket || art.relatedMarket.marketType === 'Long-Term'
            );

            return (
              <div className="space-y-12 animate-fade-in">
                {/* Short-Term News Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 border-b border-dark-border/20 pb-2">
                    <span className="text-xl">⚡</span>
                    <h2 className="text-base font-extrabold text-white tracking-tight leading-none uppercase">
                      Short-Term News Briefings
                    </h2>
                    <span className="text-[10px] bg-brand-blue/10 border border-brand-blue/35 text-brand-blue font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Daily Updates
                    </span>
                  </div>
                  {shortTermNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {shortTermNews.map((article) => (
                        <div
                          key={article._id}
                          className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all duration-250 hover:border-dark-border/100 hover:scale-[1.01]"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded">
                                {article.category}
                              </span>
                              <div className="flex items-center space-x-3 text-[10px] text-dark-muted font-medium">
                                <span className="flex items-center space-x-1">
                                  <Eye size={11} />
                                  <span>{article.views || 120} views</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar size={11} />
                                  <span>{formatDate(article.publishedDate)}</span>
                                </span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <h2 className="text-base font-extrabold text-white leading-snug mb-1 group-hover:text-brand-blue transition-colors">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                  {article.headline}
                                </a>
                              </h2>
                              <span className="text-[10px] text-dark-muted font-bold">
                                via <span className="text-white/80">{article.source}</span>
                              </span>
                            </div>
                            <p className="text-xs text-dark-muted leading-relaxed mb-6">
                              {article.summary}
                            </p>
                          </div>
                          <div className="space-y-4 pt-4 border-t border-dark-border/20">
                            <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3.5 text-xs text-dark-muted relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue"></div>
                              <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wider block mb-1">
                                AI Impact Analysis
                              </span>
                              <p className="leading-relaxed text-[11px]">{article.aiSummary}</p>
                            </div>
                            {article.relatedMarket && (
                              <Link
                                to={`/markets/${article.relatedMarket._id}`}
                                className="inline-flex items-center justify-between w-full bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/20 hover:border-brand-purple/35 rounded-xl px-4 py-2.5 text-xs text-brand-purple transition-all duration-200"
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  <Link2 size={13} className="flex-shrink-0" />
                                  <span className="font-bold truncate text-white">
                                    {article.relatedMarket.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4 font-bold">
                                  <span>YES {article.relatedMarket.yesProbability}%</span>
                                  <span className="text-white/30">•</span>
                                  <span>Trade Now →</span>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-10 text-center">
                      <p className="text-xs text-dark-muted">No daily short-term news briefings currently synced.</p>
                    </div>
                  )}
                </div>

                {/* Long-Term News Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 border-b border-dark-border/20 pb-2">
                    <span className="text-xl">📅</span>
                    <h2 className="text-base font-extrabold text-white tracking-tight leading-none uppercase">
                      Long-Term News Timelines
                    </h2>
                    <span className="text-[10px] bg-brand-purple/10 border border-brand-purple/35 text-brand-purple font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Contracts Timelines
                    </span>
                  </div>
                  {longTermNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {longTermNews.map((article) => (
                        <div
                          key={article._id}
                          className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all duration-250 hover:border-dark-border/100 hover:scale-[1.01]"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded">
                                {article.category}
                              </span>
                              <div className="flex items-center space-x-3 text-[10px] text-dark-muted font-medium">
                                <span className="flex items-center space-x-1">
                                  <Eye size={11} />
                                  <span>{article.views || 120} views</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar size={11} />
                                  <span>{formatDate(article.publishedDate)}</span>
                                </span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <h2 className="text-base font-extrabold text-white leading-snug mb-1 group-hover:text-brand-blue transition-colors">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                  {article.headline}
                                </a>
                              </h2>
                              <span className="text-[10px] text-dark-muted font-bold">
                                via <span className="text-white/80">{article.source}</span>
                              </span>
                            </div>
                            <p className="text-xs text-dark-muted leading-relaxed mb-6">
                              {article.summary}
                            </p>
                          </div>
                          <div className="space-y-4 pt-4 border-t border-dark-border/20">
                            <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-3.5 text-xs text-dark-muted relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple"></div>
                              <span className="text-[9px] font-bold text-brand-purple uppercase tracking-wider block mb-1">
                                AI Impact Analysis
                              </span>
                              <p className="leading-relaxed text-[11px]">{article.aiSummary}</p>
                            </div>
                            {article.relatedMarket && (
                              <Link
                                to={`/markets/${article.relatedMarket._id}`}
                                className="inline-flex items-center justify-between w-full bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/20 hover:border-brand-purple/35 rounded-xl px-4 py-2.5 text-xs text-brand-purple transition-all duration-200"
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  <Link2 size={13} className="flex-shrink-0" />
                                  <span className="font-bold truncate text-white">
                                    {article.relatedMarket.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4 font-bold">
                                  <span>YES {article.relatedMarket.yesProbability}%</span>
                                  <span className="text-white/30">•</span>
                                  <span>Trade Now →</span>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-10 text-center">
                      <p className="text-xs text-dark-muted">No long-term news timelines currently synced.</p>
                    </div>
                  )}
                </div>

                {/* Empty State after filter */}
                {shortTermNews.length === 0 && longTermNews.length === 0 && (
                  <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-14 text-center">
                    <p className="text-sm text-white font-bold mb-1">No news briefings matched</p>
                    <p className="text-xs text-dark-muted">Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="bg-dark-card/30 border border-dark-border/40 rounded-2xl py-20 text-center flex flex-col items-center justify-center">
            <span className="text-3xl mb-4">📰</span>
            <p className="text-sm text-white font-bold mb-1">No news briefings found</p>
            <p className="text-xs text-dark-muted max-w-xs leading-relaxed">
              We couldn't find any news articles matching your criteria. Click the "Sync AI News" button (if Admin) or check back later!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewsHub;
