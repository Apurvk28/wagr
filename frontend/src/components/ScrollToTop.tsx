import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollTo(0, 0);
    }
    
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollTo(0, 0);
    }

    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.scrollTop = 0;
      rootEl.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
