import React, { useState, useEffect } from 'react';
import VideoThumbnail from '../components/VideoThumbnail';
import { useNavigation, Page } from '../context/NavigationContext';
import { Sprite } from '../types';
// Direct import for debugging
import spritesData from '../assets/metadata/sprites.json';

const Home: React.FC = () => {
  const { navigate, resetInactivityTimer } = useNavigation();
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sprite data on component mount - simplified direct approach
  useEffect(() => {
    console.log('Direct loading of sprites');
    setLoading(true);
    
    try {
      // Simple direct use of imported data
      if (spritesData && Array.isArray(spritesData.sprites)) {
        console.log('Setting sprites from direct import, length:', spritesData.sprites.length);
        setSprites(spritesData.sprites);
        setLoading(false);
      } else {
        console.error('Invalid sprites data format in direct import');
        setError('Failed to parse sprite data.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in sprite setup:', err);
      setError('An error occurred loading sprite data.');
      setLoading(false);
    }
  }, []);

  // Separate effect for resetting inactivity timer
  useEffect(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Handle sprite selection
  const handleSpriteClick = (sprite: Sprite) => {
    navigate(Page.SPRITE, sprite);
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

  // Add a console log to check sprites data before rendering
  console.log('Rendering Home with sprites:', sprites.length);

  return (
    <div className="home-page" style={{
      padding: '1rem',
      paddingTop: 'calc(1rem + 60px)', // Account for the fixed navigation
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        margin: '1rem 0 2rem',
        fontSize: '2rem',
      }}>
        Motion Study Sprites Gallery
      </h1>
      
      {sprites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No sprites found. Please check the data source.</p>
        </div>
      ) : (
        <div className="sprite-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {sprites.map((sprite) => (
            <div key={sprite.id} style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa',
            }}>
              <VideoThumbnail
                key={sprite.id}
                sprite={sprite}
                onClick={handleSpriteClick}
                previewMode={false} // Changed to false to avoid autoplay issues
              />
              <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{sprite.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;