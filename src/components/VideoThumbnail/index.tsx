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
        width: '100%', // Take full container width
        paddingTop: '100%', // Create square aspect ratio
        backgroundColor: 'transparent',
        borderRadius: '6px', // Slightly rounded corners
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: 'none',
        boxShadow: isHovered ? 
          '0 4px 8px rgba(0,0,0,0.15)' : 
          '0 2px 4px rgba(0,0,0,0.1)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)', // Slightly larger hover effect
        transition: `transform ${TIMING.standard}ms ${EASING.emphasized}`,
        willChange: 'transform',
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center', // Explicitly center the video content
          borderRadius: '6px', // Match parent container's rounded corners
        }}
      />

      {/* Text overlay removed as requested */}

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
            zIndex: 1, // Ensure overlay is above video
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
          zIndex: 2, // Ensure loading indicator is above all
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