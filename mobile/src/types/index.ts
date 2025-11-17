/**
 * FamilyUp Mobile Type Definitions
 *
 * PRIVACY NOTE: All data types represent AGGREGATE county-level statistics only.
 * NO individual child information, exact locations, or PII is ever stored or displayed.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DistributionCenter {
  lat: number;
  lng: number;
  weight: number;
  name?: string;
}

export interface CountyData {
  name: string;
  fips: string;
  lat: number;
  lng: number;
  totalChildren: number;
  waitingAdoption: number;
  ageBreakdown: {
    '0-5': number;
    '6-10': number;
    '11-17': number;
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

export interface StateSummary {
  totalChildren: number;
  waitingAdoption: number;
  adoptionsThisYear: number;
  averageAge: number;
  agedOutLastYear: number;
  lastUpdated?: string;
}

export interface ParticleData {
  id: string;
  position: {x: number; y: number; z: number};
  velocity: {x: number; y: number; z: number};
  color: {r: number; g: number; b: number; a: number};
  size: number;
  age: number;
  lifespan: number;
}
