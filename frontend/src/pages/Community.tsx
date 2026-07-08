import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  getPosts, 
  createPost, 
  toggleLikePost, 
  getComments, 
  createComment
} from '../services/communityService';
import type { Post, Comment } from '../services/communityService';
import { getMarkets } from '../services/marketService';
import type { Market } from '../types';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Link as LinkIcon, 
  Clock, 
  MessageCircle,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Community: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // State variables
  const [posts, setPosts] = useState<Post[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState<'global' | 'following'>('global');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  
  // Composer states
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [composerError, setComposerError] = useState<string | null>(null);
  const [composerSuccess, setComposerSuccess] = useState<string | null>(null);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comments state (keyed by postId)
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentsByPost, setCommentsByPost] = useState<{ [postId: string]: Comment[] }>({});
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [replyToCommentId, setReplyToCommentId] = useState<{ [postId: string]: string | null }>({});

  // 1. Fetch Posts and Markets
  const loadPosts = async () => {
    setLoading(true);
    try {
      const postsData = await getPosts({
        feed: feedType === 'following' ? 'following' : undefined,
        sortBy
      });
      setPosts(postsData);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [feedType, sortBy]);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const marketsData = await getMarkets({ status: 'Live' });
        setMarkets(marketsData);
      } catch (err) {
        console.error('Failed to load markets:', err);
      }
    };
    if (isAuthenticated) {
      loadMarkets();
    }
  }, [isAuthenticated]);

  // 2. Publish Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setComposerError(null);
    setComposerSuccess(null);

    if (!newPostContent.trim()) {
      setComposerError('Content cannot be empty.');
      return;
    }

    setSubmittingPost(true);
    try {
      await createPost(newPostContent, selectedMarketId || undefined);
      setNewPostContent('');
      setSelectedMarketId('');
      setComposerSuccess('Insight shared successfully!');
      loadPosts();
    } catch (err: any) {
      setComposerError(err.response?.data?.message || 'Failed to share insight.');
    } finally {
      setSubmittingPost(false);
    }
  };

  // 3. Like Post
  const handleLikePost = async (postId: string) => {
    if (!isAuthenticated) return;
    try {
      const result = await toggleLikePost(postId);
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                likesCount: result.likesCount,
                likes: result.hasLiked 
                  ? [...p.likes, user?.id || '']
                  : p.likes.filter(id => id !== user?.id)
              }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // 4. Toggle Comments View & Load Comments
  const handleToggleComments = async (postId: string) => {
    const isExpanded = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanded }));

    if (isExpanded) {
      try {
        const commentsData = await getComments(postId);
        setCommentsByPost(prev => ({ ...prev, [postId]: commentsData }));
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    }
  };

  // 5. Submit Comment/Reply
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = newCommentText[postId] || '';
    const parentId = replyToCommentId[postId] || undefined;

    if (!content.trim()) return;

    try {
      await createComment(postId, content, parentId);
      setNewCommentText(prev => ({ ...prev, [postId]: '' }));
      setReplyToCommentId(prev => ({ ...prev, [postId]: null }));
      
      // Reload comments list and increment count
      const updatedComments = await getComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: updatedComments }));
      setPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
      );
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  // Helper to parse @username tags
  const renderMentionsAndContent = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1);
        return (
          <Link 
            key={index} 
            to={`/user/${username}`} 
            className="text-brand-blue font-semibold hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  // Build comment threads UI layout
  const renderCommentsThread = (postId: string) => {
    const list = commentsByPost[postId] || [];
    // Separate roots and replies
    const roots = list.filter(c => !c.parentId);
    const getReplies = (parentId: string) => list.filter(c => c.parentId === parentId);

    return (
      <div className="space-y-4 pt-3 border-t border-dark-border/20">
        {roots.length === 0 ? (
          <p className="text-[11px] text-dark-muted py-1">No comments yet. Start the conversation!</p>
        ) : (
          roots.map(comment => (
            <div key={comment._id} className="space-y-2">
              <div className="bg-dark/40 border border-dark-border/50 rounded-xl p-3 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <Link to={`/user/${comment.userId.username}`} className="text-white font-bold hover:underline">
                    @{comment.userId.username}
                  </Link>
                  <span className="text-dark-muted font-medium">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">
                  {renderMentionsAndContent(comment.content)}
                </p>
                {isAuthenticated && (
                  <button 
                    onClick={() => setReplyToCommentId(prev => ({ ...prev, [postId]: comment._id }))}
                    className="text-[9px] font-bold text-brand-blue hover:text-white uppercase tracking-wider block pt-1.5"
                  >
                    Reply to this
                  </button>
                )}
              </div>

              {/* Replies Threading Indent */}
              {getReplies(comment._id).map(reply => (
                <div key={reply._id} className="pl-6 border-l-2 border-brand-purple/20 space-y-2">
                  <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <Link to={`/user/${reply.userId.username}`} className="text-white font-bold hover:underline">
                        @{reply.userId.username}
                      </Link>
                      <span className="text-dark-muted font-medium">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">
                      {renderMentionsAndContent(reply.content)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {/* Reply/Comment Form */}
        {isAuthenticated && (
          <form onSubmit={(e) => handleAddComment(postId, e)} className="flex items-center space-x-2 pt-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newCommentText[postId] || ''}
                onChange={(e) => setNewCommentText(prev => ({ ...prev, [postId]: e.target.value }))}
                placeholder={
                  replyToCommentId[postId] 
                    ? "Write a reply thread..." 
                    : "Add public comment..."
                }
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/75 transition-colors"
              />
              {replyToCommentId[postId] && (
                <button
                  type="button"
                  onClick={() => setReplyToCommentId(prev => ({ ...prev, [postId]: null }))}
                  className="absolute right-3 top-2.5 text-[10px] text-brand-danger font-bold hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl p-2 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Title */}
            <div className="flex justify-between items-center pb-4 border-b border-dark-border/20">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Community Hub<span className="text-brand-purple">.</span>
                </h1>
                <p className="text-xs text-dark-muted mt-1">
                  Share market insights, track follow feeds, and discuss prediction trades.
                </p>
              </div>

              {/* Sorting buttons */}
              <div className="flex space-x-2 bg-dark-card border border-dark-border rounded-xl p-1 text-[11px] font-bold uppercase tracking-wider">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    sortBy === 'newest' ? 'bg-brand-purple text-white' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                    sortBy === 'popular' ? 'bg-brand-purple text-white' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <TrendingUp size={11} />
                  <span>Popular</span>
                </button>
              </div>
            </div>

            {/* Feeds Selection Tabs */}
            {isAuthenticated && (
              <div className="flex space-x-2 border-b border-dark-border/10 pb-1">
                <button
                  onClick={() => setFeedType('global')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 px-3 transition-colors ${
                    feedType === 'global' ? 'border-brand-purple text-white' : 'border-transparent text-dark-muted hover:text-white'
                  }`}
                >
                  Global Feed
                </button>
                <button
                  onClick={() => setFeedType('following')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 px-3 transition-colors ${
                    feedType === 'following' ? 'border-brand-purple text-white' : 'border-transparent text-dark-muted hover:text-white'
                  }`}
                >
                  Following Feed
                </button>
              </div>
            )}

            {/* Posts Feed Loader */}
            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-dark-card/60 border border-dark-border/40 rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="w-24 h-4 bg-dark-border rounded"></div>
                      <div className="w-16 h-3 bg-dark-border rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-dark-border rounded"></div>
                    <div className="w-20 h-4 bg-dark-border rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                <MessageCircle size={32} className="mx-auto mb-3 text-dark-muted" />
                <p className="text-sm font-bold text-white mb-1">No community discussions found</p>
                <p className="text-xs text-dark-muted">
                  {feedType === 'following' 
                    ? "Follow more predictors to populate your custom feed, or compose the first post." 
                    : "No insights have been posted yet. Share your forecasts first!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => {
                  const hasLiked = post.likes.includes(user?.id || '');
                  return (
                    <div key={post._id} className="bg-dark-card border border-dark-border/60 hover:border-dark-border transition-colors rounded-2xl p-5 space-y-4 shadow-lg animate-fade-in">
                      
                      {/* Author Header */}
                      <div className="flex justify-between items-center">
                        <Link to={`/user/${post.userId.username}`} className="flex items-center space-x-2 group">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-[10px] font-black text-white uppercase shadow-md shadow-brand-purple/5">
                            {post.userId.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs text-white font-bold group-hover:text-brand-blue transition-colors">
                              {post.userId.fullName}
                            </p>
                            <p className="text-[10px] text-dark-muted">
                              @{post.userId.username}
                            </p>
                          </div>
                        </Link>

                        <div className="flex items-center space-x-1.5 text-[10px] text-dark-muted font-medium">
                          <Clock size={11} />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs text-white/95 leading-relaxed break-words">
                        {renderMentionsAndContent(post.content)}
                      </p>

                      {/* Linked Market Card */}
                      {post.linkedMarket && (
                        <div className="bg-dark/45 hover:bg-dark/70 border border-dark-border/60 hover:border-brand-purple/35 rounded-xl p-3.5 transition-colors relative">
                          <span className="text-[8px] bg-brand-purple/10 border border-brand-purple/35 text-brand-purple font-black uppercase tracking-wider px-1.5 py-0.5 rounded absolute right-3.5 top-3">
                            forecast contract
                          </span>
                          <p className="text-[9px] text-dark-muted uppercase font-bold tracking-wider mb-1 flex items-center">
                            <LinkIcon size={10} className="mr-1 text-brand-blue" />
                            Linked Market
                          </p>
                          <Link to={`/markets/${post.linkedMarket._id}`} className="block group">
                            <h4 className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors mb-2 pr-16 line-clamp-1">
                              {post.linkedMarket.title}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-[10px]">
                              <div>
                                <span className="text-dark-muted">YES Return:</span>{' '}
                                <span className="text-brand-success font-bold">+{100 - post.linkedMarket.yesProbability}%</span>
                              </div>
                              <div>
                                <span className="text-dark-muted">NO Return:</span>{' '}
                                <span className="text-brand-danger font-bold">+{100 - post.linkedMarket.noProbability}%</span>
                              </div>
                              <div>
                                <span className="text-dark-muted">Status:</span>{' '}
                                <span className="text-white font-semibold">{post.linkedMarket.status}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Actions Widget (Likes, Comments Count) */}
                      <div className="flex items-center space-x-6 text-[11px] pt-1.5 border-t border-dark-border/10">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          disabled={!isAuthenticated}
                          className={`flex items-center space-x-1.5 font-bold uppercase tracking-wider transition-colors ${
                            hasLiked ? 'text-brand-success' : 'text-dark-muted hover:text-white disabled:opacity-50'
                          }`}
                        >
                          <ThumbsUp size={13} />
                          <span>{post.likesCount} Likes</span>
                        </button>

                        <button
                          onClick={() => handleToggleComments(post._id)}
                          className={`flex items-center space-x-1.5 font-bold uppercase tracking-wider transition-colors ${
                            expandedComments[post._id] ? 'text-brand-purple' : 'text-dark-muted hover:text-white'
                          }`}
                        >
                          <MessageSquare size={13} />
                          <span>{post.commentsCount} Comments</span>
                        </button>
                      </div>

                      {/* Expandable comments thread drawer */}
                      {expandedComments[post._id] && renderCommentsThread(post._id)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Composer Column */}
          <div className="space-y-6">
            
            {/* Create Post Deck */}
            {isAuthenticated ? (
              <div className="bg-dark-card border border-brand-purple/25 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-brand-purple" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Share Market Insight
                  </h3>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-3.5">
                  {composerSuccess && (
                    <p className="text-[10px] text-brand-success bg-brand-success/10 border border-brand-success/20 px-3 py-1.5 rounded-lg font-bold">
                      {composerSuccess}
                    </p>
                  )}
                  {composerError && (
                    <p className="text-[10px] text-brand-danger bg-brand-danger/10 border border-brand-danger/20 px-3 py-1.5 rounded-lg font-bold">
                      {composerError}
                    </p>
                  )}

                  <div>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => {
                        setNewPostContent(e.target.value);
                        setComposerError(null);
                        setComposerSuccess(null);
                      }}
                      placeholder="Discuss market odds, explain your reasoning, or tag predictors using @username..."
                      required
                      rows={4}
                      className="w-full bg-dark/60 border border-dark-border rounded-xl p-3.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/75 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Prediction Market Link Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
                      Link Prediction Market (Optional)
                    </label>
                    <select
                      value={selectedMarketId}
                      onChange={(e) => setSelectedMarketId(e.target.value)}
                      className="w-full bg-dark/60 border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/70 transition-colors"
                    >
                      <option value="">No Market Link</option>
                      {markets.map(m => (
                        <option key={m._id} value={m._id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingPost}
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-brand-purple/10 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {submittingPost ? 'Publishing...' : 'Share insight'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-3.5 text-center">
                <MessageCircle size={24} className="mx-auto text-dark-muted" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Join the Discussion
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  Sign in or register to publish insight posts, like forecasts, and comment threads.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" className="bg-dark border border-dark-border text-white text-xs font-bold py-2 rounded-xl hover:bg-dark-card/65 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-bold py-2 rounded-xl hover:opacity-95 transition-opacity">
                    Register
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Tips Box */}
            <div className="bg-dark-card/50 border border-dark-border/40 rounded-2xl p-5 space-y-2.5 text-xs">
              <span className="font-extrabold text-white text-[11px] uppercase tracking-wider block border-b border-dark-border/20 pb-1.5">
                💡 Formatting Tips
              </span>
              <ul className="space-y-2 text-[11px] text-dark-muted leading-relaxed">
                <li>• Reference predictions by picking from the dropdown list.</li>
                <li>• Tag users with `@username` (e.g. `@apurv`) to reference them as links.</li>
                <li>• Maintain respectful, evidence-based reasoning behind event outcomes.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Community;
