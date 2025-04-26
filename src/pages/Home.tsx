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
      width: '100vw',
      height: '100vh',
      overflow: 'hidden', // Prevent scrolling
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '60px', // Account for the fixed navigation
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        margin: '1vh 0',
        fontSize: 'clamp(1.5rem, 2vw, 2.5rem)', // Responsive font size
      }}>
        Motion Study Sprites Gallery
      </h1>
      
      {sprites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No sprites found. Please check the data source.</p>
        </div>
      ) : (
        <Grid 
          sprites={sprites}
          onSpriteSelect={handleSpriteClick}
        />
      )}
    </div>
  );
};

export default Home;