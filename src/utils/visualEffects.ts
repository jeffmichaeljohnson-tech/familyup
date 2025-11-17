/**
 * Visual Effects Utilities
 *
 * Dramatic visual effects for Snapchat+ quality graphics:
 * - Pulsing glow intensity
 * - Particle emission patterns
 * - Color gradient transitions
 * - Animation easing functions
 */

import { CountyData } from '../types';

/**
 * Easing functions for smooth animations
 */
export const easing = {
  // Cubic ease-out (fast start, slow end)
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },

  // Quad ease-in-out (smooth both ends)
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  // Elastic ease-out (bouncy)
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Exponential ease-out (very fast start)
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  // Bounce ease-out (realistic bounce)
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

/**
 * Calculate pulsing glow intensity based on time
 * Creates breathing effect with multiple harmonics
 */
export function calculateGlowIntensity(time: number, baseIntensity: number = 1.0): number {
  // Primary pulse (slow breathing)
  const primary = Math.sin(time * 0.5) * 0.3;

  // Secondary pulse (faster shimmer)
  const secondary = Math.sin(time * 2.0) * 0.15;

  // Tertiary pulse (subtle sparkle)
  const tertiary = Math.sin(time * 4.0) * 0.05;

  return baseIntensity + primary + secondary + tertiary;
}

/**
 * Generate particle emission pattern for a county
 * Returns positions in a visually pleasing distribution
 */
export function generateEmissionPattern(
  _county: CountyData,
  particleCount: number,
  pattern: 'radial' | 'spiral' | 'burst' | 'fountain' = 'radial'
): Array<{ position: [number, number, number]; velocity: [number, number, number] }> {
  const particles: Array<{ position: [number, number, number]; velocity: [number, number, number] }> = [];

  for (let i = 0; i < particleCount; i++) {
    const t = i / particleCount;
    let position: [number, number, number];
    let velocity: [number, number, number];

    switch (pattern) {
      case 'spiral':
        // Golden ratio spiral for natural distribution
        const angle = t * Math.PI * 2 * 10; // 10 rotations
        const radius = t * 500; // Expand outward
        position = [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ];
        velocity = [
          Math.cos(angle + Math.PI / 2) * 0.5,
          1.0,
          Math.sin(angle + Math.PI / 2) * 0.5
        ];
        break;

      case 'burst':
        // Explosive burst pattern
        const burstAngle = Math.random() * Math.PI * 2;
        const burstRadius = Math.random() * 300;
        position = [
          Math.cos(burstAngle) * burstRadius,
          0,
          Math.sin(burstAngle) * burstRadius
        ];
        velocity = [
          Math.cos(burstAngle) * 2.0,
          1.5,
          Math.sin(burstAngle) * 2.0
        ];
        break;

      case 'fountain':
        // Fountain-like upward spray
        const fountainAngle = Math.random() * Math.PI * 2;
        const fountainRadius = Math.random() * 150;
        position = [
          Math.cos(fountainAngle) * fountainRadius,
          0,
          Math.sin(fountainAngle) * fountainRadius
        ];
        velocity = [
          Math.cos(fountainAngle) * 0.3,
          2.0 + Math.random() * 1.0,
          Math.sin(fountainAngle) * 0.3
        ];
        break;

      default: // radial
        // Evenly distributed radial pattern
        const radialAngle = (t * Math.PI * 2) + (Math.random() * 0.2);
        const radialRadius = Math.sqrt(Math.random()) * 400; // Uniform distribution
        position = [
          Math.cos(radialAngle) * radialRadius,
          0,
          Math.sin(radialAngle) * radialRadius
        ];
        velocity = [
          (Math.random() - 0.5) * 0.5,
          1.0,
          (Math.random() - 0.5) * 0.5
        ];
        break;
    }

    particles.push({ position, velocity });
  }

  return particles;
}

/**
 * Create smooth color gradient transition between two colors
 */
export function colorGradient(
  color1: [number, number, number],
  color2: [number, number, number],
  t: number
): [number, number, number] {
  // Use smooth interpolation
  const smoothT = easing.easeInOutQuad(t);

  return [
    color1[0] + (color2[0] - color1[0]) * smoothT,
    color1[1] + (color2[1] - color1[1]) * smoothT,
    color1[2] + (color2[2] - color1[2]) * smoothT
  ];
}

/**
 * Convert hex color to RGB array (0-1 range)
 */
export function hexToRGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];

  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
}

/**
 * Calculate particle size based on screen size and importance
 */
export function calculateParticleSize(
  baseSize: number,
  screenWidth: number,
  importance: number = 1.0
): number {
  // Scale with screen size (responsive)
  const screenFactor = Math.min(screenWidth / 1920, 1.5);

  // Add importance multiplier
  return baseSize * screenFactor * importance;
}

/**
 * Generate camera fly-through keyframes for dramatic reveal
 */
export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
  duration: number;
  easing: keyof typeof easing;
}

export function generateFlyThroughPath(counties: CountyData[]): CameraKeyframe[] {
  const keyframes: CameraKeyframe[] = [];

  // Opening shot: High altitude overview
  keyframes.push({
    position: [0, 100000, 0],
    target: [0, 0, 0],
    duration: 2000,
    easing: 'easeOutCubic'
  });

  // Descend to medium altitude
  keyframes.push({
    position: [0, 50000, 30000],
    target: [0, 0, 0],
    duration: 1500,
    easing: 'easeInOutQuad'
  });

  // Fly over largest counties
  const largestCounties = [...counties]
    .sort((a, b) => b.totalChildren - a.totalChildren)
    .slice(0, 3);

  largestCounties.forEach((county) => {
    keyframes.push({
      position: [county.lng * 100000, 20000, county.lat * 100000],
      target: [county.lng * 100000, 0, county.lat * 100000],
      duration: 2000,
      easing: 'easeInOutQuad'
    });
  });

  // Final position: Medium altitude center view
  keyframes.push({
    position: [0, 30000, 25000],
    target: [0, 0, 0],
    duration: 2000,
    easing: 'easeOutCubic'
  });

  return keyframes;
}

/**
 * Performance monitor for maintaining 60fps
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTimes: number[] = [];

  update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;

    this.frameTimes.push(delta);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    this.frameCount++;

    // Update FPS every second
    if (delta >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67; // 60fps target
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 55 && this.getAverageFrameTime() < 20;
  }

  shouldReduceQuality(): boolean {
    return this.fps < 30 || this.getAverageFrameTime() > 33;
  }
}

/**
 * LOD (Level of Detail) calculator
 * Reduces particle count based on distance from camera
 */
export function calculateLOD(
  distanceFromCamera: number,
  maxParticles: number
): number {
  if (distanceFromCamera < 10000) return maxParticles; // Full detail
  if (distanceFromCamera < 30000) return Math.floor(maxParticles * 0.6); // Medium detail
  if (distanceFromCamera < 60000) return Math.floor(maxParticles * 0.3); // Low detail
  return Math.floor(maxParticles * 0.1); // Minimum detail
}
