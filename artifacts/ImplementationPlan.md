# Implementation Plan: Motion Study Sprites Kiosk Site

## How to Use This Plan

This document outlines the step-by-step implementation approach for the Motion Study Sprites Kiosk Site. To ensure quality and alignment with requirements:

1. **Sequential Implementation**: We will proceed through steps 1-6 in order, completing each step fully before proceeding to the next.
2. **User Feedback**: After each step is completed, we will seek feedback before moving to the next step.
3. **Validation**: Each component will be tested individually to ensure it meets requirements.
4. **Adjustments**: The plan may be adjusted based on feedback and findings during implementation.

**Important**: Do not proceed to a new step until the current step has been reviewed and approved.

## 1. Core Video Functionality
- **Implement `useVideoPlayback` hook**
  - Create hook that configures videos with: autoplay, loop, playsInline
  - Handle mute/unmute toggling (muted in grid, sound enabled in fullscreen)
  - Add play/pause/reset methods for controlling video state
  - Implement loading error fallback mechanism with black background + title text
  - Add reference tracking for proper cleanup of video resources

- **Create video asset utilities**
  - Build helper to import video assets from local filesystem
  - Implement video quality selection based on current view (lower for grid, higher for fullscreen)
  - Add error boundary for handling video loading failures silently

## 2. Navigation State Management
- **Implement App-level state**
  - Use React useState to track current view (home/sprite) and active sprite ID
  - Create navigation functions: viewSprite(id) and returnToHome()
  - Store entire sprite metadata in state to prevent unnecessary data fetching
  - Test with simulated navigations to ensure smooth state transitions

- **Add view transition logic**
  - Create enter/exit states for components to trigger animations
  - Implement state reset when navigating back to home
  - Handle edge cases like rapid navigation between sprites

## 3. Home Grid Layout
- **Create Grid component**
  - Implement using CSS Grid with fixed 4×5 layout 
  - Calculate exact dimensions to fit all videos on screen without scrolling
  - Use viewport units (vh/vw) to ensure grid fills available space perfectly
  - Add appropriate gaps between grid items using fixed percentage of screen size
  - Ensure all thumbnails maintain proper aspect ratio

- **Implement VideoThumbnail component**
  - Create rounded rectangle containers with consistent dimensions
  - Implement subtle scale transform on hover using Tailwind classes
  - Configure videos to be muted in grid view
  - Add click handler to trigger navigation to sprite page
  - Apply React.memo to prevent unnecessary re-renders

## 4. Individual Sprite Pages
- **Create VideoFullscreen component**
  - Implement full-screen video player with object-fit: cover
  - Enable sound for fullscreen video playback
  - Create overlay for displaying sprite metadata (title, genre, song, animation methods)
  - Position metadata for optimal readability without obscuring key video content
  - Apply text shadows or background gradients for better text visibility over video

- **Implement useInactivityTimer hook**
  - Create hook that tracks mouse movement and interaction
  - Set 10-second countdown for automatic return to home
  - Make timer completely invisible to user (no visual countdown)
  - Implement reset when user interacts with the page
  - Connect timer to navigation function to return to home

- **Add Navigation component**
  - Create unobtrusive back button that's visible but not distracting
  - Position consistently in all sprite pages (e.g., top-left corner)
  - Implement click handler to return to home grid
  - Style using Tailwind to match minimal aesthetic

## 5. Transitions and Animations
- **Implement view transitions**
  - Create smooth fade or slide transitions between views
  - Use CSS transforms and opacity for better performance
  - Ensure 60fps performance during transitions
  - Implement proper timing and easing for natural feel
  - Test transitions on target hardware to verify smoothness

- **Add interaction animations**
  - Implement subtle scale effect on thumbnail hover
  - Create transition for showing sprite metadata in fullscreen view
  - Add subtle animation for back button hover state
  - Ensure all animations remain smooth on target hardware

## 6. Testing and Optimization
- **Performance testing**
  - Verify all 20 videos can play simultaneously without performance degradation
  - Test memory usage on target hardware (27" iMac)
  - Ensure transitions maintain at least 30fps (ideally 60fps)
  - Monitor for any memory leaks during extended usage

- **Offline functionality**
  - Test running from local filesystem (file:// URL)
  - Verify all videos and assets load correctly offline
  - Ensure all relative paths work properly in filesystem context
  - Verify application works properly after system sleep/wake cycles

- **Final verification**
  - Validate against all requirements in REQUIREMENTS.md
  - Test on actual target device in Chrome kiosk mode
  - Verify inactivity timer works correctly
  - Ensure audio plays only in fullscreen view