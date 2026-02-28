// Performance optimization utilities for smooth animations

export const animationConfig = {
  // Reduced motion detection
  useReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Optimized spring configurations
  gentleSpring: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1
  },

  smoothSpring: {
    type: "spring", 
    stiffness: 300,
    damping: 30,
    mass: 1
  },

  // Optimized transition configurations
  fastTransition: {
    duration: 0.2,
    ease: "easeOut"
  },

  smoothTransition: {
    duration: 0.3,
    ease: "easeInOut"
  },

  // GPU acceleration hints
  gpuAccelerate: {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)'
  },

  // Throttled scroll handler
  createThrottledScrollHandler: (callback, delay = 16) => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };
  },

  // Intersection Observer for lazy animations
  createIntersectionObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
  },

  // Performance monitoring
  measureFPS: () => {
    let fps = 0;
    let lastTime = performance.now();
    let frames = 0;
    
    const countFPS = (currentTime) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFPS);
    };
    
    requestAnimationFrame(countFPS);
    return fps;
  }
};

export default animationConfig;
