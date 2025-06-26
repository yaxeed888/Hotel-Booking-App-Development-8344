import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiUser, FiCreditCard, FiCheckCircle } = FiIcons;

const BookingProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Guest Info', icon: FiUser },
    { id: 2, name: 'Payment', icon: FiCreditCard },
    { id: 3, name: 'Confirmation', icon: FiCheckCircle }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: currentStep >= step.id ? 1.1 : 1,
                    backgroundColor: currentStep >= step.id ? '#003580' : '#e5e7eb'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-booking-blue text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <SafeIcon icon={FiCheck} className="text-sm" />
                  ) : (
                    <SafeIcon icon={step.icon} className="text-sm" />
                  )}
                </motion.div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-booking-blue' : 'text-gray-500'
                  }`}>
                    Step {step.id}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: currentStep > step.id ? '100%' : '0%',
                      backgroundColor: currentStep > step.id ? '#003580' : '#e5e7eb'
                    }}
                    transition={{ duration: 0.5 }}
                    className="h-1 bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div className="h-full bg-booking-blue" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;