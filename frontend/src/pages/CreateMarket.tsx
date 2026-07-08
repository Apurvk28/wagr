import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createMarket } from '../services/marketService';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';

const Categories = [
  'Artificial Intelligence',
  'Technology',
  'Finance',
  'Sports',
  'Politics'
];

const CreateMarket: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(Categories[0]);
  const [resolutionDate, setResolutionDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validations
    if (!title.trim() || !description.trim() || !category || !resolutionDate) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(resolutionDate) <= new Date()) {
      setError('The resolution date must be in the future.');
      return;
    }

    setLoading(true);
    try {
      await createMarket({
        title: title.trim(),
        description: description.trim(),
        category,
        resolutionDate: new Date(resolutionDate).toISOString(),
      });
      // Redirect to listing page upon success
      navigate('/markets');
    } catch (err: any) {
      console.error('Error creating market:', err);
      setError(err.response?.data?.message || 'Failed to submit market event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-2xl w-full mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          to="/markets"
          className="inline-flex items-center space-x-1.5 text-xs text-dark-muted hover:text-white font-bold tracking-wider uppercase mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Back to Markets</span>
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-2">
            Submit event contract<span className="text-brand-purple">.</span>
          </h1>
          <p className="text-xs text-dark-muted leading-relaxed">
            Create a binary outcome forecast market. All community submissions are subject to administrative review before going live.
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-dark-card border border-dark-border/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-purple to-brand-blue"></div>

          {error && (
            <div className="mb-6 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title field */}
            <div>
              <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2" htmlFor="title">
                Market Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Will OpenAI release GPT-6 before 2027?"
                className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
              />
            </div>

            {/* Description field */}
            <div>
              <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2" htmlFor="description">
                Resolution Rules & Criteria
              </label>
              <textarea
                id="description"
                rows={4}
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError(null);
                }}
                placeholder="Define explicit resolution criteria. (e.g. 'Resolves to YES if OpenAI officially announces or releases the model GPT-6 on or before December 31, 2026. Official blog or press statements will serve as proof.')"
                className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors resize-none"
              />
            </div>

            {/* Grid for Category & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors cursor-pointer"
                >
                  {Categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution date */}
              <div>
                <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-2" htmlFor="resDate">
                  Resolution Date & Time
                </label>
                <input
                  id="resDate"
                  type="datetime-local"
                  required
                  value={resolutionDate}
                  onChange={(e) => {
                    setResolutionDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple/70 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Hint message box */}
            <div className="bg-dark/40 border border-dark-border/40 rounded-xl p-4 flex items-start space-x-3 text-[11px] text-dark-muted">
              <span className="text-brand-blue mt-0.5"><Info size={14} /></span>
              <p className="leading-relaxed">
                Make sure your resolution date is placed after the forecasted event occurs. Once submitted, parameters are immutable. Please review resolution terms before creating this event contract.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-3 text-sm font-semibold tracking-wider hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  <span>Creating contract...</span>
                </>
              ) : (
                <span>Submit Contract</span>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateMarket;
