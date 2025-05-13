import { useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  // Time in milliseconds between refreshes
  interval?: number;
  // Whether the refresh should be active
  enabled?: boolean;
}

/**
 * Hook that automatically refreshes the page at specified intervals
 * Designed for long-running kiosk applications that need periodic refreshes
 * to prevent memory issues or stale states
 */
export const useAutoRefresh = (options: UseAutoRefreshOptions = {}) => {
  const {
    interval = 1800000, // Default to 30 minutes (1800000ms)
    enabled = true,
  } = options;
  
  // Store timer reference to clean up
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up the refresh timer
  useEffect(() => {
    // Only set up timer if enabled
    if (!enabled) return;

    console.log(`Setting up page auto-refresh timer: ${interval}ms`);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Set new timer to refresh page
    timerRef.current = setTimeout(() => {
      console.log('Auto-refresh timer triggered - reloading page');
      window.location.reload();
    }, interval);
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        console.log('Cleaning up auto-refresh timer');
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [interval, enabled]);
  
  // Return function to manually trigger a refresh
  const refreshNow = () => {
    console.log('Manual refresh triggered');
    window.location.reload();
  };
  
  return refreshNow;
};

export default useAutoRefresh;