import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import SpritePage from './pages/SpritePage';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import RefreshIndicator from './components/RefreshIndicator';
import { Sprite } from './types';
import useAutoRefresh from './hooks/useAutoRefresh';

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

  // Set up auto-refresh timer to reload the page every 30 minutes
  // This helps prevent memory issues and ensure stability for long-running kiosks
  useAutoRefresh({
    interval: 30 * 60 * 1000, // 30 minutes in milliseconds
    enabled: true,
  });

  // Inactivity timer for the sprite page
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Keep refs for compatibility, but we won't use them to show UI
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
  };

  // Start the inactivity timer
  const startInactivityTimer = () => {
    // Clear any existing timers first
    clearAllTimers();

    // Only start timer on sprite page
    if (currentPage !== Page.SPRITE) return;

    console.log('App: Starting inactivity timer');

    // Main inactivity timer (10 seconds)
    inactivityTimerRef.current = setTimeout(() => {
      console.log('App: Inactivity timeout reached, navigating to home');
      goHome();
    }, 10000);
    
    // We keep these references but don't show the UI
    warningTimerRef.current = null;
    countdownRef.current = null;
  };

  // Reset the inactivity timer
  const resetInactivityTimer = () => {
    if (currentPage === Page.SPRITE) {
      console.log('App: Resetting inactivity timer');
      clearAllTimers();
      startInactivityTimer();
    }
  };

  // Effect to handle page changes - no longer auto-starts timer on SPRITE page
  useEffect(() => {
    if (currentPage !== Page.SPRITE) {
      clearAllTimers();
      // Reset the video ended flag and play count when leaving sprite page
      videoHasEndedRef.current = false;
      videoPlayCountRef.current = 0;
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
    videoHasEndedRef.current = false;
    videoPlayCountRef.current = 0; // Reset play count
    setCurrentPage(Page.HOME);
    setSelectedSprite(null);
  };

  // Track whether video has ended and play count
  const videoHasEndedRef = useRef(false);
  const videoPlayCountRef = useRef(0);
  const MAX_PLAY_COUNT = 2; // Play video twice

  // Handle user interaction (to reset timer, but only if video has ended)
  const handleUserInteraction = () => {
    if (currentPage === Page.SPRITE && videoHasEndedRef.current) {
      resetInactivityTimer();
    }
  };

  // Handle video ended event (to start inactivity timer after MAX_PLAY_COUNT)
  const handleVideoEnded = () => {
    if (currentPage === Page.SPRITE) {
      videoPlayCountRef.current += 1;
      console.log(`App: Video ended (play ${videoPlayCountRef.current}/${MAX_PLAY_COUNT})`);
      
      if (videoPlayCountRef.current >= MAX_PLAY_COUNT) {
        console.log('App: Max play count reached, starting inactivity timer');
        videoHasEndedRef.current = true;
        startInactivityTimer();
      }
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
              onVideoEnded={handleVideoEnded}
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

  // Automatically hide indicator in production mode
  // Will show only in development mode when using Vite
  const showRefreshIndicator = import.meta.env.DEV;

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation currentPage={currentPage} onHomeClick={goHome} />

        {renderPage()}

        {/* Conditionally render the refresh indicator based on environment */}
        {showRefreshIndicator && <RefreshIndicator />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
