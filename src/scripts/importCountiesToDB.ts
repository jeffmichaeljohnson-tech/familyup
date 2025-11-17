/**
 * Import all Michigan counties from allCounties.ts to SQLite database
 */

import Database from 'better-sqlite3';
import { allMichiganCounties } from '../data/allCounties';
import path from 'path';

const dbPath = path.join(process.cwd(), 'familyup.db');
const db = new Database(dbPath);

console.log('Starting county data import to SQLite...');
console.log(`Database: ${dbPath}`);
console.log(`Counties to import: ${allMichiganCounties.length}`);

// Prepare insert statement
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO counties (
    name, fips, lat, lng, totalChildren, waitingAdoption,
    age_0_5, age_6_10, age_11_17, boys, girls,
    agencies, phone, email, distributionCenters
  ) VALUES (
    @name, @fips, @lat, @lng, @totalChildren, @waitingAdoption,
    @age_0_5, @age_6_10, @age_11_17, @boys, @girls,
    @agencies, @phone, @email, @distributionCenters
  )
`);

let successCount = 0;
let errorCount = 0;

// Import each county
for (const county of allMichiganCounties) {
  try {
    insertStmt.run({
      name: county.name,
      fips: county.fips,
      lat: county.lat,
      lng: county.lng,
      totalChildren: county.totalChildren,
      waitingAdoption: county.waitingAdoption,
      age_0_5: county.ageBreakdown['0-5'],
      age_6_10: county.ageBreakdown['6-10'],
      age_11_17: county.ageBreakdown['11-17'],
      boys: county.genderBreakdown.boys,
      girls: county.genderBreakdown.girls,
      agencies: JSON.stringify(county.agencies),
      phone: county.contactInfo?.phone || null,
      email: county.contactInfo?.email || null,
      distributionCenters: JSON.stringify(county.distributionCenters || [])
    });
    successCount++;
  } catch (error) {
    console.error(`Error importing ${county.name}:`, error);
    errorCount++;
  }
}

// Verify import
const totalCount = db.prepare('SELECT COUNT(*) as count FROM counties').get() as { count: number };
const totalChildren = db.prepare('SELECT SUM(totalChildren) as total FROM counties').get() as { total: number };

console.log('\n=== Import Complete ===');
console.log(`✓ Successfully imported: ${successCount} counties`);
console.log(`✗ Errors: ${errorCount}`);
console.log(`Database total: ${totalCount.count} counties`);
console.log(`Total children: ${totalChildren.total.toLocaleString()}`);

// Show sample data
console.log('\n=== Sample Counties ===');
const samples = db.prepare('SELECT name, totalChildren, lat, lng FROM counties ORDER BY totalChildren DESC LIMIT 5').all();
console.table(samples);

db.close();
console.log('\nDatabase connection closed.');
