import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRecommendationStore } from '../../store/recommendationStore';

const { FiFilter, FiX, FiSliders, FiMapPin, FiDollarSign, FiStar, FiCalendar } = FiIcons;

const RecommendationFilters = ({ isOpen, onClose }) => {
  const { filters, setFilters, applyFilters } = useRecommendationStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    setFilters(localFilters);
    applyFilters();
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      priceRange: [0, 1000],
      rating: 0,
      propertyTypes: [],
      amenities: [],
      location: '',
      travelDates: null
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const propertyTypes = [
    { value: 'hotel', label: 'Hotels' },
    { value: 'resort', label: 'Resorts' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'villa', label: 'Villas' },
    { value: 'guesthouse', label: 'Guesthouses' }
  ];

  const amenitiesList = [
    'WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Beach Access',
    'Parking', 'Room Service', 'Business Center', 'Pet Friendly'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiSliders} className="text-booking-blue" />
                  <h2 className="text-xl font-semibold">Recommendation Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiMapPin} className="inline mr-2" />
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                  placeholder="City, country, or region"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiDollarSign} className="inline mr-2" />
                  Price Range (per night)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={localFilters.priceRange[0]}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          priceRange: [parseInt(e.target.value), localFilters.priceRange[1]]
                        })}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Min: ${localFilters.priceRange[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={localFilters.priceRange[1]}
                        onChange={(e) => setLocalFilters({
                          ...localFilters,
                          priceRange: [localFilters.priceRange[0], parseInt(e.target.value)]
                        })}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Max: ${localFilters.priceRange[1]}
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium text-booking-blue">
                    ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiStar} className="inline mr-2" />
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5, 5].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={localFilters.rating === rating}
                        onChange={(e) => setLocalFilters({ ...localFilters, rating: parseFloat(e.target.value) })}
                        className="text-booking-blue"
                      />
                      <div className="flex items-center space-x-1">
                        {rating === 0 ? (
                          <span>Any rating</span>
                        ) : (
                          <>
                            <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-sm" />
                            <span>{rating}+ stars</span>
                          </>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Types
                </label>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.propertyTypes.includes(type.value)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...localFilters.propertyTypes, type.value]
                            : localFilters.propertyTypes.filter(t => t !== type.value);
                          setLocalFilters({ ...localFilters, propertyTypes: newTypes });
                        }}
                        className="text-booking-blue"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Amenities
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...localFilters.amenities, amenity]
                            : localFilters.amenities.filter(a => a !== amenity);
                          setLocalFilters({ ...localFilters, amenities: newAmenities });
                        }}
                        className="text-booking-blue"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 bg-booking-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecommendationFilters;