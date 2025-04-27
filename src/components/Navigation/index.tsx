import React, { useState, useEffect } from 'react';
import { TIMING, EASING } from '../../utils/animations';

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
  
  // Track mount animation state
  const [isVisible, setIsVisible] = useState(false);
  
  // Track button hover state
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Trigger mount animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav 
      className={`navigation ${className} ${isVisible ? 'visible' : ''}`} 
      style={{
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
        opacity: 0,
        transform: 'translateY(-10px)',
        transition: `
          opacity ${TIMING.entrance}ms ${EASING.easeOut},
          transform ${TIMING.entrance}ms ${EASING.easeOut}
        `,
      }}
    >
      <div className="navigation-left">
        <button
          onClick={onHomeClick}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={isHomePage}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: isHomePage ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: isHomePage ? 
              'transparent' : 
              isButtonHovered ? 
                'rgba(255,255,255,0.2)' : 
                'rgba(255,255,255,0.1)',
            opacity: isHomePage ? 0.6 : 1,
            pointerEvents: isHomePage ? 'none' : 'auto',
            transition: `
              background-color ${TIMING.fast}ms ${EASING.easeOut},
              transform ${TIMING.fast}ms ${EASING.emphasized},
              opacity ${TIMING.fast}ms ${EASING.easeOut}
            `,
            transform: isButtonHovered && !isHomePage ? 'scale(1.05)' : 'scale(1)',
            willChange: 'transform, background-color',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background ripple animation on hover */}
          {isButtonHovered && !isHomePage && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
              animation: 'fadeIn 300ms ease forwards',
              pointerEvents: 'none',
            }} />
          )}
          
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            transition: `transform ${TIMING.fast}ms ${EASING.emphasized}`,
            transform: isButtonHovered && !isHomePage ? 'translateX(-2px)' : 'translateX(0)',
            display: 'inline-block',
          }}>←</span>
          <span>Home</span>
        </button>
      </div>
      
      <div 
        className="navigation-center" 
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
          transition: `
            opacity ${TIMING.entrance}ms ${EASING.easeOut} ${TIMING.standard}ms,
            transform ${TIMING.entrance}ms ${EASING.easeOut} ${TIMING.standard}ms
          `,
        }}
      >
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
      
      {/* Animation styles */}
      <style>{`
        .navigation.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;