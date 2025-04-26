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
      height: '60px', // Fixed height for consistent layout
      padding: '0 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      zIndex: 900,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
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
            padding: '8px 16px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            backgroundColor: isHomePage ? 'transparent' : 'rgba(255,255,255,0.1)',
            opacity: isHomePage ? 0.6 : 1,
            pointerEvents: isHomePage ? 'none' : 'auto',
          }}
          onMouseOver={(e) => {
            if (!isHomePage) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }
          }}
          onMouseOut={(e) => {
            if (!isHomePage) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}>←</span>
          <span>Home</span>
        </button>
      </div>
      
      <div className="navigation-center" style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}>
        Motion Study Sprites
      </div>
      
      <div className="navigation-right" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        width: '120px', // Match width of left side for balance
      }}>
        {/* This space intentionally left blank for symmetry */}
      </div>
    </nav>
  );
};

export default Navigation;