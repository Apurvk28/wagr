import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatMXP } from '../utils';
import api from '../services/api';
import { Menu, X, Wallet, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, reloadProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showBalanceControls, setShowBalanceControls] = useState(false);
  
  const handleAdjustBalance = async (amount: number) => {
    try {
      await api.post('/users/admin/balance', { amount });
      await reloadProfile();
      setShowBalanceControls(false);
    } catch (err) {
      console.error('Failed to adjust balance:', err);
    }
  };

  const toggleDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <nav className="bg-dark/80 backdrop-blur-md border-b border-dark-border/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Nav Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-base shadow-lg shadow-brand-purple/10">
                W
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                wagr<span className="text-brand-blue">.io</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 text-sm font-medium text-dark-muted">
              <Link to="/markets" className="hover:text-white transition-colors duration-150 py-2">
                Prediction Markets
              </Link>
              <Link to="/news" className="hover:text-white transition-colors duration-150 py-2">
                News Hub
              </Link>
              <Link to="/community" className="hover:text-white transition-colors duration-150 py-2">
                Community
              </Link>
            </div>
          </div>

          {/* User Controls / Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* Wallet Balance Display */}
                {user.role === 'Admin' ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowBalanceControls(!showBalanceControls)}
                      className="bg-dark-card/90 hover:bg-dark-card/85 border border-dark-border/80 rounded-full pl-3.5 pr-4 py-1.5 flex items-center space-x-2 shadow-inner text-xs font-semibold text-brand-blue focus:outline-none cursor-pointer"
                    >
                      <Wallet size={14} className="text-brand-blue" />
                      <span>{formatMXP(user.mxpBalance)}</span>
                      <span className="text-[9px] opacity-60">⚙️</span>
                    </button>

                    {showBalanceControls && (
                      <div className="absolute right-0 mt-2 w-36 bg-dark-card border border-dark-border rounded-xl py-1.5 shadow-2xl z-50 animate-fade-in flex flex-col space-y-0.5 p-1">
                        <button
                          onClick={() => handleAdjustBalance(10000)}
                          className="text-left px-3 py-1.5 text-xs text-brand-success hover:bg-dark/45 rounded-lg transition-colors font-bold"
                        >
                          + 10,000 MXP
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(-10000)}
                          className="text-left px-3 py-1.5 text-xs text-brand-danger hover:bg-dark/45 rounded-lg transition-colors font-bold"
                        >
                          - 10,000 MXP
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-dark-card/90 border border-dark-border/80 rounded-full pl-3.5 pr-4 py-1.5 flex items-center space-x-2 shadow-inner text-xs font-semibold text-brand-blue">
                    <Wallet size={14} className="text-brand-blue" />
                    <span>{formatMXP(user.mxpBalance)}</span>
                  </div>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-dark-card hover:bg-dark-card/80 border border-dark-border rounded-full px-3 py-1.5 transition-colors focus:outline-none"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-[10px] font-black text-white">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs text-white/90 font-medium">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown size={12} className={`text-dark-muted transform transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl py-1.5 shadow-2xl z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-dark-border/50">
                        <p className="text-xs text-white font-semibold truncate">{user.fullName}</p>
                        <p className="text-[10px] text-dark-muted truncate">@{user.username}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-white/80 hover:bg-dark/45 hover:text-white transition-colors"
                      >
                        <UserIcon size={13} />
                        <span>My Portfolio</span>
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-xs text-brand-danger/95 hover:bg-dark/45 hover:text-brand-danger transition-colors border-t border-dark-border/50"
                      >
                        <LogOut size={13} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-white/95 hover:text-white transition-colors py-2 px-3"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-full px-5 py-2 text-xs font-bold shadow-lg shadow-brand-purple/10 hover:opacity-95 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-card focus:outline-none focus:ring-1 focus:ring-dark-border"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border/40 bg-dark-card py-3.5 space-y-2.5 px-4 shadow-xl">
          <Link
            to="/markets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            Prediction Markets
          </Link>
          <Link
            to="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            News Hub
          </Link>
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-dark-muted hover:text-white font-medium py-1"
          >
            Community
          </Link>

          {/* Guest or User actions for Mobile */}
          <div className="border-t border-dark-border/40 pt-3.5 space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                {user.role === 'Admin' ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue">
                      <Wallet size={14} />
                      <span>Wallet: {formatMXP(user.mxpBalance)} (Admin)</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          await handleAdjustBalance(10000);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-brand-success/15 hover:bg-brand-success/20 border border-brand-success/30 px-3 py-1 rounded-lg text-[9px] text-brand-success font-bold uppercase tracking-wider"
                      >
                        + 10k MXP
                      </button>
                      <button
                        onClick={async () => {
                          await handleAdjustBalance(-10000);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-brand-danger/15 hover:bg-brand-danger/20 border border-brand-danger/30 px-3 py-1 rounded-lg text-[9px] text-brand-danger font-bold uppercase tracking-wider"
                      >
                        - 10k MXP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue">
                    <Wallet size={14} />
                    <span>Wallet: {formatMXP(user.mxpBalance)}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-2 w-full text-xs text-brand-danger py-1"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs text-white/90 border border-dark-border rounded-xl py-2 font-semibold hover:bg-dark transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl py-2 font-bold hover:opacity-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
