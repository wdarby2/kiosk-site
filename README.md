# Motion Study Sprites Kiosk Site

A kiosk site for displaying 20 motion study sprite videos as part of a gallery installation.

## Project Overview

This application is designed to run on a 27" iMac in Chrome kiosk mode, providing an immersive gallery experience for viewing motion study videos. The application runs completely offline from the local filesystem.

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
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk file:///full/path/to/dist/index.html

# Windows
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk file:///C:/path/to/dist/index.html
```

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
    /VideoThumbnail   # Grid item component
    /VideoFullscreen  # Individual sprite page component
    /Grid            # Home page grid layout
    /Navigation      # Back button + inactivity timer
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

## Requirements

See `artifacts/REQUIREMENTS.MD` for detailed project requirements.

## License

ISC License