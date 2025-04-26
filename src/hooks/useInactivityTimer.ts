import { useState, useEffect, useCallback } from 'react';

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
    events = ['mousedown', 'mousemove', 'keypress', 'touchstart', 'click', 'scroll'],
  } = options;

  const [isInactive, setIsInactive] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to reset the timer
  const resetTimer = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }
    
    // If we were inactive, trigger the active callback
    if (isInactive) {
      setIsInactive(false);
      onActive?.();
    }

    // Set a new timer
    const newTimer = setTimeout(() => {
      setIsInactive(true);
      onInactive?.();
    }, timeout);

    setTimer(newTimer);
  }, [isInactive, onActive, onInactive, timeout, timer]);

  // Set up the initial timer
  useEffect(() => {
    resetTimer();

    // Clean up on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [resetTimer]);

  // Set up activity event listeners
  useEffect(() => {
    // Handler for all events
    const activityHandler = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, activityHandler);
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