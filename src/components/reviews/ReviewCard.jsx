import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';

const { FiStar, FiThumbsUp, FiThumbsDown, FiFlag, FiUser, FiMoreHorizontal } = FiIcons;

const ReviewCard = ({ review, onHelpful, onReport, showActions = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState(review.helpful_votes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulVote = () => {
    if (!hasVoted) {
      setHelpfulVotes(prev => prev + 1);
      setHasVoted(true);
      onHelpful?.(review.id);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <SafeIcon
        key={index}
        icon={FiStar}
        className={`text-sm ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-blue-600 bg-blue-50';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const shouldTruncate = review.comment.length > 200;
  const displayComment = isExpanded || !shouldTruncate 
    ? review.comment 
    : review.comment.substring(0, 200) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-booking-blue rounded-full flex items-center justify-center flex-shrink-0">
            <SafeIcon icon={FiUser} className="text-white text-sm" />
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user_name || 'Anonymous'}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                {review.rating}.0
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(review.created_at), 'MMM dd, yyyy')}
              {review.stay_date && (
                <span className="ml-2">
                  • Stayed in {format(new Date(review.stay_date), 'MMM yyyy')}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <SafeIcon icon={FiMoreHorizontal} />
            </button>
          </div>
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-medium text-gray-900 mb-2">
          {review.title}
        </h5>
      )}

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {displayComment}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-booking-blue hover:text-blue-700 text-sm font-medium mt-2"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Categories */}
      {review.categories && Object.keys(review.categories).length > 0 && (
        <div className="mb-4">
          <h6 className="text-sm font-medium text-gray-900 mb-2">Ratings breakdown:</h6>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(review.categories).map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                  <span className="text-gray-500 text-xs">{rating}.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* Pros and Cons */}
      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {review.pros?.length > 0 && (
            <div>
              <h6 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                <SafeIcon icon={FiThumbsUp} className="mr-1 text-xs" />
                Liked
              </h6>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {review.cons?.length > 0 && (
            <div>
              <h6 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <SafeIcon icon={FiThumbsDown} className="mr-1 text-xs" />
                Disliked
              </h6>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHelpfulVote}
              disabled={hasVoted}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                hasVoted 
                  ? 'text-booking-blue cursor-not-allowed' 
                  : 'text-gray-600 hover:text-booking-blue'
              }`}
            >
              <SafeIcon icon={FiThumbsUp} className="text-xs" />
              <span>Helpful ({helpfulVotes})</span>
            </button>
            
            <button
              onClick={() => onReport?.(review.id)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <SafeIcon icon={FiFlag} className="text-xs" />
              <span>Report</span>
            </button>
          </div>

          {review.verified && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <SafeIcon icon={FiStar} className="fill-current" />
              <span>Verified stay</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ReviewCard;