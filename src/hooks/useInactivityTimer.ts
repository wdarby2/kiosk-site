import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInactivityTimerOptions {
  timeout?: number;
  onInactive?: () => void;
  onActive?: () => void;
  events?: string[];
  warningThreshold?: number;
  onWarning?: (remainingSeconds: number) => void;
}

/**
 * A hook to track user inactivity and trigger callbacks after a specified timeout.
 * Optimized for kiosk/exhibit applications with automatic return to home screen.
 * 
 * @param options Configuration options
 * @returns [isInactive, resetTimer] - Current inactive state and a function to manually reset the timer
 */
export const useInactivityTimer = (options: UseInactivityTimerOptions = {}) => {
  const {
    timeout = 10000, // Default to 10 seconds of inactivity (specified in requirements)
    onInactive,
    onActive,
    events = ['mousedown', 'keypress', 'touchstart', 'click', 'mousemove'], 
    warningThreshold = 3000, // Warning 3 seconds before timeout
    onWarning,
  } = options;

  const [isInactive, setIsInactive] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef(options);
  
  // Update ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // Function to reset the timer
  const resetTimer = useCallback(() => {
    console.log('Inactivity timer reset');
    clearAllTimers();
    
    // If we were inactive or warning, trigger the active callback
    if (isInactive || isWarning) {
      console.log('State was inactive or warning, now active');
      setIsInactive(false);
      setIsWarning(false);
      optionsRef.current.onActive?.();
    }

    // Set up warning timer
    const warningTime = optionsRef.current.warningThreshold || warningThreshold;
    const mainTimeout = optionsRef.current.timeout || timeout;
    console.log(`Setting timers: warning=${mainTimeout - warningTime}ms, timeout=${mainTimeout}ms`);
    
    // Only set warning timer if we have a warning threshold
    if (warningTime > 0 && warningTime < mainTimeout) {
      warningTimerRef.current = setTimeout(() => {
        console.log('Warning timer triggered');
        setIsWarning(true);
        setSecondsRemaining(Math.ceil(warningTime / 1000));
        
        // Start countdown timer
        countdownRef.current = setInterval(() => {
          setSecondsRemaining(prev => {
            const newValue = prev - 1;
            console.log(`Countdown: ${newValue}s remaining`);
            if (newValue <= 0) {
              if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
              }
              return 0;
            }
            return newValue;
          });
        }, 1000);
        
        // Call warning callback if provided
        if (optionsRef.current.onWarning) {
          console.log('Calling onWarning callback');
          optionsRef.current.onWarning(Math.ceil(warningTime / 1000));
        }
      }, mainTimeout - warningTime);
    }

    // Set the main inactivity timer
    timerRef.current = setTimeout(() => {
      console.log('Inactivity timeout reached');
      setIsInactive(true);
      setIsWarning(false);
      
      // Make sure to call the latest callback from options
      if (optionsRef.current.onInactive) {
        try {
          console.log('Calling onInactive callback');
          // Store callback in a variable for debugging clarity
          const callback = optionsRef.current.onInactive;
          console.log('onInactive callback type:', typeof callback);
          callback();
          console.log('onInactive callback completed');
        } catch (error) {
          console.error('Error in onInactive callback:', error);
        }
      } else {
        console.warn('No onInactive callback provided');
      }
    }, mainTimeout);
  }, [isInactive, isWarning, clearAllTimers, timeout, warningThreshold]);

  // Set up the initial timer
  useEffect(() => {
    resetTimer();

    // Clean up on unmount
    return clearAllTimers;
  }, [resetTimer, clearAllTimers]);

  // Set up activity event listeners - with reduced sensitivity for high-frequency events
  useEffect(() => {
    // To avoid frequent re-renders, we throttle the mousemove event
    let lastActivity = Date.now();
    const throttleDelay = 500; // 0.5 second throttle
    
    // Handler for all events
    const activityHandler = (e: Event) => {
      // Throttle mousemove events to avoid excessive resets
      if (e.type === 'mousemove') {
        const now = Date.now();
        if (now - lastActivity > throttleDelay) {
          lastActivity = now;
          resetTimer();
        }
      } else {
        // Reset immediately for all other events
        resetTimer();
      }
    };

    // Add event listeners 
    const currentEvents = optionsRef.current.events || events;
    currentEvents.forEach((event) => {
      window.addEventListener(event, activityHandler, { passive: true });
    });

    // Clean up
    return () => {
      currentEvents.forEach((event) => {
        window.removeEventListener(event, activityHandler);
      });
    };
  }, [events, resetTimer]);

  return [isInactive, resetTimer] as const;
};

export default useInactivityTimer;