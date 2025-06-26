import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { format, differenceInDays } from 'date-fns';

const { FiCreditCard, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiArrowLeft } = FiIcons;

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBooking } = useBookingStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [loading, setLoading] = useState(false);

  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData) {
      navigate('/search');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const { property, room, dates, guests } = bookingData;
  const nights = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
  const roomTotal = room.price_per_night * nights;
  const serviceFee = 25;
  const taxes = Math.round(roomTotal * 0.12);
  const totalAmount = roomTotal + serviceFee + taxes;

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const booking = {
        user_id: user.id,
        property_id: property.id,
        room_id: room.id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        guests: guests,
        total_amount: totalAmount,
        guest_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests
        },
        payment_info: {
          last_four: formData.cardNumber.slice(-4),
          card_name: formData.cardName
        },
        status: 'confirmed'
      };

      const result = await createBooking(booking);
      
      if (result.success) {
        navigate(`/confirmation/${result.booking.id}`, {
          state: { booking: result.booking, property, room }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-booking-blue hover:text-blue-700"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to property</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Your Booking
              </h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guest Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Guest Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiUser} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiUser} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiMail} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiPhone} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special requests or preferences..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiCreditCard} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-booking-blue text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Complete Booking - $${totalAmount}`}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
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
              </div>

              {/* Dates */}
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
                  <span className="text-sm text-gray-600">Guests</span>
                  <span className="font-medium">{guests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">${room.price_per_night} × {nights} nights</span>
                  <span>${roomTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxes</span>
                  <span>${taxes}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;