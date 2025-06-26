import React from 'react';
import { motion } from 'framer-motion';
import SearchForm from '../components/search/SearchForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiStar, FiShield, FiClock } = FiIcons;

const HomePage = () => {
  const features = [
    {
      icon: FiMapPin,
      title: "Worldwide Destinations",
      description: "Discover amazing places around the globe with our extensive network of properties."
    },
    {
      icon: FiStar,
      title: "Verified Reviews",
      description: "Read authentic reviews from real travelers to make informed decisions."
    },
    {
      icon: FiShield,
      title: "Secure Booking",
      description: "Your payments and personal information are protected with bank-level security."
    },
    {
      icon: FiClock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support."
    }
  ];

  const popularDestinations = [
    {
      name: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
      properties: "1,234+ properties"
    },
    {
      name: "Paris",
      country: "France", 
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
      properties: "892+ properties"
    },
    {
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      properties: "756+ properties"
    },
    {
      name: "London",
      country: "UK",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
      properties: "643+ properties"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-booking-blue to-blue-800 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100">
              Discover amazing hotels, resorts, and unique accommodations worldwide
            </p>
          </motion.div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BookingClone?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make travel planning simple, secure, and enjoyable with our comprehensive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-booking-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="text-2xl text-booking-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Explore the world's most loved travel destinations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-2">
                    {destination.country}
                  </p>
                  <p className="text-sm text-gray-300">
                    {destination.properties}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-booking-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions of travelers who trust BookingClone for their accommodation needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-booking-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Searching Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;