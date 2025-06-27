import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Define role hierarchy and permissions
const ROLES = {
  super_admin: {
    name: 'Super Admin',
    level: 100,
    permissions: ['*'], // All permissions
    description: 'Full system access with all permissions'
  },
  admin: {
    name: 'Admin',
    level: 80,
    permissions: [
      'users.read', 'users.create', 'users.update', 'users.delete',
      'properties.read', 'properties.create', 'properties.update', 'properties.delete',
      'bookings.read', 'bookings.update', 'bookings.cancel',
      'analytics.read', 'settings.update', 'roles.read'
    ],
    description: 'Administrative access to manage users, properties, and bookings'
  },
  manager: {
    name: 'Manager',
    level: 60,
    permissions: [
      'properties.read', 'properties.update',
      'bookings.read', 'bookings.update',
      'analytics.read', 'users.read'
    ],
    description: 'Property and booking management with analytics access'
  },
  staff: {
    name: 'Staff',
    level: 40,
    permissions: [
      'bookings.read', 'bookings.update',
      'properties.read'
    ],
    description: 'Basic staff access for booking and property management'
  },
  user: {
    name: 'User',
    level: 20,
    permissions: [
      'bookings.create', 'bookings.read.own', 'bookings.cancel.own',
      'profile.read', 'profile.update'
    ],
    description: 'Standard user with booking and profile management'
  },
  guest: {
    name: 'Guest',
    level: 10,
    permissions: [
      'properties.read', 'search.read'
    ],
    description: 'Limited access for browsing properties'
  }
};

export const RoleProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState('guest');
  const [roleData, setRoleData] = useState(ROLES.guest);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role || 'user';
      setUserRole(role);
      setRoleData(ROLES[role] || ROLES.user);
    } else {
      setUserRole('guest');
      setRoleData(ROLES.guest);
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!roleData) return false;

    // Super admin has all permissions
    if (roleData.permissions.includes('*')) return true;

    // Check exact permission match
    if (roleData.permissions.includes(permission)) return true;

    // Check wildcard permissions (e.g., 'users.*' matches 'users.read')
    return roleData.permissions.some(perm => {
      if (perm.endsWith('.*')) {
        const basePermission = perm.slice(0, -2);
        return permission.startsWith(basePermission + '.');
      }
      return false;
    });
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Check if user role level meets minimum requirement
  const hasMinimumRole = (minimumRole) => {
    const minimumLevel = ROLES[minimumRole]?.level || 0;
    return roleData.level >= minimumLevel;
  };

  // Check if user can access resource based on ownership
  const canAccessResource = (resource, permission, resourceUserId = null) => {
    // Check if user has general permission
    if (hasPermission(permission)) return true;

    // Check if user has permission for own resources
    if (resourceUserId && user?.id === resourceUserId) {
      return hasPermission(permission + '.own');
    }

    return false;
  };

  // Get all available roles (for admin interfaces)
  const getAllRoles = () => {
    return Object.entries(ROLES).map(([key, role]) => ({
      id: key,
      ...role
    }));
  };

  // Update user role (admin function)
  const updateUserRole = async (userId, newRole) => {
    if (!hasPermission('users.update')) {
      toast.error('You do not have permission to update user roles');
      return { success: false, error: 'Insufficient permissions' };
    }

    if (!ROLES[newRole]) {
      toast.error('Invalid role specified');
      return { success: false, error: 'Invalid role' };
    }

    try {
      // In a real app, this would make an API call
      // For demo, we'll simulate the update
      toast.success(`User role updated to ${ROLES[newRole].name}`);
      return { success: true };
    } catch (error) {
      toast.error('Failed to update user role');
      return { success: false, error: error.message };
    }
  };

  // Get role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', path: '/', permission: null },
      { name: 'Search', path: '/search', permission: 'properties.read' }
    ];

    const roleBasedItems = [];

    if (hasPermission('bookings.read.own') || hasPermission('bookings.read')) {
      roleBasedItems.push({
        name: 'My Bookings',
        path: '/dashboard',
        permission: 'bookings.read.own'
      });
    }

    if (hasPermission('analytics.read')) {
      roleBasedItems.push({
        name: 'Analytics',
        path: '/admin/analytics',
        permission: 'analytics.read'
      });
    }

    if (hasPermission('users.read')) {
      roleBasedItems.push({
        name: 'User Management',
        path: '/admin/users',
        permission: 'users.read'
      });
    }

    if (hasPermission('properties.read') && hasMinimumRole('staff')) {
      roleBasedItems.push({
        name: 'Property Management',
        path: '/admin/properties',
        permission: 'properties.read'
      });
    }

    if (hasMinimumRole('admin')) {
      roleBasedItems.push({
        name: 'Admin Panel',
        path: '/admin',
        permission: 'users.read'
      });
    }

    return [...baseItems, ...roleBasedItems];
  };

  const value = {
    userRole,
    roleData,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasMinimumRole,
    canAccessResource,
    getAllRoles,
    updateUserRole,
    getNavigationItems,
    ROLES
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};