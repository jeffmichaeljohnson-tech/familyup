/**
 * Load county data from SQLite database
 * This provides a single source of truth for all Michigan foster care data
 */

import Database from 'better-sqlite3';
import path from 'path';
import { CountyData } from '../types';

// Database path
const dbPath = path.join(process.cwd(), 'familyup.db');

/**
 * Load all counties from the database
 */
export function loadCountiesFromDB(): CountyData[] {
  const db = new Database(dbPath, { readonly: true });

  const rows = db.prepare(`
    SELECT
      name, fips, lat, lng, totalChildren, waitingAdoption,
      age_0_5, age_6_10, age_11_17, boys, girls,
      agencies, phone, email, distributionCenters
    FROM counties
    ORDER BY name
  `).all();

  const counties: CountyData[] = rows.map((row: any) => ({
    name: row.name,
    fips: row.fips,
    lat: row.lat,
    lng: row.lng,
    totalChildren: row.totalChildren,
    waitingAdoption: row.waitingAdoption,
    ageBreakdown: {
      '0-5': row.age_0_5,
      '6-10': row.age_6_10,
      '11-17': row.age_11_17
    },
    genderBreakdown: {
      boys: row.boys,
      girls: row.girls
    },
    agencies: row.agencies ? JSON.parse(row.agencies) : [],
    contactInfo: {
      phone: row.phone,
      email: row.email
    },
    distributionCenters: row.distributionCenters ? JSON.parse(row.distributionCenters) : []
  }));

  db.close();

  console.log(`✓ Loaded ${counties.length} counties from SQLite database`);

  return counties;
}

/**
 * Get county statistics from database
 */
export function getCountyStats() {
  const db = new Database(dbPath, { readonly: true });

  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalCounties,
      SUM(totalChildren) as totalChildren,
      SUM(waitingAdoption) as waitingAdoption,
      SUM(age_0_5) as age_0_5,
      SUM(age_6_10) as age_6_10,
      SUM(age_11_17) as age_11_17,
      SUM(boys) as boys,
      SUM(girls) as girls
    FROM counties
  `).get() as any;

  db.close();

  return stats;
}

/**
 * Get county by FIPS code
 */
export function getCountyByFips(fips: string): CountyData | undefined {
  const counties = loadCountiesFromDB();
  return counties.find(c => c.fips === fips);
}

/**
 * Get counties by region (placeholder - can be enhanced with regions table)
 */
export function getCountiesByRegion(_region: string): CountyData[] {
  // For now, return all counties
  // TODO: Add regions table and filtering
  return loadCountiesFromDB();
}
