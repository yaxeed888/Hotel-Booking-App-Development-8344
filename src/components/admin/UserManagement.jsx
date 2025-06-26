import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRole } from '../../contexts/RoleContext';
import RoleGuard from '../auth/RoleGuard';
import toast from 'react-hot-toast';

const { FiUsers, FiEdit3, FiTrash2, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiShield, FiMail, FiCalendar } = FiIcons;

const UserManagement = () => {
  const { getAllRoles, updateUserRole, hasPermission, ROLES } = useRole();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const allRoles = getAllRoles();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock user data - in real app, fetch from API
      const mockUsers = [
        {
          id: 1,
          name: 'John Admin',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          createdAt: new Date('2023-01-15'),
          totalBookings: 0,
          avatar: null
        },
        {
          id: 2,
          name: 'Jane Manager',
          email: 'manager@example.com',
          role: 'manager',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          createdAt: new Date('2023-03-20'),
          totalBookings: 0,
          avatar: null
        },
        {
          id: 3,
          name: 'Bob Staff',
          email: 'staff@example.com',
          role: 'staff',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          createdAt: new Date('2023-06-10'),
          totalBookings: 0,
          avatar: null
        },
        {
          id: 4,
          name: 'Alice User',
          email: 'user@example.com',
          role: 'user',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          createdAt: new Date('2023-08-05'),
          totalBookings: 5,
          avatar: null
        },
        {
          id: 5,
          name: 'Charlie Customer',
          email: 'customer@example.com',
          role: 'user',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
          createdAt: new Date('2023-09-12'),
          totalBookings: 2,
          avatar: null
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setShowRoleModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!hasPermission('users.delete')) {
      toast.error('You do not have permission to delete users');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // In real app, make API call to delete user
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      user: 'bg-gray-100 text-gray-800',
      guest: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || colors.user;
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatLastLogin = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-booking-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <RoleGuard permission="users.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <RoleGuard permission="users.create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-booking-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} />
              <span>Add User</span>
            </motion.button>
          </RoleGuard>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {allRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Last Login</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Bookings</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-booking-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {ROLES[user.role]?.name || user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.totalBookings}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <RoleGuard permission="users.update">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Change Role"
                          >
                            <SafeIcon icon={FiShield} />
                          </button>
                        </RoleGuard>
                        <RoleGuard permission="users.update">
                          <button
                            onClick={() => {
                              // Handle edit user
                              toast.info('Edit user functionality coming soon');
                            }}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit User"
                          >
                            <SafeIcon icon={FiEdit3} />
                          </button>
                        </RoleGuard>
                        <RoleGuard permission="users.delete">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete User"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </button>
                        </RoleGuard>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Role for {selectedUser.name}
              </h3>
              <div className="space-y-3 mb-6">
                {allRoles.map(role => (
                  <label key={role.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedUser.role === role.id}
                      onChange={() => setSelectedUser({ ...selectedUser, role: role.id })}
                      className="mt-1 text-booking-blue"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-600">{role.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRoleChange(selectedUser.id, selectedUser.role)}
                  className="flex-1 bg-booking-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Role
                </button>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default UserManagement;