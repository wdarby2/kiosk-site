import React from 'react';
import { useNavigation, Page } from '../../context/NavigationContext';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { currentPage, goHome, isInactive } = useNavigation();
  
  return (
    <nav className={`navigation ${className}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      zIndex: 900,
      backdropFilter: 'blur(5px)',
    }}>
      <div className="navigation-left">
        <button
          onClick={goHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: currentPage === Page.HOME ? 0.6 : 1,
            pointerEvents: currentPage === Page.HOME ? 'none' : 'auto',
          }}
        >
          <span style={{
            fontSize: '1.5rem',
          }}>←</span>
          <span>Home</span>
        </button>
      </div>
      
      <div className="navigation-center" style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
      }}>
        Motion Study Sprites
      </div>
      
      <div className="navigation-right" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {isInactive && (
          <span style={{
            fontSize: '0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
          }}>
            Inactive
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navigation;