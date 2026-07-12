import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { Bell, X, TrendingUp, Heart, MessageSquare, Award, ShieldCheck, AlertCircle } from 'lucide-react';
import './ToastNotification.css';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: string;
  redirectUrl?: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Market Resolved': <Award size={16} className="text-brand-success" />,
  'Market Cancelled': <AlertCircle size={16} className="text-brand-danger" />,
  'Followed Market Updated': <TrendingUp size={16} className="text-brand-blue" />,
  'New Market': <TrendingUp size={16} className="text-brand-purple" />,
  'Follow': <Bell size={16} className="text-brand-purple" />,
  'Like': <Heart size={16} className="text-brand-danger" />,
  'Comment': <MessageSquare size={16} className="text-brand-blue" />,
  'Reply': <MessageSquare size={16} className="text-brand-blue" />,
  'Mention': <MessageSquare size={16} className="text-yellow-400" />,
  'Verification': <ShieldCheck size={16} className="text-brand-success" />,
  'Security': <ShieldCheck size={16} className="text-brand-danger" />,
  'Admin Announcement': <AlertCircle size={16} className="text-brand-danger" />,
};

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 5000;

const ToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();
  const socket = useSocket(); // returns Socket | null


  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Listen for real-time notification events
  useEffect(() => {
    if (!socket) return;

    const handler = (notification: any) => {
      const toast: Toast = {
        id: notification._id ?? `${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        redirectUrl: notification.redirectUrl,
      };

      setToasts(prev => {
        const updated = [toast, ...prev].slice(0, MAX_TOASTS);
        return updated;
      });
    };

    socket.on('new_notification', handler);
    return () => { socket.off('new_notification', handler); };
  }, [socket]);

  // Auto-dismiss each toast after timeout
  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map(toast =>
      setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  const handleClick = (toast: Toast) => {
    dismiss(toast.id);
    if (toast.redirectUrl) {
      navigate(toast.redirectUrl);
    }
  };

  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="toast-card"
            onClick={() => handleClick(toast)}
            role="alert"
          >
            {/* Progress bar */}
            <div className="toast-progress" style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }} />

            <div className="toast-inner">
              <div className="toast-icon">
                {TYPE_ICONS[toast.type] ?? <Bell size={16} className="text-brand-purple" />}
              </div>

              <div className="toast-content">
                <p className="toast-title">{toast.title}</p>
                <p className="toast-message">{toast.message}</p>
              </div>

              <button
                className="toast-close"
                onClick={e => { e.stopPropagation(); dismiss(toast.id); }}
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
