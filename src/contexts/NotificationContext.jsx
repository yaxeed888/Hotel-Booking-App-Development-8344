import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    bookingConfirmation: true,
    bookingReminder: true,
    paymentConfirmation: true,
    cancellationNotice: true,
    promotionalOffers: false
  });

  // Load notifications and preferences on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      loadPreferences();
    }
  }, [isAuthenticated, user]);

  const loadNotifications = () => {
    // Mock notifications - in real app, fetch from API
    const mockNotifications = [
      {
        id: 1,
        type: 'booking_confirmation',
        title: 'Booking Confirmed',
        message: 'Your booking at Grand Palace Hotel has been confirmed for Feb 15-18, 2024.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        data: {
          bookingId: 'BK001',
          propertyName: 'Grand Palace Hotel',
          checkIn: '2024-02-15',
          checkOut: '2024-02-18'
        }
      },
      {
        id: 2,
        type: 'payment_confirmation',
        title: 'Payment Processed',
        message: 'Payment of $897 has been successfully processed for your booking.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        data: {
          amount: 897,
          bookingId: 'BK001'
        }
      },
      {
        id: 3,
        type: 'booking_reminder',
        title: 'Upcoming Stay Reminder',
        message: 'Your stay at Seaside Resort is coming up in 3 days. Check-in: Jan 10, 2024.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        data: {
          bookingId: 'BK002',
          propertyName: 'Seaside Resort',
          checkIn: '2024-01-10',
          daysUntil: 3
        }
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const loadPreferences = () => {
    // Load from localStorage or API
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      createdAt: new Date(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    showToastNotification(newNotification);

    return newNotification.id;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
    toast.success('Notification preferences updated');
  };

  const showToastNotification = (notification) => {
    const toastOptions = {
      duration: 5000,
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px'
      }
    };

    switch (notification.type) {
      case 'booking_confirmation':
        toast.success(notification.message, toastOptions);
        break;
      case 'payment_confirmation':
        toast.success(notification.message, toastOptions);
        break;
      case 'booking_reminder':
        toast(notification.message, { ...toastOptions, icon: '📅' });
        break;
      case 'cancellation_notice':
        toast.error(notification.message, toastOptions);
        break;
      case 'promotional_offer':
        if (preferences.promotionalOffers) {
          toast(notification.message, { ...toastOptions, icon: '🎉' });
        }
        break;
      default:
        toast(notification.message, toastOptions);
    }
  };

  // Booking-specific notification helpers
  const sendBookingConfirmation = (bookingData) => {
    if (!preferences.bookingConfirmation) return;

    addNotification({
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Your booking at ${bookingData.propertyName} has been confirmed for ${bookingData.checkIn} - ${bookingData.checkOut}.`,
      data: bookingData
    });
  };

  const sendPaymentConfirmation = (paymentData) => {
    if (!preferences.paymentConfirmation) return;

    addNotification({
      type: 'payment_confirmation',
      title: 'Payment Processed',
      message: `Payment of $${paymentData.amount} has been successfully processed for your booking.`,
      data: paymentData
    });
  };

  const sendBookingReminder = (bookingData) => {
    if (!preferences.bookingReminder) return;

    addNotification({
      type: 'booking_reminder',
      title: 'Upcoming Stay Reminder',
      message: `Your stay at ${bookingData.propertyName} is coming up in ${bookingData.daysUntil} days.`,
      data: bookingData
    });
  };

  const sendCancellationNotice = (bookingData) => {
    if (!preferences.cancellationNotice) return;

    addNotification({
      type: 'cancellation_notice',
      title: 'Booking Cancelled',
      message: `Your booking at ${bookingData.propertyName} has been cancelled. Refund will be processed within 3-5 business days.`,
      data: bookingData
    });
  };

  const sendPromotionalOffer = (offerData) => {
    if (!preferences.promotionalOffers) return;

    addNotification({
      type: 'promotional_offer',
      title: offerData.title,
      message: offerData.message,
      data: offerData
    });
  };

  const value = {
    notifications,
    unreadCount,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    // Booking-specific helpers
    sendBookingConfirmation,
    sendPaymentConfirmation,
    sendBookingReminder,
    sendCancellationNotice,
    sendPromotionalOffer
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};