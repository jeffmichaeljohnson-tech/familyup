/**
 * County Boundary Utilities
 *
 * Implements computational geometry algorithms to:
 * 1. Load Michigan county boundary polygons from GeoJSON
 * 2. Generate random points INSIDE county boundaries (point-in-polygon)
 * 3. Distribute child markers within actual county lines
 */

import countyGeoJSON from '../../public/michigan-counties.geo.json';

interface Point {
  lng: number;
  lat: number;
}

// Polygon interface kept for type documentation
// interface Polygon {
//   type: 'Polygon' | 'MultiPolygon';
//   coordinates: number[][][] | number[][][][];
// }

interface CountyBoundary {
  name: string;
  polygons: number[][][][]; // Normalized to always be array of polygons
}

/**
 * Ray-casting algorithm for point-in-polygon test
 *
 * The algorithm works by casting a ray from the point to infinity
 * and counting how many times it crosses the polygon boundary.
 * If odd, the point is inside. If even, it's outside.
 *
 * @param point Point to test
 * @param polygon Array of coordinates [lng, lat]
 * @returns true if point is inside polygon
 */
function isPointInPolygon(point: Point, polygon: number[][]): boolean {
  const { lng, lat } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    // Check if ray crosses this edge
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Test if a point is inside any polygon of a MultiPolygon
 *
 * @param point Point to test
 * @param multiPolygon Array of polygon rings
 * @returns true if point is inside any polygon
 */
function isPointInMultiPolygon(point: Point, multiPolygon: number[][][]): boolean {
  // First polygon ring is outer boundary, rest are holes
  // We need to be inside outer boundary but NOT in any holes

  for (let i = 0; i < multiPolygon.length; i++) {
    const ring = multiPolygon[i];
    const inRing = isPointInPolygon(point, ring);

    if (i === 0) {
      // Outer ring - must be inside
      if (!inRing) return false;
    } else {
      // Hole - must NOT be inside
      if (inRing) return false;
    }
  }

  return true;
}

/**
 * Test if a point is inside a county's boundaries
 *
 * Handles both Polygon and MultiPolygon geometries
 *
 * @param point Point to test
 * @param county County boundary data
 * @returns true if point is inside county
 */
function isPointInCounty(point: Point, county: CountyBoundary): boolean {
  // Check all polygons (handles MultiPolygon geometry)
  for (const polygon of county.polygons) {
    if (isPointInMultiPolygon(point, polygon)) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate bounding box for a polygon
 *
 * @param polygon Array of coordinate arrays
 * @returns Bounding box {minLng, maxLng, minLat, maxLat}
 */
function getBoundingBox(polygon: number[][][]): {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
} {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const ring of polygon) {
    for (const coord of ring) {
      const [lng, lat] = coord;
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }

  return { minLng, maxLng, minLat, maxLat };
}

/**
 * Generate a random point inside a county's boundaries
 *
 * Uses rejection sampling: generate random points in bounding box
 * until one falls inside the actual county polygon.
 *
 * @param county County boundary data
 * @param maxAttempts Maximum number of random attempts (prevents infinite loops)
 * @returns Random point inside county, or null if failed
 */
export function generateRandomPointInCounty(
  county: CountyBoundary,
  maxAttempts: number = 100
): Point | null {
  // Get bounding box of all polygons
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const polygon of county.polygons) {
    const bbox = getBoundingBox(polygon);
    minLng = Math.min(minLng, bbox.minLng);
    maxLng = Math.max(maxLng, bbox.maxLng);
    minLat = Math.min(minLat, bbox.minLat);
    maxLat = Math.max(maxLat, bbox.maxLat);
  }

  // Rejection sampling: keep trying until we get a point inside the polygon
  for (let i = 0; i < maxAttempts; i++) {
    const point: Point = {
      lng: minLng + Math.random() * (maxLng - minLng),
      lat: minLat + Math.random() * (maxLat - minLat),
    };

    if (isPointInCounty(point, county)) {
      return point;
    }
  }

  // Fallback: return center of bounding box if all attempts failed
  console.warn(`Failed to generate point inside ${county.name} after ${maxAttempts} attempts`);
  return {
    lng: (minLng + maxLng) / 2,
    lat: (minLat + maxLat) / 2,
  };
}

/**
 * Load and parse Michigan county boundaries from GeoJSON
 *
 * @returns Map of county name to boundary data
 */
export function loadCountyBoundaries(): Map<string, CountyBoundary> {
  const boundaries = new Map<string, CountyBoundary>();

  // Parse the nested GeoJSON structure
  const data = countyGeoJSON as any;

  // The structure has features at the top level
  if (data.features) {
    for (const stateFeature of data.features) {
      // Each state feature contains county features
      if (stateFeature.features) {
        for (const countyFeature of stateFeature.features) {
          const props = countyFeature.properties;
          const geom = countyFeature.geometry;

          if (props && props.name && geom) {
            const countyName = props.name;

            // Normalize geometry to always be array of polygons
            let polygons: number[][][][];

            if (geom.type === 'Polygon') {
              // Single polygon - wrap in array
              polygons = [geom.coordinates];
            } else if (geom.type === 'MultiPolygon') {
              // Already array of polygons
              polygons = geom.coordinates;
            } else {
              console.warn(`Unknown geometry type for ${countyName}:`, geom.type);
              continue;
            }

            boundaries.set(countyName, {
              name: countyName,
              polygons,
            });
          }
        }
      }
    }
  }

  console.log(`✓ Loaded ${boundaries.size} county boundaries`);
  return boundaries;
}

/**
 * Get county boundary by name
 *
 * @param countyName County name (e.g., "Wayne", "Oakland")
 * @returns County boundary data or undefined
 */
export function getCountyBoundary(countyName: string): CountyBoundary | undefined {
  const boundaries = loadCountyBoundaries();
  return boundaries.get(countyName);
}
