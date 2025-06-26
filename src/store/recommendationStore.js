import { create } from 'zustand';
import { mockProperties } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useRecommendationStore = create((set, get) => ({
  recommendations: {
    trending: [],
    personalized: [],
    nearby: [],
    popular: []
  },
  filters: {
    priceRange: [0, 1000],
    rating: 0,
    propertyTypes: [],
    amenities: [],
    location: '',
    travelDates: null
  },
  loading: false,
  savedProperties: new Set(),

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  applyFilters: () => {
    const { filters } = get();
    // Apply filters to recommendations
    set({ loading: true });
    
    setTimeout(() => {
      // Mock filtered results
      set({ loading: false });
      toast.success('Filters applied successfully');
    }, 500);
  },

  getRecommendations: async (type, limit = 6) => {
    set({ loading: true });
    
    try {
      // Mock recommendation logic
      const recommendations = mockProperties
        .slice(0, limit)
        .map(property => ({
          property,
          reason: {
            type: type === 'trending' ? 'trending' : 'popular',
            text: type === 'trending' ? 'Trending now' : 'Popular choice'
          }
        }));

      set(state => ({
        recommendations: {
          ...state.recommendations,
          [type]: recommendations
        },
        loading: false
      }));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      set({ loading: false });
    }
  },

  refreshRecommendations: async (type) => {
    return get().getRecommendations(type);
  },

  saveProperty: (propertyId, saved) => {
    set(state => {
      const newSaved = new Set(state.savedProperties);
      if (saved) {
        newSaved.add(propertyId);
      } else {
        newSaved.delete(propertyId);
      }
      return { savedProperties: newSaved };
    });
    
    toast.success(saved ? 'Property saved' : 'Property removed from saved');
  }
}));