import React, { useEffect } from 'react';
import VideoFullscreen from '../components/VideoFullscreen';
import { useNavigation, Page } from '../context/NavigationContext';

const SpritePage: React.FC = () => {
  const { selectedSprite, navigate, resetInactivityTimer } = useNavigation();

  // Reset inactivity timer when the component mounts
  useEffect(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // If no sprite is selected, redirect to home
  useEffect(() => {
    if (!selectedSprite) {
      navigate(Page.HOME);
    }
  }, [selectedSprite, navigate]);

  // Early return if no sprite is selected
  if (!selectedSprite) {
    return null;
  }

  // Handle close event
  const handleClose = () => {
    navigate(Page.HOME);
  };

  return (
    <div className="sprite-page" style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#000',
    }}>
      <VideoFullscreen
        sprite={selectedSprite}
        onClose={handleClose}
        autoPlay={true}
      />
    </div>
  );
};

export default SpritePage;