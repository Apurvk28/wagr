import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register, error, clearErrors, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [localError, setLocalError] = useState<string | null>(null);

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
    setLocalError(null);
    clearErrors();

    // Field completion check
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    // Email format check
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    // Password strength verification
    const allChecksPassed = Object.values(checks).every(Boolean);
    if (!allChecksPassed) {
      setLocalError('Password does not meet all security requirements.');
      return;
    }

    // Password confirmation match
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const result = await register(fullName, username, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Create an account</h2>
        <p className="text-xs text-dark-muted">Get started today with 500 Market Exchange Points</p>
      </div>

      {(error || localError) && (
        <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-lg flex items-center space-x-2">
          <span className="font-bold">⚠️</span>
          <span>{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name Field */}
        <div>
          <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="Apurv Khairnar"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="apurv"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="name@domain.com"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-white/90 uppercase tracking-wider mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="••••••••"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />

          {/* Real-time Checklist */}
          {password.length > 0 && (
            <div className="mt-2.5 bg-dark/40 border border-dark-border/40 rounded-lg p-2.5 space-y-1.5">
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
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setLocalError(null);
              clearErrors();
            }}
            placeholder="••••••••"
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-2 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple/70 transition-colors"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-4 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
              <span>Registering...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      {/* Navigation Footer */}
      <div className="mt-5 text-center text-xs text-dark-muted border-t border-dark-border/40 pt-4">
        <span>Already have an account? </span>
        <Link to="/login" className="font-semibold text-brand-purple hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
