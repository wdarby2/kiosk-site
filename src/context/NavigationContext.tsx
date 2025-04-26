import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useInactivityTimer from '../hooks/useInactivityTimer';
import { Sprite } from '../types';

// Define the possible pages in the application
export enum Page {
  HOME = 'home',
  SPRITE = 'sprite',
}

// Define the state shape for our navigation context
interface NavigationState {
  currentPage: Page;
  selectedSprite: Sprite | null;
  navigate: (page: Page, sprite?: Sprite) => void;
  goHome: () => void;
  inactivityTimeout: number;
  isInactive: boolean;
  resetInactivityTimer: () => void;
  setInactivityTimeout: (timeout: number) => void;
}

// Create the context with a default state
const NavigationContext = createContext<NavigationState | undefined>(undefined);

// Default inactivity timeout in milliseconds (1 minute)
const DEFAULT_INACTIVITY_TIMEOUT = 60000;

interface NavigationProviderProps {
  children: React.ReactNode;
  initialPage?: Page;
  initialSprite?: Sprite | null;
  inactivityTimeout?: number;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialPage = Page.HOME,
  initialSprite = null,
  inactivityTimeout = DEFAULT_INACTIVITY_TIMEOUT,
}) => {
  // State for current page and selected sprite
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(initialSprite);
  const [timeout, setTimeout] = useState<number>(inactivityTimeout);

  // Use the inactivity timer hook with stabilized callback
  const handleInactivity = useCallback(() => {
    console.log('Inactive: Returning to home page');
    setCurrentPage(Page.HOME);
    setSelectedSprite(null);
  }, []);

  const [isInactive, resetInactivityTimer] = useInactivityTimer({
    timeout,
    onInactive: handleInactivity,
  });

  // Navigation function
  const navigate = useCallback((page: Page, sprite?: Sprite) => {
    setCurrentPage(page);
    if (sprite) {
      setSelectedSprite(sprite);
    }
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Home shortcut
  const goHome = useCallback(() => {
    navigate(Page.HOME);
    setSelectedSprite(null);
  }, [navigate]);

  // Update inactivity timeout
  const setInactivityTimeout = useCallback((newTimeout: number) => {
    setTimeout(newTimeout);
  }, []);

  // Reset timer when page changes
  useEffect(() => {
    resetInactivityTimer();
  }, [currentPage, resetInactivityTimer]);

  // Create the context value object
  const value = {
    currentPage,
    selectedSprite,
    navigate,
    goHome,
    inactivityTimeout: timeout,
    isInactive,
    resetInactivityTimer,
    setInactivityTimeout,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation context
export const useNavigation = (): NavigationState => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationContext;