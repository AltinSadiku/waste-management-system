import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check, Trash2, CheckCheck, X, Clock, Truck, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const { user, isAuthenticated, loading } = useAuth();

  // Only fetch if user is authenticated
  const isUserAuthenticated = isAuthenticated();

  // Fetch unread count
  const { data: unreadCountData, refetch: refetchCount } = useQuery(
    'unreadNotificationsCount',
    () => notificationsAPI.getUnreadCount(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      enabled: isUserAuthenticated, // Only fetch if authenticated
      retry: false, // Don't retry on failure
      onError: (error) => {
        console.error('Error fetching unread count:', error);
      }
    }
  );

  // Fetch all notifications
  const { data: notificationsData, isLoading, refetch: refetchNotifications } = useQuery(
    'notifications',
    () => notificationsAPI.getNotifications(),
    {
      enabled: isOpen && isUserAuthenticated, // Only fetch if open and authenticated
      retry: false, // Don't retry on failure
      onError: (error) => {
        console.error('Error fetching notifications:', error);
      }
    }
  );

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.data || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation(
    (id) => notificationsAPI.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotificationsCount');
      },
    }
  );

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(
    () => notificationsAPI.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotificationsCount');
      },
    }
  );

  // Delete notification mutation
  const deleteNotificationMutation = useMutation(
    (id) => notificationsAPI.deleteNotification(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotificationsCount');
      },
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'COLLECTION_REMINDER':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'REPORT_STATUS_CHANGE':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'REPORT_COMMENT':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id, {
      onSuccess: () => {
        refetchCount();
        refetchNotifications();
      }
    });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(id, {
      onSuccess: () => {
        refetchCount();
        refetchNotifications();
      }
    });
  };

  // Don't render if loading or not authenticated
  if (loading || !isUserAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsReadMutation.mutate()}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, notification.id)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Read
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

