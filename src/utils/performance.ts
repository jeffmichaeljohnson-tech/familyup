/**
 * Performance Monitoring System for FamilyUp
 *
 * Real-time FPS tracking, memory monitoring, and adaptive quality system
 *
 * TARGETS:
 * - Maintain 60fps with 10,000 markers
 * - Auto-downgrade quality if performance drops
 * - Memory leak detection
 * - Render profiling
 */

/**
 * Performance metrics snapshot
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number; // milliseconds
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  renderTime: number;
  lastUpdate: number;
}

/**
 * Performance budget thresholds
 */
export interface PerformanceBudget {
  targetFPS: number;
  minFPS: number;
  maxFrameTime: number; // milliseconds
  maxMemory: number; // bytes
  renderBudget: number; // milliseconds per frame
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  targetFPS: 60,
  minFPS: 30,
  maxFrameTime: 16.67, // 60fps = 16.67ms per frame
  maxMemory: 500 * 1024 * 1024, // 500MB
  renderBudget: 10, // 10ms for rendering
};

/**
 * FPS Counter
 * Tracks frames per second with rolling average
 */
export class FPSCounter {
  private frames: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private frameTimes: number[] = [];
  private maxSamples: number = 60;

  /**
   * Call this on each animation frame
   */
  tick(): number {
    const now = performance.now();
    const delta = now - this.lastTime;

    this.frames++;
    this.frameTimes.push(delta);

    // Keep only recent samples
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }

    // Calculate FPS every second
    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frames = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get average frame time in milliseconds
   */
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    const sum = this.frameTimes.reduce((a, b) => a + b, 0);
    return sum / this.frameTimes.length;
  }

  /**
   * Get frame time percentiles for profiling
   */
  getFrameTimePercentile(percentile: number): number {
    if (this.frameTimes.length === 0) return 0;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * (percentile / 100));
    return sorted[index] || 0;
  }

  /**
   * Reset counter
   */
  reset(): void {
    this.frames = 0;
    this.lastTime = performance.now();
    this.frameTimes = [];
  }
}

/**
 * Performance Monitor
 * Comprehensive performance tracking and adaptive quality
 */
export class PerformanceMonitor {
  private fpsCounter: FPSCounter;
  private budget: PerformanceBudget;
  private metrics: PerformanceMetrics;
  private listeners: Set<(metrics: PerformanceMetrics) => void>;
  private rafId: number | null = null;
  private renderStartTime: number = 0;

  constructor(budget: Partial<PerformanceBudget> = {}) {
    this.fpsCounter = new FPSCounter();
    this.budget = { ...DEFAULT_PERFORMANCE_BUDGET, ...budget };
    this.listeners = new Set();

    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      renderTime: 0,
      lastUpdate: performance.now(),
    };
  }

  /**
   * Start monitoring
   */
  start(): void {
    if (this.rafId !== null) return;

    const monitor = () => {
      this.update();
      this.rafId = requestAnimationFrame(monitor);
    };

    this.rafId = requestAnimationFrame(monitor);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Update metrics
   */
  private update(): void {
    const fps = this.fpsCounter.tick();
    const frameTime = this.fpsCounter.getAverageFrameTime();

    this.metrics = {
      fps,
      frameTime,
      memory: this.getMemoryInfo(),
      renderTime: this.metrics.renderTime,
      lastUpdate: performance.now(),
    };

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.metrics));
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get memory information (if available)
   */
  private getMemoryInfo(): PerformanceMetrics['memory'] | undefined {
    // @ts-ignore - performance.memory is non-standard
    const memory = (performance as any).memory;

    if (memory) {
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }

    return undefined;
  }

  /**
   * Check if performance is within budget
   */
  isWithinBudget(): boolean {
    return (
      this.metrics.fps >= this.budget.minFPS &&
      this.metrics.frameTime <= this.budget.maxFrameTime &&
      (!this.metrics.memory || this.metrics.memory.usedJSHeapSize <= this.budget.maxMemory)
    );
  }

  /**
   * Get performance health score (0-100)
   */
  getHealthScore(): number {
    const fpsScore = Math.min(100, (this.metrics.fps / this.budget.targetFPS) * 100);
    const frameTimeScore = Math.max(
      0,
      100 - ((this.metrics.frameTime - this.budget.maxFrameTime) / this.budget.maxFrameTime) * 100
    );

    let memoryScore = 100;
    if (this.metrics.memory) {
      const memoryUsage = this.metrics.memory.usedJSHeapSize / this.budget.maxMemory;
      memoryScore = Math.max(0, 100 - memoryUsage * 100);
    }

    return (fpsScore * 0.5 + frameTimeScore * 0.3 + memoryScore * 0.2);
  }

  /**
   * Mark start of render
   */
  startRender(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * Mark end of render
   */
  endRender(): void {
    if (this.renderStartTime > 0) {
      this.metrics.renderTime = performance.now() - this.renderStartTime;
      this.renderStartTime = 0;
    }
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get performance warnings
   */
  getWarnings(): string[] {
    const warnings: string[] = [];

    if (this.metrics.fps < this.budget.minFPS) {
      warnings.push(`Low FPS: ${this.metrics.fps} (target: ${this.budget.targetFPS})`);
    }

    if (this.metrics.frameTime > this.budget.maxFrameTime * 2) {
      warnings.push(`High frame time: ${this.metrics.frameTime.toFixed(2)}ms`);
    }

    if (this.metrics.memory) {
      const memoryUsageMB = this.metrics.memory.usedJSHeapSize / (1024 * 1024);
      const maxMemoryMB = this.budget.maxMemory / (1024 * 1024);

      if (memoryUsageMB > maxMemoryMB) {
        warnings.push(`High memory usage: ${memoryUsageMB.toFixed(0)}MB (max: ${maxMemoryMB}MB)`);
      }
    }

    if (this.metrics.renderTime > this.budget.renderBudget) {
      warnings.push(`Slow render: ${this.metrics.renderTime.toFixed(2)}ms`);
    }

    return warnings;
  }
}

/**
 * Adaptive Quality System
 * Automatically adjusts quality settings based on performance
 */
export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';

export interface QualitySettings {
  level: QualityLevel;
  maxMarkers: number;
  enableClustering: boolean;
  clusterRadius: number;
  enableAnimations: boolean;
  enableShadows: boolean;
  enableGlow: boolean;
  particleCount: number;
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  ultra: {
    level: 'ultra',
    maxMarkers: 10000,
    enableClustering: false,
    clusterRadius: 0,
    enableAnimations: true,
    enableShadows: true,
    enableGlow: true,
    particleCount: 1000,
  },
  high: {
    level: 'high',
    maxMarkers: 5000,
    enableClustering: true,
    clusterRadius: 40,
    enableAnimations: true,
    enableShadows: true,
    enableGlow: true,
    particleCount: 500,
  },
  medium: {
    level: 'medium',
    maxMarkers: 2000,
    enableClustering: true,
    clusterRadius: 60,
    enableAnimations: true,
    enableShadows: false,
    enableGlow: false,
    particleCount: 200,
  },
  low: {
    level: 'low',
    maxMarkers: 500,
    enableClustering: true,
    clusterRadius: 80,
    enableAnimations: false,
    enableShadows: false,
    enableGlow: false,
    particleCount: 0,
  },
};

export class AdaptiveQualityManager {
  private monitor: PerformanceMonitor;
  private currentQuality: QualityLevel = 'high';
  private listeners: Set<(quality: QualitySettings) => void>;
  private autoAdjust: boolean = true;
  private checkInterval: number = 2000; // Check every 2 seconds
  private lastCheck: number = 0;

  constructor(monitor: PerformanceMonitor, initialQuality: QualityLevel = 'high') {
    this.monitor = monitor;
    this.currentQuality = initialQuality;
    this.listeners = new Set();
  }

  /**
   * Get current quality settings
   */
  getQualitySettings(): QualitySettings {
    return QUALITY_PRESETS[this.currentQuality];
  }

  /**
   * Set quality level manually
   */
  setQualityLevel(level: QualityLevel): void {
    if (this.currentQuality !== level) {
      this.currentQuality = level;
      this.notifyListeners();
    }
  }

  /**
   * Enable/disable auto quality adjustment
   */
  setAutoAdjust(enabled: boolean): void {
    this.autoAdjust = enabled;
  }

  /**
   * Update quality based on performance (call in animation loop)
   */
  update(): void {
    if (!this.autoAdjust) return;

    const now = performance.now();
    if (now - this.lastCheck < this.checkInterval) return;

    this.lastCheck = now;
    const metrics = this.monitor.getMetrics();

    // Determine if we should adjust quality
    if (metrics.fps < 45 && this.currentQuality !== 'low') {
      // Performance is poor, downgrade
      this.downgradeQuality();
    } else if (metrics.fps >= 58 && this.currentQuality !== 'ultra') {
      // Performance is excellent, try upgrading
      this.upgradeQuality();
    }
  }

  /**
   * Downgrade quality level
   */
  private downgradeQuality(): void {
    const levels: QualityLevel[] = ['ultra', 'high', 'medium', 'low'];
    const currentIndex = levels.indexOf(this.currentQuality);

    if (currentIndex < levels.length - 1) {
      this.currentQuality = levels[currentIndex + 1];
      console.warn(`Performance issue detected. Downgrading to ${this.currentQuality} quality.`);
      this.notifyListeners();
    }
  }

  /**
   * Upgrade quality level
   */
  private upgradeQuality(): void {
    const levels: QualityLevel[] = ['ultra', 'high', 'medium', 'low'];
    const currentIndex = levels.indexOf(this.currentQuality);

    if (currentIndex > 0) {
      this.currentQuality = levels[currentIndex - 1];
      console.log(`Performance improved. Upgrading to ${this.currentQuality} quality.`);
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to quality changes
   */
  subscribe(listener: (quality: QualitySettings) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current quality
    listener(this.getQualitySettings());
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of quality change
   */
  private notifyListeners(): void {
    const settings = this.getQualitySettings();
    this.listeners.forEach((listener) => listener(settings));
  }
}

/**
 * Detect device capabilities
 */
export interface DeviceCapabilities {
  gpu: 'high' | 'medium' | 'low';
  memory: number; // GB
  cores: number;
  mobile: boolean;
  recommendedQuality: QualityLevel;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // @ts-ignore
  const memory = (navigator as any).deviceMemory || 4; // GB
  const cores = navigator.hardwareConcurrency || 4;

  // Rough GPU detection via canvas performance
  let gpu: 'high' | 'medium' | 'low' = 'medium';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // Simple heuristic
        if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('RTX')) {
          gpu = 'high';
        } else if (renderer.includes('Intel')) {
          gpu = 'medium';
        } else {
          gpu = 'low';
        }
      }
    }
  } catch (e) {
    gpu = 'medium';
  }

  // Determine recommended quality
  let recommendedQuality: QualityLevel = 'medium';

  if (isMobile) {
    recommendedQuality = memory >= 4 ? 'medium' : 'low';
  } else {
    if (gpu === 'high' && memory >= 8 && cores >= 4) {
      recommendedQuality = 'ultra';
    } else if (gpu === 'medium' && memory >= 4) {
      recommendedQuality = 'high';
    } else if (memory >= 2) {
      recommendedQuality = 'medium';
    } else {
      recommendedQuality = 'low';
    }
  }

  return {
    gpu,
    memory,
    cores,
    mobile: isMobile,
    recommendedQuality,
  };
}

/**
 * Memory leak detector
 * Tracks memory growth over time
 */
export class MemoryLeakDetector {
  private samples: number[] = [];
  private maxSamples: number = 50;
  private threshold: number = 1.5; // 50% growth = potential leak

  /**
   * Record current memory usage
   */
  recordSample(): void {
    // @ts-ignore
    const memory = (performance as any).memory;
    if (!memory) return;

    this.samples.push(memory.usedJSHeapSize);

    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  /**
   * Detect if there's a potential memory leak
   */
  hasLeak(): boolean {
    if (this.samples.length < this.maxSamples) return false;

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const growth = last / first;

    return growth >= this.threshold;
  }

  /**
   * Get memory growth rate
   */
  getGrowthRate(): number {
    if (this.samples.length < 2) return 0;

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];

    return ((last - first) / first) * 100;
  }

  /**
   * Reset detector
   */
  reset(): void {
    this.samples = [];
  }
}

/**
 * Global performance manager instance
 */
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
    globalPerformanceMonitor.start();
  }
  return globalPerformanceMonitor;
}
