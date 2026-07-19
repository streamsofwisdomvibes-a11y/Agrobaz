import { auth } from './firebase';
import { authService } from './firebaseServices';

// Set user after authentication
export const setAuthUser = (user) => {
  if (user) {
    localStorage.setItem('agrobaz_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('agrobaz_user');
  }
};

// Get stored user
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('agrobaz_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Get current user from Firebase
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user role from Firestore
export const getUserRole = async (uid) => {
  try {
    const user = await authService.getCurrentUser(uid);
    return user?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Clear auth
export const clearAuth = () => {
  localStorage.removeItem('agrobaz_user');
};
