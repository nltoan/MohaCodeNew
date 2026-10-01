import { useEffect, useRef, useState, type ReactNode } from 'react';

export function DeferredSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    // Finish loading public content without requiring scroll/click (including crawlers).
    let idle: number | undefined;
    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(() => setVisible(true), { timeout: 1000 });
      } else { setVisible(true); }
    }, 2500);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true); observer.disconnect();
      }
    }, { rootMargin: '400px' });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect(); window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, []);
  return <div className="mh-deferred-section" ref={ref} style={visible ? undefined : { minHeight: 360 }}>
    {visible ? children : <div aria-hidden="true" />}
  </div>;
}
