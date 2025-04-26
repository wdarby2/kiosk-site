# Project Progress Log

## Initial Setup (Current Phase)

### Architecture Design
Created a structured file organization to support a video-heavy single-page application for a gallery kiosk installation.

Key considerations:
- Efficient video loading and playback
- Clear separation of components for maintainability
- Support for smooth transitions between views
- Proper organization of assets and metadata

### File Structure
```
/src
  /assets
    /videos       # Store all video files
    /metadata     # JSON files with sprite metadata
  /components
    /VideoThumbnail   # Grid item component with video playback
    /VideoFullscreen  # Individual sprite page component
    /Grid            # Home page grid layout
    /Navigation      # Back button + inactivity timer logic
  /hooks
    useVideoPlayback.ts  # Video configuration hook
    useInactivityTimer.ts # For 10-second redirect
  /pages
    Home.tsx        # Grid container
    SpritePage.tsx  # Individual video view
  /types           # TypeScript interfaces
  /utils           # Helper functions
  App.tsx          # Main application with routing
  index.tsx        # Entry point
```

This structure accommodates all the requirements including:
- Video playback for 20 thumbnails and fullscreen views
- Smooth transitions between home and individual sprite pages
- Clear organization of video assets and metadata
- Support for TypeScript and React components as required

### Video Specifications
We've analyzed the video files to ensure they meet our requirements:

- **Format**: MP4 (ISO Media, MP4 v2)
- **Codec**: H.264 (widely supported in all browsers)
- **Resolution**: 1280x720 (720p)
- **Framerate**: ~30fps (30000/1001)
- **Bitrate**: ~1.4 Mbps
- **Duration**: ~18 seconds

These specifications are well-suited for our kiosk application:
- H.264 ensures compatibility across browsers
- 720p resolution is sufficient for thumbnails and scales well for fullscreen view
- The moderate bitrate allows for multiple simultaneous video playback
- The video files are properly formatted for web playback

### Metadata Format
We've created a structured JSON format for sprite metadata:

```json
{
  "sprites": [
    {
      "id": 1,
      "filename": "sprite1.mp4",
      "title": "Motion Study 1",
      "genre": "Electronic",
      "songTitle": "Digital Waves",
      "animationMethods": "After Effects, Cinema 4D"
    }
  ]
}
```

Advantages of this format:
- **Simple structure**: Easy to maintain and update
- **Complete data**: Contains all required information (title, genre, song title, animation methods)
- **Typing-friendly**: Created TypeScript interfaces to match this structure
- **Centralized**: Single source of truth for all sprite information

Corresponding TypeScript types:
```typescript
export interface Sprite {
  id: number;
  filename: string;
  title: string;
  genre: string;
  songTitle: string;
  animationMethods: string;
}

export interface SpriteData {
  sprites: Sprite[];
}
```