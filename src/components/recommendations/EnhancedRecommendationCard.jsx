import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const { 
  FiStar, FiMapPin, FiHeart, FiTrendingUp, FiUsers, FiCalendar, 
  FiTarget, FiZap, FiAward, FiPercent, FiClock, FiBookmark 
} = FiIcons;

const EnhancedRecommendationCard = ({ 
  property, 
  reason, 
  score, 
  context, 
  index = 0, 
  onSave,
  showScore = false 
}) => {
  const { trackEvent } = useAnalytics();
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave && onSave(property, !isSaved);
    
    trackEvent('property_saved', {
      propertyId: property.id,
      saved: !isSaved,
      context: 'recommendation',
      reason: reason?.type
    });
  };

  const getReasonIcon = (reasonType) => {
    switch (reasonType) {
      case 'trending': return FiTrendingUp;
      case 'popular': return FiUsers;
      case 'recent': return FiClock;
      case 'preference': return FiTarget;
      case 'location': return FiMapPin;
      case 'similar': return FiHeart;
      case 'hot': return FiZap;
      case 'featured': return FiAward;
      default: return FiStar;
    }
  };

  const getReasonColor = (reasonType) => {
    switch (reasonType) {
      case 'trending': return 'bg-orange-100 text-orange-800';
      case 'popular': return 'bg-purple-100 text-purple-800';
      case 'recent': return 'bg-blue-100 text-blue-800';
      case 'preference': return 'bg-green-100 text-green-800';
      case 'location': return 'bg-indigo-100 text-indigo-800';
      case 'similar': return 'bg-pink-100 text-pink-800';
      case 'hot': return 'bg-red-100 text-red-800';
      case 'featured': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    trackEvent('recommendation_card_clicked', {
      propertyId: property.id,
      context,
      reason: reason?.type,
      score,
      position: index
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/property/${property.id}`} onClick={handleCardClick}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <SafeIcon 
              icon={isSaved ? FiHeart : FiBookmark} 
              className={`text-sm ${isSaved ? 'fill-current' : ''}`} 
            />
          </button>

          {/* Discount Badge */}
          {property.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
              <SafeIcon icon={FiPercent} className="text-xs" />
              <span>{property.discount}% OFF</span>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              {property.originalPrice && property.originalPrice > property.minPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ${property.originalPrice}
                </span>
              )}
              <span className="text-sm font-bold text-booking-blue">
                ${property.minPrice}/night
              </span>
            </div>
          </div>

          {/* Recommendation Reason */}
          {reason && (
            <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(reason.type)}`}>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={getReasonIcon(reason.type)} className="text-xs" />
                <span>{reason.text}</span>
              </div>
            </div>
          )}

          {/* Score Indicator */}
          {showScore && score && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-booking-blue text-white px-2 py-1 rounded-full text-xs font-medium">
              {Math.round(score * 100)}% match
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-booking-blue transition-colors">
                {property.name}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <SafeIcon icon={FiMapPin} className="text-sm mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{property.city}, {property.country}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
              <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-sm" />
              <span className="font-medium text-sm">{property.avgRating}</span>
              <span className="text-gray-500 text-xs">({property.reviewCount})</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {property.description}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {amenity}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">
              {property.type}
            </span>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isHovered 
                  ? 'bg-booking-blue text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              View Details
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Hover Overlay with Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-booking-blue bg-opacity-95 flex items-center justify-center pointer-events-none"
      >
        <div className="text-center text-white space-y-3">
          <h4 className="text-lg font-semibold">Quick Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiStar} className="fill-current" />
              <span>{property.avgRating} • {property.reviewCount} reviews</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiMapPin} />
              <span>{property.city}, {property.country}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiCalendar} />
              <span>Available dates</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedRecommendationCard;