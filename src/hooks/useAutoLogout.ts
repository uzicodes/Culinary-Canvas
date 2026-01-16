import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = async () => {
    // Clear user session data
    if (typeof window !== 'undefined') {
      // Sign out using NextAuth
      await signOut({ redirect: false });
      
      // Clear any additional local storage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      // Redirect to home page
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
    if (status === 'loading') return; // Wait for session to load
    if (status === 'unauthenticated' || !session) return; // No need to logout if not logged in

    // Update last activity time
    lastActivityRef.current = Date.now();

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
    }, [session, status, resetTimer]);

  return { logout };
};
