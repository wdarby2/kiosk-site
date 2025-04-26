import React from 'react';
import useVideoPlayback from '../../hooks/useVideoPlayback';
import { Sprite } from '../../types';

interface VideoThumbnailProps {
  sprite: Sprite;
  onClick?: (sprite: Sprite) => void;
  isActive?: boolean;
  previewMode?: boolean;
  className?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  sprite,
  onClick,
  isActive = false,
  previewMode = false,
  className = '',
}) => {
  // Use our custom hook for video playback
  const [videoRef, videoState, videoControls] = useVideoPlayback(
    sprite.filename,
    {
      autoPlay: previewMode, // Only autoplay in preview mode
      loop: true,
      muted: true,
      playsInline: true,
      controls: false,
      forceProtocolCheck: true,
    }
  );

  // Play/pause on hover if in preview mode
  const handleMouseEnter = () => {
    if (previewMode && !videoState.isPlaying) {
      videoControls.play();
    }
  };

  const handleMouseLeave = () => {
    if (previewMode && videoState.isPlaying) {
      videoControls.pause();
      videoControls.reset(); // Reset to start when mouse leaves
    }
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(sprite);
    }
  };

  // Error state fallback
  if (videoState.hasError) {
    return (
      <div 
        className={`video-thumbnail error ${isActive ? 'active' : ''} ${className}`}
        onClick={handleClick}
        style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
          border: isActive ? '3px solid #4a90e2' : '3px solid transparent',
        }}
      >
        <div style={{
          color: '#fff',
          textAlign: 'center',
          padding: '1rem',
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{sprite.title}</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Video not available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`video-thumbnail ${isActive ? 'active' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: isActive ? '3px solid #4a90e2' : '3px solid transparent',
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Overlay with sprite info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        color: '#fff',
        padding: '1rem',
        opacity: isActive ? 1 : 0.8,
        transition: 'opacity 0.3s ease',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{sprite.title}</h3>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.8 }}>{sprite.genre}</p>
      </div>

      {/* Loading indicator */}
      {!videoState.isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            borderTop: '4px solid #fff',
            animation: 'spin 1s linear infinite',
          }}></div>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Play indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: videoState.isPlaying ? 0 : 0.8,
          transition: 'opacity 0.3s ease',
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderLeft: '20px solid #fff',
            marginLeft: '5px',
          }}></div>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;