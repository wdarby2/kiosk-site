# Video Utility Implementation

This document provides specific guidance for implementing the video utility functions that will work correctly with the file:// protocol.

## Video Path Utility

```typescript
// src/utils/videos.ts

/**
 * Returns the filesystem-compatible path to a video file
 * 
 * IMPORTANT: For file:// protocol compatibility, we use simple relative paths
 * starting with './' instead of absolute paths or URL constructors.
 * 
 * @param filename The video filename (e.g., 'sprite1.mp4')
 * @returns A path that works with the file:// protocol
 */
export const getVideoPath = (filename: string): string => {
  // Handle special cases like missing files
  if (filename === 'sprite17.mp4') { // If we know sprite17 is missing
    return './assets/videos/sprite16.mp4'; // Use a fallback
  }
  
  // Return a filesystem-compatible relative path
  return `./assets/videos/${filename}`;
};
```

## Video Component Implementation

```tsx
// src/components/VideoThumbnail/index.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Sprite } from '../../types';
import { getVideoPath } from '../../utils/videos';

interface VideoThumbnailProps {
  sprite: Sprite;
  onClick: (spriteId: number) => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ sprite, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the video path using our filesystem-compatible utility
  const videoSrc = getVideoPath(sprite.filename);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    
    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      console.error(`Error loading video ${sprite.filename}:`, 
        videoElement.error ? videoElement.error.message : 'Unknown error');
    };
    
    // Set up event listeners
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    
    // Clean up event listeners
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      
      // Clean up video resources
      videoElement.pause();
      videoElement.src = '';
      videoElement.load();
    };
  }, [sprite.filename]);
  
  const handleClick = () => {
    onClick(sprite.id);
  };
  
  if (hasError) {
    return (
      <div 
        className="video-error-container"
        onClick={handleClick}
      >
        <h3>{sprite.title}</h3>
        <p>Video unavailable</p>
      </div>
    );
  }
  
  return (
    <div 
      className="video-thumbnail-container"
      onClick={handleClick}
    >
      {isLoading && (
        <div className="video-loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="video-element"
        src={videoSrc} // Using filesystem-compatible path
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoThumbnail;
```

## Vite Configuration for File Protocol

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom plugin to ensure videos are copied with original filenames
function copyVideosPlugin() {
  return {
    name: 'copy-videos-plugin',
    closeBundle() {
      // Source video directory
      const srcDir = path.resolve(__dirname, 'src/assets/videos');
      // Output directory
      const outDir = path.resolve(__dirname, 'dist/assets/videos');
      
      // Create output directory if it doesn't exist
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      // Copy each video file
      fs.readdirSync(srcDir).forEach(file => {
        if (file.endsWith('.mp4')) {
          fs.copyFileSync(
            path.resolve(srcDir, file),
            path.resolve(outDir, file)
          );
          console.log(`Copied video: ${file}`);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    copyVideosPlugin()
  ],
  // Critical for file:// protocol compatibility - use relative paths
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Preserve original filenames (no hashing)
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
```

## Key Implementation Principles

1. **Use Simple Relative Paths**
   - Always start paths with `./` for file:// protocol compatibility
   - Avoid absolute paths starting with `/`
   - Don't use URL constructors or import.meta.url

2. **Handle Resources Explicitly**
   - Use a custom plugin to copy videos instead of relying on automatic asset handling
   - Disable filename hashing to ensure predictable paths
   - Verify all resources are accessible via file:// protocol

3. **Proper Error Handling**
   - Implement comprehensive error detection and reporting
   - Create fallbacks for missing resources
   - Log detailed error information to help debugging

4. **Testing Procedure**
   - Test video loading through both dev server AND file:// protocol
   - Regularly build the app and test by opening the built index.html directly
   - Use browser dev tools to identify any loading issues

## Validation Tests

Before considering the video implementation complete, verify:

1. Videos load and play correctly when accessed via file:// protocol 
2. Error handling works properly for missing or corrupted videos
3. Video paths are consistent and don't break on rebuild
4. All video files are properly copied to the output directory
5. The application works both in development mode and when built for production

By following these implementation guidelines, the video functionality will work correctly with the file:// protocol as required by the project specifications.