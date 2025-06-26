import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiStar, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit3, 
  FiX 
} = FiIcons;

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  // Mock bookings data
  useEffect(() => {
    const mockBookings = [
      {
        id: 1,
        property_name: "Grand Palace Hotel",
        property_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        room_name: "Deluxe Room",
        check_in: "2024-02-15",
        check_out: "2024-02-18",
        guests: 2,
        total_amount: 897,
        status: "confirmed",
        city: "New York",
        country: "USA"
      },
      {
        id: 2,
        property_name: "Seaside Resort",
        property_image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        room_name: "Ocean View Room",
        check_in: "2024-01-10",
        check_out: "2024-01-14",
        guests: 2,
        total_amount: 756,
        status: "completed",
        city: "Miami",
        country: "USA"
      }
    ];

    setBookings(mockBookings);
  }, []);

  const tabs = [
    { id: 'bookings', name: 'My Bookings', icon: FiCalendar },
    { id: 'profile', name: 'Profile', icon: FiUser }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    // Here you would typically update the user profile
    console.log('Updated profile data:', profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Guest'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-booking-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
                  <div className="text-sm text-gray-600">
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <SafeIcon icon={FiCalendar} className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start exploring amazing properties and make your first booking!
                    </p>
                    <a
                      href="/search"
                      className="bg-booking-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Properties
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-48 flex-shrink-0">
                            <img
                              src={booking.property_image}
                              alt={booking.property_name}
                              className="w-full h-32 lg:h-24 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {booking.property_name}
                                </h3>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                  <SafeIcon icon={FiMapPin} className="mr-1" />
                                  <span>{booking.city}, {booking.country}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {booking.room_name} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <SafeIcon icon={FiCalendar} className="mr-1" />
                                  <span>Check-in</span>
                                </div>
                                <div className="font-medium">
                                  {format(new Date(booking.check_in), 'MMM dd, yyyy')}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <SafeIcon icon={FiCalendar} className="mr-1" />
                                  <span>Check-out</span>
                                </div>
                                <div className="font-medium">
                                  {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <SafeIcon icon={FiClock} className="mr-1" />
                                  <span>Total Paid</span>
                                </div>
                                <div className="font-bold text-booking-blue">
                                  ${booking.total_amount}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center space-x-2 text-booking-blue hover:text-blue-700"
                  >
                    <SafeIcon icon={isEditingProfile ? FiX : FiEdit3} />
                    <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiUser} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiMail} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiPhone} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-booking-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={FiUser} className="text-gray-400" />
                          <span>{user?.name || 'Not provided'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={FiMail} className="text-gray-400" />
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={FiPhone} className="text-gray-400" />
                          <span>Not provided</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <SafeIcon icon={FiCalendar} className="text-gray-400" />
                          <span>{format(new Date(user?.created_at || new Date()), 'MMM yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;