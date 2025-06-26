import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCreditCard, FiLock, FiShield, FiAlertCircle, FiArrowLeft } = FiIcons;

const PaymentForm = ({ formData, setFormData, onNext, onBack, totalAmount }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'cardNumber':
        const cardNum = value.replace(/\D/g, '');
        return cardNum.length >= 13 && cardNum.length <= 19 ? '' : 'Please enter a valid card number';
      case 'expiryDate':
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(value)) return 'Please enter MM/YY format';
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now ? '' : 'Card has expired';
      case 'cvv':
        const cvv = value.replace(/\D/g, '');
        return cvv.length >= 3 && cvv.length <= 4 ? '' : 'Please enter a valid CVV';
      case 'cardName':
        return value.trim().length >= 2 ? '' : 'Please enter the name on card';
      default:
        return '';
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

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
    
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <SafeIcon icon={FiShield} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
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
              onBlur={handleBlur}
              className={inputClasses('cardNumber')}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
            <SafeIcon 
              icon={FiLock} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          </div>
          {errors.cardNumber && touched.cardNumber && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-1 text-red-600 text-sm"
            >
              <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
              {errors.cardNumber}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={inputClasses('expiryDate')}
              placeholder="MM/YY"
              maxLength="5"
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.expiryDate && touched.expiryDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-red-600 text-sm"
              >
                <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
                {errors.expiryDate}
              </motion.div>
            )}
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
              onBlur={handleBlur}
              className={inputClasses('cvv')}
              placeholder="123"
              maxLength="4"
              style={{
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.cvv && touched.cvv && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-red-600 text-sm"
              >
                <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
                {errors.cvv}
              </motion.div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name on Card *
          </label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClasses('cardName')}
            placeholder="Enter name as it appears on card"
            style={{
              color: '#111827',
              backgroundColor: '#ffffff'
            }}
          />
          {errors.cardName && touched.cardName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-1 text-red-600 text-sm"
            >
              <SafeIcon icon={FiAlertCircle} className="mr-1 text-xs" />
              {errors.cardName}
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800 text-sm">
            <SafeIcon icon={FiShield} />
            <span>
              Your payment is protected by 256-bit SSL encryption and our secure payment processor.
            </span>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-booking-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Complete Booking - ${totalAmount}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentForm;