import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInactivityTimerOptions {
  timeout?: number;
  onInactive?: () => void;
  onActive?: () => void;
  events?: string[];
}

/**
 * A hook to track user inactivity and trigger callbacks
 * 
 * @param options Configuration options
 * @returns [isInactive, resetTimer] - Current inactive state and a function to manually reset the timer
 */
export const useInactivityTimer = (options: UseInactivityTimerOptions = {}) => {
  const {
    timeout = 60000, // Default to 60 seconds of inactivity
    onInactive,
    onActive,
    events = ['mousedown', 'keypress', 'touchstart', 'click'], // Reduced events, removed high-frequency ones
  } = options;

  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef(options);
  
  // Update ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Function to reset the timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // If we were inactive, trigger the active callback
    if (isInactive) {
      setIsInactive(false);
      optionsRef.current.onActive?.();
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      console.log('Inactivity timeout reached - triggering onInactive callback');
      setIsInactive(true);
      // Make sure to call the latest callback from options
      if (optionsRef.current.onInactive) {
        console.log('Calling onInactive callback');
        optionsRef.current.onInactive();
      } else {
        console.warn('No onInactive callback provided');
      }
    }, optionsRef.current.timeout || 60000);
  }, [isInactive]);

  // Set up the initial timer
  useEffect(() => {
    console.log('Setting up initial inactivity timer');
    resetTimer();

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resetTimer]);

  // Set up activity event listeners - with reduced sensitivity
  useEffect(() => {
    // To avoid frequent re-renders, we throttle the events
    let lastActivity = Date.now();
    const throttleDelay = 1000; // 1 second throttle
    
    // Handler for all events
    const activityHandler = () => {
      const now = Date.now();
      if (now - lastActivity > throttleDelay) {
        lastActivity = now;
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, activityHandler, { passive: true });
    });

    // Clean up
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, activityHandler);
      });
    };
  }, [events, resetTimer]);

  return [isInactive, resetTimer] as const;
};

export default useInactivityTimer;