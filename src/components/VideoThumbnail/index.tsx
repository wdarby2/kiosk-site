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
  // Simplified version without video loading initially
  console.log(`Rendering VideoThumbnail for sprite:`, sprite.id, sprite.title);
  
  // Handle click
  const handleClick = () => {
    console.log('Thumbnail clicked:', sprite.title);
    if (onClick) {
      onClick(sprite);
    }
  };

  return (
    <div 
      className={`video-thumbnail ${isActive ? 'active' : ''} ${className}`}
      onClick={handleClick}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#333',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: isActive ? '3px solid #4a90e2' : '3px solid transparent',
      }}
    >
      {/* Placeholder for video */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      </div>

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
    </div>
  );
};
export default VideoThumbnail;