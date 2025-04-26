import React, { useState } from 'react';
import VideoDemo from './components/VideoDemo';
import VideoTest from './components/VideoTest';

const App: React.FC = () => {
  const [showFileBanner, setShowFileBanner] = useState(true);
  const [showVideoTest, setShowVideoTest] = useState(false);
  
  // Check if we're using file:// protocol
  const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Motion Study Sprites
        </h1>
        <p style={{ fontSize: '1.25rem' }}>
          {isFileProtocol ? 'Running from Filesystem' : 'Running on Development Server'}
        </p>
      </header>
      
      {showFileBanner && isFileProtocol && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          backgroundColor: '#d4edda', 
          borderRadius: '8px',
          border: '1px solid #c3e6cb',
          position: 'relative'
        }}>
          <button 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#333'
            }}
            onClick={() => setShowFileBanner(false)}
          >
            ×
          </button>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#155724' }}>
            File Protocol Detected ✓
          </h2>
          <p>
            The site is successfully running from the filesystem using the file:// protocol.
            Video paths have been adjusted automatically to work in this environment.
          </p>
        </div>
      )}
      
      <main>
        {/* Video Components Demo */}
        <VideoDemo />
        
        {showVideoTest && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #dee2e6' }}>
            <h2 style={{ marginBottom: '1rem' }}>File Protocol Video Test</h2>
            <p style={{ marginBottom: '1rem' }}>
              This component tests path resolution for the file:// protocol.
            </p>
            <button
              onClick={() => setShowVideoTest(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              Hide Test
            </button>
            <VideoTest filename="sprite1.mp4" />
          </div>
        )}
        
        {!showVideoTest && (
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button
              onClick={() => setShowVideoTest(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Show File Protocol Test Component
            </button>
          </div>
        )}
        
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#343a40', marginBottom: '1rem' }}>Core Video Functionality</h3>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Videos load correctly using filesystem-compatible paths</li>
            <li>Thumbnail and fullscreen components with rich controls</li>
            <li>Play/pause, mute/unmute, and seek functionality</li>
            <li>Keyboard shortcuts for video control</li>
            <li>Loading indicators and error states</li>
            <li>User inactivity detection</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;