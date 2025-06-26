import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import RecommendationCard from './RecommendationCard';
import { useRecommendationStore } from '../../store/recommendationStore';
import { useAuth } from '../../contexts/AuthContext';

const { FiChevronLeft, FiChevronRight, FiRefreshCw, FiSettings } = FiIcons;

const RecommendationSection = ({ title, type, limit = 6 }) => {
  const { user } = useAuth();
  const { 
    recommendations, 
    loading, 
    getRecommendations, 
    refreshRecommendations,
    saveProperty 
  } = useRecommendationStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      getRecommendations(type, limit);
    }
  }, [user, type, limit, getRecommendations]);

  const sectionRecommendations = recommendations[type] || [];
  const itemsPerView = 3;
  const maxIndex = Math.max(0, sectionRecommendations.length - itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshRecommendations(type);
    setCurrentIndex(0);
    setIsRefreshing(false);
  };

  const handleSaveProperty = (property, saved) => {
    saveProperty(property.id, saved);
  };

  if (loading && sectionRecommendations.length === 0) {
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

  if (sectionRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-gray-600 mt-2">
              Personalized recommendations just for you
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <SafeIcon 
                icon={FiRefreshCw} 
                className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              <span className="text-sm font-medium">Refresh</span>
            </motion.button>
            
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <SafeIcon icon={FiSettings} className="text-sm" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {sectionRecommendations.length > itemsPerView && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiChevronLeft} className="text-lg" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiChevronRight} className="text-lg" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex"
              style={{ width: `${(sectionRecommendations.length / itemsPerView) * 100}%` }}
            >
              {sectionRecommendations.map((item, index) => (
                <div
                  key={item.property.id}
                  className="px-3"
                  style={{ width: `${100 / sectionRecommendations.length}%` }}
                >
                  <RecommendationCard
                    property={item.property}
                    reason={item.reason}
                    index={index}
                    onSave={handleSaveProperty}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {sectionRecommendations.length > itemsPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-booking-blue' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;