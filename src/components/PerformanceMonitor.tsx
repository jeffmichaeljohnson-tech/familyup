/**
 * Performance Monitor Component
 *
 * Real-time FPS counter and performance metrics display
 * Helps developers and QA verify performance targets
 */

import React, { useEffect, useState } from 'react';
import { getGlobalPerformanceMonitor, PerformanceMetrics } from '../utils/performance';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  detailed?: boolean;
}

/**
 * Real-time performance metrics display
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = React.memo(({
  show = false,
  position = 'top-right',
  detailed = false,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!show) return;

    const monitor = getGlobalPerformanceMonitor();

    // Subscribe to metrics updates
    const unsubscribe = monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    return () => {
      unsubscribe();
    };
  }, [show]);

  if (!show || !metrics) return null;

  const getFPSColor = (fps: number): string => {
    if (fps >= 58) return '#10b981'; // green
    if (fps >= 45) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getFrameTimeColor = (frameTime: number): string => {
    if (frameTime <= 16.67) return '#10b981'; // green
    if (frameTime <= 33.33) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '1rem', left: '1rem' },
    'top-right': { top: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        zIndex: 9999,
        minWidth: '200px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
        PERFORMANCE METRICS
      </div>

      {/* FPS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span>FPS:</span>
        <span style={{ color: getFPSColor(metrics.fps), fontWeight: 'bold' }}>
          {metrics.fps}
        </span>
      </div>

      {/* Frame Time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span>Frame:</span>
        <span style={{ color: getFrameTimeColor(metrics.frameTime), fontWeight: 'bold' }}>
          {metrics.frameTime.toFixed(2)}ms
        </span>
      </div>

      {/* Render Time */}
      {detailed && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span>Render:</span>
          <span style={{ color: '#60a5fa' }}>
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>
      )}

      {/* Memory */}
      {detailed && metrics.memory && (
        <>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Memory:</span>
              <span style={{ color: '#60a5fa' }}>
                {(metrics.memory.usedJSHeapSize / (1024 * 1024)).toFixed(0)}MB
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.7 }}>
              <span>Limit:</span>
              <span>
                {(metrics.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(0)}MB
              </span>
            </div>
          </div>
        </>
      )}

      {/* Visual FPS Graph */}
      {detailed && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '30px', gap: '2px' }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const height = (metrics.fps / 60) * 100;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    backgroundColor: getFPSColor(metrics.fps),
                    opacity: 0.3 + (i / 20) * 0.7,
                    height: `${height}%`,
                    minHeight: '2px',
                    transition: 'height 0.1s ease',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
