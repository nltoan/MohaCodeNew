import { useState, useEffect } from 'react';

// Change "const" to "export const"
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth, // Initialize with actual values to avoid undefined on first render
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    // No need to call handleResize() here if you initialize state with window.innerHeight
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};