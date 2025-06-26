import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format, differenceInDays } from 'date-fns';

const { FiMapPin, FiCalendar, FiUsers, FiInfo } = FiIcons;

const BookingSummary = ({ property, room, dates, guests, isSticky = false }) => {
  const nights = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
  const roomTotal = room.price_per_night * nights;
  const serviceFee = 25;
  const taxes = Math.round(roomTotal * 0.12);
  const totalAmount = roomTotal + serviceFee + taxes;

  const containerClasses = isSticky 
    ? "bg-white rounded-xl shadow-lg p-6 sticky top-24" 
    : "bg-white rounded-xl shadow-lg p-6";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={containerClasses}
    >
      <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>

      {/* Property Info */}
      <div className="mb-6">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h3 className="font-semibold text-lg">{property.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mt-1">
          <SafeIcon icon={FiMapPin} className="mr-1" />
          <span>{property.city}, {property.country}</span>
        </div>
      </div>

      {/* Room Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">{room.name}</h4>
        <p className="text-sm text-gray-600">Max guests: {room.max_guests}</p>
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Included amenities:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="text-gray-400" />
            <span className="text-sm">Check-in</span>
          </div>
          <span className="font-medium">
            {format(new Date(dates.checkIn), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="text-gray-400" />
            <span className="text-sm">Check-out</span>
          </div>
          <span className="font-medium">
            {format(new Date(dates.checkOut), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="text-gray-400" />
            <span className="text-sm">Guests</span>
          </div>
          <span className="font-medium">{guests}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Nights</span>
          <span className="font-medium">{nights}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span>${room.price_per_night} × {nights} nights</span>
          <span>${roomTotal}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span>Service fee</span>
            <SafeIcon icon={FiInfo} className="text-gray-400 text-xs" />
          </div>
          <span>${serviceFee}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span>Taxes & fees</span>
            <SafeIcon icon={FiInfo} className="text-gray-400 text-xs" />
          </div>
          <span>${taxes}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-booking-blue">${totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <SafeIcon icon={FiInfo} className="text-green-600 text-sm mt-0.5" />
          <div className="text-green-800 text-xs">
            <p className="font-medium mb-1">You won't be charged yet</p>
            <p>Final payment will be processed after confirmation</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSummary;