import React, { useState, useEffect, ReactNode, useRef } from 'react';

export type TransitionType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';

interface TransitionProps {
  children: ReactNode;
  isVisible: boolean;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  className?: string;
  onExited?: () => void;
}

/**
 * Reusable transition component for animating elements
 * File protocol compatible using pure CSS transitions
 */
const Transition: React.FC<TransitionProps> = ({
  children,
  isVisible,
  type = 'fade',
  duration = 300,
  delay = 0,
  className = '',
  onExited,
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const hasAnimatedOut = useRef(false);
  
  // Handle entrance and exit animations
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      hasAnimatedOut.current = false;
    } else if (!hasAnimatedOut.current) {
      // Start exit animation
      hasAnimatedOut.current = true;
      
      // After animation completes, stop rendering if needed
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onExited) onExited();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onExited]);
  
  // Don't render anything if we don't need to show the component
  if (!shouldRender) return null;
  
  // Determine correct transform for the selected transition type
  const getTransformValue = (visible: boolean): string => {
    if (type === 'fade') return 'none';
    if (type === 'scale') return visible ? 'scale(1)' : 'scale(0.95)';
    if (type === 'slide-up') return visible ? 'translateY(0)' : 'translateY(20px)';
    if (type === 'slide-down') return visible ? 'translateY(0)' : 'translateY(-20px)';
    if (type === 'slide-left') return visible ? 'translateX(0)' : 'translateX(20px)';
    if (type === 'slide-right') return visible ? 'translateX(0)' : 'translateX(-20px)';
    return 'none';
  };
  
  // Create style object for the transition
  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransformValue(isVisible),
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
  };
  
  return (
    <div 
      className={`transition ${type} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Transition;