import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import SpritePage from './pages/SpritePage';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import { Sprite } from './types';

// Define available pages
enum Page {
  HOME = 'home',
  SPRITE = 'sprite',
}

// Main App component with all state management
const App: React.FC = () => {
  // Application state
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null);
  
  // Inactivity timer for the sprite page
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear all timers
  const clearAllTimers = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setShowWarning(false);
  };
  
  // Start the inactivity timer
  const startInactivityTimer = () => {
    // Clear any existing timers first
    clearAllTimers();
    
    // Only start timer on sprite page
    if (currentPage !== Page.SPRITE) return;
    
    console.log('App: Starting inactivity timer');
    
    // Set warning timer (7 seconds into the 10-second inactivity period)
    warningTimerRef.current = setTimeout(() => {
      console.log('App: Warning timer triggered');
      setShowWarning(true);
      setCountdown(3); // 3 seconds warning
      
      // Countdown timer
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          const newVal = prev - 1;
          console.log(`App: Countdown ${newVal}`);
          if (newVal <= 0) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            return 0;
          }
          return newVal;
        });
      }, 1000);
    }, 7000);
    
    // Main inactivity timer (10 seconds)
    inactivityTimerRef.current = setTimeout(() => {
      console.log('App: Inactivity timeout reached, navigating to home');
      goHome();
    }, 10000);
  };
  
  // Reset the inactivity timer
  const resetInactivityTimer = () => {
    if (currentPage === Page.SPRITE) {
      console.log('App: Resetting inactivity timer');
      clearAllTimers();
      startInactivityTimer();
    }
  };
  
  // Effect to start/stop timer when page changes
  useEffect(() => {
    if (currentPage === Page.SPRITE) {
      startInactivityTimer();
    } else {
      clearAllTimers();
    }
    
    // Cleanup on unmount
    return clearAllTimers;
  }, [currentPage]);
  
  // Navigation functions
  const navigate = (page: Page, sprite?: Sprite) => {
    console.log(`App: Navigating to ${page}`, sprite);
    setCurrentPage(page);
    if (sprite) {
      setSelectedSprite(sprite);
    }
  };
  
  const goHome = () => {
    console.log('App: Navigating to HOME');
    clearAllTimers();
    setCurrentPage(Page.HOME);
    setSelectedSprite(null);
  };
  
  // Handle user interaction (to reset timer)
  const handleUserInteraction = () => {
    if (currentPage === Page.SPRITE) {
      resetInactivityTimer();
    }
  };
  
  // Render the appropriate page based on current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return (
          <Home 
            onSpriteSelect={(sprite) => navigate(Page.SPRITE, sprite)} 
          />
        );
      case Page.SPRITE:
        return selectedSprite ? (
          <SpritePage 
            sprite={selectedSprite} 
            onClose={goHome}
            onUserInteraction={handleUserInteraction}
          />
        ) : null;
      default:
        return <Home onSpriteSelect={(sprite) => navigate(Page.SPRITE, sprite)} />;
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation 
          currentPage={currentPage} 
          onHomeClick={goHome} 
        />
        
        {renderPage()}
        
        {/* Inactivity Warning */}
        {showWarning && (
          <div 
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              animation: 'fadeIn 0.3s forwards',
            }}
            onClick={resetInactivityTimer}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '5px', fontSize: '1.1rem' }}>
                Returning to home screen in {countdown} seconds
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Touch screen to continue viewing
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
              Continue Viewing
            </button>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
              }
            `}</style>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;