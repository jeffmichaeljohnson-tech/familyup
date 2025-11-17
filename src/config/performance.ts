/**
 * Performance Configuration for FamilyUp
 *
 * Central configuration for performance settings, quality presets,
 * and device-specific optimizations
 */

import { QualityLevel } from '../utils/performance';

/**
 * Rendering configuration
 */
export interface RenderConfig {
  useWebGL: boolean;
  useBatching: boolean;
  enableFrustumCulling: boolean;
  enableInstanceRendering: boolean;
  maxDrawCalls: number;
  bufferSize: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  enableMarkerAnimations: boolean;
  enableClusterAnimations: boolean;
  enableTransitions: boolean;
  transitionDuration: number; // milliseconds
  easing: string;
}

/**
 * Memory configuration
 */
export interface MemoryConfig {
  maxCachedMarkers: number;
  enableMarkerPooling: boolean;
  poolSize: number;
  enableTextureAtlas: boolean;
  textureAtlasSize: number;
}

/**
 * Complete performance configuration
 */
export interface PerformanceConfig {
  quality: QualityLevel;
  render: RenderConfig;
  animation: AnimationConfig;
  memory: MemoryConfig;
  clustering: {
    enabled: boolean;
    radius: number;
    maxZoom: number;
    minPoints: number;
  };
  debugging: {
    showFPS: boolean;
    showMemory: boolean;
    showDrawCalls: boolean;
    enableProfiling: boolean;
  };
}

/**
 * Ultra Quality Preset
 * For high-end desktop GPUs (RTX 3070+, Radeon 6800+)
 */
export const ULTRA_QUALITY_CONFIG: PerformanceConfig = {
  quality: 'ultra',
  render: {
    useWebGL: true,
    useBatching: true,
    enableFrustumCulling: true,
    enableInstanceRendering: true,
    maxDrawCalls: 1000,
    bufferSize: 50000,
  },
  animation: {
    enableMarkerAnimations: true,
    enableClusterAnimations: true,
    enableTransitions: true,
    transitionDuration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  memory: {
    maxCachedMarkers: 50000,
    enableMarkerPooling: true,
    poolSize: 10000,
    enableTextureAtlas: true,
    textureAtlasSize: 4096,
  },
  clustering: {
    enabled: false, // Show all markers
    radius: 0,
    maxZoom: 22,
    minPoints: 2,
  },
  debugging: {
    showFPS: false,
    showMemory: false,
    showDrawCalls: false,
    enableProfiling: false,
  },
};

/**
 * High Quality Preset
 * For mid-range GPUs (GTX 1660+, Radeon 5600+)
 */
export const HIGH_QUALITY_CONFIG: PerformanceConfig = {
  quality: 'high',
  render: {
    useWebGL: true,
    useBatching: true,
    enableFrustumCulling: true,
    enableInstanceRendering: true,
    maxDrawCalls: 500,
    bufferSize: 20000,
  },
  animation: {
    enableMarkerAnimations: true,
    enableClusterAnimations: true,
    enableTransitions: true,
    transitionDuration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  memory: {
    maxCachedMarkers: 20000,
    enableMarkerPooling: true,
    poolSize: 5000,
    enableTextureAtlas: true,
    textureAtlasSize: 2048,
  },
  clustering: {
    enabled: true,
    radius: 40,
    maxZoom: 16,
    minPoints: 3,
  },
  debugging: {
    showFPS: false,
    showMemory: false,
    showDrawCalls: false,
    enableProfiling: false,
  },
};

/**
 * Medium Quality Preset
 * For integrated graphics (Intel Iris, AMD Vega)
 */
export const MEDIUM_QUALITY_CONFIG: PerformanceConfig = {
  quality: 'medium',
  render: {
    useWebGL: true,
    useBatching: true,
    enableFrustumCulling: true,
    enableInstanceRendering: false, // Simpler rendering
    maxDrawCalls: 200,
    bufferSize: 10000,
  },
  animation: {
    enableMarkerAnimations: true,
    enableClusterAnimations: false, // Disable for performance
    enableTransitions: true,
    transitionDuration: 200,
    easing: 'ease-out',
  },
  memory: {
    maxCachedMarkers: 10000,
    enableMarkerPooling: true,
    poolSize: 2000,
    enableTextureAtlas: true,
    textureAtlasSize: 1024,
  },
  clustering: {
    enabled: true,
    radius: 60,
    maxZoom: 14,
    minPoints: 5,
  },
  debugging: {
    showFPS: false,
    showMemory: false,
    showDrawCalls: false,
    enableProfiling: false,
  },
};

/**
 * Low Quality Preset
 * For mobile devices and older hardware
 */
export const LOW_QUALITY_CONFIG: PerformanceConfig = {
  quality: 'low',
  render: {
    useWebGL: false, // Use Canvas 2D
    useBatching: true,
    enableFrustumCulling: true,
    enableInstanceRendering: false,
    maxDrawCalls: 50,
    bufferSize: 2000,
  },
  animation: {
    enableMarkerAnimations: false,
    enableClusterAnimations: false,
    enableTransitions: false,
    transitionDuration: 0,
    easing: 'linear',
  },
  memory: {
    maxCachedMarkers: 2000,
    enableMarkerPooling: true,
    poolSize: 500,
    enableTextureAtlas: false, // Simpler rendering
    textureAtlasSize: 512,
  },
  clustering: {
    enabled: true,
    radius: 80,
    maxZoom: 12,
    minPoints: 10,
  },
  debugging: {
    showFPS: false,
    showMemory: false,
    showDrawCalls: false,
    enableProfiling: false,
  },
};

/**
 * Quality preset map
 */
export const QUALITY_CONFIGS: Record<QualityLevel, PerformanceConfig> = {
  ultra: ULTRA_QUALITY_CONFIG,
  high: HIGH_QUALITY_CONFIG,
  medium: MEDIUM_QUALITY_CONFIG,
  low: LOW_QUALITY_CONFIG,
};

/**
 * Get configuration for quality level
 */
export function getConfigForQuality(quality: QualityLevel): PerformanceConfig {
  return QUALITY_CONFIGS[quality];
}

/**
 * Merge custom config with preset
 */
export function mergeConfig(
  quality: QualityLevel,
  overrides: Partial<PerformanceConfig>
): PerformanceConfig {
  const base = getConfigForQuality(quality);
  return {
    ...base,
    ...overrides,
    render: { ...base.render, ...overrides.render },
    animation: { ...base.animation, ...overrides.animation },
    memory: { ...base.memory, ...overrides.memory },
    clustering: { ...base.clustering, ...overrides.clustering },
    debugging: { ...base.debugging, ...overrides.debugging },
  };
}

/**
 * Performance budgets for different scenarios
 */
export interface ScenarioBudget {
  name: string;
  targetFPS: number;
  maxFrameTime: number;
  maxMemory: number;
  maxMarkers: number;
  description: string;
}

export const PERFORMANCE_SCENARIOS: Record<string, ScenarioBudget> = {
  /**
   * Desktop scenario - High-end systems
   */
  desktop: {
    name: 'Desktop',
    targetFPS: 60,
    maxFrameTime: 16.67,
    maxMemory: 1024 * 1024 * 1024, // 1GB
    maxMarkers: 50000,
    description: 'High-end desktop with dedicated GPU',
  },

  /**
   * Laptop scenario - Mid-range systems
   */
  laptop: {
    name: 'Laptop',
    targetFPS: 60,
    maxFrameTime: 20,
    maxMemory: 512 * 1024 * 1024, // 512MB
    maxMarkers: 20000,
    description: 'Modern laptop with integrated graphics',
  },

  /**
   * Tablet scenario - Mobile devices
   */
  tablet: {
    name: 'Tablet',
    targetFPS: 30,
    maxFrameTime: 33.33,
    maxMemory: 256 * 1024 * 1024, // 256MB
    maxMarkers: 5000,
    description: 'iPad or Android tablet',
  },

  /**
   * Mobile scenario - Smartphones
   */
  mobile: {
    name: 'Mobile',
    targetFPS: 30,
    maxFrameTime: 40,
    maxMemory: 128 * 1024 * 1024, // 128MB
    maxMarkers: 2000,
    description: 'Modern smartphone',
  },

  /**
   * Low-end scenario - Older devices
   */
  lowEnd: {
    name: 'Low-End',
    targetFPS: 24,
    maxFrameTime: 50,
    maxMemory: 64 * 1024 * 1024, // 64MB
    maxMarkers: 500,
    description: 'Older mobile devices or low-end hardware',
  },
};

/**
 * Detect appropriate scenario based on device
 */
export function detectScenario(): ScenarioBudget {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  // @ts-ignore
  const memory = (navigator as any).deviceMemory || 4;

  if (isMobile) {
    return isTablet ? PERFORMANCE_SCENARIOS.tablet : PERFORMANCE_SCENARIOS.mobile;
  }

  if (memory >= 8) {
    return PERFORMANCE_SCENARIOS.desktop;
  } else if (memory >= 4) {
    return PERFORMANCE_SCENARIOS.laptop;
  }

  return PERFORMANCE_SCENARIOS.lowEnd;
}

/**
 * Optimization flags for specific features
 */
export interface OptimizationFlags {
  // Rendering optimizations
  useOffscreenCanvas: boolean;
  useWebWorkers: boolean;
  useSharedArrayBuffer: boolean;

  // Data optimizations
  useLazyLoading: boolean;
  useVirtualization: boolean;
  useIncrementalLoading: boolean;

  // Cache optimizations
  useServiceWorker: boolean;
  useIndexedDB: boolean;
  preloadCriticalAssets: boolean;

  // Network optimizations
  useCompression: boolean;
  useCDN: boolean;
  enableHTTP2: boolean;
}

export const DEFAULT_OPTIMIZATION_FLAGS: OptimizationFlags = {
  useOffscreenCanvas: true,
  useWebWorkers: true,
  useSharedArrayBuffer: false, // Requires specific headers

  useLazyLoading: true,
  useVirtualization: true,
  useIncrementalLoading: true,

  useServiceWorker: true,
  useIndexedDB: true,
  preloadCriticalAssets: true,

  useCompression: true,
  useCDN: true,
  enableHTTP2: true,
};

/**
 * Check if browser supports specific features
 */
export function checkFeatureSupport(): Partial<OptimizationFlags> {
  const support: Partial<OptimizationFlags> = {};

  // OffscreenCanvas
  support.useOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

  // Web Workers
  support.useWebWorkers = typeof Worker !== 'undefined';

  // SharedArrayBuffer (requires COOP/COEP headers)
  support.useSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';

  // IndexedDB
  support.useIndexedDB = typeof indexedDB !== 'undefined';

  // Service Worker
  support.useServiceWorker = 'serviceWorker' in navigator;

  return support;
}

/**
 * Get optimal configuration based on device and scenario
 */
export function getOptimalConfig(): PerformanceConfig {
  const scenario = detectScenario();
  const featureSupport = checkFeatureSupport();

  // Select quality based on scenario
  let quality: QualityLevel;
  if (scenario.maxMarkers >= 20000) {
    quality = 'ultra';
  } else if (scenario.maxMarkers >= 10000) {
    quality = 'high';
  } else if (scenario.maxMarkers >= 5000) {
    quality = 'medium';
  } else {
    quality = 'low';
  }

  const config = getConfigForQuality(quality);

  // Adjust based on feature support
  if (!featureSupport.useOffscreenCanvas) {
    config.render.useWebGL = false;
  }

  return config;
}

/**
 * Development/Debug configuration
 */
export const DEBUG_CONFIG: PerformanceConfig = {
  ...HIGH_QUALITY_CONFIG,
  debugging: {
    showFPS: true,
    showMemory: true,
    showDrawCalls: true,
    enableProfiling: true,
  },
};

/**
 * Export default configuration
 */
export const DEFAULT_CONFIG = getOptimalConfig();
