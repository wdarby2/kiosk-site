import { useRef, useState, useEffect, useCallback } from 'react';
import { getVideoPath } from '../utils';

export interface VideoPlaybackState {
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
}

export interface VideoPlaybackControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  seek: (time: number) => void;
}

export interface UseVideoPlaybackOptions {
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  onPlay?: () => void;
  onPause?: () => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  forceProtocolCheck?: boolean;
}

export const useVideoPlayback = (
  filename: string,
  options: UseVideoPlaybackOptions = {}
): [React.RefObject<HTMLVideoElement>, VideoPlaybackState, VideoPlaybackControls] => {
  const {
    autoPlay = false,
    loop = true,
    muted = true,
    playsInline = true,
    controls = true,
    preload = 'auto',
    onPlay,
    onPause,
    onLoadStart,
    onCanPlay,
    onError,
    onEnded,
    forceProtocolCheck = true,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Create state to track video playback
  const [state, setState] = useState<VideoPlaybackState>({
    isPlaying: false,
    isMuted: muted,
    isLoaded: false,
    hasError: false,
    currentTime: 0,
    duration: 0,
  });

  // Generate the video path using our utility function
  const videoPath = getVideoPath(filename, forceProtocolCheck);

  // Set the video source when the ref is available
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      console.log(`Setting video src for ${filename} to: ${videoPath}`);
      // Reset the video element
      video.pause();
      video.removeAttribute('src'); // Empty source
      video.load(); // Reset the video element
      
      // Set the new source
      video.src = videoPath;
      
      // Load the new video
      video.load();
    }
  }, [videoPath, filename]);

  // Play control
  const play = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      // Using Promise to handle autoplay restrictions
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setState(prev => ({ ...prev, isPlaying: true }));
            onPlay?.();
          })
          .catch((error) => {
            console.error('Error attempting to play video:', error);
            // Often this is due to autoplay restrictions
            // In this case, we should leave the video paused
            setState(prev => ({ ...prev, isPlaying: false }));
          });
      }
    }
  }, [onPlay]);

  // Pause control
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      onPause?.();
    }
  }, [onPause]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        play();
      } else {
        pause();
      }
    }
  }, [play, pause]);

  // Reset to beginning
  const reset = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setState(prev => ({ ...prev, currentTime: 0 }));
      play();
    }
  }, [play]);

  // Mute control
  const mute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      setState(prev => ({ ...prev, isMuted: true }));
    }
  }, []);

  // Unmute control
  const unmute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setState(prev => ({ ...prev, isMuted: false }));
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setState(prev => ({ ...prev, isMuted: video.muted }));
    }
  }, []);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Event handlers
    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
      onPlay?.();
    };
    
    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onPause?.();
    };
    
    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoaded: false }));
      onLoadStart?.();
    };
    
    const handleCanPlay = () => {
      setState(prev => ({ 
        ...prev, 
        isLoaded: true, 
        hasError: false,
        duration: video.duration 
      }));
      onCanPlay?.();
      
      // If autoPlay is true, start playing once video can play
      if (autoPlay && video.paused) {
        play();
      }
    };
    
    const handleError = (error: any) => {
      console.error('Video error:', error);
      setState(prev => ({ ...prev, hasError: true }));
      onError?.(error);
    };
    
    const handleTimeUpdate = () => {
      setState(prev => ({ 
        ...prev, 
        currentTime: video.currentTime 
      }));
    };
    
    const handleEnded = () => {
      if (!loop) {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
      onEnded?.();
    };
    
    const handleVolumeChange = () => {
      setState(prev => ({ ...prev, isMuted: video.muted }));
    };
    
    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);
    
    // Clean up
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [autoPlay, loop, onCanPlay, onEnded, onError, onLoadStart, onPause, onPlay, play]);

  // Ensure unmounting pauses and resets
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, []);

  // Return the ref, state, and controls
  return [
    videoRef, 
    state, 
    {
      play,
      pause,
      toggle,
      reset,
      mute,
      unmute,
      toggleMute,
      seek,
    }
  ];
};

export default useVideoPlayback;