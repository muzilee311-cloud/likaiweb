import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window;
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
    };

    const handleLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseleave', handleLeave);

    let raf: number;
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }
      if (ringRef.current) {
        const size = isHovering.current ? 44 : 32;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = isHovering.current ? '#DB380F' : 'rgba(255,255,255,0.4)';
        ringRef.current.style.opacity = isVisible.current ? (isHovering.current ? '1' : '0.5') : '0';
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div className="custom-cursor hidden md:block" style={{ mixBlendMode: 'difference' }}>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999] opacity-0 transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[9999] opacity-0 transition-[width,height,border-color] duration-300"
      />
    </div>
  );
}
