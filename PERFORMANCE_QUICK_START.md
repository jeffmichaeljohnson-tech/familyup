# Performance Optimization - Quick Start Guide

## Installation

The performance system is already installed. Dependencies added:
- `supercluster` - Marker clustering
- `@types/supercluster` - TypeScript definitions

## Quick Integration

### 1. Replace Map Component (5 minutes)

**Current (App.tsx)**:
```tsx
import { InteractiveMap } from './components/InteractiveMap';
```

**Optimized (App.tsx)**:
```tsx
import { OptimizedInteractiveMap } from './components/OptimizedInteractiveMap';
import { PerformanceMonitor } from './components/PerformanceMonitor';

// In your component
<OptimizedInteractiveMap
  counties={michiganCounties}
  onCountyClick={handleCountyClick}
  enableClustering={true}
  showPerformanceMetrics={false}
/>

{/* Optional: Show FPS counter in development */}
<PerformanceMonitor
  show={import.meta.env.DEV}
  position="top-right"
  detailed={true}
/>
```

### 2. Run Performance Benchmark (2 minutes)

Open browser console and run:

```javascript
// Quick check
await window.runPerformanceBenchmark();

// Load test with 10,000 markers for 10 seconds
await window.runLoadTest(10000, 10);
```

### 3. Enable Performance Monitoring (1 minute)

```tsx
import { getGlobalPerformanceMonitor } from './utils/performance';

// Somewhere in your app initialization
const monitor = getGlobalPerformanceMonitor();

monitor.subscribe((metrics) => {
  if (metrics.fps < 30) {
    console.warn('Low FPS detected:', metrics.fps);
  }
});
```

## Quick Settings

### Performance Presets

```tsx
import { getConfigForQuality } from './config/performance';

// Ultra: 10,000 markers, no clustering, all effects
const ultraConfig = getConfigForQuality('ultra');

// High: 5,000 markers, light clustering (default)
const highConfig = getConfigForQuality('high');

// Medium: 2,000 markers, moderate clustering
const mediumConfig = getConfigForQuality('medium');

// Low: 500 markers, heavy clustering (mobile)
const lowConfig = getConfigForQuality('low');
```

### Auto-Detect Device

```tsx
import { getOptimalConfig } from './config/performance';

// Automatically selects best quality for device
const config = getOptimalConfig();
```

## Common Tasks

### Show FPS Counter

```tsx
<PerformanceMonitor show={true} position="top-right" />
```

### Enable Clustering

```tsx
<OptimizedInteractiveMap
  enableClustering={true}
  counties={counties}
/>
```

### Generate Test Data

```tsx
import { generateTestMarkers } from './utils/performanceTest';

// Generate 10,000 test markers
const markers = generateTestMarkers(10000);
```

### Check Performance

```tsx
import { quickPerformanceCheck } from './utils/performanceTest';

// Returns true if 80%+ tests pass
const isHealthy = await quickPerformanceCheck();
```

## Troubleshooting

### Low FPS?

1. Enable clustering: `enableClustering={true}`
2. Lower quality: `getConfigForQuality('medium')`
3. Check console for warnings

### High Memory?

1. Reduce max markers in config
2. Enable marker pooling
3. Check for memory leaks with `MemoryLeakDetector`

### Slow Loading?

1. Use lazy loading for markers
2. Reduce initial marker count
3. Enable web workers (advanced)

## Performance Checklist

- [ ] Clustering enabled for 1,000+ markers
- [ ] React.memo on expensive components
- [ ] Memoized callbacks with useCallback
- [ ] Memoized calculations with useMemo
- [ ] Canvas rendering instead of DOM markers
- [ ] Frustum culling enabled
- [ ] Performance monitoring in development
- [ ] Benchmark tests passing

## Key Metrics

**Targets**:
- FPS: ≥ 60
- Frame Time: ≤ 16.67ms
- Memory: ≤ 500MB
- Load Time: ≤ 2s

**Check Current Performance**:
```javascript
const monitor = getGlobalPerformanceMonitor();
const metrics = monitor.getMetrics();
console.log(metrics);
```

## Files Created

### Core System
- `src/utils/clustering.ts` - Marker clustering system
- `src/utils/performance.ts` - Performance monitoring
- `src/config/performance.ts` - Configuration presets
- `src/utils/performanceTest.ts` - Testing utilities

### Components
- `src/components/CanvasRenderer.tsx` - WebGL renderer
- `src/components/PerformanceMonitor.tsx` - FPS counter
- `src/components/OptimizedInteractiveMap.tsx` - Optimized map

### Documentation
- `PERFORMANCE_OPTIMIZATION.md` - Complete documentation
- `PERFORMANCE_QUICK_START.md` - This file

## Next Steps

1. **Test**: Run benchmark suite to verify performance
2. **Integrate**: Replace InteractiveMap with OptimizedInteractiveMap
3. **Monitor**: Enable performance tracking
4. **Optimize**: Adjust quality presets based on analytics
5. **Deploy**: Ship optimized version to production

## Support

See `PERFORMANCE_OPTIMIZATION.md` for detailed documentation.

For issues:
1. Check browser console for warnings
2. Run performance benchmark
3. Verify clustering is enabled
4. Check device capabilities with `detectDeviceCapabilities()`
