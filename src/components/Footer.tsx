import { useRef, useEffect } from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import gsap from 'gsap';

// Marquee component for infinite horizontal scroll
function Marquee({ children, speed = 50, direction = 'left' }: { children: React.ReactNode; speed?: number; direction?: 'left' | 'right' }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstChild = track.firstElementChild as HTMLElement;
    if (!firstChild) return;

    // Calculate width for seamless loop
    const width = firstChild.offsetWidth;

    // GSAP infinite scroll
    const tween = gsap.to(track, {
      x: direction === 'left' ? -width : width,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          const w = width;
          if (direction === 'left') {
            return parseFloat(String(x)) % w;
          } else {
            const val = parseFloat(String(x)) % w;
            return val === 0 ? 0 : val - w;
          }
        }),
      },
    });

    return () => { tween.kill(); };
  }, [speed, direction]);

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex whitespace-nowrap" style={{ width: 'max-content' }}>
        <div className="flex-shrink-0">{children}</div>
        <div className="flex-shrink-0">{children}</div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { copied, copy } = useClipboard();

  return (
    <footer className="relative border-t border-[#1A1A1A]">
      {/* Top labels */}
      <div className="flex justify-between items-center px-8 md:px-12 py-4">
        <span className="font-mono text-[10px] text-white/40 tracking-[0.2em]">— GET IN TOUCH</span>
        <span className="font-mono text-[10px] text-white/40 tracking-[0.2em]">NOW ACCEPTING INQUIRIES</span>
      </div>

      {/* Large scrolling email marquee */}
      <div className="py-6 overflow-hidden">
        <Marquee speed={30} direction="left">
          <div className="flex items-center gap-8 px-4">
            <span
              className="font-bold text-white uppercase leading-none"
              style={{
                fontSize: 'clamp(48px, 10vw, 120px)',
                fontFamily: "Impact, 'Arial Black', sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              542811149@qq.com
            </span>
            {/* Line circle icon between repetitions */}
            <svg viewBox="0 0 40 40" className="h-[clamp(32px,6vw,80px)] w-auto flex-shrink-0">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#DB380F" strokeWidth="1.5" />
            </svg>
            <span
              className="font-bold uppercase leading-none"
              style={{
                fontSize: 'clamp(48px, 10vw, 120px)',
                fontFamily: "Impact, 'Arial Black', sans-serif",
                letterSpacing: '-0.02em',
                color: '#DB380F',
              }}
            >
              LIKAI-DESIGN
            </span>
            <svg viewBox="0 0 40 40" className="h-[clamp(32px,6vw,80px)] w-auto flex-shrink-0">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#DB380F" strokeWidth="1.5" />
            </svg>
          </div>
        </Marquee>
      </div>

      {/* Info ticker strip */}
      <div className="border-t border-b border-[#1A1A1A] py-2 overflow-hidden">
        <Marquee speed={20} direction="right">
          <div className="flex items-center gap-6 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-mono text-[10px] text-[#DB380F]/60 tracking-[0.15em] flex items-center gap-6">
                <span>REMOTE-FRIENDLY</span>
                <span className="text-white/20">•</span>
                <span>REPLIES WITHIN 48 HOURS</span>
                <span className="text-white/20">•</span>
                <span>TIMEZONE: CHENGDU</span>
                <span className="text-white/20">•</span>
                <span>TELL ME WHAT YOU&apos;RE BUILDING</span>
                <span className="text-white/20">•</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-end px-8 md:px-12 py-6">
        <div className="flex items-center gap-6">
          {/* Copy Email button - red like the accent */}
          <button
            onClick={() => copy('542811149@qq.com')}
            className="bg-[#DB380F] text-white px-6 py-3 font-mono text-[10px] tracking-widest hover:bg-[#b82f0d] transition-colors duration-300"
          >
            {copied ? 'COPIED!' : 'COPY EMAIL'}
          </button>
        </div>

        {/* Right side name */}
        <div className="text-right">
          <p className="font-mono text-[10px] text-white/60 tracking-[0.1em]">LIKAI-DESIGN</p>
          <p className="font-mono text-[9px] text-white/30 tracking-[0.1em] mt-1">DESIGN & DEV</p>
        </div>
      </div>
    </footer>
  );
}
