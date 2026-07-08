import React from 'react';
import { Link, Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center select-none animate-fade-in">
        <Link to="/" className="flex items-center space-x-2.5 mb-2 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-lg shadow-xl shadow-brand-purple/15">
            W
          </div>
          <span className="text-2xl font-bold tracking-wider text-white">
            wagr<span className="text-brand-blue">.io</span>
          </span>
        </Link>
        <span className="text-xs text-dark-muted font-medium uppercase tracking-widest">
          The Future Has Odds.
        </span>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-dark-card border border-dark-border/80 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
        {children || <Outlet />}
      </div>

      {/* Small Legal Disclaimer */}
      <footer className="mt-8 text-center text-[10px] text-dark-muted max-w-xs leading-relaxed">
        By continuing, you agree to Wagr's virtual economic terms. No real money or real-world wagering is involved.
      </footer>
    </div>
  );
};

export default AuthLayout;
