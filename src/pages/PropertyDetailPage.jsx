import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { mockProperties } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

const { FiStar, FiMapPin, FiWifi, FiCoffee, FiCar, FiUsers, FiCalendar, FiArrowLeft } = FiIcons;

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const foundProperty = mockProperties.find(p => p.id === parseInt(id));
    setProperty(foundProperty);
    if (foundProperty?.rooms?.length > 0) {
      setSelectedRoom(foundProperty.rooms[0]);
    }
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    navigate(`/booking/${property.id}`, {
      state: {
        property,
        room: selectedRoom,
        dates: { checkIn, checkOut },
        guests
      }
    });
  };

  const amenityIcons = {
    'WiFi': FiWifi,
    'Restaurant': FiCoffee,
    'Parking': FiCar,
    'Pool': FiUsers
  };

  if (!property) {
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

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = selectedRoom ? selectedRoom.price_per_night * nights : 0;

  const inputClasses = `
    w-full pl-10 pr-4 py-3 
    border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-booking-blue focus:border-booking-blue focus:outline-none
    text-gray-900 placeholder-gray-500
    bg-white
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-booking-blue hover:text-blue-700"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to results</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <SafeIcon icon={FiMapPin} className="mr-1" />
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="text-yellow-400 fill-current" />
                      <span className="font-medium">{property.avgRating}</span>
                      <span className="text-gray-500">({property.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-booking-blue">
                      ${property.minPrice}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {property.description}
                </p>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <SafeIcon 
                          icon={amenityIcons[amenity] || FiWifi} 
                          className="text-booking-blue" 
                        />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Choose Your Room</h2>
              <div className="space-y-4">
                {property.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'border-booking-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Max guests: {room.max_guests}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-booking-blue">
                          ${room.price_per_night}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-booking-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {review.user_name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{review.user_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiStar} className="text-yellow-400 fill-current text-sm" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(review.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Book Your Stay</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <SafeIcon 
                      icon={FiCalendar} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
                    />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className={inputClasses}
                      style={{
                        color: '#111827',
                        backgroundColor: '#ffffff',
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <SafeIcon 
                      icon={FiCalendar} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
                    />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                      className={inputClasses}
                      style={{
                        color: '#111827',
                        backgroundColor: '#ffffff',
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <SafeIcon 
                      icon={FiUsers} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
                    />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className={inputClasses}
                      style={{
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && selectedRoom && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>${selectedRoom.price_per_night} × {nights} nights</span>
                      <span>${selectedRoom.price_per_night * nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>${Math.round(totalPrice * 0.12)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice + 25 + Math.round(totalPrice * 0.12)}</span>
                    </div>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="w-full bg-booking-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {user ? 'Book Now' : 'Sign In to Book'}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;