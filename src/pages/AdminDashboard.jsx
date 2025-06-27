import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import PropertyManagement from '../components/admin/PropertyManagement';
import UserManagement from '../components/admin/UserManagement';
import RoomManagement from '../components/admin/RoomManagement';
import { usePropertyStore } from '../store/propertyStore';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import toast from 'react-hot-toast';

const { FiHome, FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiPlus, FiEdit3, FiTrash2, FiEye, FiSettings, FiBarChart3 } = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPropertyForRooms, setSelectedPropertyForRooms] = useState(null);
  const { properties, getAllProperties } = usePropertyStore();
  const { user } = useAuth();
  const { userRole, hasPermission } = useRole();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Check if user has admin access
  const isAdmin = userRole === 'admin' || userRole === 'super_admin' || user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    // Load properties when component mounts
    getAllProperties();
    
    // Mock data for bookings and users
    const mockBookings = [
      {
        id: 1,
        property_name: "Grand Palace Hotel",
        guest_name: "John Doe",
        check_in: "2024-02-15",
        check_out: "2024-02-18",
        total_amount: 897,
        status: "confirmed"
      },
      {
        id: 2,
        property_name: "Seaside Resort",
        guest_name: "Jane Smith",
        check_in: "2024-02-20",
        check_out: "2024-02-25",
        total_amount: 1245,
        status: "confirmed"
      }
    ];

    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        totalBookings: 5,
        joinDate: "2023-10-15"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        totalBookings: 3,
        joinDate: "2023-11-20"
      }
    ];

    setBookings(mockBookings);
    setUsers(mockUsers);
  }, [getAllProperties, isAdmin, userRole, user]);

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500">
            Try logging in with: <strong>admin@example.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiHome },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart3 },
    { id: 'properties', name: 'Properties', icon: FiHome },
    { id: 'bookings', name: 'Bookings', icon: FiCalendar },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: FiHome,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Active Bookings",
      value: bookings.filter(b => b.status === 'confirmed').length,
      icon: FiCalendar,
      color: "bg-green-500",
      change: "+8%"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
      color: "bg-purple-500",
      change: "+15%"
    },
    {
      title: "Monthly Revenue",
      value: "$25,000",
      icon: FiDollarSign,
      color: "bg-yellow-500",
      change: "+25%"
    }
  ];

  // Handle room management navigation
  const handleManageRooms = (propertyId) => {
    setSelectedPropertyForRooms(propertyId);
  };

  // If viewing room management for a specific property
  if (selectedPropertyForRooms) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <RoomManagement
            propertyId={selectedPropertyForRooms}
            onClose={() => setSelectedPropertyForRooms(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your properties, bookings, and users
          </p>
          <div className="mt-2 text-sm text-green-600">
            Welcome, {user?.name} ({userRole})
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
          <div className="lg:col-span-4">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <SafeIcon icon={stat.icon} className="text-white text-xl" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <div className="flex items-center">
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <span className="ml-2 text-sm text-green-600 flex items-center">
                              <SafeIcon icon={FiTrendingUp} className="mr-1" />
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Guest</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Dates</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">{booking.guest_name}</td>
                            <td className="py-3 px-4">{booking.property_name}</td>
                            <td className="py-3 px-4">{booking.check_in} - {booking.check_out}</td>
                            <td className="py-3 px-4">${booking.total_amount}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AnalyticsDashboard />
              </motion.div>
            )}

            {activeTab === 'properties' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PropertyManagement onManageRooms={handleManageRooms} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserManagement />
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900">All Bookings</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">ID</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Guest</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Property</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Check-in</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Check-out</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-100">
                            <td className="py-4 px-6">#{booking.id}</td>
                            <td className="py-4 px-6">{booking.guest_name}</td>
                            <td className="py-4 px-6">{booking.property_name}</td>
                            <td className="py-4 px-6">{booking.check_in}</td>
                            <td className="py-4 px-6">{booking.check_out}</td>
                            <td className="py-4 px-6">${booking.total_amount}</td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <SafeIcon icon={FiEye} />
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <SafeIcon icon={FiEdit3} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive email notifications for new bookings</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-approve Bookings</h4>
                          <p className="text-sm text-gray-600">Automatically approve new bookings</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;