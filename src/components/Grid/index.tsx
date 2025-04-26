import React, { useState, useEffect } from 'react';
import VideoThumbnail from '../VideoThumbnail';
import { Sprite } from '../../types';
import { staggeredAnimation, EASING, TIMING } from '../../utils/animations';

interface GridProps {
  sprites: Sprite[];
  onSpriteSelect: (sprite: Sprite) => void;
  rowCount?: number;
  columnCount?: number;
}

/**
 * Grid component for displaying sprite thumbnails
 * Optimized for 27" iMac in fullscreen (4x5 grid layout)
 * Enhanced with staggered entrance animations
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
      width: '100%', // Use 100% to respect parent container size
      height: 'calc(100vh - 80px)', // Ensure it fits below header
      padding: '0', // No padding, let grid component handle spacing
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="sprites-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, // Responsive columns
        gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`, // Responsive rows
        justifyContent: 'center', // Center the grid horizontally
        gap: '1.5vh 1.5vw',  // Responsive gaps
        width: '95%', // Take most of container width
        height: '85vh', // Fixed height that should fit on 27" display
        margin: '0 auto', // Center the grid
      }}>
        {sprites.map((sprite, index) => (
          <div 
            key={sprite.id} 
            style={{
              width: '100%',
              height: '100%', // Fill the grid cell
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Use CSS variables for staggered animations
              ['--item-index' as any]: index,
              opacity: 0, // Start invisible for entrance animation
              animation: isLoaded ? 
                `scaleIn 400ms ${EASING.easeOut} forwards` : 'none',
              animationDelay: isLoaded ? 
                `${100 + (index * 30)}ms` : '0ms', // Faster staggered delay
              transform: 'scale(0.95)', // Starting scale for entrance animation
              willChange: 'opacity, transform',
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

      {/* Animation keyframes */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .grid-container {
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 400ms ease-out;
        }
        
        .grid-container.loaded {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Grid;