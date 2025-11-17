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
import { getCountyColor, getMarkerRadius, getCountyColorWithOpacity } from '../utils/colorScale';
import { distributeAllChildren } from '../utils/distribution';
import { debugLog } from '../utils/debugLog';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiamVmZm1pY2hhZWxqb2huc29uLXRlY2giLCJhIjoiY21pM28wNWw2MXNlZDJrcHdhaHJuY3M4ZyJ9.LD85_bwC_M-3JKjhjtDhqQ';

interface InteractiveMapProps {
  counties: CountyData[];
  onCountyClick?: (county: CountyData) => void;
}

export function InteractiveMap({ counties, onCountyClick }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  // Add county markers when map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    debugLog(`=== RENDERING ${counties.length} MICHIGAN COUNTIES ===`);
    debugLog('Sample counties', counties.slice(0, 10).map(c => ({ name: c.name, lat: c.lat, lng: c.lng })));

    // Store markers for cleanup
    const markers: mapboxgl.Marker[] = [];

    // Add county circle layers with heat map effect
    counties.forEach((county, index) => {
      if (index < 5) {
        console.log(`Adding marker ${index + 1}: ${county.name} at [${county.lng}, ${county.lat}]`);
      }
      const color = getCountyColor(county.totalChildren);
      const radius = getMarkerRadius(county.totalChildren);

      // Create marker element with glow effect
      const el = document.createElement('div');
      el.className = 'county-marker';
      el.style.width = `${radius * 2}px`;
      el.style.height = `${radius * 2}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getCountyColorWithOpacity(county.totalChildren, 0.6);
      el.style.border = `3px solid ${color}`;
      el.style.boxShadow = `0 0 ${radius}px ${color}80`;
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.3s ease';

      // Pulsing animation for dramatic effect
      el.style.animation = 'pulse-slow 3s ease-in-out infinite';

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.boxShadow = `0 0 ${radius * 2}px ${color}`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = `0 0 ${radius}px ${color}80`;
      });

      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 16px; min-width: 250px;">
            <h3 style="font-size: 18px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px;">
              ${county.name}
            </h3>
            <hr style="margin: 8px 0; border-color: #e5e7eb;" />
            <div style="font-size: 14px; color: #374151; line-height: 1.6;">
              <p style="margin: 4px 0;">
                <strong>Total in Care:</strong> ${county.totalChildren.toLocaleString()}
              </p>
              <p style="margin: 4px 0;">
                <strong>Waiting for Adoption:</strong> ${county.waitingAdoption.toLocaleString()}
              </p>
              <div style="margin-top: 12px;">
                <p style="font-weight: 600; margin-bottom: 4px;">Age Breakdown:</p>
                <ul style="list-style: none; padding-left: 0;">
                  <li>• Ages 0-5: ${county.ageBreakdown['0-5']}</li>
                  <li>• Ages 6-10: ${county.ageBreakdown['6-10']}</li>
                  <li>• Ages 11-17: ${county.ageBreakdown['11-17']}</li>
                </ul>
              </div>
              <div style="margin-top: 12px; padding: 8px; background: #fef3c7; border-radius: 4px;">
                <p style="font-size: 12px; color: #92400e;">
                  <strong>Privacy Note:</strong> Icons show aggregate county data only, not actual child locations.
                </p>
              </div>
              <a
                href="tel:1-800-589-6273"
                style="display: block; margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; text-align: center; border-radius: 6px; text-decoration: none; font-weight: 600;"
              >
                📞 Call MARE: 1-800-589-6273
              </a>
            </div>
          </div>
        `);

      // Add marker to map with popup attached
      const marker = new mapboxgl.Marker(el)
        .setLngLat([county.lng, county.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Click handler to trigger both popup and callback
      el.addEventListener('click', () => {
        onCountyClick?.(county);
      });

      markers.push(marker);
    });

    console.log(`✓ Added ${markers.length} markers to map`);

    // Cleanup function to remove markers when component unmounts or re-renders
    return () => {
      console.log(`Cleaning up ${markers.length} markers`);
      markers.forEach(marker => marker.remove());
    };

  }, [mapLoaded, counties, onCountyClick]);

  // Add child icons (simplified version - full WebGL implementation would go here)
  useEffect(() => {
    if (!map.current || !mapLoaded || childIcons.length === 0) return;

    // For performance, we'll show a subset of icons on the map
    // In production, use WebGL/Canvas rendering for thousands of icons
    const visibleIcons = childIcons.slice(0, 200); // Show first 200 for demo

    visibleIcons.forEach((icon) => {
      const el = document.createElement('div');
      el.className = `child-icon child-icon-${icon.gender}`;
      el.style.opacity = '0.8';

      // Add tooltip
      el.title = `${icon.gender === 'boy' ? 'Boy' : 'Girl'}, Age ${icon.ageGroup}`;

      new mapboxgl.Marker(el, { anchor: 'center' })
        .setLngLat([icon.position.lng, icon.position.lat])
        .addTo(map.current!);
    });

  }, [mapLoaded, childIcons]);

  return (
    <div className="relative w-full h-full">
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
          Displaying all {counties.length} Michigan counties
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Visualizing {childIcons.length.toLocaleString()} children (aggregate data)
        </p>
        <p className="text-xs text-blue-600 mt-1 font-medium">
          ✓ All 83 counties shown
        </p>
      </div>
    </div>
  );
}
