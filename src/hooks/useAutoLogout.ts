import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = () => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    // Clear user session data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      // Add any other session data you want to clear
      
      // Redirect to login or home page
      router.push('/');
      
      // Optional: Show a notification that the session expired
      alert('Your session has expired due to inactivity. Please log in again.');
    }
  };

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Check if user is logged in before setting up the timer
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user');
    
    if (!isLoggedIn) return;

    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return { logout };
};
