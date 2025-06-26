import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiStar, FiMapPin, FiWifi, FiCoffee, FiCar, FiUsers } = FiIcons;

const PropertyCard = ({ property, index = 0 }) => {
  const amenityIcons = {
    'WiFi': FiWifi,
    'Restaurant': FiCoffee,
    'Parking': FiCar,
    'Pool': FiUsers
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-sm font-semibold">
          ${property.minPrice}/night
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm">
            <SafeIcon icon={FiStar} className="text-yellow-400 fill-current" />
            <span className="font-medium">{property.avgRating}</span>
            <span className="text-gray-500">({property.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <SafeIcon icon={FiMapPin} className="text-sm mr-1" />
          <span className="text-sm">{property.city}, {property.country}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities?.slice(0, 4).map((amenity, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
            >
              <SafeIcon 
                icon={amenityIcons[amenity] || FiWifi} 
                className="text-xs" 
              />
              <span>{amenity}</span>
            </div>
          ))}
          {property.amenities?.length > 4 && (
            <div className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              +{property.amenities.length - 4} more
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="capitalize">{property.type}</span>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="bg-booking-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;