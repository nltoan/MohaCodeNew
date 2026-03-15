import { useState, useEffect } from 'react';

export const GlobalFontScaler = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%

  useEffect(() => {
    const bodyStyle = document.body.style;

    if ('zoom' in bodyStyle) {
      // Standard zoom property (Works in Chrome, Edge, Safari in 2026)
      bodyStyle.zoom = zoomLevel.toString();
    } else {
      // Firefox fallback using transform: scale()
      (bodyStyle as any).transform = `scale(${zoomLevel})`;
      (bodyStyle as any).transformOrigin = 'top left';
      (bodyStyle as any).width = `${100 / zoomLevel}%`; // Prevents horizontal overflow
    }
  }, [zoomLevel]);

  return (
    <div className="mh-header-utils-fontscaler">
      <button translate='no' onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}>A-</button>
      <span className="divider"></span>
      <button translate='no' onClick={() => setZoomLevel(z => Math.min(3, z + 0.1))}>A+</button>
    </div>
  );
};