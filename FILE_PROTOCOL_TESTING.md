# File Protocol Testing Guide

This document outlines how to test the Motion Study Sprites Kiosk Site using the file:// protocol to ensure it works correctly in its intended deployment environment.

## Testing the Proof of Concept

The first step in our implementation is to validate that our approach works with the file:// protocol. We've created a proof-of-concept component that tests both direct video tag and JavaScript-created video loading.

### Building and Testing

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test from filesystem:**
   - Navigate to the `dist` directory in your file explorer
   - Double-click on `index.html` to open it in Chrome
   
3. **Verify successful operation:**
   - The page should display "File Protocol Video Playback Test"
   - You should see "Current protocol: file:"
   - Both videos should load and play automatically
   - Both video tests should show "✅ Video loaded successfully"
   
4. **Check browser console:**
   - Open Chrome DevTools (F12 or Cmd+Opt+I)
   - Look for any errors or warnings
   - You should see the protocol, document URL, and video path logged

## Visual Testing Evidence

When testing, capture the following information for validation:

1. **Browser URL bar** - Should show a `file://` URL
2. **Protocol info section** - Should indicate running on file:// protocol
3. **Video playback status** - Both videos should play successfully
4. **Browser console** - Should show no errors related to file loading

## Common Issues and Solutions

### Videos don't load

**Possible causes:**
- Incorrect path format (should start with `./`)
- Videos not correctly copied to the dist/assets/videos directory
- Browser security settings blocking local file access

**Solutions:**
- Verify that video paths use the `./assets/videos/filename.mp4` format
- Check that videos exist in the dist/assets/videos directory
- Try opening Chrome with less restrictive local file settings

### CSS or JavaScript doesn't load

**Possible causes:**
- Incorrect paths in the built index.html
- Asset hashing causing unpredictable filenames

**Solutions:**
- Verify that the index.html references scripts and styles with `./` paths
- Confirm that Vite's asset hashing is disabled in the configuration

### Wrong Content Appears

**Possible causes:**
- Viewing an outdated build
- Cached resources from previous builds

**Solutions:**
- Ensure you're opening the latest build
- Clear browser cache or use incognito mode

## Testing on Target Hardware

Once the proof of concept works on your development machine, test on the target 27" iMac:

1. Copy the entire `dist` directory to the iMac
2. Open the index.html file directly in Chrome
3. Test in Chrome kiosk mode:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk file:///path/to/dist/index.html
   ```

## Validating the Full Implementation

As the project progresses through the implementation steps, use this same testing approach for each new feature:

1. Build the application
2. Test by opening directly from the filesystem
3. Verify all functionality works correctly
4. Check browser console for errors
5. Document any issues

Remember: The application must work flawlessly via the file:// protocol, as this is a critical requirement for the project.