import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

interface NavigationProps {
  onContactClick: () => void;
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      className="relative font-nav text-white/60 hover:text-white transition-colors duration-300 group"
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-px bg-[#DB380F] transition-transform duration-300 origin-left ${
          isActive ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      />
    </Link>
  );
}

// Mobile Menu Panel (right slide-in, 1/3 width)
function MobileMenuPanel({ isOpen, onClose, onContactClick }: { isOpen: boolean; onClose: () => void; onContactClick: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    if (isOpen) {
      gsap.to(panelRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll('.menu-item');
        gsap.fromTo(items,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
        );
      }
    } else {
      gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isOpen]);

  const menuItems = [
    { label: 'HOME', sub: '首页', to: '/' },
    { label: 'PROJECTS', sub: '精选项目', to: '/projects' },
    { label: 'ABOUT', sub: '关于', to: '/about' },
    { label: 'CONTACT', sub: '联系', action: 'contact', to: '#' },
  ];

  const handleClick = (item: typeof menuItems[0]) => {
    onClose();
    if (item.action === 'contact') {
      setTimeout(() => onContactClick(), 500);
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 z-[199] transition-opacity duration-500 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{
          backdropFilter: isOpen ? 'blur(12px) brightness(0.6)' : 'none',
          WebkitBackdropFilter: isOpen ? 'blur(12px) brightness(0.6)' : 'none',
          backgroundColor: isOpen ? 'rgba(0,0,0,0.2)' : 'transparent',
        }}
      />
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-screen z-[200] md:hidden flex flex-col"
        style={{
          width: '38vw',
          minWidth: '160px',
          maxWidth: '240px',
          transform: 'translateX(100%)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
          backgroundColor: 'rgba(15, 15, 15, 0.6)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Close button */}
        <div className="flex justify-end px-5 pt-5 pb-2">
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>
        {/* Menu items — positioned near the top */}
        <div ref={itemsRef} className="flex flex-col px-5 gap-5" style={{ marginTop: '4vh' }}>
          {menuItems.map((item) => (
            item.action === 'contact' ? (
              <button key={item.label} onClick={() => handleClick(item)} className="menu-item text-left group">
                <span className="block font-impact uppercase text-white/80 group-hover:text-[#DB380F] transition-colors leading-none" style={{ fontSize: 'clamp(22px, 5vw, 32px)', letterSpacing: '0.05em' }}>{item.label}</span>
                <span className="block text-white/30 mt-1.5 group-hover:text-white/50 transition-colors" style={{ fontSize: 'clamp(12px, 2.5vw, 15px)', fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, letterSpacing: '0.1em' }}>{item.sub}</span>
              </button>
            ) : (
              <Link key={item.label} to={item.to} onClick={onClose} className="menu-item text-left group">
                <span className="block font-impact uppercase text-white/80 group-hover:text-[#DB380F] transition-colors leading-none" style={{ fontSize: 'clamp(22px, 5vw, 32px)', letterSpacing: '0.05em' }}>{item.label}</span>
                <span className="block text-white/30 mt-1.5 group-hover:text-white/50 transition-colors" style={{ fontSize: 'clamp(12px, 2.5vw, 15px)', fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300, letterSpacing: '0.1em' }}>{item.sub}</span>
              </Link>
            )
          ))}
        </div>
        {/* Footer */}
        <div className="mt-auto p-5 border-t border-white/10">
          <div className="w-6 h-px bg-[#DB380F] mb-2" />
          <p className="font-mono text-[8px] text-white/20 tracking-[0.2em]">LIKAI-DESIGN</p>
        </div>
      </div>
    </>
  );
}

export default function Navigation({ onContactClick }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-5 md:px-12 py-4 md:py-5 flex items-center justify-between" style={{ backdropFilter: 'blur(2px)' }}>
        {/* Desktop: PROJECTS + ABOUT | Mobile: hidden */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/projects">PROJECTS</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
        </div>

        {/* Logo - always visible */}
        <Link to="/" className="md:absolute md:left-1/2 md:-translate-x-1/2 hover:opacity-80 transition-opacity duration-300">
          <img src="/logo.png" alt="LIKAI DESIGN" className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-4 md:gap-10">
          <button onClick={onContactClick} className="relative font-nav text-white/60 hover:text-white transition-colors duration-300 group hidden md:block">
            CONTACT
            <span className="absolute -bottom-1 left-0 w-full h-px bg-[#DB380F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }} />
          </button>
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-white/70 hover:text-white transition-colors p-1" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <MobileMenuPanel isOpen={mobileOpen} onClose={closeMobile} onContactClick={onContactClick} />
    </>
  );
}
