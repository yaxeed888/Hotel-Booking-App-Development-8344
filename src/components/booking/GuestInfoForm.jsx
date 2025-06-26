import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiMail, FiPhone, FiMessageSquare, FiAlertCircle } = FiIcons;

const GuestInfoForm = ({ formData, setFormData, onNext, user }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\D/g, '')) ? '' : 'Please enter a valid phone number';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const newErrors = {};
    const newTouched = {};

    requiredFields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field] || '');
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const inputClasses = (fieldName) => `
    w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
    ${errors[fieldName] && touched[fieldName] 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-booking-blue focus:ring-blue-200'
    }
    focus:ring-2 focus:outline-none
    text-gray-900 placeholder-gray-500 bg-white
  `;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Information</h2>
        <p className="text-gray-600">Please provide your details for the booking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                onBlur={handleBlur}
                className={inputClasses('firstName')}
                placeholder="Enter your first name"
                style={{
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-red-600 text-sm"
              >
                <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
                {errors.firstName}
              </motion.div>
            )}
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
                onBlur={handleBlur}
                className={inputClasses('lastName')}
                placeholder="Enter your last name"
                style={{
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
            {errors.lastName && touched.lastName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-red-600 text-sm"
              >
                <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
                {errors.lastName}
              </motion.div>
            )}
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
              onBlur={handleBlur}
              className={inputClasses('email')}
              placeholder="Enter your email address"
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          {errors.email && touched.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-1 text-red-600 text-sm"
            >
              <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
              {errors.email}
            </motion.div>
          )}
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
              onBlur={handleBlur}
              className={inputClasses('phone')}
              placeholder="Enter your phone number"
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          {errors.phone && touched.phone && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-1 text-red-600 text-sm"
            >
              <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
              {errors.phone}
            </motion.div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <div className="relative">
            <SafeIcon 
              icon={FiMessageSquare} 
              className="absolute left-3 top-3 text-gray-400" 
            />
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Any special requests or preferences..."
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-booking-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Payment
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default GuestInfoForm;