import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  // State to track calculated cell size
  const [cellSize, setCellSize] = useState(0);
  // Reference to the grid container for measurements
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the optimal cell size based on available space
  const calculateCellSize = useCallback(() => {
    if (!gridContainerRef.current) return;
    
    const container = gridContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Available width and height for the grid
    const availableWidth = containerRect.width * 0.95; // 95% of container width
    const availableHeight = containerRect.height * 0.95; // 95% of container height
    
    // Fixed gap size in pixels (more predictable than vh/vw units)
    const gapSize = Math.min(window.innerWidth, window.innerHeight) * 0.015; // 1.5% of viewport smallest dimension
    
    // Calculate maximum possible cell width considering gaps
    const maxCellWidth = (availableWidth - (gapSize * (columnCount - 1))) / columnCount;
    
    // Calculate maximum possible cell height considering gaps
    const maxCellHeight = (availableHeight - (gapSize * (rowCount - 1))) / rowCount;
    
    // Use the smaller of the two to ensure square cells that fit within constraints
    const optimalCellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));
    
    setCellSize(optimalCellSize);
  }, [rowCount, columnCount]);
  
  // Recalculate on resize
  useEffect(() => {
    calculateCellSize();
    
    const handleResize = () => {
      calculateCellSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCellSize]);
  
  // Trigger entrance animation once component mounts
  useEffect(() => {
    // Short timeout to ensure all grid items render before animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      ref={gridContainerRef}
      className={`grid-container ${isLoaded ? 'loaded' : ''}`} 
      style={{
        width: '100%', // Use 100% to respect parent container size
        height: 'calc(100vh - 80px)', // Ensure it fits below header
        padding: '0', // No padding, let grid component handle spacing
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {cellSize > 0 && (
        <div className="sprites-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, ${cellSize}px)`, // Fixed size columns
          gridTemplateRows: `repeat(${rowCount}, ${cellSize}px)`, // Fixed size rows
          justifyContent: 'center', // Center the grid horizontally
          gap: `${Math.min(window.innerWidth, window.innerHeight) * 0.015}px`, // Fixed pixel gap
          margin: '0 auto', // Center the grid
        }}>
          {sprites.map((sprite, index) => (
            <div 
              key={sprite.id} 
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
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
      )}

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