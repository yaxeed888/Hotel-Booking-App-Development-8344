import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { useBookingStore } from '../store/bookingStore';
import BookingProgress from '../components/booking/BookingProgress';
import GuestInfoForm from '../components/booking/GuestInfoForm';
import PaymentForm from '../components/booking/PaymentForm';
import BookingSummary from '../components/booking/BookingSummary';
import { differenceInDays } from 'date-fns';

const { FiArrowLeft, FiShield } = FiIcons;

const OptimizedBookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createBooking } = useBookingStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Guest Info
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const bookingData = location.state;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!bookingData) {
      navigate('/search');
    }
  }, [bookingData, navigate, isAuthenticated, location]);

  if (!isAuthenticated || !bookingData) {
    return null;
  }

  const { property, room, dates, guests } = bookingData;
  const nights = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
  const roomTotal = room.price_per_night * nights;
  const serviceFee = 25;
  const taxes = Math.round(roomTotal * 0.12);
  const totalAmount = roomTotal + serviceFee + taxes;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteBooking = async () => {
    setLoading(true);

    try {
      const booking = {
        user_id: user.id,
        property_id: property.id,
        room_id: room.id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        guests: guests,
        total_amount: totalAmount,
        guest_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests
        },
        payment_info: {
          last_four: formData.cardNumber.slice(-4),
          card_name: formData.cardName
        },
        status: 'confirmed'
      };

      const result = await createBooking(booking);
      if (result.success) {
        navigate(`/confirmation/${result.booking.id}`, {
          state: { booking: result.booking, property, room }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <BookingProgress currentStep={currentStep} />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-booking-blue hover:text-blue-700 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to property</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <GuestInfoForm
                    key="guest-info"
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                    user={user}
                  />
                )}
                
                {currentStep === 2 && (
                  <PaymentForm
                    key="payment"
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleCompleteBooking}
                    onBack={handleBack}
                    totalAmount={totalAmount}
                    loading={loading}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              property={property}
              room={room}
              dates={dates}
              guests={guests}
              isSticky={true}
            />
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedBookingPage;