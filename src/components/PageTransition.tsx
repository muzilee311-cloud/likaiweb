import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';

export default function PageTransitionOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setIsAnimating(true);
      prevPath.current = location.pathname;

      const panels = containerRef.current?.querySelectorAll('.transition-panel');
      if (!panels) return;

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      // Exit animation - panels scale in
      tl.set(panels, { scale: 0 });
      tl.to(panels, {
        scale: 1,
        duration: 0.4,
        ease: 'power3.inOut',
        stagger: { amount: 0.05 },
      });

      // Entry animation - panels scale out
      tl.to(panels, {
        scale: 0,
        duration: 0.4,
        ease: 'power3.inOut',
        stagger: { amount: 0.05, from: 'end' },
        delay: 0.05,
      });
    }
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ pointerEvents: isAnimating ? 'auto' : 'none' }}
    >
      <div className="transition-panel absolute top-0 left-0 w-1/2 h-1/2 bg-[#DB380F] origin-top-left" style={{ transform: 'scale(0)' }} />
      <div className="transition-panel absolute top-0 right-0 w-1/2 h-1/2 bg-[#DB380F] origin-top-right" style={{ transform: 'scale(0)' }} />
      <div className="transition-panel absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#DB380F] origin-bottom-left" style={{ transform: 'scale(0)' }} />
      <div className="transition-panel absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#DB380F] origin-bottom-right" style={{ transform: 'scale(0)' }} />
    </div>
  );
}
