# File Protocol Proof of Concept

This document outlines a minimal proof of concept for loading videos via the file:// protocol, which should be implemented before proceeding with the full application.

## Step 1: Create Minimal Structure

```
/poc
  /assets
    /videos
      sprite1.mp4    # Copy one video file here
  index.html         # Simple HTML file
  script.js          # Basic JavaScript
  style.css          # Minimal styling
```

## Step 2: Create HTML File

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Protocol Video Test</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="container">
    <h1>Video Playback Test (file:// protocol)</h1>
    
    <div class="video-container">
      <h2>Direct Video Tag</h2>
      <video
        id="direct-video"
        src="./assets/videos/sprite1.mp4"
        controls
        autoplay
        muted
        loop
        width="320"
      ></video>
      <div id="direct-status">Loading...</div>
    </div>
    
    <div class="video-container">
      <h2>JavaScript-Created Video</h2>
      <div id="js-video-container"></div>
      <div id="js-status">Loading...</div>
    </div>
  </div>
  
  <script src="./script.js"></script>
</body>
</html>
```

## Step 3: Create JavaScript

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Test direct video tag
  const directVideo = document.getElementById('direct-video');
  const directStatus = document.getElementById('direct-status');
  
  directVideo.addEventListener('canplay', () => {
    directStatus.textContent = '✅ Direct video loaded successfully';
    directStatus.className = 'success';
  });
  
  directVideo.addEventListener('error', (e) => {
    directStatus.textContent = '❌ Error loading direct video: ' + (directVideo.error ? directVideo.error.message : 'Unknown error');
    directStatus.className = 'error';
    console.error('Direct video error:', directVideo.error);
  });
  
  // Test JavaScript-created video
  const jsContainer = document.getElementById('js-video-container');
  const jsStatus = document.getElementById('js-status');
  
  try {
    // Create video element via JavaScript
    const jsVideo = document.createElement('video');
    jsVideo.src = './assets/videos/sprite1.mp4'; // Key test: correct path format
    jsVideo.width = 320;
    jsVideo.autoplay = true;
    jsVideo.muted = true;
    jsVideo.loop = true;
    jsVideo.controls = true;
    
    jsVideo.addEventListener('canplay', () => {
      jsStatus.textContent = '✅ JavaScript video loaded successfully';
      jsStatus.className = 'success';
    });
    
    jsVideo.addEventListener('error', (e) => {
      jsStatus.textContent = '❌ Error loading JavaScript video: ' + (jsVideo.error ? jsVideo.error.message : 'Unknown error');
      jsStatus.className = 'error';
      console.error('JS video error:', jsVideo.error);
    });
    
    jsContainer.appendChild(jsVideo);
  } catch (err) {
    jsStatus.textContent = '❌ Error creating JavaScript video: ' + err.message;
    jsStatus.className = 'error';
    console.error('JS creation error:', err);
  }
  
  // Log environment information
  console.log('Document URL:', document.URL);
  console.log('Protocol:', window.location.protocol);
  console.log('Is file protocol:', window.location.protocol === 'file:');
});
```

## Step 4: Add Simple Styling

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.container {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
}

.video-container {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

h1 {
  color: #333;
}

h2 {
  color: #555;
}
```

## Step 5: Testing Procedure

1. Create the files and directory structure as outlined above
2. Copy one video file (e.g., sprite1.mp4) to the assets/videos directory
3. Open the index.html file directly in Chrome using the file:// protocol:
   - Double-click the file in your file explorer, or
   - Drag it into a Chrome window
4. Verify that both videos load and play correctly
5. Check the browser console for any errors
6. Document the results, especially noting the correct path format

## What This Validates

1. **Proper Path Structure**: Confirms the correct format for paths when using file:// protocol
2. **Video Loading**: Validates that videos can be loaded from the filesystem
3. **JavaScript Integration**: Ensures JavaScript can dynamically create and manipulate videos
4. **Error Handling**: Tests error detection and reporting

## Converting to Production Code

After confirming that the proof of concept works:

1. Extract the successful path format into a utility function:
   ```javascript
   export const getVideoPath = (filename) => {
     return `./assets/videos/${filename}`;
   };
   ```

2. Ensure the Vite build configuration preserves file paths and avoids hashing:
   ```javascript
   build: {
     assetsInlineLimit: 0,
     rollupOptions: {
       output: {
         assetFileNames: 'assets/[name][extname]',
       }
     }
   }
   ```

3. Apply the same path approach to all assets in the main application

## Key Takeaways

- For file:// protocol, all paths must be relative starting with `./`
- Direct video embedding and JavaScript creation should both work if paths are correct
- Video playback APIs work the same as with HTTP/HTTPS, but path resolution is different
- Before building the full application, confirm this basic approach works properly