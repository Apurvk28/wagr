import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  getUserProfile, 
  toggleFollowUser, 
  getPosts, 
  toggleLikePost, 
  getComments, 
  createComment
} from '../services/communityService';
import type { Post, Comment, UserProfileData } from '../services/communityService';
import { 
  Users, 
  Award, 
  PieChart, 
  FileText, 
  Calendar, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Link as LinkIcon, 
  Clock,
  UserPlus,
  UserMinus,
  Sparkles
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { isAuthenticated, user: currentUser, updateProfile } = useAuth();

  // Profile data & posts states
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  // Comments state (keyed by postId)
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentsByPost, setCommentsByPost] = useState<{ [postId: string]: Comment[] }>({});
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [replyToCommentId, setReplyToCommentId] = useState<{ [postId: string]: string | null }>({});

  const loadProfileData = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const profileData = await getUserProfile(username);
      setProfile(profileData);
      
      const postsData = await getPosts({ username });
      setPosts(postsData);
    } catch (err: any) {
      console.error('Failed to load user profile:', err);
      setError('User profile not found or failed to load statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [username]);

  // Handle Follow / Unfollow
  const handleFollowToggle = async () => {
    if (!profile || !isAuthenticated || followLoading) return;
    setFollowLoading(true);
    try {
      const result = await toggleFollowUser(profile.id);
      setProfile(prev => prev ? { 
        ...prev, 
        isFollowing: result.isFollowing, 
        followersCount: result.followersCount 
      } : null);

      // Trigger profile reload to sync the current user's following list in context
      await updateProfile(currentUser?.fullName || '');
    } catch (err) {
      console.error('Failed to toggle follow status:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Like Post
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
                  ? [...p.likes, currentUser?.id || '']
                  : p.likes.filter(id => id !== currentUser?.id)
              }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // Toggle Comments View
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

  // Submit Comment/Reply
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = newCommentText[postId] || '';
    const parentId = replyToCommentId[postId] || undefined;

    if (!content.trim()) return;

    try {
      await createComment(postId, content, parentId);
      setNewCommentText(prev => ({ ...prev, [postId]: '' }));
      setReplyToCommentId(prev => ({ ...prev, [postId]: null }));
      
      const updatedComments = await getComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: updatedComments }));
      setPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
      );
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  // Mentions parser
  const renderMentionsAndContent = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const targetUsername = part.slice(1);
        return (
          <Link 
            key={index} 
            to={`/user/${targetUsername}`} 
            className="text-brand-blue font-semibold hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  // Render comments threads UI layout
  const renderCommentsThread = (postId: string) => {
    const list = commentsByPost[postId] || [];
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
                    Reply
                  </button>
                )}
              </div>

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

        {/* Comment Input */}
        {isAuthenticated && (
          <form onSubmit={(e) => handleAddComment(postId, e)} className="flex items-center space-x-2 pt-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newCommentText[postId] || ''}
                onChange={(e) => setNewCommentText(prev => ({ ...prev, [postId]: e.target.value }))}
                placeholder={replyToCommentId[postId] ? "Write a reply thread..." : "Add comment..."}
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
            <button type="submit" className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl p-2 transition-colors flex items-center justify-center cursor-pointer">
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
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="w-full h-44 bg-dark-card border border-dark-border/40 rounded-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-dark-card border border-dark-border/40 rounded-3xl"></div>
              <div className="h-60 bg-dark-card border border-dark-border/40 rounded-3xl"></div>
            </div>
          </div>
        ) : error || !profile ? (
          <div className="bg-dark-card border border-brand-danger/35 text-center p-12 rounded-3xl">
            <p className="text-sm font-bold text-white mb-2">Error Loading Profile</p>
            <p className="text-xs text-dark-muted">{error || 'User statistics unavailable.'}</p>
            <Link to="/community" className="inline-flex items-center space-x-2 text-xs text-brand-blue font-bold uppercase tracking-wider mt-4 hover:underline">
              <span>Return to Community Forum</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header Profile Dashboard */}
            <div className="bg-gradient-to-br from-dark-card to-dark/45 border border-dark-border rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-purple/20">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-white leading-none mb-1.5 flex items-center gap-2">
                      {profile.fullName}
                      {profile.predictionAccuracy >= 60 && (
                        <Sparkles size={16} className="text-brand-purple" />
                      )}
                    </h1>
                    <p className="text-xs text-dark-muted font-bold">@{profile.username}</p>
                    <p className="text-[10px] text-dark-muted font-medium mt-1 flex items-center space-x-1.5">
                      <Calendar size={11} className="text-brand-blue" />
                      <span>Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

                {/* Follow trigger */}
                {isAuthenticated && currentUser?.username !== profile.username && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      profile.isFollowing
                        ? 'bg-dark border border-dark-border hover:border-brand-danger text-brand-danger hover:bg-brand-danger/5'
                        : 'bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-95 shadow-md shadow-brand-purple/10'
                    }`}
                  >
                    {profile.isFollowing ? (
                      <>
                        <UserMinus size={13} />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Public Statistics Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Followers */}
              <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-4.5 space-y-1 shadow-lg">
                <p className="text-[9px] font-bold text-dark-muted uppercase tracking-wider flex items-center">
                  <Users size={11} className="mr-1 text-brand-blue" />
                  Followers
                </p>
                <p className="text-2xl font-black text-white">{profile.followersCount}</p>
              </div>

              {/* Following */}
              <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-4.5 space-y-1 shadow-lg">
                <p className="text-[9px] font-bold text-dark-muted uppercase tracking-wider flex items-center">
                  <Users size={11} className="mr-1 text-brand-blue" />
                  Following
                </p>
                <p className="text-2xl font-black text-white">{profile.followingCount}</p>
              </div>

              {/* Accuracy */}
              <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-4.5 space-y-1 shadow-lg relative overflow-hidden">
                <div className="absolute right-3.5 bottom-3 text-brand-success/15 font-black text-3xl">%</div>
                <p className="text-[9px] font-bold text-dark-muted uppercase tracking-wider flex items-center">
                  <Award size={11} className="mr-1 text-brand-success" />
                  Accuracy Rate
                </p>
                <p className="text-2xl font-black text-brand-success">{profile.predictionAccuracy}%</p>
              </div>

              {/* Markets Participated */}
              <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-4.5 space-y-1 shadow-lg">
                <p className="text-[9px] font-bold text-dark-muted uppercase tracking-wider flex items-center">
                  <PieChart size={11} className="mr-1 text-brand-purple" />
                  Contracts Traded
                </p>
                <p className="text-2xl font-black text-white">{profile.marketsParticipated}</p>
              </div>
            </div>

            {/* Profile body posts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column Authored posts stream */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex items-center space-x-2 border-b border-dark-border/20 pb-2">
                  <FileText size={14} className="text-brand-purple" />
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Insight Stream ({profile.totalPosts})
                  </h2>
                </div>

                {posts.length === 0 ? (
                  <div className="bg-dark-card border border-dark-border rounded-2xl py-12 text-center">
                    <p className="text-xs text-dark-muted">No insights have been posted by this user yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => {
                      const hasLiked = post.likes.includes(currentUser?.id || '');
                      return (
                        <div key={post._id} className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 space-y-4 shadow-lg animate-fade-in">
                          
                          {/* Card header */}
                          <div className="flex justify-between items-center text-[10px] text-dark-muted">
                            <span className="font-semibold">@{profile.username}</span>
                            <span className="font-medium flex items-center space-x-1">
                              <Clock size={11} />
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>

                          <p className="text-xs text-white/95 leading-relaxed break-words">
                            {renderMentionsAndContent(post.content)}
                          </p>

                          {/* Linked market */}
                          {post.linkedMarket && (
                            <div className="bg-dark/45 hover:bg-dark/70 border border-dark-border/60 hover:border-brand-purple/35 rounded-xl p-3.5 transition-colors relative">
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

                          {/* Actions */}
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

                          {/* Threads comment panel */}
                          {expandedComments[post._id] && renderCommentsThread(post._id)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right sidebar details info */}
              <div className="space-y-6">
                <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-5 space-y-3.5 text-xs">
                  <h3 className="font-extrabold text-white text-[11px] uppercase tracking-wider border-b border-dark-border/20 pb-1.5">
                    User Details
                  </h3>
                  <div className="space-y-3 leading-relaxed text-dark-muted">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Role</p>
                      <p className="text-white font-semibold">Predictor</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Total Insight Posts</p>
                      <p className="text-white font-semibold">{profile.totalPosts} Published</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5">Accuracy Calculation</p>
                      <p className="text-white font-semibold">
                        Computed dynamically based on all resolved position outcomes in settled prediction markets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
