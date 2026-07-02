import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleHorseProps {
  mouseRef: React.RefObject<{ normalizedX: number; normalizedY: number } | null>;
  opacity?: number;
  scanlineProgress?: number; // 0 = no scan, 1 = fully scanned away
}

// ===== FRONT-FACING HORSE HEAD SDF =====
function horseHeadFrontSDF(x: number, y: number, z: number): number {
  // Front-facing horse head

  // Main head - wide cranium (front view)
  const cranium = Math.sqrt(
    Math.pow(x / 0.7, 2) +
    Math.pow((y + 0.15) / 0.65, 2) +
    Math.pow(z / 0.55, 2)
  ) - 0.75;

  // Left ear (pointed, upright)
  const leftEar = Math.sqrt(
    Math.pow((x + 0.42) / 0.2, 2) +
    Math.pow((y - 0.85) / 0.45, 2) +
    Math.pow((z - 0.1) / 0.18, 2)
  ) - 0.32;

  // Right ear (pointed, upright)
  const rightEar = Math.sqrt(
    Math.pow((x - 0.42) / 0.2, 2) +
    Math.pow((y - 0.85) / 0.45, 2) +
    Math.pow((z - 0.1) / 0.18, 2)
  ) - 0.32;

  // Muzzle/snout - extends forward and down
  const muzzle = Math.sqrt(
    Math.pow(x / 0.45, 2) +
    Math.pow((y + 0.55) / 0.4, 2) +
    Math.pow((z - 0.35) / 0.35, 2)
  ) - 0.45;

  // Nostrils (left)
  const nostrilL = Math.sqrt(
    Math.pow((x + 0.18) / 0.1, 2) +
    Math.pow((y + 0.65) / 0.08, 2) +
    Math.pow((z - 0.6) / 0.08, 2)
  ) - 0.12;

  // Nostrils (right)
  const nostrilR = Math.sqrt(
    Math.pow((x - 0.18) / 0.1, 2) +
    Math.pow((y + 0.65) / 0.08, 2) +
    Math.pow((z - 0.6) / 0.08, 2)
  ) - 0.12;

  // Jaw / chin
  const jaw = Math.sqrt(
    Math.pow(x / 0.5, 2) +
    Math.pow((y + 0.85) / 0.25, 2) +
    Math.pow((z - 0.1) / 0.35, 2)
  ) - 0.4;

  // Left eye socket (indented)
  const eyeSocketL = Math.sqrt(
    Math.pow((x + 0.32) / 0.18, 2) +
    Math.pow((y + 0.05) / 0.12, 2) +
    Math.pow((z - 0.35) / 0.15, 2)
  ) - 0.18;

  // Right eye socket
  const eyeSocketR = Math.sqrt(
    Math.pow((x - 0.32) / 0.18, 2) +
    Math.pow((y + 0.05) / 0.12, 2) +
    Math.pow((z - 0.35) / 0.15, 2)
  ) - 0.18;

  // Forehead ridge
  const forehead = Math.sqrt(
    Math.pow(x / 0.4, 2) +
    Math.pow((y - 0.25) / 0.15, 2) +
    Math.pow((z - 0.3) / 0.25, 2)
  ) - 0.25;

  // Mane suggestion between ears
  const mane = Math.sqrt(
    Math.pow(x / 0.15, 2) +
    Math.pow((y - 0.6) / 0.2, 2) +
    Math.pow((z + 0.35) / 0.25, 2)
  ) - 0.2;

  // Cheek bulges
  const cheekL = Math.sqrt(
    Math.pow((x + 0.5) / 0.2, 2) +
    Math.pow((y + 0.15) / 0.22, 2) +
    Math.pow((z - 0.05) / 0.2, 2)
  ) - 0.18;

  const cheekR = Math.sqrt(
    Math.pow((x - 0.5) / 0.2, 2) +
    Math.pow((y + 0.15) / 0.22, 2) +
    Math.pow((z - 0.05) / 0.2, 2)
  ) - 0.18;

  // Combine with smooth union
  let shape = smoothMin(smoothMin(cranium, muzzle, 0.3), jaw, 0.25);
  shape = smoothMin(shape, leftEar, 0.15);
  shape = smoothMin(shape, rightEar, 0.15);
  shape = smoothMin(shape, forehead, 0.15);
  shape = smoothMin(shape, mane, 0.15);
  shape = smoothMin(shape, cheekL, 0.12);
  shape = smoothMin(shape, cheekR, 0.12);
  shape = smoothMin(shape, nostrilL, 0.08);
  shape = smoothMin(shape, nostrilR, 0.08);

  // Subtract eye sockets
  shape = smoothMax(shape, -eyeSocketL, 0.08);
  shape = smoothMax(shape, -eyeSocketR, 0.08);

  return shape;
}

function smoothMin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0.0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

function smoothMax(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0.0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
}

export default function ParticleHorse({ mouseRef, opacity = 1, scanlineProgress = 0 }: ParticleHorseProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const count = useMemo(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 3000 : 7000), []);

  const vertexShader = useMemo(() => `
    attribute float aVisible;
    attribute float aDistance;
    attribute vec3 aPosition;
    attribute float aYPos;
    uniform float uTime;
    uniform float uScanline;
    varying float vDist;
    varying float vVis;
    varying float vYPos;

    void main() {
      vDist = aDistance;
      vVis = aVisible;
      vYPos = aYPos;

      // Scanline effect: if scanline is active, hide particles below the threshold
      float scanlineVis = 1.0;
      if (uScanline > 0.0) {
        float scanThreshold = -1.0 + uScanline * 3.0; // scan from bottom to top
        scanlineVis = smoothstep(scanThreshold, scanThreshold + 0.15, aYPos);
      }

      float breathe = 1.0 + 0.06 * sin(uTime * 1.2 + aPosition.x * 2.5 + aPosition.y * 1.8);
      vec3 pos = position * breathe;
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Apply scanline to point size
      gl_PointSize = 2.5 * scanlineVis;
    }
  `, []);

  const fragmentShader = useMemo(() => `
    uniform float uOpacity;
    uniform vec3 uVermillion;
    uniform float uScanline;
    varying float vDist;
    varying float vVis;
    varying float vYPos;

    void main() {
      if (vVis < 0.5) {
        discard;
      }

      // Scanline hiding
      if (uScanline > 0.0) {
        float scanThreshold = -1.0 + uScanline * 3.0;
        if (vYPos < scanThreshold) {
          discard;
        }
      }

      vec3 white = vec3(1.0);
      float t = smoothstep(0.0, 0.5, vDist);
      vec3 color = mix(uVermillion, white, t);
      float glow = 1.0 - smoothstep(0.0, 0.3, vDist);
      color += uVermillion * glow * 0.6;
      float alpha = uOpacity * (0.7 + 0.3 * (1.0 - vDist));
      gl_FragColor = vec4(color, alpha);
    }
  `, []);

  const { distances, visibles, instanceData } = useMemo(() => {
    const distancesArr: number[] = [];
    const visiblesArr: number[] = [];
    const instanceDataArr: number[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const radius = 1.5;

    for (let i = 0; i < count; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / count);
      const phi = Math.PI * 2 * i / goldenRatio;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      const d = horseHeadFrontSDF(x, y, z);
      const visible = d <= 0.18 ? 1 : 0;
      const distFromCenter = Math.sqrt(x * x + y * y + z * z) / radius;

      distancesArr.push(distFromCenter);
      visiblesArr.push(visible);
      instanceDataArr.push(x, y, z);
    }
    return { distances: distancesArr, visibles: visiblesArr, instanceData: instanceDataArr };
  }, [count]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: opacity },
        uVermillion: { value: new THREE.Color('#DB380F') },
        uScanline: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [vertexShader, fragmentShader, opacity]);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useFrame((_state: unknown, delta: number) => {
    timeRef.current += delta;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uOpacity.value = opacity;
      materialRef.current.uniforms.uScanline.value = scanlineProgress;
    }

    if (meshRef.current) {
      const mouse = mouseRef.current;
      const targetX = (mouse?.normalizedY ?? 0) * 0.35;
      const targetY = (mouse?.normalizedX ?? 0) * 0.5;
      rotationRef.current.x += (targetX - rotationRef.current.x) * 0.06;
      rotationRef.current.y += (targetY - rotationRef.current.y) * 0.06;
      meshRef.current.rotation.x = rotationRef.current.x;
      meshRef.current.rotation.y = rotationRef.current.y + timeRef.current * 0.03;
    }
  });

  const boxGeo = useMemo(() => new THREE.BoxGeometry(0.028, 0.028, 0.028), []);
  const dummy = useMemo(() => new THREE.Matrix4(), []);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!instancedMeshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.setPosition(
        instanceData[i * 3],
        instanceData[i * 3 + 1],
        instanceData[i * 3 + 2]
      );
      instancedMeshRef.current.setMatrixAt(i, dummy);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, instanceData, dummy]);

  return (
    <instancedMesh
      ref={(el: THREE.InstancedMesh | null) => {
        meshRef.current = el;
        instancedMeshRef.current = el;
      }}
      args={[boxGeo, material, count]}
    />
  );
}
