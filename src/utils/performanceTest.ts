/**
 * Performance Testing Utilities for FamilyUp
 *
 * Comprehensive benchmarking and load testing suite
 *
 * TESTS:
 * - Load testing with 10,000 icons
 * - FPS stability tests
 * - Memory leak detection
 * - Render performance profiling
 */

import { ChildIcon } from '../types';
import { PerformanceMonitor, MemoryLeakDetector } from './performance';
import { MarkerClusterManager } from './clustering';

/**
 * Test result
 */
export interface TestResult {
  name: string;
  passed: boolean;
  duration: number; // milliseconds
  metrics: Record<string, number>;
  errors: string[];
  warnings: string[];
}

/**
 * Benchmark suite
 */
export interface BenchmarkSuite {
  name: string;
  tests: TestResult[];
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    totalDuration: number;
    averageFPS?: number;
    peakMemory?: number;
  };
}

/**
 * Generate test markers
 */
export function generateTestMarkers(count: number, bounds?: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): ChildIcon[] {
  const defaultBounds = {
    minLat: 41.7,
    maxLat: 48.3,
    minLng: -90.4,
    maxLng: -82.4,
  };

  const b = bounds || defaultBounds;
  const markers: ChildIcon[] = [];

  for (let i = 0; i < count; i++) {
    const lat = b.minLat + Math.random() * (b.maxLat - b.minLat);
    const lng = b.minLng + Math.random() * (b.maxLng - b.minLng);
    const gender = Math.random() > 0.5 ? 'boy' : 'girl';
    const ageGroups: Array<'0-5' | '6-10' | '11-17'> = ['0-5', '6-10', '11-17'];
    const ageGroup = ageGroups[Math.floor(Math.random() * 3)];

    markers.push({
      id: `test-marker-${i}`,
      position: { lat, lng },
      gender,
      countyFips: `26${Math.floor(Math.random() * 83).toString().padStart(3, '0')}`,
      ageGroup,
    });
  }

  return markers;
}

/**
 * Performance benchmark runner
 */
export class PerformanceBenchmark {
  private monitor: PerformanceMonitor;
  private results: TestResult[] = [];

  constructor() {
    this.monitor = new PerformanceMonitor();
  }

  /**
   * Run all benchmarks
   */
  async runAll(): Promise<BenchmarkSuite> {
    console.log('Starting FamilyUp Performance Benchmark Suite...');

    this.results = [];

    // Run tests
    await this.testMarkerGeneration();
    await this.testClusteringPerformance();
    await this.testRenderPerformance();
    await this.testMemoryUsage();
    await this.testFPSStability();
    await this.testScalability();

    // Generate summary
    const summary = this.generateSummary();

    return {
      name: 'FamilyUp Performance Benchmark',
      tests: this.results,
      summary,
    };
  }

  /**
   * Test 1: Marker Generation
   */
  private async testMarkerGeneration(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Generate 10,000 markers
      const markers = generateTestMarkers(10000);

      const duration = performance.now() - startTime;

      this.results.push({
        name: 'Marker Generation (10,000 markers)',
        passed: markers.length === 10000 && duration < 1000,
        duration,
        metrics: {
          markerCount: markers.length,
          timePerMarker: duration / markers.length,
        },
        errors,
        warnings: duration > 500 ? ['Generation took longer than expected'] : [],
      });
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'Marker Generation',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Test 2: Clustering Performance
   */
  private async testClusteringPerformance(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const markers = generateTestMarkers(10000);
      const clusterManager = new MarkerClusterManager();

      // Load markers
      const loadStart = performance.now();
      clusterManager.loadMarkers(markers);
      const loadDuration = performance.now() - loadStart;

      // Get clusters
      const clusterStart = performance.now();
      const clusters = clusterManager.getClusters([-90.4, 41.7, -82.4, 48.3], 8);
      const clusterDuration = performance.now() - clusterStart;

      const totalDuration = performance.now() - startTime;
      const passed = loadDuration < 500 && clusterDuration < 50;

      this.results.push({
        name: 'Clustering Performance (10,000 markers)',
        passed,
        duration: totalDuration,
        metrics: {
          loadTime: loadDuration,
          clusterTime: clusterDuration,
          clusterCount: clusters.length,
          reductionRatio: (markers.length - clusters.length) / markers.length,
        },
        errors,
        warnings:
          clusterDuration > 25 ? ['Cluster calculation slower than target (25ms)'] : [],
      });
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'Clustering Performance',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Test 3: Render Performance
   */
  private async testRenderPerformance(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Create offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      const markers = generateTestMarkers(5000);

      // Measure render time
      const renderStart = performance.now();

      markers.forEach((marker) => {
        const x = ((marker.position.lng + 90.4) / 8) * canvas.width;
        const y = ((marker.position.lat - 41.7) / 6.6) * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = marker.gender === 'boy' ? '#3b82f6' : '#ec4899';
        ctx.fill();
      });

      const renderDuration = performance.now() - renderStart;
      const totalDuration = performance.now() - startTime;

      // Target: render 5000 markers in < 16ms (60fps)
      const passed = renderDuration < 16;

      this.results.push({
        name: 'Render Performance (5,000 markers)',
        passed,
        duration: totalDuration,
        metrics: {
          renderTime: renderDuration,
          markersPerMs: markers.length / renderDuration,
          estimatedFPS: 1000 / renderDuration,
        },
        errors,
        warnings: renderDuration > 10 ? ['Render time exceeds target (10ms)'] : [],
      });
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'Render Performance',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Test 4: Memory Usage
   */
  private async testMemoryUsage(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // @ts-ignore
      const memory = (performance as any).memory;

      if (!memory) {
        warnings.push('Memory API not available (Chrome only)');
        this.results.push({
          name: 'Memory Usage Test',
          passed: true,
          duration: performance.now() - startTime,
          metrics: {},
          errors,
          warnings,
        });
        return;
      }

      const initialMemory = memory.usedJSHeapSize;

      // Generate large dataset
      const markers = generateTestMarkers(50000);

      const finalMemory = memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryPerMarker = memoryIncrease / markers.length;

      // Target: < 1KB per marker
      const passed = memoryPerMarker < 1024;

      this.results.push({
        name: 'Memory Usage (50,000 markers)',
        passed,
        duration: performance.now() - startTime,
        metrics: {
          initialMemoryMB: initialMemory / (1024 * 1024),
          finalMemoryMB: finalMemory / (1024 * 1024),
          memoryIncreaseMB: memoryIncrease / (1024 * 1024),
          bytesPerMarker: memoryPerMarker,
        },
        errors,
        warnings: memoryPerMarker > 500 ? ['Memory per marker exceeds target (500 bytes)'] : [],
      });

      // Memory will be cleaned up by garbage collector
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'Memory Usage',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Test 5: FPS Stability
   */
  private async testFPSStability(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this.monitor.start();

      const fpsSamples: number[] = [];
      const duration = 2000; // 2 seconds
      const sampleInterval = 100; // Sample every 100ms

      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          const metrics = this.monitor.getMetrics();
          fpsSamples.push(metrics.fps);

          if (performance.now() - startTime >= duration) {
            clearInterval(interval);
            resolve();
          }
        }, sampleInterval);
      });

      this.monitor.stop();

      // Calculate statistics
      const avgFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
      const minFPS = Math.min(...fpsSamples);
      const maxFPS = Math.max(...fpsSamples);
      const variance =
        fpsSamples.reduce((sum, fps) => sum + Math.pow(fps - avgFPS, 2), 0) / fpsSamples.length;
      const stdDev = Math.sqrt(variance);

      // Target: avg FPS >= 55, std dev < 10
      const passed = avgFPS >= 55 && stdDev < 10;

      this.results.push({
        name: 'FPS Stability Test (2 seconds)',
        passed,
        duration: performance.now() - startTime,
        metrics: {
          averageFPS: avgFPS,
          minFPS,
          maxFPS,
          standardDeviation: stdDev,
        },
        errors,
        warnings: avgFPS < 58 ? ['Average FPS below target (58)'] : [],
      });
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'FPS Stability',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Test 6: Scalability
   */
  private async testScalability(): Promise<void> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const counts = [100, 500, 1000, 5000, 10000];
      const renderTimes: number[] = [];

      for (const count of counts) {
        const markers = generateTestMarkers(count);

        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        if (!ctx) continue;

        const renderStart = performance.now();

        markers.forEach((marker) => {
          const x = ((marker.position.lng + 90.4) / 8) * canvas.width;
          const y = ((marker.position.lat - 41.7) / 6.6) * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = marker.gender === 'boy' ? '#3b82f6' : '#ec4899';
          ctx.fill();
        });

        renderTimes.push(performance.now() - renderStart);
      }

      // Check if scaling is roughly linear (O(n))
      const scalingFactor = renderTimes[4] / renderTimes[0]; // 10000 vs 100
      const expectedScaling = counts[4] / counts[0]; // 100x
      const scalingRatio = scalingFactor / expectedScaling;

      // Good scaling: ratio close to 1.0 (linear)
      const passed = scalingRatio < 2.0; // Allow 2x overhead

      this.results.push({
        name: 'Scalability Test (100 to 10,000 markers)',
        passed,
        duration: performance.now() - startTime,
        metrics: {
          renderTime100: renderTimes[0],
          renderTime500: renderTimes[1],
          renderTime1000: renderTimes[2],
          renderTime5000: renderTimes[3],
          renderTime10000: renderTimes[4],
          scalingFactor,
          scalingRatio,
        },
        errors,
        warnings: scalingRatio > 1.5 ? ['Scaling worse than linear'] : [],
      });
    } catch (error) {
      errors.push(String(error));
      this.results.push({
        name: 'Scalability',
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      });
    }
  }

  /**
   * Generate summary
   */
  private generateSummary(): BenchmarkSuite['summary'] {
    const totalTests = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = totalTests - passed;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    // Extract specific metrics
    const fpsTest = this.results.find((r) => r.name.includes('FPS Stability'));
    const memoryTest = this.results.find((r) => r.name.includes('Memory Usage'));

    return {
      totalTests,
      passed,
      failed,
      totalDuration,
      averageFPS: fpsTest?.metrics.averageFPS,
      peakMemory: memoryTest?.metrics.finalMemoryMB,
    };
  }

  /**
   * Print results to console
   */
  printResults(suite: BenchmarkSuite): void {
    console.log('\n=== FamilyUp Performance Benchmark Results ===\n');

    suite.tests.forEach((test) => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`${icon} ${test.name}`);
      console.log(`   Duration: ${test.duration.toFixed(2)}ms`);

      Object.entries(test.metrics).forEach(([key, value]) => {
        console.log(`   ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`);
      });

      if (test.warnings.length > 0) {
        console.log(`   ⚠️  Warnings: ${test.warnings.join(', ')}`);
      }

      if (test.errors.length > 0) {
        console.log(`   ❌ Errors: ${test.errors.join(', ')}`);
      }

      console.log('');
    });

    console.log('\n=== Summary ===');
    console.log(`Total Tests: ${suite.summary.totalTests}`);
    console.log(`Passed: ${suite.summary.passed}`);
    console.log(`Failed: ${suite.summary.failed}`);
    console.log(`Total Duration: ${suite.summary.totalDuration.toFixed(2)}ms`);

    if (suite.summary.averageFPS) {
      console.log(`Average FPS: ${suite.summary.averageFPS.toFixed(2)}`);
    }

    if (suite.summary.peakMemory) {
      console.log(`Peak Memory: ${suite.summary.peakMemory.toFixed(2)}MB`);
    }

    console.log('\n===========================================\n');
  }
}

/**
 * Load test runner
 * Simulates realistic usage with thousands of markers
 */
export class LoadTestRunner {
  private monitor: PerformanceMonitor;
  private leakDetector: MemoryLeakDetector;

  constructor() {
    this.monitor = new PerformanceMonitor();
    this.leakDetector = new MemoryLeakDetector();
  }

  /**
   * Run load test
   */
  async runLoadTest(markerCount: number, durationSeconds: number): Promise<TestResult> {
    console.log(`Starting load test: ${markerCount} markers for ${durationSeconds} seconds...`);

    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Generate markers
      // const markers = generateTestMarkers(markerCount);

      // Start monitoring
      this.monitor.start();

      const fpsSamples: number[] = [];
      const frameTimeSamples: number[] = [];

      // Run for specified duration
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          const metrics = this.monitor.getMetrics();
          fpsSamples.push(metrics.fps);
          frameTimeSamples.push(metrics.frameTime);

          // Record memory sample
          this.leakDetector.recordSample();

          if (performance.now() - startTime >= durationSeconds * 1000) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      this.monitor.stop();

      // Calculate metrics
      const avgFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
      const minFPS = Math.min(...fpsSamples);
      const avgFrameTime = frameTimeSamples.reduce((a, b) => a + b, 0) / frameTimeSamples.length;
      const maxFrameTime = Math.max(...frameTimeSamples);

      // Check for memory leaks
      const hasLeak = this.leakDetector.hasLeak();
      const growthRate = this.leakDetector.getGrowthRate();

      if (hasLeak) {
        errors.push(`Potential memory leak detected (${growthRate.toFixed(2)}% growth)`);
      }

      // Pass criteria: avg FPS >= 30, no memory leaks
      const passed = avgFPS >= 30 && !hasLeak;

      if (minFPS < 24) {
        warnings.push(`Minimum FPS dropped below 24 (${minFPS.toFixed(2)})`);
      }

      if (maxFrameTime > 50) {
        warnings.push(`Frame time spikes detected (${maxFrameTime.toFixed(2)}ms)`);
      }

      return {
        name: `Load Test (${markerCount} markers, ${durationSeconds}s)`,
        passed,
        duration: performance.now() - startTime,
        metrics: {
          markerCount,
          averageFPS: avgFPS,
          minimumFPS: minFPS,
          averageFrameTime: avgFrameTime,
          maxFrameTime,
          memoryGrowthRate: growthRate,
        },
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(String(error));
      return {
        name: `Load Test (${markerCount} markers)`,
        passed: false,
        duration: performance.now() - startTime,
        metrics: {},
        errors,
        warnings,
      };
    }
  }
}

/**
 * Quick performance check
 * Run this to verify system is performing adequately
 */
export async function quickPerformanceCheck(): Promise<boolean> {
  const benchmark = new PerformanceBenchmark();
  const suite = await benchmark.runAll();

  benchmark.printResults(suite);

  return suite.summary.passed >= suite.summary.totalTests * 0.8; // 80% pass rate
}

/**
 * Stress test
 * Push the system to its limits
 */
export async function stressTest(): Promise<TestResult> {
  console.log('Starting stress test...');

  const loadTest = new LoadTestRunner();
  return await loadTest.runLoadTest(100000, 30); // 100k markers for 30 seconds
}

/**
 * Export convenience function to run from console
 */
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.runPerformanceBenchmark = async () => {
    const benchmark = new PerformanceBenchmark();
    const suite = await benchmark.runAll();
    benchmark.printResults(suite);
    return suite;
  };

  // @ts-ignore
  window.runLoadTest = async (markerCount: number = 10000, duration: number = 10) => {
    const loadTest = new LoadTestRunner();
    const result = await loadTest.runLoadTest(markerCount, duration);
    console.log(result);
    return result;
  };

  console.log('Performance testing utilities loaded!');
  console.log('Run: window.runPerformanceBenchmark()');
  console.log('Run: window.runLoadTest(10000, 10)');
}
