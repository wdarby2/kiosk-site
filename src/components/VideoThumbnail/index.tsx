import React, { useEffect, useState } from 'react';
import useVideoPlayback from '../../hooks/useVideoPlayback';
import { Sprite } from '../../types';
import { TIMING, EASING } from '../../utils/animations';

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
  previewMode = true, // Default to true for grid view
  className = '',
}) => {
  // Track hover state for enhanced animations
  const [isHovered, setIsHovered] = useState(false);
  
  // Use our custom hook for video playback
  const [videoRef, videoState, videoControls] = useVideoPlayback(
    sprite.filename,
    {
      // Only autoplay in preview mode and if not previously loaded
      autoPlay: previewMode,
      loop: true,
      muted: true, // Always muted in grid view
      playsInline: true,
      controls: false,
      forceProtocolCheck: true,
    }
  );

  // Handle mouse interactions for preview mode
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (previewMode && !videoState.isPlaying) {
      videoControls.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (previewMode && videoState.isPlaying && !isActive) {
      videoControls.pause();
    }
  };

  // Play video when in preview mode or when active
  useEffect(() => {
    if ((previewMode || isActive) && videoState.isLoaded && !videoState.isPlaying) {
      videoControls.play();
    }
  }, [previewMode, isActive, videoState.isLoaded, videoState.isPlaying, videoControls]);

  // Handle clicking on the thumbnail
  const handleClick = () => {
    if (onClick) {
      onClick(sprite);
    }
  };

  return (
    <div 
      className={`video-thumbnail ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#222',
        borderRadius: '12px', // Slightly more rounded for gallery style
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: isActive ? '3px solid #4a90e2' : '3px solid transparent',
        boxShadow: isHovered ? 
          '0 8px 16px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.1)' : 
          '0 4px 8px rgba(0,0,0,0.1)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        transition: `
          transform ${TIMING.standard}ms ${EASING.emphasized},
          box-shadow ${TIMING.standard}ms ${EASING.easeOut},
          border ${TIMING.standard}ms ${EASING.easeOut}
        `,
        willChange: 'transform, box-shadow',
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
          objectPosition: 'center',
          borderRadius: '8px', // Match parent container's rounded corners
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
        opacity: isHovered || isActive ? 1 : 0.8,
        transform: isHovered ? 'translateY(0)' : 'translateY(3px)',
        transition: `
          opacity ${TIMING.standard}ms ${EASING.easeOut},
          transform ${TIMING.standard}ms ${EASING.easeOut}
        `,
      }}>
        <h3 
          style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: 'bold',
            transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
            transition: `transform ${TIMING.standard}ms ${EASING.easeOut}`,
          }}
        >
          {sprite.title}
        </h3>
        <p 
          style={{ 
            margin: '0.25rem 0 0', 
            fontSize: '0.8rem', 
            opacity: isHovered ? 1 : 0.8,
            transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
            transition: `
              opacity ${TIMING.standard}ms ${EASING.easeOut},
              transform ${TIMING.standard}ms ${EASING.easeOut} ${TIMING.fast}ms
            `,
          }}
        >
          {sprite.genre}
        </p>
      </div>

      {/* Hover overlay effect */}
      {isHovered && !isActive && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'fadeIn 300ms ease forwards',
          }}
        />
      )}

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
          transition: `opacity ${TIMING.standard}ms ${EASING.easeOut}`,
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

      {/* Animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VideoThumbnail;