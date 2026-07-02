import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShapeProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  color: string;
  bobSpeed?: number;
  bobAmp?: number;
}

function WireframeShape({ geometry, position, rotationSpeed, color, bobSpeed = 0, bobAmp = 0 }: ShapeProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }: { clock: THREE.Clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rotationSpeed[0] * 0.01;
    ref.current.rotation.y += rotationSpeed[1] * 0.01;
    ref.current.rotation.z += rotationSpeed[2] * 0.01;
    if (bobSpeed > 0) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * bobSpeed) * bobAmp;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
    </mesh>
  );
}

export default function FloatingShapes() {
  const geo1 = new THREE.OctahedronGeometry(0.5);
  const geo2 = new THREE.IcosahedronGeometry(0.3);
  const geo3 = new THREE.TetrahedronGeometry(0.4);

  return (
    <>
      <WireframeShape geometry={geo1} position={[-2.8, 1.2, 0.5]} rotationSpeed={[1, 1.5, 0.5]} color="#FFFFFF" />
      <WireframeShape geometry={geo2} position={[2.8, 0.8, -0.8]} rotationSpeed={[-0.5, 1, 1.2]} color="#DB380F" />
      <WireframeShape geometry={geo3} position={[0.5, -1.8, 1.2]} rotationSpeed={[0.8, -1, 0.3]} color="#666666" bobSpeed={1.5} bobAmp={0.3} />
    </>
  );
}
