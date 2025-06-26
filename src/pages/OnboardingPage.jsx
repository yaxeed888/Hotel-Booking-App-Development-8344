import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../contexts/AuthContext';
import questConfig from '../config/questConfig';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !userId || !token) {
      navigate('/login');
      return;
    }

    // Set loading to false after checking auth
    setLoading(false);
  }, [isAuthenticated, userId, token, navigate]);

  const getAnswers = () => {
    // Handle completion of onboarding
    console.log('Onboarding completed with answers:', answers);
    toast.success('Welcome to BookingClone! Your profile has been set up.');
    
    // Navigate to main application after onboarding completion
    navigate('/dashboard');
  };

  const handleSkipOnboarding = () => {
    toast.success('Welcome to BookingClone!');
    navigate('/dashboard');
  };

  if (loading || !isAuthenticated || !userId || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-booking-blue to-blue-800 flex items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-booking-blue to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section - Visual/Branding */}
        <div className="text-white space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Let's Get Started!
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We're setting up your personalized experience. This will help us recommend 
              the perfect accommodations for your travel needs.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">1</span>
              </div>
              <span className="text-blue-100">Tell us about your preferences</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">2</span>
              </div>
              <span className="text-blue-100">Get personalized recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white">3</span>
              </div>
              <span className="text-blue-100">Start exploring amazing places</span>
            </div>
          </div>

          {/* Skip Option */}
          <div className="pt-8">
            <button
              onClick={handleSkipOnboarding}
              className="text-blue-200 hover:text-white transition-colors text-sm underline"
            >
              Skip onboarding and go to dashboard →
            </button>
          </div>
        </div>

        {/* Right Section - Onboarding Component */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: '400px' }}>
              <OnBoarding
                userId={userId}
                token={token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;