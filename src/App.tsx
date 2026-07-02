import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Navigation from '@/components/Navigation';
import ContactPanel from '@/components/ContactPanel';
import CustomCursor from '@/components/CustomCursor';
import SplashCursor from '@/components/SplashCursor';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Admin from '@/pages/Admin';
import { useLenis } from '@/hooks/useLenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== Auto-reload hook: triggers on any /api/publish call =====
function useAutoReload(enabled: boolean) {
  const POLL_MS = 6000;

  useEffect(() => {
    if (!enabled) return;

    const key = '__pub_v__';
    let mounted = true;

    // 1. BroadcastChannel — instant cross-tab
    let bc: BroadcastChannel | undefined;
    try {
      bc = new BroadcastChannel('pub');
      bc.onmessage = (e) => {
        if (e.data === 'go' && mounted) {
          localStorage.setItem(key, String(Date.now()));
          window.location.reload();
        }
      };
    } catch { /* not supported */ }

    // 2. storage event — catches localStorage changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && mounted) {
        window.location.reload();
      }
    };
    window.addEventListener('storage', onStorage);

    // 3. polling — catches server restart / missed events
    let current = localStorage.getItem(key) || '0';
    const check = async () => {
      try {
        const r = await fetch('/api/version?_=' + Date.now(), { cache: 'no-store' });
        const d = await r.json();
        const sv = String(d.version);
        if (sv !== current) {
          current = sv;
          localStorage.setItem(key, sv);
          window.location.reload();
        }
      } catch { /* network error, ignore */ }
    };
    const t = setInterval(check, POLL_MS);
    check(); // immediate first check

    return () => {
      mounted = false;
      bc?.close();
      window.removeEventListener('storage', onStorage);
      clearInterval(t);
    };
  }, [enabled]);
}

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [show3D, setShow3D] = useState(true);
  const location = useLocation();
  const lenisRef = useLenis();

  const isAdminPage = location.pathname.startsWith('/admin');
  const showSplashCursor = location.pathname !== '/';

  // Enable auto-reload on all pages (including admin)
  useAutoReload(true);

  useEffect(() => {
    const path = location.pathname;
    const is3DPage = path === '/' || path === '/about';
    setShow3D(is3DPage);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [location.pathname, lenisRef]);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  // Admin page: no nav, no cursor glow, no contact panel
  if (isAdminPage) {
    return (
      <>
        {showSplashCursor && <SplashCursor COLOR="#DB380F" RAINBOW_MODE={false} />}
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {showSplashCursor && <SplashCursor COLOR="#DB380F" RAINBOW_MODE={false} />}

      <div
        className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle 250px at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(219, 56, 15, 0.05), transparent)',
        }}
      />
      <CustomCursor />

      <Navigation onContactClick={openContact} />
      <ContactPanel isOpen={contactOpen} onClose={closeContact} />

      <main>
        <Routes>
          <Route path="/" element={<Home show3D={show3D} />} />
          <Route path="/about" element={<About show3D={show3D} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
    </div>
  );
}
