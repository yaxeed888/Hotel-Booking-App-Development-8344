import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../contexts/AuthContext';
import questConfig from '../config/questConfig';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiMail, FiLock, FiEye, FiEyeOff } = FiIcons;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, mockLogin } = useAuth();
  const [showDemoLogin, setShowDemoLogin] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleQuestLogin = ({ userId, token, newUser }) => {
    // Create user data object for Quest login
    const userData = {
      id: userId,
      email: `user-${userId.slice(-8)}@example.com`,
      name: `User ${userId.slice(-8)}`,
      role: 'user'
    };

    const result = login(userId, token, userData, newUser);
    
    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Welcome to BookingClone!');
    
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await mockLogin(demoCredentials.email, demoCredentials.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginOptions = [
    {
      label: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    },
    {
      label: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-booking-blue to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section - Branding */}
        <div className="text-white space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome to BookingClone
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover amazing hotels, resorts, and unique accommodations worldwide. 
              Your perfect stay is just a few clicks away.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span className="text-blue-100">Verified properties worldwide</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span className="text-blue-100">Secure booking & payment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <span className="text-blue-100">24/7 customer support</span>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign In to Your Account
                </h2>
                <p className="text-gray-600">
                  Enter your credentials to access your bookings
                </p>
              </div>

              {!showDemoLogin ? (
                <div className="space-y-6">
                  {/* Quest Login Component */}
                  <div className="quest-login-container">
                    <QuestLogin 
                      onSubmit={handleQuestLogin}
                      email={true}
                      google={false}
                      accent={questConfig.PRIMARY_COLOR}
                    />
                  </div>

                  {/* Demo Login Toggle */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowDemoLogin(true)}
                      className="text-booking-blue hover:text-blue-700 text-sm font-medium"
                    >
                      Try Demo Login Instead
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Demo Login Form */}
                  <form onSubmit={handleDemoLogin} className="space-y-4">
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
                          value={demoCredentials.email}
                          onChange={(e) => setDemoCredentials(prev => ({ 
                            ...prev, 
                            email: e.target.value 
                          }))}
                          required
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiLock} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={demoCredentials.password}
                          onChange={(e) => setDemoCredentials(prev => ({ 
                            ...prev, 
                            password: e.target.value 
                          }))}
                          required
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-booking-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </motion.button>
                  </form>

                  {/* Quick Login Options */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-center">Quick Login:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLoginOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setDemoCredentials({
                            email: option.email,
                            password: option.password
                          })}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Back to Quest Login */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowDemoLogin(false)}
                      className="text-booking-blue hover:text-blue-700 text-sm font-medium"
                    >
                      ← Back to Quest Login
                    </button>
                  </div>
                </div>
              )}

              {/* Demo Notice */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> This is a demonstration app. 
                  {showDemoLogin ? ' Use demo@example.com / password123 or admin@example.com / admin123' : ' Authentication is simulated.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;