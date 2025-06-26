import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useBookingStore } from '../../store/bookingStore';

const { FiSliders, FiStar, FiDollarSign, FiHome } = FiIcons;

const FilterSidebar = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useBookingStore();

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'resort', label: 'Resorts' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'guesthouse', label: 'Guesthouses' },
    { value: 'lodge', label: 'Lodges' }
  ];

  const amenitiesList = [
    'WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 
    'Parking', 'Spa', 'Bar', 'Business Center', 'Beach Access'
  ];

  const handlePriceChange = (value, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters({ priceRange: newRange });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ amenities: newAmenities });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      rating: 0,
      amenities: [],
      propertyType: ''
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:w-full overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiSliders} className="text-booking-blue" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-booking-blue hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiDollarSign} className="text-gray-600" />
              <h3 className="font-medium">Price per night</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, 0)}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">${filters.priceRange[0]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, 1)}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">${filters.priceRange[1]}</span>
              </div>
              <div className="text-sm text-gray-600">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiStar} className="text-gray-600" />
              <h3 className="font-medium">Minimum Rating</h3>
            </div>
            <div className="space-y-2">
              {[0, 3, 4, 4.5, 5].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating}
                    onChange={(e) => setFilters({ rating: parseFloat(e.target.value) })}
                    className="text-booking-blue"
                  />
                  <div className="flex items-center space-x-1">
                    {rating === 0 ? (
                      <span>Any rating</span>
                    ) : (
                      <>
                        <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-sm" />
                        <span>{rating}+</span>
                      </>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiHome} className="text-gray-600" />
              <h3 className="font-medium">Property Type</h3>
            </div>
            <div className="space-y-2">
              {propertyTypes.map(type => (
                <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="propertyType"
                    value={type.value}
                    checked={filters.propertyType === type.value}
                    onChange={(e) => setFilters({ propertyType: e.target.value })}
                    className="text-booking-blue"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Amenities</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="text-booking-blue"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;