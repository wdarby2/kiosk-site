import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import SpritePage from './pages/SpritePage';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';

// Define available pages
enum Page {
  HOME = 'home',
  SPRITE = 'sprite',
}

// Main App component with all state management
const App: React.FC = () => {
  // Application state
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedSprite, setSelectedSprite] = useState<any>(null);
  const [isInactive, setIsInactive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Constants
  const INACTIVITY_TIMEOUT = 10000; // 10 seconds for testing
  const WARNING_TIME = 3000; // Show warning 3 seconds before timeout
  
  // Navigation functions
  const navigate = (page: Page, sprite?: any) => {
    setCurrentPage(page);
    if (sprite) {
      setSelectedSprite(sprite);
    }
    resetInactivityTimer();
  };
  
  const goHome = () => {
    setCurrentPage(Page.HOME);
    setSelectedSprite(null);
    resetInactivityTimer();
  };
  
  // Reset inactivity timer
  const resetInactivityTimer = () => {
    setLastActivity(Date.now());
    setIsInactive(false);
    setShowWarning(false);
  };
  
  // Check for inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      // If we've passed the warning threshold but not the timeout
      if (timeSinceLastActivity > (INACTIVITY_TIMEOUT - WARNING_TIME) && 
          timeSinceLastActivity < INACTIVITY_TIMEOUT && 
          !showWarning && !isInactive) {
        console.log('Showing inactivity warning');
        setShowWarning(true);
        setCountdown(Math.ceil(WARNING_TIME / 1000));
      }
      
      // If we've passed the timeout
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && !isInactive) {
        console.log('Inactivity timeout reached');
        setIsInactive(true);
        setShowWarning(false);
        setCurrentPage(Page.HOME);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastActivity, isInactive, showWarning, INACTIVITY_TIMEOUT, WARNING_TIME]);
  
  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (showWarning && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showWarning, countdown]);
  
  // Set up global event listeners for user activity
  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };
    
    // Add event listeners
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);
    
    // Clean up
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);
  
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
        return (
          <SpritePage 
            sprite={selectedSprite} 
            onClose={goHome}
          />
        );
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
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;