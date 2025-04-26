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

  // Track page transition states
  const [isExiting, setIsExiting] = useState(false);
  const [pendingPage, setPendingPage] = useState<{ page: Page; sprite?: Sprite } | null>(null);

  // Handle page transitions
  const handlePageTransition = (page: Page, sprite?: Sprite) => {
    setIsExiting(true);
    setPendingPage({ page, sprite });

    // Wait for exit animation to complete before changing page
    setTimeout(() => {
      if (page === Page.SPRITE && sprite) {
        navigate(page, sprite);
      } else {
        goHome();
      }
      setIsExiting(false);
      setPendingPage(null);
    }, 400); // Match transition duration
  };

  // Render the appropriate page based on current navigation state
  const renderPage = () => {
    const activePage = pendingPage ? pendingPage.page : currentPage;

    // Apply transition classes
    const pageClasses = `
      page-container 
      ${isExiting ? 'exiting' : ''} 
      ${pendingPage ? 'entering' : ''} 
      ${activePage === Page.HOME ? 'home-page' : 'sprite-page'}
    `;

    switch (currentPage) {
      case Page.HOME:
        return (
          <div className={pageClasses}>
            <Home onSpriteSelect={sprite => handlePageTransition(Page.SPRITE, sprite)} />

            <style>{`
              .page-container {
                position: relative;
                width: 100%;
                height: 100%;
                opacity: 1;
                transition: opacity 400ms ease-out, transform 400ms ease-out;
              }
              
              .page-container.exiting {
                opacity: 0;
                transform: scale(1.05);
              }
              
              .page-container.entering {
                opacity: 0;
                transform: scale(0.95);
              }
              
              .home-page.exiting {
                transform: scale(0.95);
              }
              
              .sprite-page.exiting {
                transform: scale(1.05);
              }
            `}</style>
          </div>
        );
      case Page.SPRITE:
        return selectedSprite ? (
          <div className={pageClasses}>
            <SpritePage
              sprite={selectedSprite}
              onClose={() => handlePageTransition(Page.HOME)}
              onUserInteraction={handleUserInteraction}
            />

            <style>{`
              .page-container {
                position: relative;
                width: 100%;
                height: 100%;
                opacity: 1;
                transition: opacity 400ms ease-out, transform 400ms ease-out;
              }
              
              .page-container.exiting {
                opacity: 0;
                transform: scale(0.95);
              }
              
              .page-container.entering {
                opacity: 0;
                transform: scale(1.05);
              }
            `}</style>
          </div>
        ) : null;
      default:
        return (
          <div className={pageClasses}>
            <Home onSpriteSelect={sprite => handlePageTransition(Page.SPRITE, sprite)} />
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation currentPage={currentPage} onHomeClick={goHome} />

        {renderPage()}

        {/* Inactivity Warning */}
        {showWarning && (
          <div
            className="inactivity-warning"
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(50, 50, 50, 0.9)',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '10px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              animation: 'fadeIn 0.4s forwards',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={resetInactivityTimer}
          >
            <div
              className="timer-icon"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid #4a90e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '5px',
                position: 'relative',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            >
              <div
                className="timer-circle"
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: 'white',
                  animation: `countdown ${countdown}s linear forwards`,
                  transformOrigin: 'center center',
                }}
              ></div>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  animation: 'countScale 1s infinite alternate ease-in-out',
                }}
              >
                {countdown}
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  marginBottom: '10px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  animation: 'fadeSlideUp 0.5s forwards 0.2s',
                  opacity: 0,
                  transform: 'translateY(10px)',
                }}
              >
                Returning to home screen soon
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  opacity: 0,
                  animation: 'fadeSlideUp 0.5s forwards 0.4s',
                  transform: 'translateY(10px)',
                }}
              >
                Touch screen to continue viewing
              </p>
            </div>

            <button
              onClick={resetInactivityTimer}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transform: 'scale(0.95)',
                opacity: 0,
                animation: 'buttonAppear 0.5s forwards 0.6s',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#5da0ec';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#4a90e2';
              }}
            >
              Continue Viewing
            </button>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
              }
              
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
              }
              
              @keyframes countdown {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              
              @keyframes countScale {
                from { transform: scale(1); }
                to { transform: scale(1.1); }
              }
              
              @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes buttonAppear {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
              }

              .inactivity-warning:hover .timer-circle {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
