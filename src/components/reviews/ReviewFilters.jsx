import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiStar, FiFilter, FiCalendar, FiUser } = FiIcons;

const ReviewFilters = ({ filters, onFiltersChange, totalReviews, averageRating }) => {
  const ratingDistribution = [
    { rating: 5, count: Math.floor(totalReviews * 0.4), percentage: 40 },
    { rating: 4, count: Math.floor(totalReviews * 0.3), percentage: 30 },
    { rating: 3, count: Math.floor(totalReviews * 0.2), percentage: 20 },
    { rating: 2, count: Math.floor(totalReviews * 0.07), percentage: 7 },
    { rating: 1, count: Math.floor(totalReviews * 0.03), percentage: 3 },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Most recent' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest rated' },
    { value: 'lowest', label: 'Lowest rated' },
    { value: 'helpful', label: 'Most helpful' },
  ];

  const handleRatingFilter = (rating) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter(r => r !== rating)
      : [...filters.ratings, rating];
    
    onFiltersChange({ ...filters, ratings: newRatings });
  };

  const handleTravelerTypeFilter = (type) => {
    const newTypes = filters.travelerTypes.includes(type)
      ? filters.travelerTypes.filter(t => t !== type)
      : [...filters.travelerTypes, type];
    
    onFiltersChange({ ...filters, travelerTypes: newTypes });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Overall Rating Summary */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex items-center justify-center space-x-1 mt-1">
              {Array.from({ length: 5 }, (_, index) => (
                <SafeIcon
                  key={index}
                  icon={FiStar}
                  className={`text-sm ${
                    index < Math.floor(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {totalReviews} reviews
            </div>
          </div>
          
          <div className="flex-1">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600 w-6">{rating}</span>
                <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-xs" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <SafeIcon icon={FiFilter} className="inline mr-2" />
          Sort by
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filters */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Filter by rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingFilter(rating)}
                className="text-booking-blue focus:ring-booking-blue"
              />
              <div className="flex items-center space-x-1">
                {Array.from({ length: rating }, (_, index) => (
                  <SafeIcon
                    key={index}
                    icon={FiStar}
                    className="text-yellow-400 fill-current text-xs"
                  />
                ))}
                {Array.from({ length: 5 - rating }, (_, index) => (
                  <SafeIcon
                    key={index + rating}
                    icon={FiStar}
                    className="text-gray-300 text-xs"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({ratingDistribution.find(r => r.rating === rating)?.count || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Traveler Type Filters */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Traveler type</h4>
        <div className="space-y-2">
          {[
            'Business',
            'Couples',
            'Family',
            'Friends',
            'Solo'
          ].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.travelerTypes.includes(type)}
                onChange={() => handleTravelerTypeFilter(type)}
                className="text-booking-blue focus:ring-booking-blue"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Time of year</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Spring', 'Summer', 'Fall', 'Winter'
          ].map(season => (
            <label key={season} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.seasons?.includes(season)}
                onChange={(e) => {
                  const newSeasons = e.target.checked
                    ? [...(filters.seasons || []), season]
                    : (filters.seasons || []).filter(s => s !== season);
                  onFiltersChange({ ...filters, seasons: newSeasons });
                }}
                className="text-booking-blue focus:ring-booking-blue"
              />
              <span className="text-sm text-gray-700">{season}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({
          sortBy: 'newest',
          ratings: [],
          travelerTypes: [],
          seasons: [],
          verified: false
        })}
        className="w-full text-center text-booking-blue hover:text-blue-700 text-sm font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default ReviewFilters;