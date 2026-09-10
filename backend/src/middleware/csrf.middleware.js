/**
 * CSRF Defense Middleware for State-Changing Requests
 * 
 * Validates Origin/Referer against configured client URL and checks for custom AJAX/Fetch request headers
 * to prevent Cross-Site Request Forgery attacks on cookie-authenticated sessions.
 */
export const csrfProtection = (req, res, next) => {
  // Safe HTTP methods (GET, HEAD, OPTIONS) do not mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Exempt public authentication endpoints (registration/login do not rely on pre-existing session cookies)
  if (req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/register') {
    return next();
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // 1. Origin Header Validation (attached automatically by browsers on cross-origin requests & POST/PUT/DELETE)
  if (origin) {
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanClientUrl = clientUrl.replace(/\/$/, '');
    if (cleanOrigin !== cleanClientUrl) {
      return res.status(403).json({
        success: false,
        message: 'CSRF Protection: Forbidden origin mismatch.',
      });
    }
  } else if (referer) {
    // 2. Fallback Referer Header Validation
    try {
      const refererOrigin = new URL(referer).origin;
      const cleanClientUrl = clientUrl.replace(/\/$/, '');
      if (refererOrigin !== cleanClientUrl) {
        return res.status(403).json({
          success: false,
          message: 'CSRF Protection: Forbidden referer mismatch.',
        });
      }
    } catch (e) {
      return res.status(403).json({
        success: false,
        message: 'CSRF Protection: Invalid referer header.',
      });
    }
  }

  // 3. Custom Header Validation (X-Requested-With / X-Wagr-CSRF)
  // Cross-site HTML forms and standard image tags cannot set custom headers.
  const customHeader = req.headers['x-requested-with'] || req.headers['x-wagr-csrf'];
  if (!customHeader) {
    return res.status(403).json({
      success: false,
      message: 'CSRF Protection: Missing required request security header.',
    });
  }

  next();
};
