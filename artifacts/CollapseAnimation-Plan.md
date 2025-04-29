# Sprite Collapse Animation Implementation Plan (Revised)

## Overview
Create a visually appealing animation where a fullscreen video appears to collapse back to its thumbnail position in the grid when navigating from sprite page to home page.

## Implementation Strategy
After encountering issues with our initial approach, we're revising to use a simpler, more reliable method.

## Revised Implementation Steps

### 1. Track Thumbnail Position
- Modify `Grid` component to record the position and dimensions of each thumbnail
- Store this information in App state when a thumbnail is selected
- Pass this position data through to the sprite page

### 2. Create Screenshot-Based Animation
- Instead of trying to animate an actual playing video:
  - Create a new `SnapshotTransition` component that renders a static element
  - Use a div with a background image capturing the final frame of the video
  - This avoids complex video synchronization issues and React hook problems

### 3. Simplify Page Transition
- Create a clear separation between:
  1. Animation phase - showing the snapshot transitioning
  2. Page change phase - occurs after animation completes
- Avoid manipulating multiple pieces of state simultaneously

### 4. Coordinate Animation Timing
- Complete the animation before changing pages
- Use callbacks rather than multiple timers to ensure proper sequence
- Avoid race conditions in state updates

## Technical Approach (Revised)

### Position Tracking
Still need to track:
- `x` and `y` coordinates of the original thumbnail
- `width` and `height` of the thumbnail
- `index` in the grid for animation timing

### Simplified Animation Technique
1. When user clicks "Back":
   - Create a static snapshot div positioned over the video
   - Make the actual video invisible (but keep it in DOM)
   - Animate the snapshot from full screen to thumbnail position
   - Only after animation completes, change the page

### Advantages of This Approach
- Fewer React hooks and simpler component structure
- No need to maintain video playback during transition
- Cleaner separation between animation and page navigation
- Better browser performance (static elements vs. video)
- Less prone to timing/race condition issues

## Implementation Order
1. Position tracking in Grid component
2. Create simplified SnapshotTransition component  
3. Update App state management for cleaner transitions
4. Refine animation timing and performance

## Key Success Criteria
- Smooth animation without flickering
- No React hooks errors
- Reliable performance across browsers
- Clear visual connection between fullscreen and thumbnail