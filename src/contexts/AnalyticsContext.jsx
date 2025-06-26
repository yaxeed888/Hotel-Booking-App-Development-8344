import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState({
    bookings: [],
    properties: [],
    users: [],
    revenue: [],
    performance: {}
  });
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    currentBookings: 0,
    todayRevenue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(false);

  // Initialize analytics data
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalyticsData();
      startRealTimeUpdates();
    }
  }, [isAuthenticated]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock analytics data - in real app, fetch from API
      const mockAnalytics = {
        bookings: generateBookingAnalytics(),
        properties: generatePropertyAnalytics(),
        users: generateUserAnalytics(),
        revenue: generateRevenueAnalytics(),
        performance: generatePerformanceAnalytics()
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Analytics loading error:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: Math.floor(Math.random() * 50) + 100,
        currentBookings: Math.floor(Math.random() * 20) + 30,
        todayRevenue: Math.floor(Math.random() * 5000) + 15000,
        conversionRate: (Math.random() * 2 + 3).toFixed(2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  };

  // Track user events
  const trackEvent = (eventName, properties = {}) => {
    const event = {
      id: Date.now(),
      name: eventName,
      properties: {
        ...properties,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };

    // Store event locally (in real app, send to analytics service)
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events

    console.log('Analytics Event:', event);
  };

  // Track page views
  const trackPageView = (page, properties = {}) => {
    trackEvent('page_view', {
      page,
      ...properties
    });
  };

  // Track booking funnel
  const trackBookingFunnel = (step, properties = {}) => {
    const funnelSteps = {
      'property_view': 'Property Viewed',
      'booking_start': 'Booking Started',
      'guest_info': 'Guest Info Completed',
      'payment_info': 'Payment Info Entered',
      'booking_complete': 'Booking Completed'
    };

    trackEvent('booking_funnel', {
      step,
      stepName: funnelSteps[step],
      ...properties
    });
  };

  // Track search behavior
  const trackSearch = (query, results, filters = {}) => {
    trackEvent('search', {
      query,
      resultsCount: results,
      filters,
      hasResults: results > 0
    });
  };

  // Track user engagement
  const trackEngagement = (action, properties = {}) => {
    trackEvent('engagement', {
      action,
      ...properties
    });
  };

  // Get analytics insights
  const getInsights = () => {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEvents = events.filter(e => new Date(e.timestamp) >= today);
    const weekEvents = events.filter(e => new Date(e.timestamp) >= thisWeek);
    const monthEvents = events.filter(e => new Date(e.timestamp) >= thisMonth);

    return {
      today: {
        pageViews: todayEvents.filter(e => e.name === 'page_view').length,
        searches: todayEvents.filter(e => e.name === 'search').length,
        bookings: todayEvents.filter(e => e.name === 'booking_funnel' && e.properties.step === 'booking_complete').length
      },
      week: {
        pageViews: weekEvents.filter(e => e.name === 'page_view').length,
        searches: weekEvents.filter(e => e.name === 'search').length,
        bookings: weekEvents.filter(e => e.name === 'booking_funnel' && e.properties.step === 'booking_complete').length
      },
      month: {
        pageViews: monthEvents.filter(e => e.name === 'page_view').length,
        searches: monthEvents.filter(e => e.name === 'search').length,
        bookings: monthEvents.filter(e => e.name === 'booking_funnel' && e.properties.step === 'booking_complete').length
      }
    };
  };

  const value = {
    analytics,
    realTimeData,
    loading,
    trackEvent,
    trackPageView,
    trackBookingFunnel,
    trackSearch,
    trackEngagement,
    getInsights,
    loadAnalyticsData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Helper functions to generate mock data
const generateBookingAnalytics = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      bookings: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      cancellations: Math.floor(Math.random() * 5) + 1,
      averageValue: Math.floor(Math.random() * 200) + 150
    });
  }
  
  return data;
};

const generatePropertyAnalytics = () => {
  return [
    { id: 1, name: 'Grand Palace Hotel', bookings: 234, revenue: 87500, rating: 4.5, occupancy: 85 },
    { id: 2, name: 'Seaside Resort', bookings: 189, revenue: 65400, rating: 4.7, occupancy: 78 },
    { id: 3, name: 'Mountain Lodge', bookings: 156, revenue: 45200, rating: 4.3, occupancy: 72 },
    { id: 4, name: 'City Center Hotel', bookings: 298, revenue: 95600, rating: 4.4, occupancy: 88 },
    { id: 5, name: 'Beach Villa Resort', bookings: 167, revenue: 78900, rating: 4.8, occupancy: 82 }
  ];
};

const generateUserAnalytics = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      newUsers: Math.floor(Math.random() * 20) + 5,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      returningUsers: Math.floor(Math.random() * 30) + 10
    });
  }
  
  return data;
};

const generateRevenueAnalytics = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 12; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: Math.floor(Math.random() * 50000) + 100000,
      bookings: Math.floor(Math.random() * 500) + 800,
      averageOrderValue: Math.floor(Math.random() * 100) + 200
    });
  }
  
  return data;
};

const generatePerformanceAnalytics = () => {
  return {
    conversionRate: 3.2,
    bounceRate: 45.8,
    averageSessionDuration: 4.5,
    pageViewsPerSession: 5.2,
    topPages: [
      { page: '/', views: 12500, bounceRate: 35.2 },
      { page: '/search', views: 8900, bounceRate: 42.1 },
      { page: '/property/*', views: 6700, bounceRate: 38.9 },
      { page: '/booking/*', views: 3400, bounceRate: 25.6 }
    ],
    topSources: [
      { source: 'Direct', users: 4500, percentage: 35.2 },
      { source: 'Google', users: 3200, percentage: 25.1 },
      { source: 'Social Media', users: 2100, percentage: 16.4 },
      { source: 'Email', users: 1800, percentage: 14.1 },
      { source: 'Referral', users: 1200, percentage: 9.2 }
    ]
  };
};