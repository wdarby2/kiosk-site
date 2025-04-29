// squircle.js - CSS Houdini Paint Worklet for squircle shapes
// This implements the squircle effect with customizable smoothing

if (typeof registerPaint !== 'undefined') {
  class SquirclePainter {
    static get inputProperties() {
      return ['--squircle-radius', '--squircle-smooth'];
    }

    paint(ctx, size, properties) {
      // Get custom properties with fallbacks
      const radius = parseInt(properties.get('--squircle-radius').toString()) || 10;
      const smoothRatio = parseInt(properties.get('--squircle-smooth').toString()) || 60;
      
      // Calculate smoothing factor (0 to 1, where 0 is a perfect square and 1 is a perfect circle)
      const smoothing = smoothRatio / 100;
      
      const width = size.width;
      const height = size.height;
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Begin a new path
      ctx.beginPath();
      
      // Helper function to draw a squircle
      const drawSquircle = (w, h, r, s) => {
        // The formula for a squircle with variable smoothing
        // When s = 0, it's a square with rounded corners
        // When s = 1, it's a perfect circle
        // Values in between create the "squircle" effect
        
        const handleSize = r * (1 - s);
        
        // Top side
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        
        // Top right corner
        ctx.bezierCurveTo(
          w - handleSize, 0,
          w, handleSize,
          w, r
        );
        
        // Right side
        ctx.lineTo(w, h - r);
        
        // Bottom right corner
        ctx.bezierCurveTo(
          w, h - handleSize,
          w - handleSize, h,
          w - r, h
        );
        
        // Bottom side
        ctx.lineTo(r, h);
        
        // Bottom left corner
        ctx.bezierCurveTo(
          handleSize, h,
          0, h - handleSize,
          0, h - r
        );
        
        // Left side
        ctx.lineTo(0, r);
        
        // Top left corner
        ctx.bezierCurveTo(
          0, handleSize,
          handleSize, 0,
          r, 0
        );
      };
      
      // Draw the squircle shape
      drawSquircle(width, height, radius, smoothing);
      
      // Fill the shape
      ctx.fillStyle = 'black';
      ctx.fill();
    }
  }

  // Register the paint worklet
  registerPaint('squircle', SquirclePainter);
}