/**
 * FamilyUp Type Definitions
 *
 * PRIVACY NOTE: All data types represent AGGREGATE county-level statistics only.
 * NO individual child information, exact locations, or PII is ever stored or displayed.
 */

/**
 * Geographic point (aggregate county center, NOT individual locations)
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Distribution center for realistic geographic spread within county
 * PRIVACY: These are statistical distribution points, NOT real child locations
 */
export interface DistributionCenter {
  lat: number;
  lng: number;
  weight: number; // 0-1, proportion of county's aggregate children
  name?: string;
}

/**
 * Michigan county with aggregate foster care statistics
 * PRIVACY COMPLIANCE: County-level aggregates only, minimum 5 children per county
 */
export interface CountyData {
  name: string;
  fips: string;
  lat: number;  // County center (NOT individual child location)
  lng: number;  // County center (NOT individual child location)
  totalChildren: number;  // Aggregate count
  waitingAdoption: number;  // Aggregate count
  ageBreakdown: {
    "0-5": number;
    "6-10": number;
    "11-17": number;
  };
  genderBreakdown: {
    boys: number;
    girls: number;
  };
  agencies: string[];
  contactInfo: {
    phone: string;
    email?: string;
    website?: string;
  };
  distributionCenters?: DistributionCenter[];
}

/**
 * Visual representation of aggregate child count
 * PRIVACY: This is a visualization element only, NOT a real individual
 */
export interface ChildIcon {
  id: string;  // Generated ID for rendering
  position: GeoPoint;  // Random position within county (NOT real location)
  gender: 'boy' | 'girl';  // From aggregate gender ratio
  countyFips: string;
  ageGroup: '0-5' | '6-10' | '11-17';  // From aggregate age breakdown
}

/**
 * User-selected filters
 */
export interface MapFilters {
  ageGroup: 'all' | '0-2' | '3-5' | '6-12' | '13-17';
  region?: string;
  gender?: 'all' | 'boys' | 'girls';
}

/**
 * Statewide summary statistics (all aggregate)
 */
export interface StateSummary {
  totalChildren: number;
  waitingAdoption: number;
  adoptionsThisYear: number;
  averageAge: number;
  agedOutLastYear: number;
  lastUpdated?: string;
}

/**
 * Graphics configuration for cutting-edge visualization
 */
export interface GraphicsConfig {
  quality: 'ultra' | 'high' | 'medium' | 'low';
  enableParticles: boolean;
  enableGlow: boolean;
  enable3D: boolean;
  targetFPS: number;
  particleCount: number;
}
