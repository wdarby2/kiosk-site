import React from 'react';
import VideoFullscreen from '../components/VideoFullscreen';
import { Sprite } from '../types';

interface SpritePageProps {
  sprite: Sprite;
  onClose: () => void;
}

const SpritePage: React.FC<SpritePageProps> = ({ sprite, onClose }) => {
  if (!sprite) {
    return null;
  }

  return (
    <div 
      className="sprite-page" 
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
      }}
    >
      <VideoFullscreen
        sprite={sprite}
        onClose={onClose}
        autoPlay={true}
      />
    </div>
  );
};

export default SpritePage;