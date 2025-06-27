import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRole } from '../../contexts/RoleContext';
import RoleGuard from '../auth/RoleGuard';
import { usePropertyStore } from '../../store/propertyStore';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit3, FiTrash2, FiEye, FiSearch, FiFilter, FiMapPin, FiStar, FiDollarSign, FiHome, FiImage, FiX, FiBed } = FiIcons;

const PropertyManagement = ({ onManageRooms }) => {
  const { hasPermission } = useRole();
  const { properties, loading, getAllProperties, deleteProperty } = usePropertyStore();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    getAllProperties();
  }, [getAllProperties]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const filterProperties = () => {
    let filtered = properties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!hasPermission('properties.delete')) {
      toast.error('You do not have permission to delete properties');
      return;
    }

    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      const result = await deleteProperty(propertyId);
      if (result.success) {
        toast.success('Property deleted successfully');
      }
    }
  };

  const handleManageRooms = (propertyId) => {
    if (onManageRooms) {
      onManageRooms(propertyId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const propertyTypes = ['hotel', 'resort', 'apartment', 'villa', 'guesthouse', 'lodge'];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <p className="text-gray-600 mt-1">Manage your properties and accommodations</p>
        </div>
        <RoleGuard permission="properties.create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-booking-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Property</span>
          </motion.button>
        </RoleGuard>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
          >
            <option value="all">All Types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={property.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-sm font-semibold">
                ${property.minPrice || 0}/night
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {property.name}
                </h3>
                <div className="flex items-center space-x-1 text-sm">
                  <SafeIcon icon={FiStar} className="text-yellow-400 fill-current" />
                  <span className="font-medium">{property.avgRating || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <SafeIcon icon={FiMapPin} className="text-sm mr-1" />
                <span className="text-sm">{property.city}, {property.country}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="capitalize">{property.type}</span>
                <span>{property.rooms?.length || 0} rooms</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <RoleGuard permission="properties.read">
                    <button
                      onClick={() => handleManageRooms(property.id)}
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                      title="Manage Rooms"
                    >
                      <SafeIcon icon={FiBed} />
                    </button>
                  </RoleGuard>
                  <RoleGuard permission="properties.update">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Edit Property"
                    >
                      <SafeIcon icon={FiEdit3} />
                    </button>
                  </RoleGuard>
                  <RoleGuard permission="properties.delete">
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Property"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </RoleGuard>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <SafeIcon icon={FiHome} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search criteria'
              : 'Start by adding your first property'}
          </p>
          <RoleGuard permission="properties.create">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-booking-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Property
            </button>
          </RoleGuard>
        </div>
      )}

      {/* Create Property Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <PropertyModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            mode="create"
          />
        )}
      </AnimatePresence>

      {/* Edit Property Modal */}
      <AnimatePresence>
        {showEditModal && selectedProperty && (
          <PropertyModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProperty(null);
            }}
            mode="edit"
            property={selectedProperty}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Property Modal Component
const PropertyModal = ({ isOpen, onClose, mode, property = null }) => {
  const { createProperty, updateProperty } = usePropertyStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: property?.name || '',
    description: property?.description || '',
    address: property?.address || '',
    city: property?.city || '',
    country: property?.country || '',
    type: property?.type || 'hotel',
    amenities: property?.amenities || [],
    images: property?.images || [],
    rooms: property?.rooms || [],
    status: property?.status || 'active'
  });

  const amenitiesList = [
    'WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Parking',
    'Spa', 'Bar', 'Business Center', 'Beach Access', 'Pet Friendly',
    'Airport Shuttle', 'Laundry Service', 'Concierge', 'Air Conditioning'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageAdd = (imageUrl) => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (mode === 'create') {
        result = await createProperty(formData);
      } else {
        result = await updateProperty(property.id, formData);
      }

      if (result.success) {
        toast.success(`Property ${mode === 'create' ? 'created' : 'updated'} successfully`);
        onClose();
      }
    } catch (error) {
      toast.error(`Failed to ${mode} property`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Property' : 'Edit Property'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  placeholder="Enter property name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                >
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="guesthouse">Guesthouse</option>
                  <option value="lodge">Lodge</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  placeholder="Describe your property..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="text-booking-blue focus:ring-booking-blue"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Images</h4>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="Enter image URL"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleImageAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = e.target.previousElementSibling;
                    handleImageAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-booking-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <SafeIcon icon={FiX} className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-booking-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Property' : 'Update Property')}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PropertyManagement;