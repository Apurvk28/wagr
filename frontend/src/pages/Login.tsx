import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, error, clearErrors, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearErrors();

    // Client-side validations
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-xs text-dark-muted">Enter your credentials to access your predictions</p>
      </div>

      {/* Backend Error Alert */}
      {(error || localError) && (
        <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-lg flex items-center space-x-2">
          <span className="font-bold">⚠️</span>
          <span>{localError || error}</span>
        </div>
      )}

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
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="name@domain.com"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="••••••••"
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
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Navigation Footer */}
      <div className="mt-6 text-center text-xs text-dark-muted border-t border-dark-border/40 pt-4">
        <span>Don't have an account? </span>
        <Link to="/register" className="font-semibold text-brand-purple hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
