import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useBookingStore = create((set, get) => ({
  searchParams: {
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 2,
    rooms: 1
  },
  properties: [],
  loading: false,
  filters: {
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    propertyType: ''
  },

  setSearchParams: (params) => {
    set(state => ({
      searchParams: { ...state.searchParams, ...params }
    }));
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  searchProperties: async () => {
    set({ loading: true });
    
    try {
      const { searchParams, filters } = get();
      
      let query = supabase
        .from('properties')
        .select(`
          *,
          rooms (
            id,
            name,
            price_per_night,
            max_guests,
            amenities
          ),
          reviews (
            rating
          )
        `)
        .eq('active', true);

      if (searchParams.location) {
        query = query.or(`city.ilike.%${searchParams.location}%,country.ilike.%${searchParams.location}%,name.ilike.%${searchParams.location}%`);
      }

      if (filters.propertyType) {
        query = query.eq('type', filters.propertyType);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Calculate average ratings and filter by price/rating
      const processedProperties = data
        .map(property => {
          const avgRating = property.reviews.length > 0 
            ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length 
            : 0;
          
          const minPrice = property.rooms.length > 0 
            ? Math.min(...property.rooms.map(room => room.price_per_night)) 
            : 0;

          return {
            ...property,
            avgRating: Math.round(avgRating * 10) / 10,
            minPrice,
            reviewCount: property.reviews.length
          };
        })
        .filter(property => {
          const matchesPrice = property.minPrice >= filters.priceRange[0] && property.minPrice <= filters.priceRange[1];
          const matchesRating = property.avgRating >= filters.rating;
          return matchesPrice && matchesRating;
        });

      set({ properties: processedProperties, loading: false });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search properties');
      set({ loading: false });
    }
  },

  createBooking: async (bookingData) => {
    try {
      // For demo purposes, create a mock booking
      const booking = {
        id: Date.now(),
        ...bookingData,
        created_at: new Date().toISOString()
      };

      toast.success('Booking created successfully!');
      return { success: true, booking };
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
      return { success: false, error: error.message };
    }
  }
}));