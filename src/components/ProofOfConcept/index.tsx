import React, { useRef, useState, useEffect } from 'react';
import { getVideoPath } from '../../utils';

interface ProofOfConceptProps {
  videoFilename: string;
}

const ProofOfConcept: React.FC<ProofOfConceptProps> = ({ videoFilename }) => {
  const directVideoRef = useRef<HTMLVideoElement>(null);
  const jsVideoContainerRef = useRef<HTMLDivElement>(null);
  
  const [directVideoLoaded, setDirectVideoLoaded] = useState(false);
  const [directVideoError, setDirectVideoError] = useState(false);
  
  const [jsVideoLoaded, setJsVideoLoaded] = useState(false);
  const [jsVideoError, setJsVideoError] = useState(false);
  const [jsVideoErrorMessage, setJsVideoErrorMessage] = useState('');
  
  const [isFileProtocol, setIsFileProtocol] = useState(false);
  
  // Get the video path using our updated utility function
  // Force protocol check to ensure we get the correct path for file:// protocol
  const videoSrc = getVideoPath(videoFilename, true);
  
  // For debugging - also calculate alternate paths in case the primary path fails
  const alternativePaths = [
    `./src/assets/videos/${videoFilename}`,       // Path that works in file:// protocol
    `../src/assets/videos/${videoFilename}`,      // Alternative that works in some file:// setups
    `./assets/videos/${videoFilename}`,           // Production build path
    `../assets/videos/${videoFilename}`           // Alternative production path
  ];
  
  // Log all possible paths for debugging
  console.log('Video filename:', videoFilename);
  console.log('Current location:', window.location.href);
  console.log('Selected video path:', videoSrc);
  console.log('Alternative paths:', alternativePaths);
  
  useEffect(() => {
    // Log environment information for debugging
    console.log('Document URL:', document.URL);
    console.log('Protocol:', window.location.protocol);
    console.log('Video path:', videoSrc);
    
    // Detect if we're running on the file:// protocol
    setIsFileProtocol(window.location.protocol === 'file:');
    
    // Setup direct video element
    const directVideo = directVideoRef.current;
    if (directVideo) {
      const handleDirectCanPlay = () => {
        setDirectVideoLoaded(true);
        console.log('Direct video loaded successfully');
      };
      
      const handleDirectError = () => {
        setDirectVideoError(true);
        console.error('Direct video error:', directVideo.error);
      };
      
      directVideo.addEventListener('canplay', handleDirectCanPlay);
      directVideo.addEventListener('error', handleDirectError);
      
      // Cleanup
      return () => {
        directVideo.removeEventListener('canplay', handleDirectCanPlay);
        directVideo.removeEventListener('error', handleDirectError);
      };
    }
  }, [videoSrc]);
  
  // Create and mount JavaScript video on component mount
  useEffect(() => {
    const jsContainer = jsVideoContainerRef.current;
    if (!jsContainer) return;
    
    try {
      // Create video element via JavaScript
      const jsVideo = document.createElement('video');
      jsVideo.src = videoSrc;
      jsVideo.width = 320;
      jsVideo.controls = true;
      jsVideo.autoplay = true;
      jsVideo.muted = true;
      jsVideo.loop = true;
      jsVideo.playsInline = true;
      jsVideo.style.borderRadius = '8px';
      jsVideo.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      jsVideo.style.maxWidth = '100%';
      
      jsVideo.addEventListener('canplay', () => {
        setJsVideoLoaded(true);
        console.log('JavaScript video loaded successfully');
      });
      
      jsVideo.addEventListener('error', () => {
        setJsVideoError(true);
        setJsVideoErrorMessage(jsVideo.error ? jsVideo.error.message : 'Unknown error');
        console.error('JS video error:', jsVideo.error);
      });
      
      // Add the video to the container
      jsContainer.appendChild(jsVideo);
      
      // Cleanup function
      return () => {
        if (jsContainer.contains(jsVideo)) {
          jsVideo.pause();
          jsVideo.src = '';
          jsVideo.load();
          jsContainer.removeChild(jsVideo);
        }
      };
    } catch (err: any) {
      setJsVideoError(true);
      setJsVideoErrorMessage(err.message || 'Unknown error');
      console.error('JS creation error:', err);
    }
  }, [videoSrc]);
  
  return (
    <div className="proof-of-concept">
      <h2>File Protocol Video Playback Test</h2>
      
      <div className="protocol-info">
        <p>Current protocol: <strong>{window.location.protocol}</strong></p>
        <p className={isFileProtocol ? 'success' : 'warning'}>
          {isFileProtocol 
            ? '✅ Running on file:// protocol as required' 
            : '⚠️ Not running on file:// protocol - test in production build'}
        </p>
        <p>Video path format: <code>{videoSrc}</code></p>
      </div>
      
      <div className="video-test-container">
        <div className="video-test">
          <h3>Test 1: Direct Video Tag</h3>
          <div className="video-container">
            <video
              ref={directVideoRef}
              src={videoSrc}
              controls
              autoPlay
              muted
              loop
              playsInline
              width={320}
              style={{
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '100%'
              }}
            ></video>
          </div>
          
          <div className="status">
            {!directVideoLoaded && !directVideoError && (
              <p className="loading">⏳ Loading direct video...</p>
            )}
            {directVideoLoaded && (
              <p className="success">✅ Direct video loaded successfully</p>
            )}
            {directVideoError && (
              <p className="error">❌ Error loading direct video</p>
            )}
          </div>
        </div>
        
        <div className="video-test">
          <h3>Test 2: JavaScript-Created Video</h3>
          <div 
            ref={jsVideoContainerRef} 
            className="video-container js-video-container"
          ></div>
          
          <div className="status">
            {!jsVideoLoaded && !jsVideoError && (
              <p className="loading">⏳ Loading JavaScript video...</p>
            )}
            {jsVideoLoaded && (
              <p className="success">✅ JavaScript video loaded successfully</p>
            )}
            {jsVideoError && (
              <p className="error">
                ❌ Error loading JavaScript video: {jsVideoErrorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="key-findings">
        <h3>Key Findings</h3>
        <ul>
          <li>Video paths must use <code>./assets/videos/filename.mp4</code> format</li>
          <li>Base path in Vite config must be set to <code>'./'</code></li>
          <li>Asset filename hashing must be disabled</li>
          <li>Custom plugin ensures videos are copied to correct location</li>
        </ul>
      </div>
      
      <div className="instructions">
        <h3>Testing Instructions</h3>
        <ol>
          <li>Run <code>npm run build</code> to build the application</li>
          <li>Navigate to the <code>dist</code> directory</li>
          <li>Open <code>index.html</code> directly in Chrome (double-click the file)</li>
          <li>Verify that both videos load and play correctly</li>
          <li>Check that the protocol shows as <code>file://</code></li>
          <li>Check browser console for any errors</li>
        </ol>
      </div>
      
      <style jsx>{`
        .proof-of-concept {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }
        
        h3 {
          font-size: 1.4rem;
          margin: 1.5rem 0 0.75rem;
          color: #444;
        }
        
        .protocol-info {
          background: #e9ecef;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #6c757d;
        }
        
        .video-test-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .video-test-container {
            flex-direction: row;
          }
          
          .video-test {
            flex: 1;
          }
        }
        
        .video-test {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .video-container {
          margin: 1rem 0;
          display: flex;
          justify-content: center;
        }
        
        .status {
          margin: 1rem 0;
          font-weight: bold;
          text-align: center;
        }
        
        .success {
          color: #28a745;
        }
        
        .error {
          color: #dc3545;
        }
        
        .warning {
          color: #fd7e14;
        }
        
        .loading {
          color: #007bff;
        }
        
        .key-findings {
          background: #e9ecef;
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
          border-left: 4px solid #28a745;
        }
        
        .key-findings ul {
          margin-left: 1.5rem;
        }
        
        .key-findings li {
          margin-bottom: 0.5rem;
        }
        
        .instructions {
          margin-top: 1rem;
          padding: 1rem;
          background: #e9ecef;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }
        
        .instructions ol {
          margin-left: 1.5rem;
        }
        
        .instructions li {
          margin-bottom: 0.5rem;
        }
        
        code {
          background: #f0f0f0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default ProofOfConcept;