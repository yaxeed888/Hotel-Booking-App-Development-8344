import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiStar, FiMapPin, FiHeart, FiTrendingUp, FiUsers, FiCalendar } = FiIcons;

const RecommendationCard = ({ property, reason, index = 0, onSave }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave && onSave(property, !isSaved);
  };

  const getReasonIcon = (reason) => {
    switch (reason?.type) {
      case 'trending': return FiTrendingUp;
      case 'popular': return FiUsers;
      case 'recent': return FiCalendar;
      default: return FiStar;
    }
  };

  const getReasonColor = (reason) => {
    switch (reason?.type) {
      case 'trending': return 'bg-orange-100 text-orange-800';
      case 'popular': return 'bg-purple-100 text-purple-800';
      case 'recent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/property/${property.id}`}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isSaved 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <SafeIcon icon={FiHeart} className={`text-sm ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Price Badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-bold text-booking-blue">
                ${property.minPrice}/night
              </span>
            </div>

            {/* Recommendation Reason */}
            {reason && (
              <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(reason)}`}>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={getReasonIcon(reason)} className="text-xs" />
                  <span>{reason.text}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-booking-blue transition-colors">
                  {property.name}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <SafeIcon icon={FiMapPin} className="text-sm mr-1" />
                  <span className="text-sm">{property.city}, {property.country}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-3">
                <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-sm" />
                <span className="font-medium text-sm">{property.avgRating}</span>
                <span className="text-gray-500 text-xs">({property.reviewCount})</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {property.description}
            </p>

            {/* Features */}
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
                className="bg-booking-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                View Details
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecommendationCard;