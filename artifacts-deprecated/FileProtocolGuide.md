# File Protocol (file://) Implementation Guide

## Purpose
This guide addresses the specific requirements and constraints for building a web application that will run directly from the filesystem using the `file://` protocol, without a web server.

## Key Constraints of the file:// Protocol

1. **Path Resolution Differences**
   - Absolute URLs (starting with '/') don't work with file:// protocol
   - Web-specific import methods like `import.meta.url` don't work as expected
   - Dynamic imports may not resolve correctly with filesystem paths

2. **Security Restrictions**
   - Stricter security model than HTTP/HTTPS
   - Some browser APIs may be restricted
   - Cross-origin requests don't apply but have different limitations

3. **Asset Handling**
   - Assets must be referenced with relative paths
   - All paths must be filesystem compatible

## Implementation Guidelines

### Project Configuration

#### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to ensure videos are properly copied
function ensureVideoAssets() {
  return {
    name: 'ensure-video-assets',
    closeBundle() {
      // Copy videos with predictable names
      const srcDir = resolve(__dirname, 'src/assets/videos');
      const destDir = resolve(__dirname, 'dist/assets/videos');
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      const videos = fs.readdirSync(srcDir);
      for (const video of videos) {
        if (video.endsWith('.mp4')) {
          fs.copyFileSync(
            resolve(srcDir, video),
            resolve(destDir, video)
          );
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    ensureVideoAssets()
  ],
  // Critical: Use relative paths for all assets
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Disable asset hashing to ensure predictable paths
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Prevent filename hashing
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
```

### Asset Loading Approach

#### Video Utility (DO NOT USE)
```typescript
// ❌ WRONG APPROACH - Won't work with file:// protocol
export const getVideoPath = (filename: string): string => {
  return new URL(`../assets/videos/${filename}`, import.meta.url).href;
};
```

#### Video Utility (CORRECT)
```typescript
// ✅ CORRECT APPROACH - Works with file:// protocol
export const getVideoPath = (filename: string): string => {
  // Simple relative path - compatible with file:// protocol
  return `./assets/videos/${filename}`;
};
```

### Project Structure for file:// Protocol

```
/dist               # Built files that will be accessed via file:// protocol
  /assets
    /videos         # Video files with original filenames preserved
    /js             # JavaScript files
    /css            # CSS files
  index.html        # Entry point opened directly in browser
```

### HTML Output Considerations

The HTML file must use relative paths for all resources:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Motion Study Sprites</title>
    <!-- Note the relative path with ./ -->
    <script type="module" src="./assets/index.js"></script>
    <link rel="stylesheet" href="./assets/index.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Testing with file:// Protocol

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Test Directly from Filesystem**
   - Navigate to the dist directory in your file explorer
   - Double-click on index.html to open it in Chrome
   - Verify that all assets load correctly with the file:// protocol

3. **Chrome Kiosk Mode Testing**
   - Launch Chrome with the following command:
   ```bash
   # On macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk file:///path/to/dist/index.html
   ```

## Common Issues and Solutions

### Problem: Videos don't load in file:// context
**Solution**: Ensure videos are referenced with relative paths starting with `./` not `/` or absolute URLs.

### Problem: Assets have hashed filenames that change on each build
**Solution**: Configure Vite to disable asset hashing as shown in the configuration example.

### Problem: Build process doesn't copy videos correctly
**Solution**: Use a custom Vite plugin to explicitly copy videos with their original filenames.

### Problem: JavaScript modules don't load
**Solution**: Ensure all imports in HTML use relative paths with `./` prefix.

## Validation Checklist

Before completing any implementation step, verify:

- [ ] All asset references use relative paths starting with `./`
- [ ] Build configuration preserves original filenames
- [ ] CSS and JavaScript are loaded correctly via file:// protocol 
- [ ] Videos play correctly when accessed via file:// protocol
- [ ] No web-specific APIs that don't work with file:// are used

By following these guidelines, the application will run correctly from the local filesystem using the file:// protocol as required.