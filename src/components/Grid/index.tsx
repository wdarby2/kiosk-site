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
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space accounting for margins
    const availableWidth = viewportWidth - 250; // 100px left and right margins + some buffer
    const availableHeight = viewportHeight - 180; // 50px top and bottom margins + space for title and header
    
    // Use a smaller gap size to allow for larger thumbnails
    const gapSize = Math.max(10, Math.min(window.innerWidth, window.innerHeight) * 0.01); // 1% of smallest dimension
    
    // Calculate maximum possible cell width considering gaps
    const maxCellWidth = (availableWidth - (gapSize * (columnCount - 1))) / columnCount;
    
    // Calculate maximum possible cell height considering gaps
    const maxCellHeight = (availableHeight - (gapSize * (rowCount - 1))) / rowCount;
    
    // Use the smaller of the two to ensure square cells that fit within constraints
    const optimalCellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));
    
    // Ensure minimum size for visibility, but make it larger
    const finalSize = Math.max(120, optimalCellSize);
    
    setCellSize(finalSize);
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
        width: '100%', // Full width of parent
        height: 'calc(100vh - 150px)', // Adjusted for margins and title
        padding: '0', // No padding, let grid component handle spacing
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Left-align to match our shared container approach
        justifyContent: 'center', // Center vertically only
        marginTop: '0', // Remove margin as the title's margin handles the spacing
      }}
    >
      {cellSize > 0 && (
        <div className="sprites-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, ${cellSize}px))`, // Responsive columns with max size
          gridTemplateRows: `repeat(${rowCount}, minmax(0, ${cellSize}px))`, // Responsive rows with max size
          justifyContent: 'start', // Left-align the grid items
          gap: `clamp(0.75rem, 1.25vw, 1.75rem)`, // Responsive gap
          margin: '0',
          width: 'fit-content', // Width based on content
        }}>
          {sprites.map((sprite, index) => (
            <div 
              key={sprite.id} 
              style={{
                width: '100%', // Use full width of grid cell
                height: '100%', // Use full height of grid cell
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
                maxWidth: `${cellSize}px`, // Maximum width
                maxHeight: `${cellSize}px`, // Maximum height
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