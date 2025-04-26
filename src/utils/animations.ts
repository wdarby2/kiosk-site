/**
 * Animation utilities for consistent animations across the application
 * Using pure CSS animations for file:// protocol compatibility
 */

// Standard timing values (in ms)
export const TIMING = {
  fast: 150,
  standard: 300,
  slow: 500,
  entrance: 400,
  exit: 300,
  stagger: 50, // Delay between staggered elements
};

// Standard easing curves
export const EASING = {
  // Simple
  linear: 'linear',
  ease: 'ease',
  // Entrance
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeOutQuick: 'cubic-bezier(0.0, 0.0, 0.4, 1)',
  // Exit
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  // Special
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
};

// Generate CSS transition string
export const transition = (
  properties: string[] = ['all'],
  duration: number = TIMING.standard,
  easing: string = EASING.ease,
  delay: number = 0
): string => {
  const transitions = properties.map(prop => 
    `${prop} ${duration}ms ${easing}${delay ? ` ${delay}ms` : ''}`
  );
  return transitions.join(', ');
};

// Calculate staggered delay for grid items
export const getStaggeredDelay = (index: number, baseDelay: number = 0): number => {
  return baseDelay + (index * TIMING.stagger);
};

// Generate will-change property for optimized animations
export const getWillChange = (properties: string[] = ['opacity', 'transform']): string => {
  return properties.join(', ');
};

// Keyframe animations for reuse
export const KEYFRAMES = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  spin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
};

// Function to generate staggered animation styles for child elements
export const staggeredAnimation = (
  baseDelay: number = 0,
  animationName: string = 'fadeIn',
  duration: number = TIMING.standard,
  staggerDelay: number = TIMING.stagger
): string => `
  animation: ${animationName} ${duration}ms ${EASING.easeOut} forwards;
  animation-delay: calc(${baseDelay}ms + var(--item-index, 0) * ${staggerDelay}ms);
`;

// Prepare all animations for injection into a style tag
export const getAllAnimationKeyframes = (): string => {
  return Object.values(KEYFRAMES).join('\n');
};