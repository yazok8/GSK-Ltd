import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0 });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}