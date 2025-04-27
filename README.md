# Motion Study Sprites Kiosk Site

A kiosk site for displaying 20 motion study sprite videos as part of a gallery installation.

## Project Overview

This application is designed to run on a 27" iMac in Chrome kiosk mode, providing an immersive gallery experience for viewing motion study videos. The application runs completely offline from the local filesystem using the `file://` protocol.

## Current Implementation Status

**Step 0: Project Setup & File Protocol Validation (COMPLETED)**

- ✅ Configured Vite for File Protocol Access
  - Set base path to './' in vite.config.ts to ensure relative paths
  - Disabled asset filename hashing to maintain predictable paths
  - Created custom plugin to handle video asset copying with consistent paths
  
- ✅ Implemented Asset Loading Proof of Concept
  - Created test page that loads videos via file:// protocol
  - Validated that video playback works from filesystem
  - Implemented correct path patterns for all resources
  - Testing both direct video tag and JavaScript-created video elements

**Completed Steps:**
1. ✅ Project Setup & File Protocol Validation (Step 0)
2. ✅ Core Video Functionality (Step 1)
3. ✅ Navigation State Management (Step 2)
4. ✅ Home Grid Layout (Step 3)

**Next Steps:**
5. Build Individual Sprite Pages (Step 4)
6. Add Transitions and Animations (Step 5)
7. Complete Testing and Optimization (Step 6)

## Key Features

- Grid layout with 4×5 video thumbnails (20 total sprites)
- Fullscreen individual video pages with metadata
- Automatic return to home after 10 seconds of inactivity
- Smooth transitions between views
- Completely offline operation via file:// protocol

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## File Protocol Testing

**IMPORTANT**: This application is designed to run from the local filesystem using the file:// protocol. To test:

1. Build the application:
   ```bash
   npm run build
   ```
2. Navigate to the `/dist` directory in your file browser
3. Open `index.html` directly in Chrome (not via a server)

## File Protocol Implementation Details

Our implementation follows these key principles to ensure file:// protocol compatibility:

1. **Relative Path References**
   - All asset paths start with `./` (never `/` or absolute URLs)
   - Example: `./assets/videos/sprite1.mp4`

2. **Vite Configuration**
   - Base URL set to `./` in vite.config.ts
   - Asset filename hashing disabled for predictable paths
   - Custom plugin that explicitly copies videos to dist folder

3. **Video Loading**
   - Simple utility function that returns filesystem-compatible paths
   - No URL constructors or import.meta.url (which don't work with file://)
   - Both direct video tags and JavaScript-created videos are tested

4. **Testing Methodology**
   - Each feature is verified in both dev server AND via file:// protocol
   - Console logging for debugging file protocol issues
   - Error states for missing files

## Implementation Documentation

This project is implemented according to a detailed plan that ensures proper functionality with the file:// protocol:

- `artifacts/ImplementationPlan-Revised.md`: Detailed step-by-step implementation plan
- `artifacts/FileProtocolGuide.md`: Specific guidance for file:// protocol compatibility
- `artifacts/ProofOfConcept.md`: Simple proof of concept for file:// testing
- `artifacts/VideoUtilityImplementation.md`: Details on video handling implementation
- `artifacts/TestingChecklist.md`: Comprehensive testing steps for file:// protocol

## Running in Chrome Kiosk Mode

To launch in Chrome kiosk mode (for production use):

```bash
# macOS
open -a "Google Chrome" --args --allow-file-access-from-files --kiosk file:///Users/andrew/projects/repos/kiosk-site/dist/index.html

# Windows
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files --kiosk file:///C:/path/to/dist/index.html
```

**IMPORTANT: The `--allow-file-access-from-files` flag is required** to prevent CORS issues when loading files via the file:// protocol. Without this flag, videos and other resources won't load properly in Chrome.

For the final installation on the 27" iMac, you can create a shell script that launches Chrome in kiosk mode with the required flags.

## Building for Production

```bash
npm run build
```

The built files will be in the `/dist` directory, ready to be deployed directly on the target iMac.

## Project Structure

```
/src
  /assets
    /videos       # Store all video files
    /metadata     # JSON files with sprite metadata
  /components
    /ProofOfConcept    # File protocol validation component
    /VideoThumbnail    # Grid item component (upcoming)
    /VideoFullscreen   # Individual sprite page component (upcoming)
    /Grid             # Home page grid layout (upcoming)
    /Navigation       # Back button + inactivity timer (upcoming)
  /hooks
    useVideoPlayback.ts   # Video configuration hook (upcoming)
    useInactivityTimer.ts # For 10-second redirect (upcoming)
  /pages
    Home.tsx        # Grid container (upcoming)
    SpritePage.tsx  # Individual video view (upcoming)
  /types           # TypeScript interfaces
  /utils           # Helper functions with file:// compatible paths
  App.tsx          # Main application component
  index.tsx        # Entry point
```

## Requirements

See `artifacts/REQUIREMENTS.MD` for detailed project requirements.

## License

ISC License