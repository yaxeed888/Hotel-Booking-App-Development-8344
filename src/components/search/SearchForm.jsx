import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useBookingStore } from '../../store/bookingStore';
import { format } from 'date-fns';

const { FiMapPin, FiCalendar, FiUsers, FiSearch } = FiIcons;

const SearchForm = ({ compact = false }) => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBookingStore();
  
  const [location, setLocation] = useState(searchParams.location);
  const [checkIn, setCheckIn] = useState(
    searchParams.checkIn ? format(new Date(searchParams.checkIn), 'yyyy-MM-dd') : ''
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.checkOut ? format(new Date(searchParams.checkOut), 'yyyy-MM-dd') : ''
  );
  const [guests, setGuests] = useState(searchParams.guests);
  const [rooms, setRooms] = useState(searchParams.rooms);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = {
      location,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      guests,
      rooms
    };
    
    setSearchParams(params);
    navigate('/search');
  };

  const formClasses = compact 
    ? "bg-white rounded-lg shadow-md p-4" 
    : "bg-white rounded-2xl shadow-2xl p-6 md:p-8";
    
  const gridClasses = compact 
    ? "grid grid-cols-1 md:grid-cols-5 gap-4" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6";

  const inputClasses = `
    w-full pl-10 pr-4 py-3 
    border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-booking-blue focus:border-booking-blue focus:outline-none
    text-gray-900 placeholder-gray-500
    bg-white
    transition-all duration-200
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSearch}
      className={formClasses}
    >
      <div className={gridClasses}>
        {/* Location */}
        <div className="relative">
          <label className={labelClasses}>
            Where are you going?
          </label>
          <div className="relative">
            <SafeIcon 
              icon={FiMapPin} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, hotel, or landmark"
              className={inputClasses}
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="relative">
          <label className={labelClasses}>
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

        {/* Check-out */}
        <div className="relative">
          <label className={labelClasses}>
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

        {/* Guests & Rooms */}
        <div className="relative">
          <label className={labelClasses}>
            Guests & Rooms
          </label>
          <div className="grid grid-cols-2 gap-2">
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
            <select
              value={rooms}
              onChange={(e) => setRooms(parseInt(e.target.value))}
              className={`${inputClasses} pl-4`}
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                  {num} {num === 1 ? 'Room' : 'Rooms'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-booking-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiSearch} className="text-lg" />
            <span>Search</span>
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default SearchForm;