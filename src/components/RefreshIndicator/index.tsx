import React, { useState, useEffect } from 'react';

/**
 * A debug component that displays the last time the page was refreshed
 * Useful for verifying the auto-refresh functionality is working
 * Can be removed in production or can be conditionally rendered based on environment
 */
const RefreshIndicator: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update current time every second to show elapsed time since refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate elapsed time since last refresh
  const elapsedSeconds = Math.floor((currentTime.getTime() - lastRefresh.getTime()) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  // Calculate time remaining until next refresh (30 minutes)
  const totalSecondsRemaining = 1800 - elapsedSeconds; // 30 minutes = 1800 seconds
  const minutesRemaining = Math.floor(totalSecondsRemaining / 60);
  const secondsRemaining = totalSecondsRemaining % 60;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace',
    }}>
      <div>Last refresh: {lastRefresh.toLocaleTimeString()}</div>
      <div>Time elapsed: {minutes}m {seconds}s</div>
      <div>Next refresh in: {minutesRemaining}m {secondsRemaining}s</div>
    </div>
  );
};

export default RefreshIndicator;