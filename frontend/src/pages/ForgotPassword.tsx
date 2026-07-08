import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Basic email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage('A password reset link has been dispatched to your email address.');
      } else {
        setError(res.data.message || 'Failed to dispatch reset link.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
        <p className="text-xs text-dark-muted">Provide your account email to receive a recovery link</p>
      </div>

      {error && (
        <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-lg flex items-center space-x-2">
          <span className="font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {message ? (
        <div className="space-y-6 text-center py-2 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-brand-success/10 border border-brand-success/30 flex items-center justify-center text-brand-success text-xl mx-auto shadow-md">
            ✉️
          </div>
          <p className="text-sm text-dark-muted leading-relaxed">
            {message} Please check your inbox and open the secure recovery URL.
          </p>

          <div className="bg-dark/80 border border-dark-border/80 rounded-xl p-3.5 text-left text-xs">
            <p className="font-bold text-brand-blue mb-1 flex items-center">
              <span className="mr-1">🛠️</span> Developer Sandbox Helper
            </p>
            <p className="text-dark-muted leading-relaxed">
              The reset token and link is logged to the <strong>backend server terminal</strong> in the active sandbox environment.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-block w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 transition-opacity"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="name@domain.com"
              className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                <span>Sending link...</span>
              </>
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>
        </form>
      )}

      {!message && (
        <div className="mt-6 text-center text-xs text-dark-muted border-t border-dark-border/40 pt-4">
          <Link to="/login" className="font-semibold text-brand-purple hover:underline">
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
