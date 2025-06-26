import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SearchForm from '../components/search/SearchForm';
import PropertyCard from '../components/property/PropertyCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import { useBookingStore } from '../store/bookingStore';
import { mockProperties } from '../lib/supabase';

const { FiSliders, FiGrid, FiList, FiMapPin } = FiIcons;

const SearchResultsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recommended');
  
  const { properties, loading, searchParams, searchProperties } = useBookingStore();

  useEffect(() => {
    // Use mock data for demo
    useBookingStore.setState({ properties: mockProperties, loading: false });
  }, []);

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating: High to Low' },
    { value: 'distance', label: 'Distance from Center' }
  ];

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.minPrice - b.minPrice;
      case 'price_high':
        return b.minPrice - a.minPrice;
      case 'rating':
        return b.avgRating - a.avgRating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-booking-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Form */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchForm compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar isOpen={true} onClose={() => {}} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchParams.location ? `Properties in ${searchParams.location}` : 'All Properties'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {properties.length} properties found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <SafeIcon icon={FiSliders} />
                  <span>Filters</span>
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="hidden md:flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-booking-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <SafeIcon icon={FiGrid} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-booking-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <SafeIcon icon={FiList} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {sortedProperties.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiMapPin} className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};

export default SearchResultsPage;