/**
 * Data Validation Script
 *
 * Runs comprehensive validation on all county data to ensure:
 * - All 83 Michigan counties are included
 * - Data integrity (age/gender breakdowns match totals)
 * - Privacy compliance (minimum thresholds)
 * - Geographic accuracy (coordinates within Michigan)
 * - Proper distribution ratios
 */

import { allMichiganCounties } from '../data/allCounties';
import { validateRegionCoverage } from '../data/regions';
import {
  runFullValidation
} from '../utils/dataValidation';

// Run comprehensive validation
console.log('='.repeat(70));
console.log('FAMILYUP DATA VALIDATION REPORT');
console.log('='.repeat(70));
console.log();

// Run full validation
const validationReport = runFullValidation(allMichiganCounties);

// Display aggregate statistics
console.log('AGGREGATE STATISTICS');
console.log('-'.repeat(70));
const stats = validationReport.aggregateStats;
console.log(`Total Children: ${stats.totalChildren.toLocaleString()}`);
console.log(`Total Waiting Adoption: ${stats.totalWaitingAdoption.toLocaleString()}`);
console.log(`Average Children per County: ${stats.averageChildrenPerCounty.toFixed(1)}`);
console.log(`Median Children per County: ${stats.medianChildrenPerCounty}`);
console.log();

console.log('Age Distribution:');
console.log(`  0-5 years:   ${stats.ageDistribution["0-5"].toLocaleString()} (${stats.agePercentages["0-5"].toFixed(1)}%)`);
console.log(`  6-10 years:  ${stats.ageDistribution["6-10"].toLocaleString()} (${stats.agePercentages["6-10"].toFixed(1)}%)`);
console.log(`  11-17 years: ${stats.ageDistribution["11-17"].toLocaleString()} (${stats.agePercentages["11-17"].toFixed(1)}%)`);
console.log();

console.log('Gender Distribution:');
console.log(`  Boys:  ${stats.genderDistribution.boys.toLocaleString()} (${stats.genderPercentages.boys.toFixed(1)}%)`);
console.log(`  Girls: ${stats.genderDistribution.girls.toLocaleString()} (${stats.genderPercentages.girls.toFixed(1)}%)`);
console.log();

// County validation results
console.log('COUNTY VALIDATION');
console.log('-'.repeat(70));
const countyVal = validationReport.countyValidation;
console.log(`Total Counties: ${countyVal.totalCounties}`);
console.log(`Valid Counties: ${countyVal.validCounties}`);
console.log(`Invalid Counties: ${countyVal.invalidCounties}`);
console.log(`Total Errors: ${countyVal.summary.totalErrors}`);
console.log(`Total Warnings: ${countyVal.summary.totalWarnings}`);
console.log();

// Show any errors
if (countyVal.summary.totalErrors > 0) {
  console.log('ERRORS FOUND:');
  countyVal.results
    .filter(r => r.errors.length > 0)
    .forEach(result => {
      console.log(`\n${result.countyName} (${result.countyFips}):`);
      result.errors.forEach(error => console.log(`  - ${error}`));
    });
  console.log();
}

// Show warnings (limited to first 10)
if (countyVal.summary.totalWarnings > 0) {
  console.log('WARNINGS FOUND:');
  const warningResults = countyVal.results.filter(r => r.warnings.length > 0);
  warningResults.slice(0, 10).forEach(result => {
    console.log(`\n${result.countyName} (${result.countyFips}):`);
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  });
  if (warningResults.length > 10) {
    console.log(`\n... and ${warningResults.length - 10} more counties with warnings`);
  }
  console.log();
}

// Distribution validation
console.log('DISTRIBUTION VALIDATION');
console.log('-'.repeat(70));
const distVal = validationReport.distributionValidation;
console.log(`Valid: ${distVal.isValid ? 'YES' : 'NO'}`);
if (distVal.errors.length > 0) {
  console.log('Errors:');
  distVal.errors.forEach(error => console.log(`  - ${error}`));
}
if (distVal.warnings.length > 0) {
  console.log('Warnings:');
  distVal.warnings.forEach(warning => console.log(`  - ${warning}`));
}
console.log();

// FIPS validation
console.log('FIPS CODE VALIDATION');
console.log('-'.repeat(70));
const fipsVal = validationReport.fipsValidation;
console.log(`Valid: ${fipsVal.isValid ? 'YES' : 'NO'}`);
if (fipsVal.errors.length > 0) {
  console.log('Errors:');
  fipsVal.errors.forEach(error => console.log(`  - ${error}`));
}
if (fipsVal.warnings.length > 0) {
  console.log('Warnings:');
  fipsVal.warnings.forEach(warning => console.log(`  - ${warning}`));
}
console.log();

// Region coverage validation
console.log('REGION COVERAGE VALIDATION');
console.log('-'.repeat(70));
const regionVal = validateRegionCoverage();
console.log(`Valid: ${regionVal.valid ? 'YES' : 'NO'}`);
console.log(`Total Counties in Regions: ${regionVal.totalCounties}`);
if (regionVal.duplicates.length > 0) {
  console.log('Duplicate FIPS codes:');
  regionVal.duplicates.forEach(fips => console.log(`  - ${fips}`));
}
if (regionVal.missing.length > 0) {
  console.log('Missing FIPS codes:');
  regionVal.missing.forEach(fips => console.log(`  - ${fips}`));
}
console.log();

// Overall result
console.log('='.repeat(70));
console.log('OVERALL VALIDATION RESULT');
console.log('='.repeat(70));
const overallValid = validationReport.overallValid && regionVal.valid;
console.log(`Status: ${overallValid ? 'PASSED ✓' : 'FAILED ✗'}`);

if (overallValid) {
  console.log();
  console.log('All validation checks passed!');
  console.log(`Successfully validated ${stats.totalChildren.toLocaleString()} children across 83 Michigan counties.`);
} else {
  console.log();
  console.log('Validation failed. Please review errors above.');
  process.exit(1);
}

console.log('='.repeat(70));
