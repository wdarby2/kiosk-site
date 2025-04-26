import React from 'react';

interface NavigationProps {
  currentPage: string;
  onHomeClick: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onHomeClick, 
  className = '' 
}) => {
  const isHomePage = currentPage === 'home';
  
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
          onClick={onHomeClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isHomePage ? 0.6 : 1,
            pointerEvents: isHomePage ? 'none' : 'auto',
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
        {/* This space intentionally left blank for symmetry */}
      </div>
    </nav>
  );
};

export default Navigation;