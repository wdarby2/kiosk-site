import React, { useState, useEffect, useRef } from 'react';
import { getVideoPath } from '../../utils';

interface VideoTestProps {
  filename: string;
}

const VideoTest: React.FC<VideoTestProps> = ({ filename }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFileProtocol, setIsFileProtocol] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [pathIndex, setPathIndex] = useState(0);
  
  // Define multiple possible paths to try
  const pathOptions = [
    `./src/assets/videos/${filename}`,
    `../src/assets/videos/${filename}`,
    `./assets/videos/${filename}`,
    `../assets/videos/${filename}`,
    `assets/videos/${filename}`,
    `videos/${filename}`
  ];
  
  useEffect(() => {
    // Check if we're using file:// protocol
    setIsFileProtocol(window.location.protocol === 'file:');
    
    // Start with the first path
    tryLoadVideo(0);
  }, []);
  
  // Function to try loading the video with different paths
  const tryLoadVideo = (index: number) => {
    if (index >= pathOptions.length) {
      console.error('All video paths failed');
      setHasError(true);
      return;
    }
    
    setPathIndex(index);
    setCurrentPath(pathOptions[index]);
  };
  
  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      console.log(`Success! Video loaded with path: ${currentPath}`);
    };
    
    const handleError = () => {
      console.log(`Failed to load video with path: ${currentPath}`);
      // Try the next path
      tryLoadVideo(pathIndex + 1);
    };
    
    // Set up event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentPath, pathIndex]);
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <h2 style={{ marginBottom: '15px' }}>Video Loading Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Protocol:</strong> {window.location.protocol}</p>
        <p><strong>File Protocol:</strong> {isFileProtocol ? 'Yes' : 'No'}</p>
        <p><strong>Current Path:</strong> <code>{currentPath}</code></p>
        <p><strong>Status:</strong> {
          isLoaded ? '✅ Loaded successfully' : 
          hasError ? '❌ Failed to load all paths' : 
          '⏳ Attempting to load...'
        }</p>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <video
          ref={videoRef}
          src={currentPath}
          controls
          autoPlay
          muted
          loop
          playsInline
          width={400}
          style={{
            maxWidth: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: isLoaded ? '3px solid green' : '3px solid transparent',
          }}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Path Options Testing</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          marginTop: '10px',
        }}>
          {pathOptions.map((path, index) => (
            <div key={index} style={{
              padding: '10px',
              backgroundColor: index === pathIndex ? '#e8f4fc' : 'white',
              borderRadius: '4px',
              fontSize: '14px',
              border: index < pathIndex ? '1px solid #dc3545' : 
                     index === pathIndex && isLoaded ? '1px solid #28a745' : 
                     '1px solid #dee2e6',
              color: index < pathIndex ? '#dc3545' : 
                     index === pathIndex && isLoaded ? '#28a745' : 
                     'inherit',
            }}>
              <code>{path}</code>
              {index < pathIndex && (
                <span style={{ marginLeft: '5px' }}>❌</span>
              )}
              {index === pathIndex && isLoaded && (
                <span style={{ marginLeft: '5px' }}>✅</span>
              )}
              {index === pathIndex && !isLoaded && !hasError && (
                <span style={{ marginLeft: '5px' }}>⏳</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #dee2e6' }}>
        <h3 style={{ marginBottom: '10px' }}>Findings:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>When using file:// protocol, paths that work are <code>./src/assets/videos/filename.mp4</code> and <code>../src/assets/videos/filename.mp4</code></li>
          <li>For production builds, paths should use <code>./assets/videos/filename.mp4</code></li>
          <li>The Vite build properly copies videos to <code>dist/assets/videos/</code></li>
          <li>Our utility function needs to detect protocol and choose the right path format</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoTest;