import React, { useEffect } from 'react';
import useVideoPlayback from '../../hooks/useVideoPlayback';
import { Sprite } from '../../types';

interface VideoFullscreenProps {
  sprite: Sprite;
  onClose?: () => void;
  autoPlay?: boolean;
  className?: string;
  onInteraction?: () => void; // Add prop for interaction events
}

const VideoFullscreen: React.FC<VideoFullscreenProps> = ({
  sprite,
  onClose,
  autoPlay = true,
  className = '',
  onInteraction,
}) => {
  // Handler for user interactions
  const handleInteraction = () => {
    console.log('VideoFullscreen: User interaction detected');
    if (onInteraction) {
      onInteraction();
    }
  };
  // Use our custom hook for video playback
  const [videoRef, videoState, videoControls] = useVideoPlayback(sprite.filename, {
    autoPlay: true, // Always autoplay
    loop: true,
    muted: false, // Fullscreen videos should have sound
    playsInline: true,
    controls: false, // No controls
    forceProtocolCheck: true,
  });

  // Handle keyboard events for escape only (to close the video)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      // Track interaction on any key press to reset inactivity timer
      handleInteraction();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Error state fallback
  if (videoState.hasError) {
    return (
      <div
        className={`video-fullscreen error ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            color: '#fff',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>{sprite.title}</h2>
          <p style={{ marginBottom: '2rem' }}>Unable to load video</p>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  // Add a transparent overlay to block all mouse events in the upper-right corner
  React.useEffect(() => {
    // Create a style tag for our CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .return-button-wrapper {
        position: fixed;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        z-index: 99999;
        pointer-events: none;
      }
      
      .return-button {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 46px;
        height: 46px;
        background-color: rgba(255, 255, 255, 0.15); /* White with 15% opacity */
        border: none;
        border-radius: 50%;
        color: rgba(255, 255, 255, 1); /* White text */
        font-size: 24px;
        cursor: pointer;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
        line-height: 1;
      }
      
      /* Fix vertical alignment and use standard arrow */
      .return-button::before {
        content: ''; /* Remove text content */
        display: block;
        width: 12px; /* Smaller size */
        height: 12px; /* Smaller size */
        border-left: 2px solid white; /* Thinner border */
        border-bottom: 2px solid white; /* Thinner border */
        transform: rotate(45deg); /* Rotate to make a left-pointing arrow */
        margin-right: -4px; /* Adjust position */
      }
      
      .return-button:hover {
        background-color: rgba(255, 255, 255, 0.25); /* White with 25% opacity */
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(styleTag);

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'return-button-wrapper';

    // Create button
    const button = document.createElement('button');
    button.className = 'return-button';
    // Don't set textContent, as we're using ::before pseudo-element
    button.setAttribute('aria-label', 'Return to gallery');

    // Add click handler
    button.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      if (onClose) onClose();
    };

    // Add to DOM outside React tree
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    // Remove onMouseMove handler from parent container
    const videoContainer = document.querySelector('.video-fullscreen');
    if (videoContainer) {
      videoContainer.onmousemove = null;
    }

    // Clean up on unmount
    return () => {
      document.head.removeChild(styleTag);
      document.body.removeChild(wrapper);
    };
  }, [onClose]);

  return (
    <div
      className={`video-fullscreen ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
      onKeyDown={handleInteraction}
    >
      {/* No buttons here - using imperative DOM button instead */}

      {/* Video element - filling available space */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Fill the entire container while maintaining aspect ratio
            objectPosition: 'center',
            backgroundColor: '#000',
          }}
          onClick={e => {
            // Just track interaction, no toggling play/pause
            handleInteraction();
          }}
        />

        {/* Subtle gradient overlay - primarily at the bottom for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)
            `,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Metadata overlay at the bottom - transparent with subtle text shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px', // Closer to bottom
            left: 0,
            right: 0,
            padding: '20px 40px',
            backgroundColor: 'transparent',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            zIndex: 5,
            animation: 'fadeInUp 500ms ease-out forwards',
          }}
        >
          {/* Title (top-left) */}
          <h2
            style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              marginBottom: '1rem', // Reduced space between title and metadata
              animation: 'fadeInUp 600ms ease-out forwards',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)', // Lighter shadow
            }}
          >
            {sprite.title}
          </h2>

          {/* Three columns layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              opacity: 0,
              animation: 'fadeInUp 400ms ease-out 200ms forwards',
            }}
          >
            {/* GENRE Column */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: 'normal',
                  marginBottom: '4px',
                  opacity: 0.8,
                  textShadow: '0 1px 1px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                GENRE
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'normal',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                {sprite.genre}
              </span>
            </div>

            {/* SONG TITLE Column */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: 'normal',
                  marginBottom: '4px',
                  opacity: 0.8,
                  textShadow: '0 1px 1px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                SONG TITLE
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'normal',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                {sprite.songTitle}
              </span>
            </div>

            {/* METHODS USED Column */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: 'normal',
                  marginBottom: '4px',
                  opacity: 0.8,
                  textShadow: '0 1px 1px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                METHODS USED
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'normal',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)', // Reduced shadow
                }}
              >
                {sprite.animationMethods}
              </span>
            </div>
          </div>

          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* Loading indicator */}
        {!videoState.isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '5px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                borderTop: '5px solid #fff',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem',
              }}
            ></div>
            <p style={{ color: '#fff' }}>Loading video...</p>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoFullscreen;
