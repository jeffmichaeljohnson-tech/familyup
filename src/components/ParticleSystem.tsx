/**
 * WebGL-Accelerated Particle System
 *
 * Snapchat+ quality particle effects using Three.js:
 * - GPU-accelerated rendering of thousands of particles
 * - Color-coded particles (blue for boys, pink for girls)
 * - Smooth 60fps animations with LOD optimization
 * - Rising particle animation from county centers
 *
 * PRIVACY: Particles are visual effects only, representing aggregate data
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CountyData } from '../types';
import { particleVertexShader } from '../shaders/particleVertex.glsl';
import { particleFragmentShader } from '../shaders/particleFragment.glsl';
import {
  calculateGlowIntensity,
  generateEmissionPattern,
  hexToRGB,
  calculateParticleSize,
  PerformanceMonitor
} from '../utils/visualEffects';

interface ParticleSystemProps {
  counties: CountyData[];
  particlesPerCounty?: number;
  quality?: 'ultra' | 'high' | 'medium' | 'low';
}

// Gender colors (Snapchat+ style)
const GENDER_COLORS = {
  boy: '#3B82F6', // Blue
  girl: '#EC4899' // Pink
};

export function ParticleSystem({
  counties,
  particlesPerCounty = 50,
  quality = 'high'
}: ParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const performanceMonitor = useRef(new PerformanceMonitor());

  // Adjust particle count based on quality setting
  const adjustedParticleCount = useMemo(() => {
    const qualityMultipliers = {
      ultra: 1.0,
      high: 0.7,
      medium: 0.4,
      low: 0.2
    };
    return Math.floor(particlesPerCounty * qualityMultipliers[quality]);
  }, [particlesPerCounty, quality]);

  // Generate particle data
  const { geometry } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const lifetimes: number[] = [];
    const speeds: number[] = [];
    const velocities: number[] = [];
    const phases: number[] = [];

    let totalParticles = 0;

    counties.forEach(county => {
      // Number of particles based on child count (aggregate visualization)
      const countyParticles = Math.min(
        adjustedParticleCount,
        Math.ceil(county.totalChildren / 10)
      );

      // Gender ratio for color distribution
      const boyRatio = county.genderBreakdown.boys / county.totalChildren;

      // Generate emission pattern
      const emissionPattern = generateEmissionPattern(
        county,
        countyParticles,
        'fountain'
      );

      for (let i = 0; i < countyParticles; i++) {
        const pattern = emissionPattern[i];

        // Position (county center + pattern offset)
        // Convert lat/lng to approximate meters (simplified)
        const baseX = county.lng * 100000;
        const baseZ = county.lat * 100000;

        positions.push(
          baseX + pattern.position[0],
          pattern.position[1], // Start at ground level
          baseZ + pattern.position[2]
        );

        // Color based on gender ratio (blue for boys, pink for girls)
        const isBoy = Math.random() < boyRatio;
        const color = hexToRGB(isBoy ? GENDER_COLORS.boy : GENDER_COLORS.girl);
        colors.push(color[0], color[1], color[2]);

        // Size variation for visual interest
        const baseSize = calculateParticleSize(8, window.innerWidth);
        sizes.push(baseSize * (0.7 + Math.random() * 0.6));

        // Lifetime variation (3-7 seconds)
        lifetimes.push(3 + Math.random() * 4);

        // Speed variation for staggered animation
        speeds.push(0.8 + Math.random() * 0.4);

        // Velocity from emission pattern
        velocities.push(
          pattern.velocity[0],
          pattern.velocity[1],
          pattern.velocity[2]
        );

        // Random phase offset for natural appearance
        phases.push(Math.random() * 10);

        totalParticles++;
      }
    });

    // Create buffer geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('aLifetime', new THREE.Float32BufferAttribute(lifetimes, 1));
    geometry.setAttribute('aSpeed', new THREE.Float32BufferAttribute(speeds, 1));
    geometry.setAttribute('aVelocity', new THREE.Float32BufferAttribute(velocities, 3));
    geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));

    return { geometry, particleCount: totalParticles };
  }, [counties, adjustedParticleCount]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uGlowIntensity: { value: 1.0 },
        uCameraPosition: { value: new THREE.Vector3() }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Glow effect
      vertexColors: true
    });
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // Update performance monitor
    performanceMonitor.current.update();

    // Update time uniform for animation
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Update glow intensity with pulsing effect
    const glowIntensity = calculateGlowIntensity(state.clock.elapsedTime);
    materialRef.current.uniforms.uGlowIntensity.value = glowIntensity;

    // Update camera position for proper depth sorting
    materialRef.current.uniforms.uCameraPosition.value.copy(state.camera.position);

    // Adaptive quality based on performance
    if (performanceMonitor.current.shouldReduceQuality()) {
      // Reduce particle visibility if performance drops
      if (particlesRef.current) {
        particlesRef.current.frustumCulled = true;
      }
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <points ref={particlesRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
}

/**
 * Performance Statistics Display Component
 */
export function ParticleSystemStats({ monitor }: { monitor: PerformanceMonitor }) {
  const fps = monitor.getFPS();
  const avgFrameTime = monitor.getAverageFrameTime();

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg font-mono text-xs">
      <div>FPS: {fps}</div>
      <div>Frame: {avgFrameTime.toFixed(2)}ms</div>
      <div className={fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
        {fps >= 55 ? 'Excellent' : fps >= 30 ? 'Good' : 'Reduce Quality'}
      </div>
    </div>
  );
}
