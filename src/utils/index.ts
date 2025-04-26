// Utility functions

/**
 * Returns the filesystem-compatible path to a video file
 * 
 * IMPORTANT: For file:// protocol compatibility, we use simple relative paths
 * starting with './' or '../' instead of absolute paths or URL constructors.
 * 
 * @param filename The video filename (e.g., 'sprite1.mp4')
 * @param forceProtocolCheck Whether to check the protocol and use different paths
 * @returns A path that works with the file:// protocol
 */
export const getVideoPath = (filename: string, forceProtocolCheck: boolean = false): string => {
  // Check if we're running on file:// protocol
  const isFileProtocol = forceProtocolCheck && typeof window !== 'undefined' 
    ? window.location.protocol === 'file:'
    : false;
  
  // Based on testing, these paths work best in different environments
  if (isFileProtocol) {
    // For file:// protocol, these paths have been confirmed to work
    return `./src/assets/videos/${filename}`;
  } else {
    // In development mode or production server, use one of these paths
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment 
      ? `./src/assets/videos/${filename}` 
      : `./assets/videos/${filename}`;
  }
};