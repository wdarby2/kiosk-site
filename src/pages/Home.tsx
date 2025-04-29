import React, { useState, useEffect } from 'react';
import Grid from '../components/Grid';
import { Sprite } from '../types';
import spritesData from '../assets/metadata/sprites.json';

interface HomeProps {
  onSpriteSelect: (sprite: Sprite) => void;
}

const Home: React.FC<HomeProps> = ({ onSpriteSelect }) => {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sprite data on component mount
  useEffect(() => {
    console.log('Loading sprite data for Home page');
    setLoading(true);
    
    try {
      if (spritesData && Array.isArray(spritesData.sprites)) {
        console.log(`Found ${spritesData.sprites.length} sprites`);
        setSprites(spritesData.sprites);
        setLoading(false);
      } else {
        setError('Failed to parse sprite data.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in sprite setup:', err);
      setError('An error occurred loading sprite data.');
      setLoading(false);
    }
  }, []);

  // Handle sprite selection
  const handleSpriteClick = (sprite: Sprite) => {
    onSpriteSelect(sprite);
  };

  if (loading) {
    return (
      <div className="home-page loading" style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(0,0,0,0.1)',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '2rem',
        }}></div>
        <h2>Loading Motion Study Sprites...</h2>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page error" style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#721c24',
        backgroundColor: '#f8d7da',
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
        }}>
          ⚠️
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Error Loading Content</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#721c24',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="home-page" style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '50px 100px', // 50px top/bottom, 100px left/right margins
      boxSizing: 'border-box',
      overflow: 'hidden', // Prevent scrolling
      position: 'relative', // Position context for content
    }}>
      {/* Content container that holds both title and grid */}
      <div className="content-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center the container itself
        width: '100%', // Full width of parent (which has the margins)
        padding: '0',
      }}>
        {/* Fixed-width shared container for title and grid */}
        <div className="fixed-width-container" style={{
          width: 'fit-content', // Width based on content (grid size)
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Left-align children 
        }}>
          {/* Title aligned to the left */}
          <div className="title-container" id="title-container" style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start', // Left-align the title
            marginBottom: '0.5rem', // Slightly increased margin below title for better spacing
            paddingLeft: '0', // No padding to match grid alignment
          }}>
          <h1 style={{ 
            textAlign: 'left',  // Left-align the title text
            margin: 0,  // No margin
            fontSize: '40px', // Exactly 40px as requested
            lineHeight: 1.2, // Slightly increased line height
            fontWeight: 'bold', // Bold weight
            fontFamily: "'JetBrains Mono', monospace", // JetBrains Mono font
            width: 'auto', // Size based on content
            paddingLeft: '0', // No padding
          }}>
            Motion Study Sprites
          </h1>
        </div>
        
          {/* Grid component */}
          {sprites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
              <p>No sprites found. Please check the data source.</p>
            </div>
          ) : (
            <Grid 
              sprites={sprites}
              onSpriteSelect={handleSpriteClick}
            />
          )}
        </div> {/* End of fixed-width-container */}
      </div>
    </div>
  );
};

export default Home;