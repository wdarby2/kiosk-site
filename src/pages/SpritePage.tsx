import React from 'react';
import VideoFullscreen from '../components/VideoFullscreen';
import { Sprite } from '../types';

interface SpritePageProps {
  sprite: Sprite;
  onClose: () => void;
  onUserInteraction?: () => void; // Prop for handling user interaction
  onVideoEnded?: () => void; // Prop for video ended event
}

const SpritePage: React.FC<SpritePageProps> = ({ 
  sprite, 
  onClose,
  onUserInteraction,
  onVideoEnded
}) => {
  if (!sprite) {
    return null;
  }

  // Handler for user interactions
  const handleUserInteraction = () => {
    console.log('SpritePage: User interaction detected');
    if (onUserInteraction) {
      onUserInteraction();
    }
  };

  return (
    <div 
      className="sprite-page" 
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
      }}
      onClick={handleUserInteraction}
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      <VideoFullscreen
        sprite={sprite}
        onClose={onClose}
        autoPlay={true}
        onInteraction={handleUserInteraction}
        onVideoEnded={onVideoEnded}
      />
    </div>
  );
};

export default SpritePage;