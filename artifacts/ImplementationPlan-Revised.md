# Revised Implementation Plan: Motion Study Sprites Kiosk Site

## How to Use This Plan

This document outlines the step-by-step implementation approach for the Motion Study Sprites Kiosk Site, revised to prioritize offline functionality with the file:// protocol. To ensure quality and alignment with requirements:

1. **File Protocol First**: We will design all functionality with local filesystem (file://) compatibility as our primary constraint.
2. **Sequential Implementation with Testing**: Each step will include testing via the file:// protocol before proceeding.
3. **User Feedback**: After each step is completed, we will seek feedback before moving to the next step.
4. **Validation**: Each component will be tested individually to ensure it meets requirements.

**Important**: Do not proceed to a new step until the current step has been reviewed and approved.

## 0. Project Setup & File Protocol Validation (NEW PREREQUISITE STEP)

- **Configure Vite for File Protocol Access**
  - Set base path to './' in vite.config.ts to ensure relative paths
  - Disable asset filename hashing to maintain predictable paths
  - Create custom plugin to handle video asset copying with consistent paths
  - Test build output by opening index.html directly via file:// protocol

- **Implement Asset Loading Proof of Concept**
  - Create simple test page that loads a single video via file:// protocol
  - Validate that video playback works from filesystem
  - Document the working approach for asset references
  - Establish correct path patterns for all resources

## 1. Core Video Functionality

- **Implement Simple Video Asset Utilities**
  - Create helper functions that use simple relative paths (`./assets/videos/filename.mp4`)
  - Avoid URL constructors, import.meta.url, or dynamic imports which don't work with file protocol
  - Implement filesystem-compatible approach to video loading
  - Test video loading with file:// protocol directly

- **Implement `useVideoPlayback` hook**
  - Create hook that configures videos with: autoplay, loop, playsInline
  - Handle mute/unmute toggling (muted in grid, sound enabled in fullscreen)
  - Add play/pause/reset methods for controlling video state
  - Add reference tracking for proper cleanup of video resources
  - Test all functionality via both development server AND file:// protocol

- **Implement Error Handling**
  - Create video loading error fallback with black background + title text
  - Add improved logging for debugging file protocol issues
  - Implement fallbacks for missing video files
  - Test error conditions when running from filesystem

## 2. Navigation State Management

- **Implement App-level state**
  - Use React useState to track current view (home/sprite) and active sprite ID
  - Create navigation functions: viewSprite(id) and returnToHome()
  - Store entire sprite metadata in state to prevent any file access issues
  - Pre-load necessary data to avoid filesystem access issues during navigation
  - Test with simulated navigations to ensure state transitions work with filesystem access

- **Validate Build Output**
  - Build application and test navigation via file:// protocol
  - Verify that state changes work without any server-dependent code
  - Ensure all assets are properly accessible with filesystem paths
  - Document any observed differences between dev server and file:// protocol behavior

## 3. Home Grid Layout

- **Create Grid component**
  - Implement using CSS Grid with fixed 4×5 layout 
  - Calculate exact dimensions to fit all videos on screen without scrolling
  - Use viewport units (vh/vw) to ensure grid fills available space perfectly
  - Add appropriate gaps between grid items using fixed percentage of screen size
  - Ensure all thumbnails maintain proper aspect ratio
  - Test grid layout directly via file:// URL to ensure it renders correctly

- **Implement VideoThumbnail component**
  - Create rounded rectangle containers with consistent dimensions
  - Implement subtle scale transform on hover using direct CSS (avoid Tailwind complexity)
  - Configure videos to be muted in grid view
  - Add click handler to trigger navigation to sprite page
  - Apply React.memo to prevent unnecessary re-renders
  - Test video loading in grid via file:// protocol
  - Verify that all 20 videos load and play when accessed via file://

## 4. Individual Sprite Pages

- **Create VideoFullscreen component**
  - Implement full-screen video player with object-fit: cover
  - Enable sound for fullscreen video playback
  - Create overlay for displaying sprite metadata (title, genre, song, animation methods)
  - Position metadata for optimal readability without obscuring key video content
  - Apply text shadows or background gradients for better text visibility over video
  - Test individual sprite page access directly via file:// protocol

- **Implement useInactivityTimer hook**
  - Create hook that tracks mouse movement and interaction
  - Set 10-second countdown for automatic return to home
  - Make timer completely invisible to user (no visual countdown)
  - Implement reset when user interacts with the page
  - Connect timer to navigation function to return to home
  - Ensure timer works correctly in file:// protocol context

- **Add Navigation component**
  - Create unobtrusive back button that's visible but not distracting
  - Position consistently in all sprite pages (e.g., top-left corner)
  - Implement click handler to return to home grid
  - Style using simple CSS to match minimal aesthetic
  - Test navigation using file:// protocol

## 5. Transitions and Animations

- **Implement view transitions**
  - Create smooth fade or slide transitions between views
  - Use CSS transforms and opacity for better performance
  - Ensure 60fps performance during transitions
  - Implement proper timing and easing for natural feel
  - Test all transitions when running from file:// protocol
  - Validate that animations work without any web-specific APIs

- **Add interaction animations**
  - Implement subtle scale effect on thumbnail hover
  - Create transition for showing sprite metadata in fullscreen view
  - Add subtle animation for back button hover state
  - Ensure all animations work correctly via file:// protocol
  - Test animations in Chrome kiosk mode if possible

## 6. Testing and Optimization

- **Performance testing**
  - Test memory usage with all 20 videos playing simultaneously
  - Verify smooth performance when running from filesystem
  - Optimize video loading for filesystem access 
  - Measure and optimize memory usage
  - Test on target hardware (27" iMac) via file:// protocol

- **File Protocol Specific Optimizations**
  - Implement any necessary optimizations for file:// protocol limitations
  - Ensure all paths and asset references are compatible with filesystem access
  - Test for any security restrictions that might affect functionality
  - Create fallbacks for any features that might not work with file:// protocol

- **Final verification**
  - Validate against all requirements in REQUIREMENTS.md
  - Test on actual target device in Chrome kiosk mode using file:// protocol
  - Verify inactivity timer works correctly in filesystem context
  - Ensure audio plays only in fullscreen view
  - Document any special considerations for file:// protocol deployment

## Key Differences in This Revised Plan:

1. **Added Step 0**: Focuses on file:// protocol compatibility from the start
2. **Testing with file:// protocol** at every stage of development
3. **Simplified asset loading** approach to work with filesystem
4. **Avoid web-specific technologies** that don't work well with file://
5. **Continuous validation** of the build output with filesystem access
6. **File protocol validation checkpoints** added to every step