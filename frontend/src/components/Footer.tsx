import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark border-t border-dark-border/40 text-dark-muted py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-black text-white text-xs shadow-lg shadow-brand-purple/10">
                W
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                wagr<span className="text-brand-blue">.io</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-dark-muted">
              Wagr is an AI-powered social prediction exchange allowing users to forecast and trade outcomes using virtual Market Exchange Points (MXP).
            </p>
            <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase">
              The Future Has Odds.
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">About Us</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors duration-150">Contact Support</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-150">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-150">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Developers</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150">
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-150">Documentation</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-150">API Reference</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Disclaimer</h3>
            <p className="text-[11px] leading-relaxed text-dark-muted/80">
              Wagr.io operates entirely on a virtual economy powered by Market Exchange Points (MXP). Every feature is designed as a simulation. No real money or digital tokens of real-world value are accepted, traded, or distributed.
            </p>
          </div>
        </div>

        {/* Copyright Footer Row */}
        <div className="border-t border-dark-border/30 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Wagr.io. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-white transition-colors">Privacy Settings</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
