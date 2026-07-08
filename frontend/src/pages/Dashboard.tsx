import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatMXP } from '../utils';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-bold text-white shadow-lg shadow-brand-purple/20">
            W
          </div>
          <span className="text-xl font-bold tracking-wider text-white">wagr<span className="text-brand-blue">.io</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-dark-card border border-dark-border px-4 py-1.5 rounded-full text-xs font-semibold text-brand-blue shadow-inner flex items-center space-x-2">
            <span>👛</span>
            <span>{user ? formatMXP(user.mxpBalance) : '0 MXP'}</span>
          </div>
          <button
            onClick={logout}
            className="bg-dark-card border border-dark-border hover:bg-dark-card/85 text-xs text-white/80 font-medium px-4 py-1.5 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto w-full flex-grow flex flex-col items-center justify-center text-center my-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-brand-purple/10 mb-6">
          {user?.fullName?.charAt(0) || 'U'}
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-sm text-dark-muted mb-8">@{user?.username}</p>

        {/* User Info Details Panel */}
        <div className="w-full bg-dark-card border border-dark-border rounded-2xl p-6 text-left space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white border-b border-dark-border pb-2.5">User Profile Info</h2>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-muted">Email</span>
            <span className="text-white font-medium">{user?.email}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-muted">Role</span>
            <span className="bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {user?.role}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-muted">Account Status</span>
            <span className="bg-brand-success/10 text-brand-success px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-muted">Accuracy Rate</span>
            <span className="text-white font-semibold">{user?.predictionAccuracy}%</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full border-t border-dark-border/40 py-6 text-center text-xs text-dark-muted">
        <p>© {new Date().getFullYear()} Wagr.io. All Rights Reserved. Development Dashboard.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
