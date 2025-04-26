import React, { useState, useEffect } from 'react';
import VideoThumbnail from '../VideoThumbnail';
import { Sprite } from '../../types';

interface GridProps {
  sprites: Sprite[];
  onSpriteSelect: (sprite: Sprite) => void;
  rowCount?: number;
  columnCount?: number;
}

/**
 * Grid component for displaying sprite thumbnails
 * Optimized for 27" iMac in fullscreen (4x5 grid layout)
 */
const Grid: React.FC<GridProps> = ({ 
  sprites, 
  onSpriteSelect, 
  rowCount = 4, 
  columnCount = 5
}) => {
  // State to track loading
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Trigger entrance animation once component mounts
  useEffect(() => {
    // Short timeout to ensure all grid items render before animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Using viewport units to ensure the grid fits perfectly on a 27" display
  return (
    <div className={`grid-container ${isLoaded ? 'loaded' : ''}`} style={{
      width: '100vw',
      height: '90vh', // Leave room for header and potential margins
      padding: '2vh 3vw', // Consistent padding on all sides
      boxSizing: 'border-box',
    }}>
      <div className="sprites-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`, // Configurable columns
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,       // Configurable rows
        gap: '2vh 2vw',  // Vertical and horizontal gap as percentage of viewport
        width: '100%',
        height: '100%',
      }}>
        {sprites.map((sprite, index) => (
          <div 
            key={sprite.id} 
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              // Use CSS variables for staggered animations
              ['--item-index' as any]: index,
            }} 
            className="grid-item"
          >
            <VideoThumbnail
              sprite={sprite}
              onClick={onSpriteSelect}
              previewMode={true}
              className="grid-thumbnail"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;