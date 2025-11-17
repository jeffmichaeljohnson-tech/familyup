/**
 * Data Validation Utilities for Foster Care Data
 *
 * Ensures all county data meets privacy requirements and data integrity standards.
 *
 * PRIVACY COMPLIANCE:
 * - Minimum 5 children per county (privacy threshold)
 * - All data is aggregate county-level only
 * - No individual child information
 *
 * DATA INTEGRITY:
 * - Age breakdowns sum to total
 * - Gender breakdowns sum to total
 * - Coordinates within Michigan bounds
 * - FIPS codes are valid Michigan counties
 */

import { CountyData } from '../types';

/**
 * Michigan geographic bounds for coordinate validation
 */
const MICHIGAN_BOUNDS = {
  minLat: 41.69,
  maxLat: 48.31,
  minLng: -90.42,
  maxLng: -82.13
};

/**
 * Privacy requirement: minimum children per county
 */
const MIN_CHILDREN_THRESHOLD = 5;

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Detailed county validation result
 */
export interface CountyValidationResult extends ValidationResult {
  countyName: string;
  countyFips: string;
}

/**
 * Validate a single county's data
 */
export function validateCounty(county: CountyData): CountyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate age breakdown sums to total
  const ageSum = county.ageBreakdown["0-5"] +
                 county.ageBreakdown["6-10"] +
                 county.ageBreakdown["11-17"];

  if (ageSum !== county.totalChildren) {
    errors.push(
      `Age breakdown sum (${ageSum}) does not match total children (${county.totalChildren})`
    );
  }

  // Validate gender breakdown sums to total
  const genderSum = county.genderBreakdown.boys + county.genderBreakdown.girls;

  if (genderSum !== county.totalChildren) {
    errors.push(
      `Gender breakdown sum (${genderSum}) does not match total children (${county.totalChildren})`
    );
  }

  // Validate minimum threshold (privacy requirement)
  if (county.totalChildren < MIN_CHILDREN_THRESHOLD) {
    errors.push(
      `County has ${county.totalChildren} children, below privacy threshold of ${MIN_CHILDREN_THRESHOLD}`
    );
  }

  // Validate coordinates are within Michigan bounds
  if (county.lat < MICHIGAN_BOUNDS.minLat || county.lat > MICHIGAN_BOUNDS.maxLat) {
    errors.push(
      `Latitude ${county.lat} is outside Michigan bounds (${MICHIGAN_BOUNDS.minLat} to ${MICHIGAN_BOUNDS.maxLat})`
    );
  }

  if (county.lng < MICHIGAN_BOUNDS.minLng || county.lng > MICHIGAN_BOUNDS.maxLng) {
    errors.push(
      `Longitude ${county.lng} is outside Michigan bounds (${MICHIGAN_BOUNDS.minLng} to ${MICHIGAN_BOUNDS.maxLng})`
    );
  }

  // Validate FIPS code format (26XXX for Michigan)
  if (!county.fips.startsWith('26') || county.fips.length !== 5) {
    errors.push(`Invalid FIPS code format: ${county.fips}`);
  }

  // Validate waiting adoption doesn't exceed total
  if (county.waitingAdoption > county.totalChildren) {
    errors.push(
      `Waiting adoption (${county.waitingAdoption}) exceeds total children (${county.totalChildren})`
    );
  }

  // Validate age breakdown values are non-negative
  if (county.ageBreakdown["0-5"] < 0 ||
      county.ageBreakdown["6-10"] < 0 ||
      county.ageBreakdown["11-17"] < 0) {
    errors.push('Age breakdown contains negative values');
  }

  // Validate gender breakdown values are non-negative
  if (county.genderBreakdown.boys < 0 || county.genderBreakdown.girls < 0) {
    errors.push('Gender breakdown contains negative values');
  }

  // Warning: Check if distribution centers exist for large counties
  if (county.totalChildren > 500 && !county.distributionCenters) {
    warnings.push(
      `County has ${county.totalChildren} children but no distribution centers defined`
    );
  }

  // Warning: Check if distribution center weights sum to 1.0
  if (county.distributionCenters) {
    const weightSum = county.distributionCenters.reduce((sum, dc) => sum + dc.weight, 0);
    const tolerance = 0.01;

    if (Math.abs(weightSum - 1.0) > tolerance) {
      warnings.push(
        `Distribution center weights sum to ${weightSum.toFixed(3)}, should be 1.0`
      );
    }

    // Validate distribution center coordinates
    county.distributionCenters.forEach((dc, index) => {
      if (dc.lat < MICHIGAN_BOUNDS.minLat || dc.lat > MICHIGAN_BOUNDS.maxLat ||
          dc.lng < MICHIGAN_BOUNDS.minLng || dc.lng > MICHIGAN_BOUNDS.maxLng) {
        warnings.push(
          `Distribution center ${index} (${dc.name || 'unnamed'}) has coordinates outside Michigan bounds`
        );
      }
    });
  }

  // Warning: Check for missing contact info
  if (!county.contactInfo.phone) {
    warnings.push('Missing phone contact information');
  }

  return {
    countyName: county.name,
    countyFips: county.fips,
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate all counties in an array
 */
export function validateAllCounties(counties: CountyData[]): {
  overallValid: boolean;
  totalCounties: number;
  validCounties: number;
  invalidCounties: number;
  results: CountyValidationResult[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
  };
} {
  const results = counties.map(validateCounty);
  const validCounties = results.filter(r => r.isValid).length;

  return {
    overallValid: results.every(r => r.isValid),
    totalCounties: counties.length,
    validCounties,
    invalidCounties: results.length - validCounties,
    results,
    summary: {
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0)
    }
  };
}

/**
 * Validate data distribution ratios
 */
export function validateDataDistribution(counties: CountyData[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const totalChildren = counties.reduce((sum, c) => sum + c.totalChildren, 0);

  // Calculate age distribution percentages
  const total_0_5 = counties.reduce((sum, c) => sum + c.ageBreakdown["0-5"], 0);
  const total_6_10 = counties.reduce((sum, c) => sum + c.ageBreakdown["6-10"], 0);
  const total_11_17 = counties.reduce((sum, c) => sum + c.ageBreakdown["11-17"], 0);

  const pct_0_5 = (total_0_5 / totalChildren) * 100;
  const pct_6_10 = (total_6_10 / totalChildren) * 100;
  const pct_11_17 = (total_11_17 / totalChildren) * 100;

  // Expected ranges based on national foster care statistics
  // 0-5: 25-30%, 6-10: 22-28%, 11-17: 45-50%
  if (pct_0_5 < 25 || pct_0_5 > 30) {
    warnings.push(
      `Age 0-5 percentage (${pct_0_5.toFixed(1)}%) outside expected range (25-30%)`
    );
  }
  if (pct_6_10 < 22 || pct_6_10 > 28) {
    warnings.push(
      `Age 6-10 percentage (${pct_6_10.toFixed(1)}%) outside expected range (22-28%)`
    );
  }
  if (pct_11_17 < 45 || pct_11_17 > 50) {
    warnings.push(
      `Age 11-17 percentage (${pct_11_17.toFixed(1)}%) outside expected range (45-50%)`
    );
  }

  // Calculate gender distribution
  const totalBoys = counties.reduce((sum, c) => sum + c.genderBreakdown.boys, 0);
  const totalGirls = counties.reduce((sum, c) => sum + c.genderBreakdown.girls, 0);

  const pctBoys = (totalBoys / totalChildren) * 100;
  const pctGirls = (totalGirls / totalChildren) * 100;

  // Expected: roughly 50-52% boys, 48-50% girls (slightly more boys in foster care)
  if (pctBoys < 49 || pctBoys > 53) {
    warnings.push(
      `Boys percentage (${pctBoys.toFixed(1)}%) outside expected range (49-53%)`
    );
  }
  if (pctGirls < 47 || pctGirls > 51) {
    warnings.push(
      `Girls percentage (${pctGirls.toFixed(1)}%) outside expected range (47-51%)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate FIPS codes are unique and complete
 */
export function validateFipsCodes(counties: CountyData[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const fipsCodes = new Set<string>();
  const duplicates = new Set<string>();

  counties.forEach(county => {
    if (fipsCodes.has(county.fips)) {
      duplicates.add(county.fips);
      errors.push(`Duplicate FIPS code: ${county.fips} (${county.name})`);
    }
    fipsCodes.add(county.fips);
  });

  // Check if we have all 83 Michigan counties
  if (counties.length !== 83) {
    warnings.push(
      `Expected 83 Michigan counties, found ${counties.length}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate aggregate statistics for validation
 */
export interface AggregateStats {
  totalChildren: number;
  totalWaitingAdoption: number;
  averageChildrenPerCounty: number;
  medianChildrenPerCounty: number;
  ageDistribution: {
    "0-5": number;
    "6-10": number;
    "11-17": number;
  };
  genderDistribution: {
    boys: number;
    girls: number;
  };
  agePercentages: {
    "0-5": number;
    "6-10": number;
    "11-17": number;
  };
  genderPercentages: {
    boys: number;
    girls: number;
  };
}

export function calculateAggregateStats(counties: CountyData[]): AggregateStats {
  const totalChildren = counties.reduce((sum, c) => sum + c.totalChildren, 0);
  const totalWaitingAdoption = counties.reduce((sum, c) => sum + c.waitingAdoption, 0);

  const ageDistribution = {
    "0-5": counties.reduce((sum, c) => sum + c.ageBreakdown["0-5"], 0),
    "6-10": counties.reduce((sum, c) => sum + c.ageBreakdown["6-10"], 0),
    "11-17": counties.reduce((sum, c) => sum + c.ageBreakdown["11-17"], 0)
  };

  const genderDistribution = {
    boys: counties.reduce((sum, c) => sum + c.genderBreakdown.boys, 0),
    girls: counties.reduce((sum, c) => sum + c.genderBreakdown.girls, 0)
  };

  const childrenCounts = counties.map(c => c.totalChildren).sort((a, b) => a - b);
  const medianIndex = Math.floor(childrenCounts.length / 2);
  const medianChildrenPerCounty = childrenCounts.length % 2 === 0
    ? (childrenCounts[medianIndex - 1] + childrenCounts[medianIndex]) / 2
    : childrenCounts[medianIndex];

  return {
    totalChildren,
    totalWaitingAdoption,
    averageChildrenPerCounty: totalChildren / counties.length,
    medianChildrenPerCounty,
    ageDistribution,
    genderDistribution,
    agePercentages: {
      "0-5": (ageDistribution["0-5"] / totalChildren) * 100,
      "6-10": (ageDistribution["6-10"] / totalChildren) * 100,
      "11-17": (ageDistribution["11-17"] / totalChildren) * 100
    },
    genderPercentages: {
      boys: (genderDistribution.boys / totalChildren) * 100,
      girls: (genderDistribution.girls / totalChildren) * 100
    }
  };
}

/**
 * Run all validations and return comprehensive report
 */
export function runFullValidation(counties: CountyData[]): {
  overallValid: boolean;
  countyValidation: ReturnType<typeof validateAllCounties>;
  distributionValidation: ValidationResult;
  fipsValidation: ValidationResult;
  aggregateStats: AggregateStats;
} {
  const countyValidation = validateAllCounties(counties);
  const distributionValidation = validateDataDistribution(counties);
  const fipsValidation = validateFipsCodes(counties);
  const aggregateStats = calculateAggregateStats(counties);

  const overallValid =
    countyValidation.overallValid &&
    distributionValidation.isValid &&
    fipsValidation.isValid;

  return {
    overallValid,
    countyValidation,
    distributionValidation,
    fipsValidation,
    aggregateStats
  };
}
