/**
 * Geographic distribution algorithm for child icons
 *
 * PRIVACY NOTE: This creates RANDOM positions within county boundaries
 * for visualization purposes ONLY. These are NOT real child locations.
 */

import { GeoPoint, CountyData, ChildIcon, DistributionCenter } from '../types';

/**
 * Michigan geographic bounds (for validation)
 */
const MICHIGAN_BOUNDS = {
  north: 48.3,
  south: 41.7,
  east: -82.4,
  west: -90.4
};

/**
 * Generate random child icon positions for a county
 * PRIVACY: All positions are randomly generated for visualization
 */
export function distributeChildrenInCounty(county: CountyData): ChildIcon[] {
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
      const position = generateRandomPosition(center, 0.15); // ~15km radius
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
