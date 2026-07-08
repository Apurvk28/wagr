import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Password requirements validation state
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError('Missing recovery token in query parameters.');
      setLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Check strength
    const allChecksPassed = Object.values(checks).every(Boolean);
    if (!allChecksPassed) {
      setError('Password does not meet safety criteria.');
      setLoading(false);
      return;
    }

    // Check matches
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', { token, password });
      if (res.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(res.data.message || 'Reset failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Set New Password</h2>
        <p className="text-xs text-dark-muted">Please provide your new security credentials</p>
      </div>

      {(error || !token) && (
        <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-lg flex items-center space-x-2">
          <span className="font-bold">⚠️</span>
          <span>{error || 'Invalid reset link. Missing token.'}</span>
        </div>
      )}

      {message ? (
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-brand-success/10 border border-brand-success/30 flex items-center justify-center text-brand-success text-xl mx-auto shadow-md">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Success</h3>
            <p className="text-sm text-dark-muted leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 transition-opacity"
          >
            Go to Login Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              disabled={!token}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors disabled:opacity-50"
            />

            {/* Real-time Checklist */}
            {password.length > 0 && (
              <div className="mt-2.5 bg-dark/40 border border-dark-border/40 rounded-lg p-2.5 space-y-1.5 animate-fade-in">
                <p className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mb-1">Security Requirements</p>
                
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className={checks.length ? "text-brand-success" : "text-dark-muted"}>
                      {checks.length ? '✓' : '○'}
                    </span>
                    <span className={checks.length ? "text-white/80" : "text-dark-muted"}>8+ Characters</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className={checks.upper ? "text-brand-success" : "text-dark-muted"}>
                      {checks.upper ? '✓' : '○'}
                    </span>
                    <span className={checks.upper ? "text-white/80" : "text-dark-muted"}>1 Uppercase</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className={checks.lower ? "text-brand-success" : "text-dark-muted"}>
                      {checks.lower ? '✓' : '○'}
                    </span>
                    <span className={checks.lower ? "text-white/80" : "text-dark-muted"}>1 Lowercase</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className={checks.number ? "text-brand-success" : "text-dark-muted"}>
                      {checks.number ? '✓' : '○'}
                    </span>
                    <span className={checks.number ? "text-white/80" : "text-dark-muted"}>1 Number</span>
                  </div>

                  <div className="flex items-center space-x-1.5 col-span-2">
                    <span className={checks.special ? "text-brand-success" : "text-dark-muted"}>
                      {checks.special ? '✓' : '○'}
                    </span>
                    <span className={checks.special ? "text-white/80" : "text-dark-muted"}>1 Special Char (@$!%*?&)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-4 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                <span>Resetting...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
