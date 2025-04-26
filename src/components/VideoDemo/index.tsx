import React, { useState, useEffect } from 'react';
import VideoThumbnail from '../VideoThumbnail';
import VideoFullscreen from '../VideoFullscreen';
import useInactivityTimer from '../../hooks/useInactivityTimer';
import { Sprite } from '../../types';

interface VideoDemoProps {
  sprites?: Sprite[];
}

const VideoDemo: React.FC<VideoDemoProps> = ({ sprites }) => {
  // Use local sprites if none are provided
  const [localSprites, setLocalSprites] = useState<Sprite[]>([]);
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // Demo protocol detection
  const [protocol, setProtocol] = useState('');
  
  // Set up inactivity timer
  const [isInactive, resetTimer] = useInactivityTimer({
    timeout: 30000, // 30 seconds for demo purposes
    onInactive: () => {
      console.log('User inactive - could trigger autoplay feature');
    },
    onActive: () => {
      console.log('User active again');
    }
  });

  useEffect(() => {
    // Get the current protocol
    if (typeof window !== 'undefined') {
      setProtocol(window.location.protocol);
    }
    
    // Load local sprites if none are provided
    if (!sprites) {
      import('../../assets/metadata/sprites.json')
        .then((data) => {
          // Just use 4 sprites for the demo
          setLocalSprites(data.sprites.slice(0, 4));
        })
        .catch((error) => {
          console.error('Error loading sprites:', error);
        });
    }
  }, [sprites]);

  // Handle selecting a sprite
  const handleSpriteClick = (sprite: Sprite) => {
    setSelectedSprite(sprite);
    setShowFullscreen(true);
    resetTimer(); // Reset inactivity timer
  };

  // Handle closing fullscreen view
  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
    resetTimer(); // Reset inactivity timer
  };

  // Use provided sprites or local sprites
  const displaySprites = sprites || localSprites;

  return (
    <div className="video-demo">
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginTop: 0, color: '#343a40' }}>Video Functionality Demo</h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          backgroundColor: '#e9ecef',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <div>
            <strong>Current Protocol:</strong> {protocol}
          </div>
          <div>
            <strong>User State:</strong> {isInactive ? 'Inactive' : 'Active'} 
            <button 
              onClick={resetTimer}
              style={{
                marginLeft: '10px',
                padding: '4px 8px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reset Timer
            </button>
          </div>
        </div>
        <p>
          This demo showcases the core video functionality for the Motion Study Sprites Kiosk.
          Click on a thumbnail to view the video in fullscreen mode. Videos will automatically
          loop and can be controlled with the on-screen controls or keyboard shortcuts.
        </p>
        <div style={{
          backgroundColor: '#e2f2ff',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Keyboard Shortcuts:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Space or K: Play/pause</li>
            <li>M: Mute/unmute</li>
            <li>R: Reset video to beginning</li>
            <li>Arrow Left/Right: Seek backward/forward</li>
            <li>Escape: Exit fullscreen</li>
          </ul>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {displaySprites.map((sprite) => (
          <VideoThumbnail 
            key={sprite.id}
            sprite={sprite}
            onClick={handleSpriteClick}
            previewMode={true}
          />
        ))}
      </div>

      {/* Fullscreen Video */}
      {showFullscreen && selectedSprite && (
        <VideoFullscreen 
          sprite={selectedSprite}
          onClose={handleCloseFullscreen}
          autoPlay={true}
        />
      )}

      {/* Inactivity Indicator */}
      {isInactive && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          zIndex: 100,
        }}>
          No activity detected for 30 seconds
        </div>
      )}
    </div>
  );
};

export default VideoDemo;