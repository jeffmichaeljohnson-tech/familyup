/**
 * Interactive Map Component
 *
 * Cutting-edge visualization using Mapbox GL JS
 * PRIVACY: Displays aggregate county data only, no individual locations
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CountyData } from '../types';
// Color scale utilities (currently not used with individual child markers)
import { distributeAllChildren } from '../utils/distribution';
import { debugLog } from '../utils/debugLog';

// Mapbox token - loaded from environment variables for security
// IMPORTANT: For iOS compatibility, token must have:
//   1. Scope: downloads:read (checked in Mapbox dashboard)
//   2. URL restriction: capacitor://localhost
//   See docs/MAPBOX_IOS_SETUP.md for configuration guide
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Validate token is configured
if (!mapboxgl.accessToken) {
  console.error('❌ MAPBOX TOKEN MISSING');
  console.error('Required: VITE_MAPBOX_TOKEN environment variable');
  console.error('1. Copy .env.example to .env');
  console.error('2. Add your Mapbox token to .env');
  console.error('3. For iOS: See docs/MAPBOX_IOS_SETUP.md');
}

interface InteractiveMapProps {
  counties: CountyData[];
  onCountyClick?: (county: CountyData) => void;
}

export function InteractiveMap({ counties }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Generate child icon positions (aggregate visualization only)
  const childIcons = useMemo(() => {
    return distributeAllChildren(counties);
  }, [counties]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark style for dramatic effect
        center: [-85.6024, 45.5], // Adjusted to show entire Michigan including UP
        zoom: 5.5, // Zoomed out to show entire state
        minZoom: 5,
        maxZoom: 12,
        pitch: 0, // Flat view initially to see all counties
        bearing: 0,
        antialias: true, // Smooth rendering
      });

      debugLog('✓ Mapbox initialized successfully');
    } catch (error) {
      console.error('❌ Mapbox initialization error:', error);
      return;
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      console.log('✓ Mapbox map loaded successfully');
      setMapLoaded(true);

      // Fit bounds to show all counties
      if (counties.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        counties.forEach(county => {
          bounds.extend([county.lng, county.lat]);
        });
        console.log('✓ Fitting bounds for', counties.length, 'counties');
        map.current?.fitBounds(bounds, { padding: 50, maxZoom: 7 });
      }
    });

    map.current.on('error', (e) => {
      console.error('❌ Mapbox error:', e);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // NOTE: County-level markers disabled - showing individual child markers instead
  // This creates a much more dramatic visualization with 13,596+ individual icons

  // Render ALL individual child markers
  useEffect(() => {
    if (!map.current || !mapLoaded || childIcons.length === 0) return;

    const logs: string[] = [];
    logs.push(`=== RENDERING INDIVIDUAL CHILD MARKERS ===`);
    logs.push(`Total children to render: ${childIcons.length.toLocaleString()}`);
    logs.push(`Map zoom: ${map.current.getZoom()}`);

    const markers: mapboxgl.Marker[] = [];
    const startTime = performance.now();

    // Render ALL child icons (dramatic visualization!)
    childIcons.forEach((icon, index) => {
      const el = document.createElement('div');
      el.className = `child-icon child-icon-${icon.gender}`;
      el.style.width = '8px';
      el.style.height = '8px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = icon.gender === 'boy' ? '#3b82f6' : '#ec4899';
      el.style.border = '1px solid white';
      el.style.opacity = '0.7';
      el.style.cursor = 'pointer';

      // Add tooltip
      el.title = `${icon.gender === 'boy' ? 'Boy' : 'Girl'}, Age ${icon.ageGroup}`;

      const marker = new mapboxgl.Marker(el, { anchor: 'center' })
        .setLngLat([icon.position.lng, icon.position.lat])
        .addTo(map.current!);

      markers.push(marker);

      // Log progress every 1000 markers
      if ((index + 1) % 1000 === 0) {
        console.log(`Rendered ${index + 1} / ${childIcons.length} child markers...`);
      }
    });

    const renderTime = Math.round(performance.now() - startTime);
    logs.push(`✓ Rendered ${markers.length.toLocaleString()} markers in ${renderTime}ms`);

    // Get actual DOM markers on page
    const domMarkers = document.querySelectorAll('.mapboxgl-marker');
    logs.push(`DOM markers visible: ${domMarkers.length.toLocaleString()}`);

    setDebugInfo(logs);
    console.log(`✓ Rendered all ${markers.length.toLocaleString()} child markers in ${renderTime}ms`);

    // Cleanup function
    return () => {
      console.log(`Cleaning up ${markers.length} child markers`);
      markers.forEach(marker => marker.remove());
    };

  }, [mapLoaded, childIcons]);

  return (
    <div className="relative w-full h-full">
      {/* Debug Panel */}
      <div className="absolute top-4 right-4 z-30 bg-black bg-opacity-90 text-green-400 p-4 rounded-lg shadow-2xl max-w-lg max-h-96 overflow-y-auto font-mono text-xs">
        <h3 className="font-bold text-white mb-2 text-sm">🔍 Live Debug Console</h3>
        {debugInfo.map((log, i) => (
          <div key={i} className="mb-1">{log}</div>
        ))}
        {debugInfo.length === 0 && <div className="text-gray-500">Waiting for map to load...</div>}
      </div>

      {/* Privacy Notice Overlay */}
      <div className="absolute top-4 left-4 z-10 max-w-md privacy-notice shadow-lg">
        <p className="font-semibold text-amber-900">
          🔒 Privacy-First Visualization
        </p>
        <p className="text-amber-800 text-xs mt-1">
          All icons represent aggregate county data only. No individual child information or exact locations are shown.
        </p>
      </div>

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-semibold">Loading Cutting-Edge Map Visualization...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="map-container" />

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-95 rounded-lg shadow-xl p-4">
        <p className="text-sm font-semibold text-gray-700">
          {childIcons.length.toLocaleString()} Individual Children Visualized
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Each dot = 1 child in foster care across {counties.length} Michigan counties
        </p>
        <p className="text-xs text-blue-600 mt-1 font-medium">
          🔵 Boys | 🔴 Girls (random positions for privacy)
        </p>
      </div>
    </div>
  );
}
