import React from 'react';
import { useRole } from '../../contexts/RoleContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiShield, FiAlertTriangle } = FiIcons;

const RoleGuard = ({ 
  children, 
  permission = null, 
  role = null, 
  permissions = null, 
  requireAll = false, 
  fallback = null, 
  showError = true 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasMinimumRole, loading, userRole } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-booking-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  let hasAccess = true;

  // For admin users, grant all access
  if (userRole === 'admin' || userRole === 'super_admin') {
    hasAccess = true;
  } else {
    // Check single permission
    if (permission && !hasPermission(permission)) {
      hasAccess = false;
    }

    // Check minimum role level
    if (role && !hasMinimumRole(role)) {
      hasAccess = false;
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      if (requireAll) {
        hasAccess = hasAllPermissions(permissions);
      } else {
        hasAccess = hasAnyPermission(permissions);
      }
    }
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    if (!showError) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg"
      >
        <SafeIcon icon={FiShield} className="text-4xl text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600 text-center">
          You don't have permission to access this content.
        </p>
      </motion.div>
    );
  }

  return children;
};

// Higher-order component for protecting routes
export const withRoleGuard = (Component, guardProps = {}) => {
  return function ProtectedComponent(props) {
    return (
      <RoleGuard {...guardProps}>
        <Component {...props} />
      </RoleGuard>
    );
  };
};

// Hook for conditional rendering based on permissions
export const usePermissionCheck = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasMinimumRole } = useRole();

  const canRender = (options = {}) => {
    const { permission, role, permissions, requireAll = false } = options;

    if (permission && !hasPermission(permission)) return false;
    if (role && !hasMinimumRole(role)) return false;
    if (permissions && permissions.length > 0) {
      if (requireAll) {
        return hasAllPermissions(permissions);
      } else {
        return hasAnyPermission(permissions);
      }
    }
    return true;
  };

  return { canRender };
};

export default RoleGuard;