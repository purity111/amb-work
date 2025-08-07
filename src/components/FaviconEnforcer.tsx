
import { useEffect } from 'react';

export default function FaviconEnforcer() {
  useEffect(() => {
    // Force favicon to load immediately on client side
    const enforceFavicon = () => {
      // Remove any existing favicon links that are temporary
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href?.includes('data:image/svg+xml') || href?.includes('vercel')) {
          link.remove();
        }
      });

      // Check if our favicon already exists
      const existingFavicon = document.querySelector('link[href="/favicon.ico"]');
      const existingPng = document.querySelector('link[href="/favicon-32x32.png"]');

      // Add favicon.ico if it doesn't exist
      if (!existingFavicon) {
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = 'image/x-icon';
        faviconLink.href = '/favicon.ico';
        document.head.appendChild(faviconLink);
      }

      // Add PNG favicon if it doesn't exist
      if (!existingPng) {
        const pngLink = document.createElement('link');
        pngLink.rel = 'icon';
        pngLink.type = 'image/png';
        pngLink.sizes = '32x32';
        pngLink.href = '/favicon-32x32.png';
        document.head.appendChild(pngLink);
      }

      // Also add high-DPI favicon
      const existingHighDpi = document.querySelector('link[href="/favicon-180x180.png"]');
      if (!existingHighDpi) {
        const highDpiLink = document.createElement('link');
        highDpiLink.rel = 'icon';
        highDpiLink.type = 'image/png';
        highDpiLink.sizes = '180x180';
        highDpiLink.href = '/favicon-180x180.png';
        document.head.appendChild(highDpiLink);
      }
    };

    // Execute immediately
    enforceFavicon();

    // Also execute after a short delay to ensure it takes effect
    const timer = setTimeout(enforceFavicon, 100);

    // Execute again after navigation events
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        enforceFavicon();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}

