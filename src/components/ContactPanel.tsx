import { useEffect, useRef, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const particleCount = window.innerWidth < 768 ? 30 : 55;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(219, 56, 15, ${(1 - d / 100) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
}

export default function ContactPanel({ isOpen, onClose }: ContactPanelProps) {
  const { copied, copy } = useClipboard();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      if (panelRef.current) panelRef.current.style.transform = 'translateX(0)';
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '1';
        backdropRef.current.style.pointerEvents = 'auto';
      }
    } else {
      if (panelRef.current) panelRef.current.style.transform = 'translateX(100%)';
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '0';
        backdropRef.current.style.pointerEvents = 'none';
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  const socialLinks = [
    { name: 'Behance', href: '#' },
    { name: 'Dribbble', href: '#' },
    { name: '站酷 ZCOOL', href: '#' },
    { name: '小红书', href: '#' },
  ];

  return (
    <div className={`fixed inset-0 z-[150] ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 z-[140] opacity-0 transition-opacity duration-500"
        style={{ pointerEvents: 'none' }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 w-full max-w-[520px] h-screen bg-[#050505] border-l border-[#1A1A1A] z-[150] overflow-y-auto"
        style={{
          transform: 'translateX(100%)',
          transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        <ConstellationCanvas />

        <div className="relative z-10 px-10 md:px-14 pt-28 pb-14">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-7 right-8 text-white/60 hover:text-[#DB380F] hover:rotate-90 transition-all duration-300"
          >
            <X size={22} />
          </button>

          {/* Title: English on top (large Impact), Chinese below (small Noto Sans SC) */}
          <div className="mb-14">
            <h2
              className="font-bold uppercase text-white leading-none"
              style={{
                fontSize: 'clamp(40px, 7vw, 72px)',
                fontFamily: "Impact, 'Arial Black', sans-serif",
                letterSpacing: '0.02em',
              }}
            >
              GET IN TOUCH
            </h2>
            <p
              className="mt-2 text-white/50"
              style={{
                fontSize: 'clamp(14px, 2vw, 24px)',
                fontFamily: "'Noto Sans SC', 'SimHei', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.1em',
              }}
            >
              联系我
            </p>
          </div>

          {/* Email */}
          <div className="mb-10">
            <p className="font-mono text-[#999] text-[10px] tracking-[0.15em] mb-3">邮箱 / EMAIL</p>
            <a href="mailto:542811149@qq.com" className="font-body text-white hover:text-[#DB380F] transition-colors duration-300 border-b border-[#333] hover:border-[#DB380F] pb-1">
              542811149@qq.com
            </a>
          </div>

          {/* QR Code - replaced with uploaded image */}
          <div className="mb-10">
            <p className="font-mono text-[#999] text-[10px] tracking-[0.15em] mb-3">微信 / WECHAT</p>
            <div className="w-[140px] h-[140px] border border-[#222] rounded bg-[#111] overflow-hidden">
              <img
                src="/erweima.png"
                alt="WeChat QR Code"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-caption text-[#999]/60 mt-2">扫码添加微信</p>
          </div>

          {/* Location */}
          <div className="mb-10">
            <p className="font-mono text-[#999] text-[10px] tracking-[0.15em] mb-3">地址 / LOCATION</p>
            <p className="font-body text-white">中国 · 成都</p>
            <p className="font-caption text-[#999]/60 mt-1">CHENGDU, CHINA</p>
          </div>

          {/* Status */}
          <div className="mb-14">
            <p className="font-mono text-[#999] text-[10px] tracking-[0.15em] mb-3">状态 / STATUS</p>
            <p className="font-body text-white flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DB380F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DB380F]"></span>
              </span>
              接受新项目委托
            </p>
          </div>

          {/* Social */}
          <div className="border-t border-[#1A1A1A] pt-10 mb-10">
            <p className="font-mono text-[#999] text-[10px] tracking-[0.15em] mb-5">社交媒体 / SOCIAL</p>
            <div className="flex flex-col gap-4">
              {socialLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body text-white/70 hover:text-[#DB380F] transition-colors duration-300 flex items-center gap-2 group w-fit"
                >
                  {link.name}
                  <ArrowUpRight size={13} className="text-[#999]/50 group-hover:text-[#DB380F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Copy Email */}
          <button
            onClick={() => copy('542811149@qq.com')}
            className="border border-white/30 bg-transparent text-white px-7 py-2.5 font-button hover:bg-white hover:text-black transition-all duration-300"
          >
            {copied ? 'COPIED!' : 'COPY EMAIL'}
          </button>
        </div>
      </div>
    </div>
  );
}
