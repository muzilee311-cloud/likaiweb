import { useEffect, useRef } from 'react';

// 2D Canvas-based running horse scene with speed lines and geometric trees
export default function ShiftScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    // Animation state
    let time = 0;
    const speedLines: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = [];
    const trees: Array<{ x: number; z: number; side: -1 | 1; type: number }> = [];
    const groundDots: Array<{ x: number; z: number }> = [];

    // Init speed lines
    for (let i = 0; i < 80; i++) {
      speedLines.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: 20 + Math.random() * 80,
        speed: 10 + Math.random() * 30,
        opacity: 0.2 + Math.random() * 0.6,
      });
    }

    // Init trees on both sides
    for (let i = 0; i < 30; i++) {
      trees.push({
        x: (Math.random() * w * 0.4) + w * 0.05,
        z: Math.random() * 2000,
        side: Math.random() > 0.5 ? 1 : -1,
        type: Math.floor(Math.random() * 3),
      });
    }

    // Init ground dots
    for (let i = 0; i < 100; i++) {
      groundDots.push({
        x: Math.random() * w,
        z: Math.random() * 2000,
      });
    }

    // Draw a geometric horse (head forward, running)
    function drawHorse(cx: number, cy: number, scale: number, gallopPhase: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Running bob animation
      const bobY = Math.sin(gallopPhase * 2) * 8;
      const bodyTilt = Math.sin(gallopPhase) * 0.03;

      ctx.translate(0, bobY);
      ctx.rotate(bodyTilt);

      // Horse body - white with #DB380F accents
      ctx.fillStyle = '#F0F0F0';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;

      // Body (main torso)
      ctx.beginPath();
      ctx.moveTo(-60, -20);
      ctx.lineTo(60, -15);
      ctx.lineTo(50, 30);
      ctx.lineTo(-50, 35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Neck
      ctx.beginPath();
      ctx.moveTo(40, -15);
      ctx.lineTo(80, -50);
      ctx.lineTo(70, -20);
      ctx.lineTo(50, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Head (front facing)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      // Snout
      ctx.moveTo(60, -55);
      ctx.lineTo(100, -45);
      ctx.lineTo(95, -25);
      ctx.lineTo(65, -30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Forehead/cranium
      ctx.beginPath();
      ctx.moveTo(60, -65);
      ctx.lineTo(95, -60);
      ctx.lineTo(100, -45);
      ctx.lineTo(60, -55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Left ear
      ctx.beginPath();
      ctx.moveTo(70, -65);
      ctx.lineTo(65, -100);
      ctx.lineTo(80, -70);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right ear
      ctx.beginPath();
      ctx.moveTo(85, -63);
      ctx.lineTo(95, -95);
      ctx.lineTo(90, -65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mane
      ctx.fillStyle = '#DB380F';
      ctx.beginPath();
      ctx.moveTo(55, -50);
      ctx.lineTo(40, -80);
      ctx.lineTo(60, -60);
      ctx.lineTo(50, -90);
      ctx.lineTo(65, -55);
      ctx.closePath();
      ctx.fill();

      // Nostrils
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.ellipse(95, -38, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(88, -40, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.ellipse(75, -52, 6, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(88, -50, 6, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(76, -53, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(89, -51, 2, 0, Math.PI * 2);
      ctx.fill();

      // Legs with running animation
      const legPhase1 = Math.sin(gallopPhase * 2);
      const legPhase2 = Math.sin(gallopPhase * 2 + Math.PI);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      // Front left leg
      ctx.beginPath();
      ctx.moveTo(30, 25);
      ctx.lineTo(35 + legPhase1 * 15, 55);
      ctx.lineTo(30 + legPhase1 * 10, 80);
      ctx.stroke();

      // Front right leg
      ctx.beginPath();
      ctx.moveTo(45, 25);
      ctx.lineTo(50 + legPhase2 * 15, 55);
      ctx.lineTo(45 + legPhase2 * 10, 80);
      ctx.stroke();

      // Back left leg
      ctx.beginPath();
      ctx.moveTo(-30, 28);
      ctx.lineTo(-35 + legPhase2 * 15, 58);
      ctx.lineTo(-30 + legPhase2 * 10, 82);
      ctx.stroke();

      // Back right leg
      ctx.beginPath();
      ctx.moveTo(-15, 28);
      ctx.lineTo(-20 + legPhase1 * 15, 58);
      ctx.lineTo(-15 + legPhase1 * 10, 82);
      ctx.stroke();

      // Tail
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      const tailWag = Math.sin(gallopPhase * 1.5) * 10;
      ctx.beginPath();
      ctx.moveTo(-60, -5);
      ctx.quadraticCurveTo(-90, -10 + tailWag, -100, 10 + tailWag);
      ctx.stroke();

      // Hooves
      ctx.fillStyle = '#333';
      const hoofY = 80;
      ctx.fillRect(25 + legPhase1 * 10, hoofY, 8, 5);
      ctx.fillRect(40 + legPhase2 * 10, hoofY, 8, 5);
      ctx.fillRect(-35 + legPhase2 * 10, hoofY + 2, 8, 5);
      ctx.fillRect(-20 + legPhase1 * 10, hoofY + 2, 8, 5);

      ctx.restore();
    }

    // Draw geometric tree
    function drawTree(screenX: number, screenY: number, scale: number, treeType: number) {
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.scale(scale, scale);

      // Trunk
      ctx.fillStyle = '#5C4033';
      ctx.fillRect(-3, 0, 6, 20);

      if (treeType === 0) {
        // Triangle layers
        ctx.fillStyle = `rgba(45, 80, 22, ${Math.min(1, scale * 2)})`;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-20, -15);
        ctx.lineTo(20, -15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(58, 107, 31, ${Math.min(1, scale * 2)})`;
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(-18, -5);
        ctx.lineTo(18, -5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(45, 80, 22, ${Math.min(1, scale * 2)})`;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-15, 5);
        ctx.lineTo(15, 5);
        ctx.closePath();
        ctx.fill();
      } else if (treeType === 1) {
        // Cube stack style
        ctx.fillStyle = `rgba(58, 107, 31, ${Math.min(1, scale * 2)})`;
        ctx.fillRect(-18, -45, 36, 20);
        ctx.fillStyle = `rgba(45, 80, 22, ${Math.min(1, scale * 2)})`;
        ctx.fillRect(-14, -30, 28, 18);
        ctx.fillStyle = `rgba(58, 107, 31, ${Math.min(1, scale * 2)})`;
        ctx.fillRect(-10, -15, 20, 15);
      } else {
        // Diamond style
        ctx.fillStyle = `rgba(45, 80, 22, ${Math.min(1, scale * 2)})`;
        ctx.beginPath();
        ctx.moveTo(0, -55);
        ctx.lineTo(-15, -30);
        ctx.lineTo(0, -10);
        ctx.lineTo(15, -30);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(-18, -10);
        ctx.lineTo(0, 5);
        ctx.lineTo(18, -10);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    const animate = () => {
      time += 0.016;
      const gallopPhase = time * 6;

      // Clear with fade for motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, w, h);

      // === GROUND ===
      const horizonY = h * 0.45;

      // Ground gradient
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      groundGrad.addColorStop(0, '#0A0A0A');
      groundGrad.addColorStop(1, '#000000');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Perspective ground lines
      ctx.strokeStyle = 'rgba(219, 56, 15, 0.15)';
      ctx.lineWidth = 1;
      const vanishingX = w / 2;
      const vanishingY = horizonY - 20;

      // Moving ground dots (speed effect)
      for (const dot of groundDots) {
        dot.z -= 15; // speed
        if (dot.z <= 0) {
          dot.z = 2000;
          dot.x = Math.random() * w;
        }

        const perspective = 300 / (300 + dot.z);
        const sx = vanishingX + (dot.x - vanishingX) * perspective;
        const sy = vanishingY + (h - vanishingY) * perspective;
        const size = 2 * (1 - perspective) + 0.5;

        ctx.fillStyle = `rgba(219, 56, 15, ${(1 - perspective) * 0.4})`;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }

      // Road edges
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 5, vanishingY);
      ctx.lineTo(w * 0.1, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(vanishingX + 5, vanishingY);
      ctx.lineTo(w * 0.9, h);
      ctx.stroke();

      // Center line
      ctx.strokeStyle = 'rgba(219, 56, 15, 0.3)';
      ctx.setLineDash([20, 30]);
      ctx.lineDashOffset = -time * 200;
      ctx.beginPath();
      ctx.moveTo(vanishingX, vanishingY);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // === TREES ===
      for (const tree of trees) {
        tree.z -= 18; // moving toward camera
        if (tree.z <= 0) {
          tree.z = 2000;
          tree.x = (Math.random() * w * 0.35) + w * 0.05;
        }

        const perspective = 300 / (300 + tree.z);
        const sideOffset = tree.side * (w * 0.25 + tree.x) * perspective;
        const sx = vanishingX + sideOffset;
        const sy = vanishingY + (h * 0.5 - vanishingY) * perspective;
        const scale = (1 - perspective) * 3;

        if (scale > 0.01 && sx > -50 && sx < w + 50) {
          drawTree(sx, sy, scale, tree.type);
        }
      }

      // === SPEED LINES ===
      for (const line of speedLines) {
        // Move outward from center for speed effect
        const dx = line.x - w / 2;
        const dy = line.y - h / 2;
        const angle = Math.atan2(dy, dx);
        line.x += Math.cos(angle) * line.speed;
        line.y += Math.sin(angle) * line.speed;

        if (line.x < 0 || line.x > w || line.y < 0 || line.y > h) {
          line.x = w / 2 + (Math.random() - 0.5) * 20;
          line.y = h / 2 + (Math.random() - 0.5) * 20;
          line.speed = 10 + Math.random() * 30;
        }

        const grad = ctx.createLinearGradient(
          line.x, line.y,
          line.x - Math.cos(angle) * line.length,
          line.y - Math.sin(angle) * line.length
        );
        grad.addColorStop(0, `rgba(255, 200, 100, ${line.opacity})`);
        grad.addColorStop(1, 'rgba(255, 200, 100, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(
          line.x - Math.cos(angle) * line.length,
          line.y - Math.sin(angle) * line.length
        );
        ctx.stroke();
      }

      // === HORSE ===
      // Draw at bottom center, large
      const horseScale = Math.min(w, h) / 250;
      drawHorse(w / 2, h * 0.68, horseScale, gallopPhase);

      // === VIGNETTE ===
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.8);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
      }}
    />
  );
}
