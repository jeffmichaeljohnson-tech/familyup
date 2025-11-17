/**
 * Graphics Mode Toggle Component
 *
 * Allows users to switch between:
 * - Standard 2D Mapbox visualization
 * - Enhanced 3D WebGL visualization with particles
 *
 * Includes quality presets and performance monitoring
 */

import { useState } from 'react';
import { CountyData, GraphicsConfig } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { Enhanced3DMap } from './Enhanced3DMap';

interface GraphicsToggleProps {
  counties: CountyData[];
  onCountyClick?: (county: CountyData) => void;
}

type GraphicsMode = '2d' | '3d';
type QualityPreset = 'ultra' | 'high' | 'medium' | 'low';

const QUALITY_PRESETS: Record<QualityPreset, GraphicsConfig> = {
  ultra: {
    quality: 'ultra',
    enableParticles: true,
    enableGlow: true,
    enable3D: true,
    targetFPS: 60,
    particleCount: 100
  },
  high: {
    quality: 'high',
    enableParticles: true,
    enableGlow: true,
    enable3D: true,
    targetFPS: 60,
    particleCount: 50
  },
  medium: {
    quality: 'medium',
    enableParticles: true,
    enableGlow: false,
    enable3D: true,
    targetFPS: 30,
    particleCount: 25
  },
  low: {
    quality: 'low',
    enableParticles: false,
    enableGlow: false,
    enable3D: true,
    targetFPS: 30,
    particleCount: 10
  }
};

export function GraphicsToggle({ counties, onCountyClick }: GraphicsToggleProps) {
  const [mode, setMode] = useState<GraphicsMode>('2d');
  const [quality, setQuality] = useState<QualityPreset>('high');
  const [autoFlyThrough, setAutoFlyThrough] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const config = QUALITY_PRESETS[quality];

  return (
    <div className="relative w-full h-full">
      {/* Mode Toggle Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        {/* Main Toggle Button */}
        <button
          onClick={() => setMode(mode === '2d' ? '3d' : '2d')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 flex items-center space-x-2"
        >
          <span>{mode === '2d' ? '🚀' : '🗺️'}</span>
          <span>{mode === '2d' ? 'Enable 3D Mode' : 'Back to 2D'}</span>
        </button>

        {/* Settings Toggle (only in 3D mode) */}
        {mode === '3d' && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-all duration-300 w-full"
          >
            {showSettings ? '✕ Close Settings' : '⚙️ Settings'}
          </button>
        )}

        {/* Settings Panel */}
        {mode === '3d' && showSettings && (
          <div className="bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg shadow-2xl space-y-4 w-72">
            {/* Quality Preset */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Graphics Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['ultra', 'high', 'medium', 'low'] as QualityPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQuality(preset)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      quality === preset
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableParticles}
                  onChange={() => {
                    // Custom config would go here
                  }}
                  disabled
                  className="w-4 h-4"
                />
                <span className="text-sm">Particle Effects</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableGlow}
                  onChange={() => {
                    // Custom config would go here
                  }}
                  disabled
                  className="w-4 h-4"
                />
                <span className="text-sm">Bloom & Glow</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFlyThrough}
                  onChange={(e) => setAutoFlyThrough(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Auto Fly-Through</span>
              </label>
            </div>

            {/* Quality Info */}
            <div className="bg-gray-800 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Particles per County:</span>
                <span className="font-semibold">{config.particleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target FPS:</span>
                <span className="font-semibold">{config.targetFPS}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GPU Acceleration:</span>
                <span className="font-semibold text-green-400">Enabled</span>
              </div>
            </div>

            {/* Performance Hints */}
            <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
              <p className="font-semibold mb-1">Performance Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Reduce quality if FPS drops below 30</li>
                <li>Ultra mode requires modern GPU</li>
                <li>Press F3 to show performance stats</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Feature Badge (3D Mode) */}
      {mode === '3d' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full shadow-2xl font-bold text-sm animate-pulse">
            Snapchat+ Quality Graphics
          </div>
        </div>
      )}

      {/* Render appropriate map component */}
      {mode === '2d' ? (
        <InteractiveMap counties={counties} onCountyClick={onCountyClick} />
      ) : (
        <Enhanced3DMap
          counties={counties}
          config={config}
          onCountyClick={onCountyClick}
          autoFlyThrough={autoFlyThrough}
        />
      )}
    </div>
  );
}
