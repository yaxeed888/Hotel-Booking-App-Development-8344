import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const { 
  FiCheckCircle, 
  FiCreditCard, 
  FiCalendar, 
  FiXCircle, 
  FiGift, 
  FiX,
  FiExternalLink 
} = FiIcons;

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmation':
        return FiCheckCircle;
      case 'payment_confirmation':
        return FiCreditCard;
      case 'booking_reminder':
        return FiCalendar;
      case 'cancellation_notice':
        return FiXCircle;
      case 'promotional_offer':
        return FiGift;
      default:
        return FiCheckCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_confirmation':
        return 'text-green-600 bg-green-100';
      case 'payment_confirmation':
        return 'text-blue-600 bg-blue-100';
      case 'booking_reminder':
        return 'text-orange-600 bg-orange-100';
      case 'cancellation_notice':
        return 'text-red-600 bg-red-100';
      case 'promotional_offer':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.data?.bookingId) {
      onClose();
      // Navigate to booking details
      // window.location.href = `/booking-details/${notification.data.bookingId}`;
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const timeAgo = formatDistanceToNow(notification.createdAt, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
          <SafeIcon icon={getNotificationIcon(notification.type)} className="text-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Additional data display */}
              {notification.data && (
                <div className="mt-2 text-xs text-gray-500">
                  {notification.data.bookingId && (
                    <span className="inline-flex items-center space-x-1">
                      <span>Booking ID: {notification.data.bookingId}</span>
                      <SafeIcon icon={FiExternalLink} className="text-xs" />
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{timeAgo}</span>
                {!notification.read && (
                  <div className="w-2 h-2 bg-booking-blue rounded-full"></div>
                )}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <SafeIcon icon={FiX} className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;