import React from 'react';
import VideoTest from './components/VideoTest';

const App: React.FC = () => {
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
        <p style={{ fontSize: '1.25rem' }}>File Protocol Compatibility Test</p>
      </header>
      
      <main>
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px',
          border: '1px solid #4a90e2'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c5282' }}>
            File Protocol Video Loader
          </h2>
          <p>
            This tool automatically tries multiple path formats to find one that 
            works with the file:// protocol. It will test different path strategies until 
            it finds one that successfully loads the video.
          </p>
        </div>
        
        <VideoTest filename="sprite1.mp4" />
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#e9f7ef', 
          borderRadius: '8px',
          border: '1px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', marginBottom: '1rem' }}>Key Learnings:</h3>
          <ol style={{ marginLeft: '1.5rem' }}>
            <li>When using the file:// protocol, source paths must be adjusted to accommodate filesystem access</li>
            <li>Vite's build process correctly handles video assets, placing them in dist/assets/videos/</li>
            <li>Our auto-detection approach allows the same code to work in both development and production</li>
            <li>The PathDebugger component can detect the correct path format for any environment</li>
            <li>Our implementation now supports the critical requirement of running from the filesystem</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default App;