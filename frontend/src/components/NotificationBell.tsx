import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../services/notificationService';
import type { Notification } from '../types';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const socket = useSocket();

  const fetchCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silently fail — user may not be logged in
    }
  }, []);

  // Initial unread count fetch
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Real-time socket listener
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on('new_notification', handleNewNotification);
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setIsOpen(prev => !prev);
    if (!isOpen && notifications.length === 0) {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
      setNotifications(prev =>
        prev.map(n => (n._id === notification._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setIsOpen(false);
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'New Follower': '👤',
      'New Market': '📊',
      'Market Resolved': '✅',
      'Market Cancelled': '❌',
      'Followed Market Updated': '📰',
      'Admin Announcement': '📢',
      Like: '❤️',
      Comment: '💬',
      Reply: '↩️',
      Mention: '@',
      Verification: '✉️',
      Security: '🔒',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notif-bell-wrapper" ref={panelRef}>
      <button
        id="notification-bell-btn"
        className="notif-bell-btn"
        onClick={handleOpen}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-panel" role="dialog" aria-label="Notifications panel">
          <div className="notif-panel-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="notif-mark-all-btn" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-empty">
                <div className="notif-spinner" />
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <span className="notif-empty-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif._id}
                  className={`notif-item${notif.isRead ? '' : ' notif-item--unread'}`}
                  onClick={() => handleNotificationClick(notif)}
                  id={`notif-${notif._id}`}
                >
                  <span className="notif-item-icon">{getTypeIcon(notif.type)}</span>
                  <div className="notif-item-body">
                    <p className="notif-item-title">{notif.title}</p>
                    <p className="notif-item-message">{notif.message}</p>
                    <p className="notif-item-time">{formatTime(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && <span className="notif-unread-dot" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
