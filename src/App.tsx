import React from 'react';
import Home from './pages/Home';
import SpritePage from './pages/SpritePage';
import Navigation from './components/Navigation';
import InactivityMonitor from './components/InactivityMonitor';
import ErrorBoundary from './components/ErrorBoundary';
import { NavigationProvider, useNavigation, Page } from './context/NavigationContext';

// App Router - selects the appropriate page based on navigation state
const AppRouter: React.FC = () => {
  const { currentPage } = useNavigation();

  // Render the appropriate page based on the current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home />;
      case Page.SPRITE:
        return <SpritePage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Navigation />
      {renderPage()}
      <InactivityMonitor />
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationProvider
        initialPage={Page.HOME}
        inactivityTimeout={120000} // 2 minute inactivity timeout
      >
        <AppRouter />
      </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;