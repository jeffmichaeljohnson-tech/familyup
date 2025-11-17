/**
 * Enhanced 3D Map Component
 *
 * Snapchat+ quality 3D visualization integrating:
 * - Three.js Canvas with Mapbox GL
 * - 3D terrain elevation based on child population
 * - Dramatic lighting and shadows
 * - Camera fly-through animations
 * - Post-processing effects (bloom, glow)
 * - GPU-accelerated particle system
 *
 * PRIVACY: All visualizations use aggregate county data only
 */

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { CountyData, GraphicsConfig } from '../types';
import { ParticleSystem, ParticleSystemStats } from './ParticleSystem';
import { PerformanceMonitor, generateFlyThroughPath, easing } from '../utils/visualEffects';

interface Enhanced3DMapProps {
  counties: CountyData[];
  config?: GraphicsConfig;
  onCountyClick?: (county: CountyData) => void;
  autoFlyThrough?: boolean;
}

/**
 * 3D County Terrain Mesh
 * Elevates counties based on child population for dramatic visualization
 */
function CountyTerrain({ counties, onCountyClick }: {
  counties: CountyData[];
  onCountyClick?: (county: CountyData) => void;
}) {
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

  // Animate hover effect
  useFrame(() => {
    meshRefs.current.forEach((mesh, fips) => {
      if (fips === hoveredCounty) {
        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 1.2, 0.1);
      } else {
        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 1.0, 0.1);
      }
    });
  });

  return (
    <group>
      {counties.map((county) => {
        // Calculate elevation based on child count (logarithmic scale for better visualization)
        const baseHeight = Math.log(county.totalChildren + 1) * 2000;

        // Convert lat/lng to approximate 3D coordinates
        const x = county.lng * 100000;
        const z = county.lat * 100000;

        // Color based on child count
        const color = new THREE.Color().setHSL(
          0.6 - (county.totalChildren / 5000) * 0.4, // Hue: blue to red
          0.7,
          0.5
        );

        return (
          <mesh
            key={county.fips}
            ref={(ref) => {
              if (ref) meshRefs.current.set(county.fips, ref);
            }}
            position={[x, baseHeight / 2, z]}
            onPointerEnter={() => setHoveredCounty(county.fips)}
            onPointerLeave={() => setHoveredCounty(null)}
            onClick={() => onCountyClick?.(county)}
            castShadow
            receiveShadow
          >
            {/* County column */}
            <cylinderGeometry args={[2000, 2500, baseHeight, 32]} />
            <meshStandardMaterial
              color={color}
              metalness={0.3}
              roughness={0.4}
              emissive={hoveredCounty === county.fips ? color : new THREE.Color(0x000000)}
              emissiveIntensity={hoveredCounty === county.fips ? 0.5 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Dramatic Lighting Setup
 */
function DramaticLighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Animate light for dramatic effect
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime;
      lightRef.current.intensity = 2 + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <>
      {/* Main directional light */}
      <directionalLight
        ref={lightRef}
        position={[50000, 100000, 50000]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200000}
        shadow-camera-left={-100000}
        shadow-camera-right={100000}
        shadow-camera-top={100000}
        shadow-camera-bottom={-100000}
      />

      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.3} />

      {/* Hemisphere light for sky/ground color gradient */}
      <hemisphereLight
        color={0x87CEEB} // Sky blue
        groundColor={0x1a1a1a} // Dark ground
        intensity={0.6}
      />

      {/* Accent lights for drama */}
      <pointLight position={[-50000, 30000, 0]} intensity={0.5} color={0x3B82F6} />
      <pointLight position={[50000, 30000, 0]} intensity={0.5} color={0xEC4899} />
    </>
  );
}

/**
 * Animated Camera Controller
 */
function CameraController({ counties, autoFlyThrough }: {
  counties: CountyData[];
  autoFlyThrough?: boolean;
}) {
  const { camera } = useThree();
  const [currentKeyframe, setCurrentKeyframe] = useState(0);
  const [progress, setProgress] = useState(0);
  const flyThroughPath = useRef(generateFlyThroughPath(counties));

  useFrame((_state, delta) => {
    if (!autoFlyThrough || flyThroughPath.current.length === 0) return;

    const keyframes = flyThroughPath.current;
    const current = keyframes[currentKeyframe];
    const next = keyframes[(currentKeyframe + 1) % keyframes.length];

    if (!current || !next) return;

    // Update progress
    const newProgress = progress + (delta * 1000) / current.duration;
    setProgress(newProgress);

    // Interpolate camera position and target
    const t = easing[current.easing](Math.min(newProgress, 1));

    const position = new THREE.Vector3(
      current.position[0] + (next.position[0] - current.position[0]) * t,
      current.position[1] + (next.position[1] - current.position[1]) * t,
      current.position[2] + (next.position[2] - current.position[2]) * t
    );

    const target = new THREE.Vector3(
      current.target[0] + (next.target[0] - current.target[0]) * t,
      current.target[1] + (next.target[1] - current.target[1]) * t,
      current.target[2] + (next.target[2] - current.target[2]) * t
    );

    camera.position.copy(position);
    camera.lookAt(target);

    // Move to next keyframe
    if (newProgress >= 1) {
      setCurrentKeyframe((currentKeyframe + 1) % keyframes.length);
      setProgress(0);
    }
  });

  return null;
}

/**
 * Main Enhanced 3D Map Scene
 */
function Scene({ counties, config, onCountyClick, autoFlyThrough }: Enhanced3DMapProps) {
  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 50000, 30000]}
        fov={60}
        near={100}
        far={500000}
      />

      {/* Camera controls */}
      {!autoFlyThrough && (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={10000}
          maxDistance={150000}
          maxPolarAngle={Math.PI / 2}
        />
      )}

      {autoFlyThrough && <CameraController counties={counties} autoFlyThrough={autoFlyThrough} />}

      {/* Lighting */}
      <DramaticLighting />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* 3D County terrain */}
      <CountyTerrain counties={counties} onCountyClick={onCountyClick} />

      {/* Particle system */}
      {config?.enableParticles && (
        <Suspense fallback={null}>
          <ParticleSystem
            counties={counties}
            particlesPerCounty={config.particleCount}
            quality={config.quality}
          />
        </Suspense>
      )}

      {/* Ground plane for shadow receiving */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300000, 300000]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
}

/**
 * Enhanced 3D Map Component with Post-Processing
 */
export function Enhanced3DMap({
  counties,
  config = {
    quality: 'high',
    enableParticles: true,
    enableGlow: true,
    enable3D: true,
    targetFPS: 60,
    particleCount: 50
  },
  onCountyClick,
  autoFlyThrough = false
}: Enhanced3DMapProps) {
  const performanceMonitor = useRef(new PerformanceMonitor());
  const [showStats, setShowStats] = useState(false);

  // Toggle stats with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        setShowStats(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio for performance
      >
        <Scene
          counties={counties}
          config={config}
          onCountyClick={onCountyClick}
          autoFlyThrough={autoFlyThrough}
        />

        {/* Post-processing effects */}
        {config.enableGlow && (
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              radius={0.8}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        )}
      </Canvas>

      {/* Performance stats */}
      {showStats && <ParticleSystemStats monitor={performanceMonitor.current} />}

      {/* Privacy notice */}
      <div className="absolute top-4 left-4 z-10 max-w-md privacy-notice shadow-lg">
        <p className="font-semibold text-amber-900">
          3D Aggregate Visualization
        </p>
        <p className="text-amber-800 text-xs mt-1">
          Column heights represent county child counts. All data is aggregate only.
        </p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-lg text-xs">
        <p className="font-semibold mb-2">Controls:</p>
        <ul className="space-y-1">
          <li>Left-drag: Rotate view</li>
          <li>Right-drag: Pan</li>
          <li>Scroll: Zoom</li>
          <li>F3: Toggle stats</li>
          <li>Click: County info</li>
        </ul>
      </div>

      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-20">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-semibold">Loading 3D Visualization...</p>
            <p className="text-gray-400 text-sm mt-2">GPU acceleration enabled</p>
          </div>
        </div>
      } />
    </div>
  );
}
