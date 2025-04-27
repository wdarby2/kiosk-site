import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../context/NavigationContext';

interface InactivityMonitorProps {
  showNotification?: boolean;
  warningSeconds?: number;
}

const InactivityMonitor: React.FC<InactivityMonitorProps> = ({
  showNotification = true,
  warningSeconds = 5, // Show warning 5 seconds before timeout (shortened for testing)
}) => {
  const { isInactive, inactivityTimeout, resetInactivityTimer } = useNavigation();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);
  
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up the warning timer when the component mounts or inactivity status changes
  useEffect(() => {
    console.log('InactivityMonitor: Setting up warning timer');
    
    // Clear any existing timers
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Always hide warning when resetting
    setShowWarning(false);
    
    // Set new warning timer
    if (showNotification && inactivityTimeout > (warningSeconds * 1000)) {
      console.log(`Setting warning to show in ${inactivityTimeout - (warningSeconds * 1000)}ms`);
      
      // Set timer to show the warning shortly before timeout
      warningTimerRef.current = setTimeout(() => {
        console.log('Showing inactivity warning now');
        setShowWarning(true);
        setCountdown(warningSeconds);
        
        // Start countdown
        countdownTimerRef.current = setInterval(() => {
          setCountdown(prev => {
            const newValue = prev - 1;
            console.log(`Countdown: ${newValue}`);
            
            if (newValue <= 0) {
              console.log('Countdown reached zero');
              if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
              }
              return 0;
            }
            return newValue;
          });
        }, 1000);
      }, inactivityTimeout - (warningSeconds * 1000));
    }
    
    // Clean up on unmount
    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isInactive, inactivityTimeout, warningSeconds, showNotification]);
  
  // Hide warning when user becomes active
  useEffect(() => {
    if (!isInactive) {
      setShowWarning(false);
    }
  }, [isInactive]);
  
  // Only render if the warning should be shown
  if (!showWarning) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px 30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
    }}
    onClick={resetInactivityTimer}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '5px', fontSize: '1.1rem' }}>
          Returning to home screen in {countdown} seconds
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Touch screen to continue browsing
        </p>
      </div>
      
      <button 
        onClick={resetInactivityTimer}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Continue Browsing
      </button>
    </div>
  );
};

export default InactivityMonitor;