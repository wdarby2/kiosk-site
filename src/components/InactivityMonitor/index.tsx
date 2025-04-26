import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../context/NavigationContext';

interface InactivityMonitorProps {
  showNotification?: boolean;
  warningSeconds?: number;
}

const InactivityMonitor: React.FC<InactivityMonitorProps> = ({
  showNotification = true,
  warningSeconds = 10, // Show warning 10 seconds before timeout
}) => {
  const { isInactive, inactivityTimeout, resetInactivityTimer } = useNavigation();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);
  
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up the warning timer when the component mounts or inactivity status changes
  useEffect(() => {
    // Clear any existing timers
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Only set the timer if we're not already inactive
    if (!isInactive && showNotification && inactivityTimeout > (warningSeconds * 1000)) {
      // Set timer to show the warning shortly before timeout
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        setCountdown(warningSeconds);
        
        // Start countdown
        countdownTimerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, inactivityTimeout - (warningSeconds * 1000));
    } else {
      setShowWarning(false);
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
  
  // No need to render if inactive or notifications disabled
  if (isInactive || !showNotification || !showWarning) {
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