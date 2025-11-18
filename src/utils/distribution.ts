/**
 * Geographic distribution algorithm for child icons
 *
 * PRIVACY NOTE: This creates RANDOM positions within county boundaries
 * for visualization purposes ONLY. These are NOT real child locations.
 *
 * ALGORITHM: Uses computational geometry (point-in-polygon) to ensure
 * all markers are distributed INSIDE actual Michigan county boundaries.
 */

import { GeoPoint, CountyData, ChildIcon, DistributionCenter } from '../types';
import { loadCountyBoundaries, generateRandomPointInCounty } from './countyBoundaries';

/**
 * Michigan geographic bounds (for validation)
 */
const MICHIGAN_BOUNDS = {
  north: 48.3,
  south: 41.7,
  east: -82.4,
  west: -90.4
};

// Cache county boundaries (loaded once)
let countyBoundariesCache: Map<string, any> | null = null;

function getCountyBoundaries() {
  if (!countyBoundariesCache) {
    countyBoundariesCache = loadCountyBoundaries();
    console.log(`🎯 County boundaries loaded: ${countyBoundariesCache.size} counties with polygon data`);
  }
  return countyBoundariesCache;
}

/**
 * Generate random child icon positions for a county
 * PRIVACY: All positions are randomly generated for visualization
 *
 * NEW: Uses actual county boundary polygons to ensure all points
 * are distributed INSIDE the county lines using point-in-polygon algorithm
 */
export function distributeChildrenInCounty(county: CountyData): ChildIcon[] {
  const icons: ChildIcon[] = [];
  const { boys, girls } = county.genderBreakdown;

  // Get the actual county boundary polygon
  const boundaries = getCountyBoundaries();
  const countyBoundary = boundaries.get(county.name);

  if (!countyBoundary) {
    console.warn(`⚠️ No boundary found for ${county.name}, using fallback`);
    // Fallback to old method if boundary not found
    return distributeChildrenFallback(county);
  }

  console.log(`✓ Distributing ${boys + girls} children inside ${county.name} boundary`);

  // Distribute boys inside county boundary
  let iconIndex = 0;
  for (let i = 0; i < boys; i++) {
    const position = generateRandomPointInCounty(countyBoundary);
    if (position) {
      icons.push({
        id: `${county.fips}-boy-${iconIndex++}`,
        position,
        gender: 'boy',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    }
  }

  // Distribute girls inside county boundary
  iconIndex = 0;
  for (let i = 0; i < girls; i++) {
    const position = generateRandomPointInCounty(countyBoundary);
    if (position) {
      icons.push({
        id: `${county.fips}-girl-${iconIndex++}`,
        position,
        gender: 'girl',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    }
  }

  return icons;
}

/**
 * Fallback distribution method (simple circle around county center)
 * Used when county boundary data is not available
 */
function distributeChildrenFallback(county: CountyData): ChildIcon[] {
  const icons: ChildIcon[] = [];
  const centers = county.distributionCenters || [
    { lat: county.lat, lng: county.lng, weight: 1.0 }
  ];

  const { boys, girls } = county.genderBreakdown;

  // Distribute boys
  let iconIndex = 0;
  centers.forEach((center) => {
    const boysForCenter = Math.round(boys * center.weight);
    for (let i = 0; i < boysForCenter; i++) {
      const position = generateRandomPosition(center, 0.15);
      icons.push({
        id: `${county.fips}-boy-${iconIndex++}`,
        position,
        gender: 'boy',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    }
  });

  // Distribute girls
  iconIndex = 0;
  centers.forEach((center) => {
    const girlsForCenter = Math.round(girls * center.weight);
    for (let i = 0; i < girlsForCenter; i++) {
      const position = generateRandomPosition(center, 0.15);
      icons.push({
        id: `${county.fips}-girl-${iconIndex++}`,
        position,
        gender: 'girl',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    }
  });

  return icons;
}

/**
 * Generate random position around a center point
 * Uses power-law distribution for natural clustering
 */
function generateRandomPosition(center: DistributionCenter, radiusDegrees: number): GeoPoint {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.pow(Math.random(), 0.6) * radiusDegrees; // Power law for clustering

  return {
    lat: center.lat + (distance * Math.cos(angle)),
    lng: center.lng + (distance * Math.sin(angle) * 1.5) // Adjust for longitude compression
  };
}

/**
 * Assign age group based on county's age breakdown proportions
 */
function assignAgeGroup(breakdown: CountyData['ageBreakdown']): '0-5' | '6-10' | '11-17' {
  const total = breakdown['0-5'] + breakdown['6-10'] + breakdown['11-17'];
  const rand = Math.random() * total;

  if (rand < breakdown['0-5']) return '0-5';
  if (rand < breakdown['0-5'] + breakdown['6-10']) return '6-10';
  return '11-17';
}

/**
 * Check if position is within Michigan bounds
 */
export function isWithinMichigan(point: GeoPoint): boolean {
  return (
    point.lat >= MICHIGAN_BOUNDS.south &&
    point.lat <= MICHIGAN_BOUNDS.north &&
    point.lng >= MICHIGAN_BOUNDS.west &&
    point.lng <= MICHIGAN_BOUNDS.east
  );
}

/**
 * Distribute all children for all counties
 */
export function distributeAllChildren(counties: CountyData[]): ChildIcon[] {
  return counties.flatMap(county => distributeChildrenInCounty(county));
}
