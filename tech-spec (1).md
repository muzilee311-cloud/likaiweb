# LIKAI DESIGN — Technical Specification

## Dependencies

### Runtime
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| react-router-dom | ^7.0.0 | SPA routing with 5 pages |
| three | ^0.170.0 | 3D engine (particle horse, floating shapes, SHIFT scene) |
| @react-three/fiber | ^9.0.0 | React renderer for Three.js |
| @react-three/drei | ^9.0.0 | R3F helpers (useTexture, Float, etc.) |
| gsap | ^3.12.0 | Core animation engine + ScrollTrigger + ScrollToPlugin + SplitText |
| framer-motion | ^11.0.0 | Declarative UI transitions (nav, contact panel, hover states) |
| lenis | ^1.1.0 | Smooth scroll with inertia |
| react-countup | ^6.5.0 | Animated number counters (if needed) |
| normalize-wheel | ^1.0.0 | Cross-browser wheel event normalization |
| embla-carousel-react | ^8.0.0 | Touch-friendly carousel fallback |
| embla-carousel-wheel-gestures | ^8.0.0 | Wheel gesture support for carousel |
| lucide-react | ^0.460.0 | Icon set (menu, close, external-link, arrow-right) |

### Dev
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.3.0 | React support for Vite |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| postcss | ^8.4.0 | CSS processing |
| autoprefixer | ^10.4.0 | Vendor prefixes |
| typescript | ^5.6.0 | Type safety |
| @types/react | ^19.0.0 | React type definitions |
| @types/react-dom | ^19.0.0 | ReactDOM type definitions |
| @types/three | ^0.170.0 | Three.js type definitions |

### External (CDN / HTML)
- **Space Grotesk** — Google Fonts (weights 300-700)
- **Noto Sans SC** — Google Fonts (weights 400, 500, 700)

---

## Component Inventory

### Layout (shared across pages)
| Component | Source | Notes |
|-----------|--------|-------|
| Navigation | Custom | Fixed top bar; contact link triggers panel overlay (not route change) |
| PageTransitionOverlay | Custom | 4-panel GSAP grid; wraps route changes |
| Footer | Custom | Used on About, Contact pages only |
| ScrollIndicator | Custom | Fixed bottom-center; dismisses on scroll |
| AtmosphericCursor | Custom | CSS radial-gradient following mouse via rAF + CSS vars |
| CustomCursor | Custom | Two-element lerp cursor; hidden on touch devices |
| ContactPanel | Custom | Slide-in panel (fixed right); contains ConstellationCanvas |

### Page Sections
| Page | Sections |
|------|----------|
| **Home** | ParticleHorseHero (3D canvas), TimeWeatherWidget, DecorativeText, ShiftModeToggle |
| **About** | ProfileHero, WorkExperience, SkillsServices, Philosophy |
| **Projects** | ProjectGallery (horizontal scroll), CTABanner |
| **ProjectDetail** | ProjectHero, ProjectInfo, ProjectGalleryBlocks, NextProject |
| **Contact** | *No dedicated route* — rendered as ContactPanel overlay on any page |

### 3D Components (R3F)
| Component | Source | Notes |
|-----------|--------|-------|
| ParticleHorse | Custom | InstancedMesh + custom ShaderMaterial with SDF sculpting; shared scene object, opacity controlled per-page |
| FloatingShapes | Custom | Three wireframe geometries (octahedron, icosahedron, tetrahedron) in shared scene |
| ShiftScene | Custom | Low-poly running horse (animated via GSAP/keyframes) + two geometric trees; replaces ParticleHorse when SHIFT active |
| ConstellationCanvas | Custom | 2D canvas (not R3F) inside ContactPanel; simple dot+line system |

### Hooks
| Hook | Purpose |
|------|---------|
| useMousePosition | Normalized [-1,1] coords from mousemove; drives 3D rotation, cursor, atmospheric glow |
| useChengduTime | Live clock for UTC+8/Chengdu; updates every second |
| useChengduWeather | Fetches weather via Open-Meteo API (free, no key); returns condition + humidity |
| useLenis | Initializes Lenis, syncs with ScrollTrigger, exposes instance for scroll-to |
| useClipboard | Copy-to-clipboard with feedback state ("COPIED!" / revert) |
| useScrollTrigger | Reusable ScrollTrigger setup/cleanup for fade/slide reveals |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| **Particle Horse System** | R3F + custom ShaderMaterial | InstancedMesh with ~5000 instances positioned via Fibonacci-sphere SDF sampling. Vertex shader handles breathing pulse (time-based scale), center-distance color mixing (white→vermillion), and mouse-driven rotation. Fragment shader applies the glow. | **High** 🔒 |
| **Mouse-driven 3D rotation** | R3F useFrame | Lerp rotation target from useMousePosition hook (factor 0.08/frame). Applied to the instanced mesh group. | Medium |
| **Page Transition Panels** | GSAP timeline | 4 fixed divs (2×2 grid), each scaling from its corner origin. Timeline: scaleIn all simultaneously → route change → scaleOut with 0.05s stagger. | Medium |
| **Horizontal Scroll Gallery** | GSAP ScrollTrigger | Pin gallery-section, scrub card-container translateX over `scrollWidth - viewportWidth`. Progress bar width tied to ScrollTrigger progress callback. | **High** 🔒 |
| **SHIFT Mode Toggle** | GSAP + R3F | Two timelines: (1) particle scatter outward + fade, (2) ShiftScene fade-in. Crossfade orchestrated via GSAP timeline controlling R3F scene visibility uniforms. | **High** 🔒 |
| **Constellation Network** | Vanilla 2D Canvas | Manual rAF loop: 50 particles drifting with random velocities, distance-based line drawing (≤100px), mouse repulsion (≤150px). No library needed. | Medium |
| **Image Reveal Mask** | GSAP ScrollTrigger | Per-image: black overlay div scalesX 1→0 (origin right), inner image scales 1.1→1.0 simultaneously. Triggered at "top 85%". | Low |
| **Text Scramble (Decorative)** | Custom (GSAP SplitText) | Character-level GSAP tween: periodically replace subset of chars with random letters then morph back. 3-5s interval. | Medium |
| **Quote Word-by-Word Reveal** | GSAP SplitText + ScrollTrigger | Split into words, stagger fade-in (0.08s per word). Vermillion border animates height 0→full first (0.6s). | Low |
| **Contact Panel Slide** | Framer Motion | `animate={{ x: 0 }}` from `initial={{ x: '100%' }}` with spring physics. Background page scale 1→0.95 + dark overlay. | Low |
| **Custom Cursor** | rAF + CSS | Dot follows instantly; ring uses lerp (factor 0.15). Transform-only. Hover detection via CSS `*:hover` or event delegation. | Medium |
| **Scroll Indicator Pulse** | GSAP | Infinite yoyo: circle translateY 0→24px + opacity 1→0 over 1.5s. Dismiss on scroll >100px. | Low |
| **Nav Underline** | CSS | `::after` pseudo-element, scaleX 0→1 on hover, transform-origin left. | Low |
| **Card Hover Effects** | CSS transitions | Image scale 1→1.05, overlay darken, title translateY -4px, "View Project →" opacity 0→1 + translateX. | Low |
| **Skill Tag Stagger** | GSAP ScrollTrigger | Batch animation: translateX -20→0, opacity 0→1, stagger 0.05s per tag. | Low |
| **Experience Entry Reveal** | GSAP ScrollTrigger | translateY 30→0, opacity 0→1, stagger 0.15s between entries. | Low |
| **Hero Image Ken Burns** | GSAP | scale 1.1→1.0 over 1.5s on page load. | Low |
| **Atmospheric Cursor Glow** | rAF + CSS vars | Update `--cursor-x`, `--cursor-y` CSS custom properties on mousemove. Gradient div reads them. | Low |
| **Floating Shapes** | R3F useFrame | Each shape: independent rotation (different speeds) + tetrahedron bobbing (sin wave on Y). | Low |

---

## State & Logic Plan

### 1. Shared 3D Scene Architecture

The particle horse is a persistent 3D element visible on Home (full) and About (dimmed). Rather than unmounting/remounting a canvas per page, use a **single fixed R3F Canvas** at the app root, with the particle system always rendered. Page-specific visibility/opacity is controlled via:

- **Uniform injection**: A `pageState` ref ("home" | "about" | "projects" | "projectDetail") drives shader uniforms for opacity, scale, and mouse-sensitivity.
- **Scene switching**: Home and About share the same R3F scene. On Projects and ProjectDetail, the canvas fades out (opacity→0 over 0.5s) since those pages are image-forward without the 3D element.

The SHIFT toggle also operates within this shared scene: it swaps the visible geometry (ParticleHorse ↔ ShiftScene) via conditional rendering inside the Canvas, orchestrated by a `shiftMode` boolean in a shared context.

### 2. Page Transition Orchestration

Route changes must be intercepted to play the transition animation:

- **Transition state machine**: `idle` → `exiting` → `switching` → `entering` → `idle`
- A `TransitionContext` (React Context) exposes `navigateTo(path)` which:
  1. Sets state to `exiting`
  2. Plays GSAP timeline (panels scale in)
  3. On timeline complete: calls `react-router` navigate
  4. Sets state to `entering`
  5. Plays reverse timeline (panels scale out)
  6. Sets state to `idle`
- All nav links and programmatic navigation must use `navigateTo()` from context, never raw router navigate
- `react-router` `<Link>` components are wrapped to use this handler

### 3. Mouse Position as Shared Input

Mouse position is consumed by 3 independent systems simultaneously:

| Consumer | Data needed | Update rate |
|----------|-------------|-------------|
| ParticleHorse | Normalized [-1, 1] | every frame (lerped) |
| CustomCursor | Pixel coordinates | every frame (lerped for ring) |
| AtmosphericCursor | Pixel coordinates | every frame |
| ConstellationCanvas | Pixel coordinates (panel-relative) | every frame |

**Strategy**: A single `mousemove` listener at the app root writes to a shared ref (not React state, to avoid re-renders). R3F `useFrame` and rAF loops read the ref directly. React components that need mouse data (cursor, atmospheric) use the same ref via a `useMousePosition` hook that returns a ref (not state).

### 4. Horizontal Scroll with Lenis Interop

The Projects page converts vertical scroll to horizontal movement via GSAP ScrollTrigger pin. This must coexist with Lenis:

- Lenis captures wheel events and drives smooth scroll
- GSAP ScrollTrigger listens to scroll position via `ScrollTrigger.scrollerProxy` or Lenis's `on('scroll')` callback
- Critical: `lenis.on('scroll', ScrollTrigger.update)` must be set up in the Lenis initialization hook
- The pinned gallery section's scroll distance is dynamic (`scrollWidth - viewportWidth`), so ScrollTrigger must use a function-based `end` value and `invalidateOnRefresh: true`
- On route change: kill all ScrollTrigger instances (`ScrollTrigger.getAll().forEach(t => t.kill())`) to prevent stale triggers

### 5. Time & Weather Data Flow

- **Time**: `useChengduTime` hook uses `setInterval(1000)` with `Intl.DateTimeFormat` for Asia/Shanghai timezone. No external API.
- **Weather**: `useChengduWeather` hook fetches from Open-Meteo free API (`https://api.open-meteo.com/v1/forecast?latitude=30.67&longitude=104.07&current=temperature_2m,relative_humidity_2m,weather_code`). Fetches once on mount. Falls back to static "MOSTLY CLEAR, 30%" if API fails.

---

## Other Key Decisions

### Routing
- 4 routes: `/` (Home), `/about`, `/projects`, `/projects/:slug`
- Contact is **not a route** — it's a slide-in panel overlay triggered by nav button, rendered via state
- ProjectDetail uses dynamic route param; project data lives in a static array mapped by slug

### 3D Performance
- Use a single R3F `<Canvas>` with `frameloop="demand"` on non-3D pages, falling back to `"always"` on Home/About
- Implement visibility culling: pause the render loop when the canvas is fully transparent (Projects/ProjectDetail pages) using `useFrame` conditional and `frameloop` prop
- Particle count: 5000 on desktop, 2000 on mobile (detected via `window.innerWidth` at init)

### Weather API
- Open-Meteo (free, no API key, CORS-friendly) for Chengdu weather
- Weather code mapping to Chinese condition strings handled locally

### Image Strategy
- All project images loaded lazily (`loading="lazy"`) except hero images
- Use `IntersectionObserver` to trigger image reveal mask animations only when images approach viewport
- Project images: ~1200×675px (16:9), served as optimized WebP with JPEG fallback

### Mobile 3D Degradation
- On screens < 768px: reduce particle count, remove floating shapes, simplify constellation to 25 dots
- Detect touch device at mount: disable CustomCursor, reduce animation complexity
