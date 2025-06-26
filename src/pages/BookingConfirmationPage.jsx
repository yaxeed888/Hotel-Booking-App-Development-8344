import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiCheckCircle, FiCalendar, FiMapPin, FiMail, FiPhone, FiHome } = FiIcons;

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  
  const { booking, property, room } = location.state || {};

  if (!booking || !property || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Link
            to="/"
            className="bg-booking-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-50 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <SafeIcon icon={FiCheckCircle} className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your reservation has been successfully confirmed
            </p>
            <div className="mt-4 inline-block bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-500">Booking ID:</span>
              <span className="ml-2 font-mono font-semibold">{bookingId}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Property Details
                </h2>
                <div className="space-y-4">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{property.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <SafeIcon icon={FiMapPin} className="mr-1" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{room.name}</h4>
                    <p className="text-sm text-gray-600">
                      Maximum {room.max_guests} guests
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Booking Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-booking-blue" />
                      <span className="font-medium">Check-in</span>
                    </div>
                    <span>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-booking-blue" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <span>{format(new Date(booking.check_out), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Guests</span>
                    <span>{booking.guests}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-booking-blue">
                      ${booking.total_amount}
                    </span>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Guest Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMail} className="text-gray-400" />
                      <span>{booking.guest_info?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiPhone} className="text-gray-400" />
                      <span>{booking.guest_info?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-booking-blue mb-4">
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• A confirmation email has been sent to your email address</li>
                <li>• Please arrive at the property between 3:00 PM - 11:00 PM on your check-in date</li>
                <li>• You can cancel this booking free of charge until 24 hours before check-in</li>
                <li>• Please bring a valid ID and the credit card used for booking</li>
                <li>• Contact the property directly for any special requests</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/dashboard"
                className="flex-1 bg-booking-blue text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Bookings
              </Link>
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiHome} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;