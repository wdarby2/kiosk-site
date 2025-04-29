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
- H.264 ensures compatibility across browsers and local playback
- 720p resolution is sufficient for thumbnails and scales well for fullscreen view
- The moderate bitrate allows for multiple simultaneous video playback
- The video files are properly formatted for local filesystem playback

**Important File Protocol Consideration**: Since the application will run from the local filesystem using the file:// protocol, all video references must use relative paths (e.g., './assets/videos/sprite1.mp4'). A custom file copying solution will be implemented to ensure videos are predictably located and accessible when running from the filesystem.

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

The metadata file has been populated with all 20 sprite entries, following this structure for each video. Each sprite has a unique ID (1-20) that corresponds to its filename.

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

### Required Packages
Based on the project requirements, we need to install the following packages:

#### Core Framework
- **vite**: Fast build tool and development server
- **react**: UI library for component-based development
- **react-dom**: React rendering for web browsers
- **typescript**: Static type checking

#### Styling
- **tailwindcss**: Utility-first CSS framework
- **postcss**: Tool for transforming CSS with JavaScript
- **autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes

#### Type Definitions
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM

#### State Management
- No external libraries needed; React's built-in hooks (useState, useContext) will be sufficient

#### Routing
- No external routing library needed; we'll implement simple view switching with React state

All assets will be local, eliminating the need for fetching libraries or external asset management.

### Project Configuration

We've set up the following configuration files:

#### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to ensure proper video file handling for file:// protocol
function ensureVideosPlugin() {
  return {
    name: 'ensure-videos-plugin',
    closeBundle() {
      // Copy videos with their original filenames to maintain predictable paths
      const srcDir = resolve(__dirname, 'src/assets/videos');
      const outDir = resolve(__dirname, 'dist/assets/videos');
      
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      fs.readdirSync(srcDir).forEach(file => {
        if (file.endsWith('.mp4')) {
          fs.copyFileSync(
            resolve(srcDir, file),
            resolve(outDir, file)
          );
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    ensureVideosPlugin() // Add our custom plugin
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Critical: Use relative paths for file:// protocol compatibility
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Prevent filename hashing to ensure predictable paths for file:// protocol
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  server: {
    open: true
  }
});
```

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### PostCSS Configuration (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### HTML Entry Point (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Motion Study Sprites</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- 
      Important: Use relative module path for file:// protocol compatibility
      This will be transformed by Vite to use the correct path in the build
     -->
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

#### Output HTML after build (for file:// protocol)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Motion Study Sprites</title>
    <!-- Note the relative paths with ./ prefix for file:// protocol compatibility -->
    <script type="module" crossorigin src="./assets/index.js"></script>
    <link rel="stylesheet" href="./assets/index.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### CSS with Tailwind Imports (`src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Additional custom styles can go here */
body {
  @apply bg-black text-white m-0 p-0 overflow-hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
```

#### Application Structure
- Created React application entry point (`index.tsx`)
- Implemented main App component with simple state-based navigation
- Set up core application structure with type-safe component props