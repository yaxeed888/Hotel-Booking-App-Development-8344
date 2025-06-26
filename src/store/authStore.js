import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAdmin: false,

  initialize: async () => {
    try {
      // Check localStorage for existing session
      const userId = localStorage.getItem('userId');
      const userData = localStorage.getItem('userData');
      
      if (userId && userData) {
        const user = JSON.parse(userData);
        set({ 
          user, 
          isAdmin: user.role === 'admin',
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      // Mock authentication - replace with real API call
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'user'
      };

      localStorage.setItem('userId', mockUser.id);
      localStorage.setItem('userData', JSON.stringify(mockUser));

      set({ 
        user: mockUser, 
        isAdmin: mockUser.role === 'admin' 
      });

      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      // Mock registration - replace with real API call
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: fullName,
        role: 'user',
        created_at: new Date().toISOString()
      };

      localStorage.setItem('userId', mockUser.id);
      localStorage.setItem('userData', JSON.stringify(mockUser));

      set({ 
        user: mockUser, 
        isAdmin: false 
      });

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      
      set({ 
        user: null, 
        isAdmin: false 
      });

      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  },

  resetPassword: async (email) => {
    try {
      // Mock password reset - replace with real API call
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  }
}));

// Initialize auth state
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}