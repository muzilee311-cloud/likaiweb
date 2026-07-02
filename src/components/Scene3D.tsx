import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleHorse from './ParticleHorse';

interface Scene3DProps {
  mouseRef: React.RefObject<{ normalizedX: number; normalizedY: number } | null>;
  opacity?: number;
}

export default function Scene3D({ mouseRef, opacity = 1 }: Scene3DProps) {
  return (
    <div className="fixed inset-0 z-0" style={{ opacity, transition: 'opacity 0.3s ease' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleHorse mouseRef={mouseRef} opacity={opacity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
