import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import RecommendationCard from './RecommendationCard';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const { FiTarget, FiTrendingUp, FiHeart, FiMapPin, FiClock, FiRefreshCw } = FiIcons;

const RecommendationEngine = ({ context = 'homepage', propertyId = null, limit = 6 }) => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('personalized');

  const categories = [
    { id: 'personalized', name: 'For You', icon: FiTarget, description: 'Based on your preferences' },
    { id: 'trending', name: 'Trending', icon: FiTrendingUp, description: 'Popular right now' },
    { id: 'similar', name: 'Similar', icon: FiHeart, description: 'Properties like this one' },
    { id: 'nearby', name: 'Nearby', icon: FiMapPin, description: 'In the same area' },
    { id: 'recent', name: 'Recently Viewed', icon: FiClock, description: 'Your recent searches' }
  ];

  // Filter categories based on context
  const availableCategories = categories.filter(cat => {
    if (context === 'property-detail') {
      return ['similar', 'nearby', 'trending'].includes(cat.id);
    }
    if (context === 'search-results') {
      return ['personalized', 'trending', 'nearby'].includes(cat.id);
    }
    return ['personalized', 'trending', 'recent'].includes(cat.id);
  });

  useEffect(() => {
    loadRecommendations();
  }, [activeCategory, user, propertyId, context]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await generateRecommendations(activeCategory, context, propertyId, limit);
      setRecommendations(data);
      
      // Track recommendation view
      trackEvent('recommendations_viewed', {
        category: activeCategory,
        context,
        propertyId,
        count: data.length
      });
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (category, context, propertyId, limit) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockProperties = [
      {
        id: 1,
        name: "Grand Palace Hotel",
        city: "New York",
        country: "USA",
        type: "hotel",
        description: "Luxury hotel in Manhattan with stunning city views.",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
        amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
        avgRating: 4.5,
        reviewCount: 1247,
        minPrice: 299,
        originalPrice: 349,
        discount: 15
      },
      {
        id: 2,
        name: "Seaside Resort",
        city: "Miami",
        country: "USA",
        type: "resort",
        description: "Beachfront resort with private beach access.",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
        amenities: ["WiFi", "Beach Access", "Pool", "Spa"],
        avgRating: 4.7,
        reviewCount: 892,
        minPrice: 189,
        originalPrice: 220,
        discount: 14
      },
      {
        id: 3,
        name: "Mountain Lodge",
        city: "Aspen",
        country: "USA",
        type: "lodge",
        description: "Cozy mountain lodge perfect for skiing.",
        images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"],
        amenities: ["WiFi", "Fireplace", "Ski Storage", "Restaurant"],
        avgRating: 4.3,
        reviewCount: 456,
        minPrice: 159,
        originalPrice: 185,
        discount: 14
      },
      {
        id: 4,
        name: "Urban Boutique Hotel",
        city: "San Francisco",
        country: "USA",
        type: "hotel",
        description: "Modern boutique hotel in the heart of the city.",
        images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
        amenities: ["WiFi", "Restaurant", "Bar", "Business Center"],
        avgRating: 4.4,
        reviewCount: 623,
        minPrice: 225,
        originalPrice: 265,
        discount: 15
      },
      {
        id: 5,
        name: "Tropical Villa Resort",
        city: "Maui",
        country: "USA",
        type: "resort",
        description: "Luxury villas with ocean views and private pools.",
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
        amenities: ["WiFi", "Private Pool", "Ocean View", "Spa"],
        avgRating: 4.8,
        reviewCount: 334,
        minPrice: 445,
        originalPrice: 520,
        discount: 14
      },
      {
        id: 6,
        name: "Historic Downtown Inn",
        city: "Boston",
        country: "USA",
        type: "hotel",
        description: "Charming historic hotel in downtown Boston.",
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
        amenities: ["WiFi", "Restaurant", "Historic Building", "Room Service"],
        avgRating: 4.2,
        reviewCount: 789,
        minPrice: 175,
        originalPrice: 200,
        discount: 13
      }
    ];

    // Generate recommendations based on category and context
    let filteredProperties = [...mockProperties];
    let reasons = [];

    switch (category) {
      case 'personalized':
        // Mock personalization based on user preferences
        reasons = [
          { type: 'preference', text: 'Matches your luxury preference' },
          { type: 'location', text: 'You often search in this area' },
          { type: 'amenity', text: 'Has your favorite amenities' },
          { type: 'price', text: 'Within your usual budget' },
          { type: 'rating', text: 'Highly rated like your past stays' },
          { type: 'type', text: 'Your preferred property type' }
        ];
        break;
      
      case 'trending':
        // Sort by popularity metrics
        filteredProperties = filteredProperties.sort((a, b) => b.reviewCount - a.reviewCount);
        reasons = [
          { type: 'trending', text: 'Trending destination' },
          { type: 'popular', text: 'Popular this week' },
          { type: 'hot', text: 'Hot booking right now' },
          { type: 'featured', text: 'Featured property' }
        ];
        break;
      
      case 'similar':
        // Filter similar properties (same type, similar price range)
        if (propertyId) {
          const currentProperty = mockProperties.find(p => p.id === parseInt(propertyId));
          if (currentProperty) {
            filteredProperties = filteredProperties.filter(p => 
              p.id !== currentProperty.id && 
              (p.type === currentProperty.type || 
               Math.abs(p.minPrice - currentProperty.minPrice) < 100)
            );
          }
        }
        reasons = [
          { type: 'similar', text: 'Similar to this property' },
          { type: 'type', text: 'Same property type' },
          { type: 'price', text: 'Similar price range' },
          { type: 'amenity', text: 'Similar amenities' }
        ];
        break;
      
      case 'nearby':
        // Mock nearby properties (same city/region)
        reasons = [
          { type: 'location', text: 'Nearby location' },
          { type: 'area', text: 'Same area' },
          { type: 'district', text: 'Popular district' },
          { type: 'transport', text: 'Easy to reach' }
        ];
        break;
      
      case 'recent':
        // Mock recent searches/views
        reasons = [
          { type: 'recent', text: 'You viewed this recently' },
          { type: 'search', text: 'From your recent search' },
          { type: 'saved', text: 'Similar to your saved items' }
        ];
        break;
      
      default:
        reasons = [{ type: 'default', text: 'Recommended for you' }];
    }

    // Limit results and add recommendation reasons
    return filteredProperties
      .slice(0, limit)
      .map((property, index) => ({
        property,
        reason: reasons[index % reasons.length] || reasons[0],
        score: Math.random() * 0.3 + 0.7, // Mock relevance score
        context: category
      }));
  };

  const handleRecommendationClick = (recommendation) => {
    trackEvent('recommendation_clicked', {
      propertyId: recommendation.property.id,
      category: activeCategory,
      context,
      reason: recommendation.reason.type,
      score: recommendation.score
    });
  };

  const handleRefresh = () => {
    trackEvent('recommendations_refreshed', {
      category: activeCategory,
      context
    });
    loadRecommendations();
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-48">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-booking-blue border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-white text-booking-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={category.icon} className="text-sm" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-booking-blue transition-colors"
        >
          <SafeIcon 
            icon={FiRefreshCw} 
            className={`text-sm ${loading ? 'animate-spin' : ''}`} 
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Category Description */}
      <div className="text-center">
        <p className="text-gray-600">
          {availableCategories.find(cat => cat.id === activeCategory)?.description}
        </p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={`${recommendation.property.id}-${activeCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleRecommendationClick(recommendation)}
          >
            <RecommendationCard
              property={recommendation.property}
              reason={recommendation.reason}
              score={recommendation.score}
              context={recommendation.context}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {recommendations.length >= limit && (
        <div className="text-center pt-4">
          <button
            onClick={() => {
              trackEvent('recommendations_load_more', {
                category: activeCategory,
                context,
                currentCount: recommendations.length
              });
              // Load more recommendations
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Show More Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;