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
          console.log(`Copied video: ${video}`);
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
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
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
  },
  server: {
    open: true
  }
});