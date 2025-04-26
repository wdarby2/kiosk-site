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
  const [videoRef, videoState, videoControls] = useVideoPlayback(
    sprite.filename,
    {
      autoPlay,
      loop: true,
      muted: false, // Fullscreen videos should have sound
      playsInline: true,
      controls: false, // We'll implement our own controls
      forceProtocolCheck: true,
    }
  );

  // Handle keyboard events for playback control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          videoControls.toggle();
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'm':
          e.preventDefault();
          videoControls.toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          // Seek back 5 seconds
          if (videoRef.current) {
            const newTime = Math.max(0, videoState.currentTime - 5);
            videoControls.seek(newTime);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          // Seek forward 5 seconds
          if (videoRef.current) {
            const newTime = Math.min(videoState.duration, videoState.currentTime + 5);
            videoControls.seek(newTime);
          }
          break;
        case 'r':
          e.preventDefault();
          videoControls.reset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoControls, videoRef, videoState.currentTime, videoState.duration, onClose]);

  // Format time (seconds -> MM:SS format)
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    
    return `${minutesStr}:${secondsStr}`;
  };

  // Calculate progress percentage
  const progressPercentage = videoState.duration 
    ? (videoState.currentTime / videoState.duration) * 100 
    : 0;

  // Handle seek on progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't stop propagation - allow the click to bubble up to parent components
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    if (videoRef.current && videoState.duration) {
      const newTime = percentage * videoState.duration;
      videoControls.seek(newTime);
    }
    
    // Track interaction
    handleInteraction();
  };

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
        <div style={{
          color: '#fff',
          textAlign: 'center',
          padding: '2rem',
        }}>
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
      {/* Close button */}
      <button
        onClick={(e) => {
          // Call the interaction handler
          handleInteraction();
          // Call the close handler but don't stop propagation
          if (onClose) {
            onClose();
          }
        }}
        aria-label="Close"
        className="close-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '46px',
          height: '46px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transform: 'scale(0.9)',
          animation: 'scaleIn 400ms ease-out 300ms forwards',
          transition: 'background-color 250ms ease, transform 250ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(74, 144, 226, 0.7)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{
          display: 'inline-block',
          lineHeight: 1,
          transition: 'transform 250ms ease',
        }}>✕</span>

        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </button>

      {/* Video element - filling available space */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Fill the entire container while maintaining aspect ratio
            objectPosition: 'center',
            backgroundColor: '#000',
          }}
          onClick={(e) => {
            // Toggle playback
            videoControls.toggle();
            // Track interaction
            handleInteraction();
          }}
        />

        {/* Enhanced video info overlay at the top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '30px',
          background: 'linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.7) 40%, transparent)',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.7)',
          zIndex: 5,
          animation: 'fadeInDown 500ms ease-out forwards',
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            animation: 'slideInRight 600ms ease-out forwards',
          }}>
            {sprite.title}
          </h2>
          <div style={{ 
            margin: '1rem 0 0.5rem', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px',
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0,
              transform: 'translateX(-20px)',
              animation: 'slideInRight 400ms ease-out 200ms forwards',
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.9rem',
                opacity: 0.8,
                transition: 'opacity 250ms ease, transform 250ms ease, background-color 250ms ease',
              }}>
                Genre
              </span>
              <span>{sprite.genre}</span>
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0,
              transform: 'translateX(-20px)',
              animation: 'slideInRight 400ms ease-out 300ms forwards',
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.9rem',
                opacity: 0.8,
                transition: 'opacity 250ms ease, transform 250ms ease, background-color 250ms ease',
              }}>
                Music
              </span>
              <span>{sprite.songTitle}</span>
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0,
              transform: 'translateX(-20px)',
              animation: 'slideInRight 400ms ease-out 400ms forwards',
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.9rem',
                opacity: 0.8,
                transition: 'opacity 250ms ease, transform 250ms ease, background-color 250ms ease',
              }}>
                Animation
              </span>
              <span>{sprite.animationMethods}</span>
            </p>
          </div>

          <style>{`
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(-20px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>

        {/* Play/pause indicator in the center */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            animation: videoState.isPlaying 
              ? 'fadeOutAfterDelay 0.5s forwards'
              : 'fadeIn 0.3s forwards',
          }}
        >
          {videoState.isPlaying ? (
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div style={{ width: '8px', height: '24px', backgroundColor: '#fff' }}></div>
              <div style={{ width: '8px', height: '24px', backgroundColor: '#fff' }}></div>
            </div>
          ) : (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderLeft: '24px solid #fff',
              marginLeft: '5px',
            }}></div>
          )}

          <style>{`
            @keyframes fadeOutAfterDelay {
              0%, 20% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Loading indicator */}
        {!videoState.isLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '5px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              borderTop: '5px solid #fff',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }}></div>
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

      {/* Video controls */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '10px 20px',
        color: '#fff',
      }}>
        {/* Progress bar */}
        <div 
          style={{
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            margin: '0 0 15px',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={handleProgressClick}
        >
          <div 
            style={{
              height: '100%',
              width: `${progressPercentage}%`,
              backgroundColor: '#4a90e2',
              borderRadius: '3px',
            }}
          ></div>
        </div>

        {/* Controls row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            {/* Play/Pause button */}
            <button
              onClick={(e) => {
                videoControls.toggle();
                // Track interaction
                handleInteraction();
              }}
              aria-label={videoState.isPlaying ? 'Pause' : 'Play'}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {videoState.isPlaying ? (
                <span>⏸️</span>
              ) : (
                <span>▶️</span>
              )}
            </button>

            {/* Mute button */}
            <button
              onClick={(e) => {
                videoControls.toggleMute();
                // Track interaction
                handleInteraction();
              }}
              aria-label={videoState.isMuted ? 'Unmute' : 'Mute'}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {videoState.isMuted ? (
                <span>🔇</span>
              ) : (
                <span>🔊</span>
              )}
            </button>

            {/* Time display */}
            <div style={{ fontSize: '0.9rem' }}>
              {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
            </div>
          </div>

          <div>
            {/* Reset button */}
            <button
              onClick={(e) => {
                videoControls.reset();
                // Track interaction
                handleInteraction();
              }}
              aria-label="Restart"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>🔄</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFullscreen;