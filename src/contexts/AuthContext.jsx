import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (userId && token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userId, token, userData, newUser = false) => {
    try {
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      return { newUser };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Failed to save user data' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Mock authentication for demo purposes
  const mockLogin = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determine role based on email
      let role = 'user';
      if (email === 'admin@example.com') {
        role = 'admin';
      } else if (email === 'manager@example.com') {
        role = 'manager';
      } else if (email === 'staff@example.com') {
        role = 'staff';
      }

      // Create mock user data
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        role: role,
        created_at: new Date().toISOString()
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Use the login function
      const result = login(mockUser.id, mockToken, mockUser, false);
      return { success: true, user: mockUser, ...result };
    } catch (error) {
      console.error('Mock login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    mockLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};