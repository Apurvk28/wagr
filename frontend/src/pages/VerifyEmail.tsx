import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('We are activating your account...');

  useEffect(() => {
    const executeVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token in URL.');
        return;
      }

      setStatus('verifying');
      const success = await verifyEmail(token);
      if (success) {
        setStatus('success');
        setMessage('Your email address has been successfully verified.');
      } else {
        setStatus('error');
        setMessage('Verification link is invalid or has expired.');
      }
    };

    executeVerification();
  }, [token]);

  return (
    <div className="w-full text-center py-4">
      {status === 'verifying' && (
        <div className="space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-brand-purple/20 border-t-brand-purple animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-white">Verifying account</h2>
          <p className="text-xs text-dark-muted">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-success/10 border border-brand-success/30 flex items-center justify-center text-brand-success text-2xl mx-auto shadow-lg shadow-brand-success/5">
            🎉
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Success</h2>
            <p className="text-sm text-dark-muted max-w-xs mx-auto leading-relaxed">
              {message} We have credited <span className="text-brand-blue font-semibold">500 MXP</span> to your wallet to start forecasting.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:opacity-95 transition-opacity"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-danger/10 border border-brand-danger/30 flex items-center justify-center text-brand-danger text-2xl mx-auto shadow-lg shadow-brand-danger/5">
            ❌
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-sm text-dark-muted max-w-xs mx-auto leading-relaxed">
              {message} Please double check your verification link or try signing up again.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-block w-full bg-dark border border-dark-border text-white rounded-xl py-2.5 text-sm font-semibold tracking-wider hover:bg-dark-card transition-colors"
          >
            Register another account
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
