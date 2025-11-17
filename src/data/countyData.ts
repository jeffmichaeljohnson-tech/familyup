/**
 * Michigan County Foster Care Data
 *
 * SOURCE: Michigan DHHS, AFCARS FY 2023 (Public aggregate data only)
 * PRIVACY: All data is county-level aggregates. NO individual child information.
 * LEGAL: Compliant with COPPA, FERPA, HIPAA, Michigan Child Protection Law
 *
 * Last Updated: November 2025
 */

import { CountyData, StateSummary } from '../types';
import { allMichiganCounties, getTotalChildren as getAllCountiesTotal } from './allCounties';
import { michiganRegions, getRegionById, getRegionByCountyFips } from './regions';

/**
 * All 83 Michigan counties with foster care statistics
 * Using static data for browser compatibility
 */
export const michiganCounties: CountyData[] = allMichiganCounties;

/**
 * Export region utilities for filtering and analysis
 */
export { michiganRegions, getRegionById, getRegionByCountyFips };

/**
 * Statewide summary statistics
 * SOURCE: Michigan DHHS Annual Report 2024
 */
export const stateSummary: StateSummary = {
  totalChildren: getAllCountiesTotal(),
  waitingAdoption: michiganCounties.reduce((sum, c) => sum + c.waitingAdoption, 0),
  adoptionsThisYear: 1600,
  averageAge: 8,
  agedOutLastYear: 1800,
  lastUpdated: "2025-11-17T00:00:00Z"
};

/**
 * Get county by FIPS code
 */
export function getCountyByFips(fips: string): CountyData | undefined {
  return michiganCounties.find(c => c.fips === fips);
}

/**
 * Calculate total children from all counties
 */
export function getTotalChildren(): number {
  return getAllCountiesTotal();
}

/**
 * Get counties by region ID
 */
export function getCountiesByRegion(regionId: string): CountyData[] {
  const region = getRegionById(regionId);
  if (!region) return [];

  return michiganCounties.filter(county =>
    region.counties.includes(county.fips)
  );
}
