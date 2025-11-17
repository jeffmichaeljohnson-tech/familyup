# Data Schema & Structure - Michigan Foster Care Map

## Overview

This document defines all data structures, schemas, and data handling patterns used in the Michigan Foster Care Map application.

---

## Legal Compliance & Privacy Framework

### Mission Statement

**Our Goal:** Dramatize the vast scale of children in need of permanent families while maintaining complete privacy and legal compliance.

This application exists to create urgency and awareness around foster care adoption by visualizing aggregate statistics. We achieve impact through scale and statistics, never through individual stories that could compromise privacy.

### Federal Legal Requirements

#### COPPA (Children's Online Privacy Protection Act)
- **Zero collection of personal information** from children under 13
- No user accounts, profiles, or registration required
- No tracking of individual user behavior
- No collection of names, addresses, or contact information
- **Compliance Method:** Display aggregate data only, no individual data collection

#### FERPA (Family Educational Rights and Privacy Act)
- No educational records or school information
- No individual student data
- No personally identifiable information from educational institutions
- **Compliance Method:** County-level statistics only, no individual records

#### HIPAA (Health Insurance Portability and Accountability Act)
- No protected health information (PHI)
- No medical records or health data
- No psychological evaluations or diagnoses
- No individual health status information
- **Compliance Method:** Aggregate statistics only, no individual health data

### State Legal Requirements

#### Michigan Child Protection Law (MCL 722.621 et seq.)
- No disclosure of individual child identities
- No case-specific information
- No family information that could identify individuals
- **Compliance Method:** Aggregate county-level data only

#### Michigan Data Privacy Act
- Minimal data collection principles
- No selling or sharing of personal data
- Clear privacy policy and terms of service
- Right to data deletion (N/A - we collect no personal data)
- **Compliance Method:** Zero PII collection policy

### Zero PII Collection Policy

**What is PII?** Personally Identifiable Information - any data that could be used to identify a specific individual.

**Our Policy:**
- ❌ **NO individual names** (children, families, caseworkers)
- ❌ **NO specific addresses** (exact street addresses, GPS coordinates of homes)
- ❌ **NO photos or images** (unless stock/consent obtained from unrelated models)
- ❌ **NO case details** (individual stories, circumstances, histories)
- ❌ **NO contact information** for individual children or families
- ❌ **NO biometric data**
- ❌ **NO social security numbers or government IDs**
- ❌ **NO financial information**

**What We DO Collect:**
- ✅ **County-level aggregate statistics** (total children per county)
- ✅ **Age group distributions** (ranges: 0-5, 6-10, 11-17)
- ✅ **Gender ratios** (percentages only)
- ✅ **Public agency contact information** (publicly available)
- ✅ **Geographic boundaries** (county-level only)

### Aggregate Data Only Requirement

**Definition:** Aggregate data represents statistical summaries of groups, never individuals.

**Minimum Aggregation Thresholds:**
- Minimum of 5 individuals in any reported group
- No exact counts for small populations (use ranges)
- Geographic precision limited to county level
- Age groups must span multiple years

**Examples:**
- ✅ "Wayne County has 3,813 children in foster care"
- ✅ "1,068 children aged 0-5 in Wayne County"
- ❌ "1 child aged 3 in rural Keweenaw County" (too specific)
- ❌ "Child #42 is located at coordinates 42.3314, -83.0458" (individual data)

### No Exact Locations Policy

**What We Show:**
- ✅ County centers (geographic centroid of county)
- ✅ Distribution centers for large counties (general population areas)
- ✅ County boundaries on maps
- ✅ Regional groupings (Upper Peninsula, Southeast Michigan)

**What We NEVER Show:**
- ❌ Exact GPS coordinates of foster homes
- ❌ Specific street addresses
- ❌ School locations
- ❌ Individual child locations
- ❌ Route mapping to specific locations
- ❌ Geocoded data more precise than county-level

**Icon Distribution Algorithm:**
- Icons are randomly distributed within county bounds
- Distribution uses statistical algorithms, not real locations
- Multiple placements prevent reverse-identification
- Clustering is decorative only, not based on actual concentrations

### Data Retention Policy

**Web Application:**
- Cache aggregate county data for 24 hours (performance only)
- No user-specific data stored
- No cookies tracking individual users
- LocalStorage used only for UI preferences (theme, zoom level)

**iOS Application:**
- Cache aggregate data locally for offline access
- No iCloud sync of user-generated content
- No background location tracking
- No persistent user identifiers

**Analytics (if implemented):**
- Only aggregate usage statistics
- No individual user tracking
- No IP address storage
- No device fingerprinting

### Third-Party Data Sharing

**Our Policy:** Zero sharing of data with third parties.

**What We Share:**
- ❌ Nothing. We collect no personal data to share.

**External Services:**
- Map tiles from public sources (e.g., OpenStreetMap)
- No analytics services that track individuals
- No advertising networks
- No social media integration that tracks users

---

## Core Data Types

### CountyData

**Primary data structure for Michigan county information**

**PRIVACY COMPLIANCE:** This interface represents AGGREGATE DATA ONLY. All values are county-level statistics, never individual child data.

```typescript
interface CountyData {
  /**
   * County name including "County" suffix
   * @example "Wayne County", "Oakland County"
   *
   * PRIVACY: Geographic unit - county level only, no specific addresses
   */
  name: string;

  /**
   * 5-digit Federal Information Processing Standards (FIPS) code
   * Format: 26XXX (26 = Michigan state code)
   * @example "26163" for Wayne County
   *
   * PRIVACY: Public identifier for geographic region, not personal data
   */
  fips: string;

  /**
   * Geographic center latitude (decimal degrees)
   * Range: 41.7 to 48.3 (Michigan bounds)
   *
   * PRIVACY WARNING: This is the county CENTROID only, not any individual location
   * NEVER represents actual child location
   * Used only for map display center point
   */
  lat: number;

  /**
   * Geographic center longitude (decimal degrees)
   * Range: -90.4 to -82.4 (Michigan bounds)
   *
   * PRIVACY WARNING: This is the county CENTROID only, not any individual location
   * NEVER represents actual child location
   * Used only for map display center point
   */
  lng: number;

  /**
   * Total children currently in foster care in this county
   * Includes all ages and situations
   *
   * AGGREGATE DATA: County-level total only
   * Minimum threshold: 5 children (privacy protection)
   * Source: Michigan DHHS quarterly reports
   */
  totalChildren: number;

  /**
   * Subset of totalChildren who are legally free for adoption
   * and waiting for identified families
   *
   * AGGREGATE DATA: County-level total only
   * NEVER identifies individual children
   */
  waitingAdoption: number;

  /**
   * Breakdown by age groups
   * Should sum to totalChildren
   *
   * AGGREGATE DATA: Age ranges only, never exact ages
   * Age groups span multiple years to protect privacy
   * NEVER links to individual child data
   */
  ageBreakdown: {
    /**
     * Infants and young children (0-5 years)
     * AGGREGATE ONLY: Count of children in 6-year range
     */
    "0-5": number;

    /**
     * School age children (6-10 years)
     * AGGREGATE ONLY: Count of children in 5-year range
     */
    "6-10": number;

    /**
     * Pre-teens and teenagers (11-17 years)
     * AGGREGATE ONLY: Count of children in 7-year range
     */
    "11-17": number;
  };

  /**
   * Breakdown by gender
   * Should sum to totalChildren
   *
   * AGGREGATE DATA: Statistical distribution only
   * NEVER identifies individual children by gender
   * Used for demographic visualization only
   */
  genderBreakdown: {
    /**
     * Number of boys
     * AGGREGATE ONLY: County-level count
     */
    boys: number;

    /**
     * Number of girls
     * AGGREGATE ONLY: County-level count
     */
    girls: number;
  };

  /**
   * List of adoption agencies serving this county
   * Typically 1-5 agencies per county
   *
   * PUBLIC DATA: Publicly available agency names only
   * No private/proprietary information
   * Contact via public channels only
   */
  agencies: string[];

  /**
   * Primary contact information for inquiries
   *
   * PUBLIC DATA ONLY: Publicly listed contact information
   * NEVER includes private contact info for children or families
   */
  contactInfo: {
    /**
     * Phone number in any format
     * PUBLIC: General inquiry line only
     */
    phone: string;

    /**
     * Optional email address
     * PUBLIC: General inquiry email only
     */
    email?: string;

    /**
     * Optional website URL
     * PUBLIC: Publicly accessible website only
     */
    website?: string;
  };

  /**
   * Optional: Multiple distribution centers for large counties
   * Used for realistic geographic spread of child icons
   *
   * PRIVACY CRITICAL: These are STATISTICAL DISTRIBUTION POINTS only
   * NOT actual locations of children
   * Used for visual distribution algorithm only
   * See DistributionCenter interface for details
   */
  distributionCenters?: DistributionCenter[];
}
```

**Example:**
```json
{
  "name": "Wayne County",
  "fips": "26163",
  "lat": 42.2808,
  "lng": -83.3733,
  "totalChildren": 3813,
  "waitingAdoption": 950,
  "ageBreakdown": {
    "0-5": 1068,
    "6-10": 953,
    "11-17": 1792
  },
  "genderBreakdown": {
    "boys": 1944,
    "girls": 1869
  },
  "agencies": [
    "Orchards Children's Services",
    "Ennis Center for Children",
    "Wolverine Human Services"
  ],
  "contactInfo": {
    "phone": "313-555-0100",
    "email": "info@wayneadoption.org",
    "website": "https://wayneadoption.org"
  },
  "distributionCenters": [
    { "lat": 42.3314, "lng": -83.0458, "weight": 0.35, "name": "Detroit" },
    { "lat": 42.2808, "lng": -83.3733, "weight": 0.25, "name": "Westland" },
    { "lat": 42.3223, "lng": -83.1763, "weight": 0.20, "name": "Dearborn" },
    { "lat": 42.5456, "lng": -83.2132, "weight": 0.20, "name": "Livonia" }
  ]
}
```

---

### DistributionCenter

**Geographic center for distributing child icons in large counties**

**CRITICAL PRIVACY NOTE:** These coordinates do NOT represent actual child locations. They are statistical distribution points for visual representation only.

```typescript
interface DistributionCenter {
  /**
   * Center point latitude
   *
   * PRIVACY WARNING: NOT a real child location
   * This is a general area centroid for statistical icon distribution
   * Used to spread icons realistically across large counties
   * NO GPS TRACKING - NO EXACT COORDINATES - AGGREGATE VISUALIZATION ONLY
   */
  lat: number;

  /**
   * Center point longitude
   *
   * PRIVACY WARNING: NOT a real child location
   * This is a general area centroid for statistical icon distribution
   * Used to spread icons realistically across large counties
   * NO GPS TRACKING - NO EXACT COORDINATES - AGGREGATE VISUALIZATION ONLY
   */
  lng: number;

  /**
   * Weight factor determining proportion of children in this area
   * Range: 0.0 to 1.0
   * All weights in a county should sum to approximately 1.0
   * @example 0.35 means 35% of county's children distributed here
   *
   * AGGREGATE DATA: Statistical distribution percentage only
   * Based on general population density, not actual child locations
   */
  weight: number;

  /**
   * Optional: Name/description of this center
   * @example "Detroit", "Westland", "Rural areas"
   *
   * PRIVACY: General area name only (city/region)
   * NEVER specific neighborhoods or addresses
   */
  name?: string;
}
```

**Usage:**
Large counties (Detroit, Grand Rapids) have multiple population centers. Instead of distributing all icons around a single point, we use multiple centers weighted by population.

**PRIVACY COMPLIANCE:** Distribution centers represent general population areas, not actual locations of children. This creates realistic visual spread while maintaining complete privacy.

**Example:**
```typescript
// Wayne County (Detroit metro) has 4 distribution centers
const wayneCountyCenters: DistributionCenter[] = [
  { lat: 42.3314, lng: -83.0458, weight: 0.35, name: "Detroit" },       // 35% of icons
  { lat: 42.2808, lng: -83.3733, weight: 0.25, name: "Westland" },      // 25% of icons
  { lat: 42.3223, lng: -83.1763, weight: 0.20, name: "Dearborn" },      // 20% of icons
  { lat: 42.5456, lng: -83.2132, weight: 0.20, name: "Livonia" }        // 20% of icons
];
// Total weight: 1.00 = 100% of children
```

---

### GeoPoint

**Simple geographic coordinate**

**PRIVACY WARNING:** Used for display purposes only. Never represents actual individual locations.

```typescript
interface GeoPoint {
  /**
   * Latitude in decimal degrees
   *
   * PRIVACY: When used in ChildIcon, this is a RANDOMLY GENERATED position
   * NOT a real child location
   * Generated by distribution algorithm for visualization only
   */
  lat: number;

  /**
   * Longitude in decimal degrees
   *
   * PRIVACY: When used in ChildIcon, this is a RANDOMLY GENERATED position
   * NOT a real child location
   * Generated by distribution algorithm for visualization only
   */
  lng: number;
}
```

**Coordinate System:**
- Uses WGS84 coordinate system (standard for GPS)
- Latitude: North is positive, South is negative
- Longitude: East is positive, West is negative
- Michigan range: lat 41.7-48.3, lng -90.4 to -82.4

**PRIVACY COMPLIANCE:**
- County centroids: Represent geographic center of county only
- Child icon positions: RANDOMLY GENERATED within county bounds
- Distribution centers: General population areas, not specific locations
- NO EXACT GPS COORDINATES of any individual child, home, or facility

---

### ChildIcon

**Represents an individual child icon on the map**

**CRITICAL PRIVACY STATEMENT:** This interface represents a VISUAL ELEMENT ONLY. It does NOT represent any specific individual child. Icons are generated statistically to visualize aggregate data.

```typescript
interface ChildIcon {
  /**
   * Unique identifier for this icon
   * Format: "{county_fips}-{gender}-{index}"
   * @example "26163-boy-42"
   *
   * PRIVACY: This is a DISPLAY ID ONLY
   * DOES NOT correspond to any real child
   * Used for React key and icon tracking only
   * NEVER linked to individual identities
   */
  id: string;

  /**
   * Position on map (computed from distribution algorithm)
   *
   * PRIVACY CRITICAL: This position is RANDOMLY GENERATED
   * NOT a real child's location
   * Generated by statistical algorithm within county bounds
   * Used for visual distribution only
   * NO GPS TRACKING - NO REAL LOCATIONS
   */
  position: GeoPoint;

  /**
   * Gender determines icon and color
   * boy = 👦 (blue), girl = 👧 (pink)
   *
   * AGGREGATE DATA: Randomly assigned based on county gender breakdown statistics
   * NOT linked to any specific individual
   * Used for visual representation of aggregate gender ratios
   */
  gender: 'boy' | 'girl';

  /**
   * County this child belongs to (for filtering)
   *
   * AGGREGATE DATA: Geographic grouping only
   * Used to associate icon with county-level statistics
   * NOT an address or specific location
   */
  countyFips: string;

  /**
   * Age group (for filtering)
   * Matches ageBreakdown keys
   *
   * AGGREGATE DATA: Broad age range only
   * Randomly assigned based on county age breakdown statistics
   * NOT a specific age or identifier
   * Multi-year ranges protect privacy (0-5, 6-10, 11-17)
   */
  ageGroup: '0-5' | '6-10' | '11-17';
}
```

**Example:**
```typescript
const icon: ChildIcon = {
  id: "26163-boy-42",  // Display ID only, not a real child identifier
  position: { lat: 42.3350, lng: -83.0500 },  // RANDOMLY GENERATED position
  gender: 'boy',  // Statistically assigned from county data
  countyFips: "26163",  // Wayne County
  ageGroup: "6-10"  // Broad age range, not exact age
};
```

**PRIVACY COMPLIANCE:**
- Each icon represents ONE unit in an aggregate count
- Position is mathematically generated, not GPS-tracked
- No correlation to any real individual
- Icons regenerate on each page load (not persistent)
- Purpose: Visualize SCALE of need, not individual cases

---

### MapFilters

**User-selected filters for map display**

```typescript
interface MapFilters {
  /** 
   * Age group filter
   * 'all' shows all ages
   */
  ageGroup: 'all' | '0-2' | '3-5' | '6-12' | '13-17';
  
  /** 
   * Optional: Region filter (future feature)
   * @example "Upper Peninsula", "Southeast Michigan"
   */
  region?: string;
  
  /** 
   * Optional: Gender filter (future feature)
   */
  gender?: 'all' | 'boys' | 'girls';
  
  /** 
   * Optional: Special needs filter (future feature)
   */
  specialNeeds?: boolean;
  
  /** 
   * Optional: Sibling groups filter (future feature)
   */
  siblingGroups?: boolean;
}
```

**Default Filters:**
```typescript
const DEFAULT_FILTERS: MapFilters = {
  ageGroup: 'all'
};
```

---

### StateSummary

**Statewide aggregate statistics**

```typescript
interface StateSummary {
  /** 
   * Total children in Michigan foster care system
   * Updated quarterly from MDHHS
   */
  totalChildren: number;
  
  /** 
   * Children legally free and waiting for adoption
   * Subset of totalChildren
   */
  waitingAdoption: number;
  
  /** 
   * Successful adoptions completed in the last calendar year
   */
  adoptionsThisYear: number;
  
  /** 
   * Average age of all children in care (years)
   * Computed from age breakdowns
   */
  averageAge: number;
  
  /** 
   * Youth who aged out of foster care without adoption last year
   * Age 18-21 depending on circumstances
   */
  agedOutLastYear: number;
  
  /** 
   * Optional: Last data update timestamp
   */
  lastUpdated?: string; // ISO 8601 date
}
```

**Example:**
```json
{
  "totalChildren": 10000,
  "waitingAdoption": 250,
  "adoptionsThisYear": 1600,
  "averageAge": 8,
  "agedOutLastYear": 1800,
  "lastUpdated": "2025-10-01T00:00:00Z"
}
```

---

## Prohibited Data Types

**Under NO circumstances should the following data types be collected, stored, displayed, or transmitted by this application:**

### Individual Identifiers

**❌ NEVER ALLOWED:**
- Individual child names (first, middle, last)
- Nicknames or aliases
- Case numbers or file numbers
- Social Security Numbers
- State ID numbers
- Birth certificate numbers
- Any other government-issued identifiers
- Database IDs from child welfare systems
- Biometric data (fingerprints, facial recognition, DNA)

**Why Prohibited:** Direct violation of COPPA, FERPA, and child protection laws. Could enable identification and tracking of vulnerable children.

### Location Data

**❌ NEVER ALLOWED:**
- Exact street addresses of foster homes
- GPS coordinates of individual residences
- School names or addresses
- Daycare or childcare facility locations
- GPS tracking data
- IP addresses linked to individuals
- Device location data
- Geofencing data
- Route or travel history
- Check-in locations

**Why Prohibited:** Could be used to locate and identify children. Violates safety protocols and privacy laws. County-level aggregation only.

### Personal Information

**❌ NEVER ALLOWED:**
- Photos of children in care (unless stock photos with model releases)
- Videos of children
- Voice recordings
- Handwriting samples
- Artwork created by specific children (unless anonymized)
- Personal stories with identifying details
- Family member names or information
- Foster parent names or identities
- Caseworker personal information
- Birth parent information

**Why Prohibited:** PII that could identify individuals. Violates COPPA and child protection statutes.

### Medical & Health Data

**❌ NEVER ALLOWED:**
- Medical records or diagnoses
- Prescription information
- Disability or special needs details (for individuals)
- Mental health diagnoses or treatment
- Therapy or counseling records
- Developmental assessments
- IEP (Individual Education Plan) details
- Healthcare provider information
- Insurance information
- Vaccination records

**Why Prohibited:** Protected Health Information (PHI) under HIPAA. Extreme privacy sensitivity for foster children.

### Educational Data

**❌ NEVER ALLOWED:**
- School attendance records
- Grade reports or transcripts
- Standardized test scores
- Disciplinary records
- IEP or 504 plan details
- Teacher names or comments
- School district assignments (when specific)
- Extracurricular participation

**Why Prohibited:** Protected under FERPA. Could enable identification and tracking.

### Legal & Case Information

**❌ NEVER ALLOWED:**
- Court case numbers or documents
- Termination of parental rights details
- Adoption case specifics
- Legal status of individual children
- Placement history for individuals
- Reasons for removal from home
- Sibling information (when identifying)
- Incident reports
- Investigation details

**Why Prohibited:** Legally protected information. Could stigmatize children and families.

### Behavioral & Tracking Data

**❌ NEVER ALLOWED:**
- Individual user behavior tracking
- Click-through rates per user
- Session recordings
- Form abandonment data (if personally identifiable)
- A/B test assignments (if personally identifiable)
- User demographics (age, gender) collected directly
- Login credentials or authentication data
- Cookie-based individual tracking
- Cross-site tracking
- Advertising identifiers

**Why Prohibited:** Violates privacy principles and COPPA. Creates unnecessary data liability.

### Financial Information

**❌ NEVER ALLOWED:**
- Adoption subsidy amounts for individuals
- Financial assistance details
- Payment information
- Bank account details
- Credit card information
- Fundraising linked to specific children

**Why Prohibited:** Financial privacy and potential exploitation concerns.

### Communication Data

**❌ NEVER ALLOWED:**
- Email addresses of children
- Phone numbers of children or foster families
- Text messages
- Chat logs
- Social media profiles
- Instant messaging handles
- Video call recordings

**Why Prohibited:** Contact information could enable unauthorized contact or exploitation.

---

## Data Validation

### Type Guards

**Validate data at runtime**

```typescript
/**
 * Check if object is valid CountyData
 */
function isCountyData(obj: unknown): obj is CountyData {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const county = obj as Record<string, unknown>;
  
  return (
    typeof county.name === 'string' &&
    typeof county.fips === 'string' &&
    county.fips.length === 5 &&
    typeof county.lat === 'number' &&
    typeof county.lng === 'number' &&
    typeof county.totalChildren === 'number' &&
    typeof county.waitingAdoption === 'number' &&
    county.totalChildren >= county.waitingAdoption &&
    isValidAgeBreakdown(county.ageBreakdown) &&
    isValidGenderBreakdown(county.genderBreakdown) &&
    Array.isArray(county.agencies) &&
    isValidContactInfo(county.contactInfo)
  );
}

function isValidAgeBreakdown(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const breakdown = obj as Record<string, unknown>;
  return (
    typeof breakdown['0-5'] === 'number' &&
    typeof breakdown['6-10'] === 'number' &&
    typeof breakdown['11-17'] === 'number'
  );
}

function isValidGenderBreakdown(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const breakdown = obj as Record<string, unknown>;
  return (
    typeof breakdown.boys === 'number' &&
    typeof breakdown.girls === 'number'
  );
}

function isValidContactInfo(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const contact = obj as Record<string, unknown>;
  return typeof contact.phone === 'string';
}
```

### Data Consistency Checks

```typescript
/**
 * Validate county data consistency
 * @throws Error if data is inconsistent
 */
function validateCountyData(county: CountyData): void {
  // Age breakdown should sum to total
  const ageSum = 
    county.ageBreakdown['0-5'] +
    county.ageBreakdown['6-10'] +
    county.ageBreakdown['11-17'];
  
  if (Math.abs(ageSum - county.totalChildren) > 1) {
    throw new Error(
      `${county.name}: Age breakdown (${ageSum}) doesn't match total (${county.totalChildren})`
    );
  }
  
  // Gender breakdown should sum to total
  const genderSum = county.genderBreakdown.boys + county.genderBreakdown.girls;
  
  if (Math.abs(genderSum - county.totalChildren) > 1) {
    throw new Error(
      `${county.name}: Gender breakdown (${genderSum}) doesn't match total (${county.totalChildren})`
    );
  }
  
  // Waiting should be <= total
  if (county.waitingAdoption > county.totalChildren) {
    throw new Error(
      `${county.name}: Waiting (${county.waitingAdoption}) exceeds total (${county.totalChildren})`
    );
  }
  
  // Coordinates should be in Michigan
  if (
    county.lat < 41.7 || county.lat > 48.3 ||
    county.lng < -90.4 || county.lng > -82.4
  ) {
    throw new Error(
      `${county.name}: Coordinates (${county.lat}, ${county.lng}) outside Michigan bounds`
    );
  }
  
  // Distribution centers should sum to ~1.0
  if (county.distributionCenters) {
    const weightSum = county.distributionCenters.reduce(
      (sum, center) => sum + center.weight,
      0
    );
    
    if (Math.abs(weightSum - 1.0) > 0.01) {
      throw new Error(
        `${county.name}: Distribution center weights sum to ${weightSum}, should be 1.0`
      );
    }
  }
}
```

---

## Data Sources

### Primary Data File

**File:** `src/data/countyData.ts`

```typescript
import { CountyData, StateSummary } from '../types';

/**
 * All 83 Michigan counties with foster care data
 * Source: Michigan DHHS, AFCARS FY 2023
 * Last updated: October 2025
 */
export const michiganCounties: CountyData[] = [
  {
    name: "Wayne County",
    fips: "26163",
    // ... full data
  },
  {
    name: "Oakland County",
    fips: "26125",
    // ... full data
  },
  // ... 81 more counties
];

/**
 * Statewide summary statistics
 * Source: Michigan DHHS Annual Report 2024
 */
export const stateSummary: StateSummary = {
  totalChildren: 10000,
  waitingAdoption: 250,
  adoptionsThisYear: 1600,
  averageAge: 8,
  agedOutLastYear: 1800,
  lastUpdated: "2025-10-01T00:00:00Z"
};

/**
 * Get county by FIPS code
 */
export function getCountyByFips(fips: string): CountyData | undefined {
  return michiganCounties.find(c => c.fips === fips);
}

/**
 * Get all counties in a region
 */
export function getCountiesByRegion(region: string): CountyData[] {
  // Implementation depends on region definitions
  return [];
}
```

---

## Data Transformation

### Age Group Mapping

**Convert from breakdown to filter groups**

```typescript
/**
 * Map age breakdown to filter age groups
 */
function mapAgeBreakdownToFilters(
  breakdown: CountyData['ageBreakdown']
): Record<MapFilters['ageGroup'], number> {
  return {
    'all': breakdown['0-5'] + breakdown['6-10'] + breakdown['11-17'],
    '0-2': Math.round(breakdown['0-5'] * 0.5), // Estimate
    '3-5': Math.round(breakdown['0-5'] * 0.5), // Estimate
    '6-12': breakdown['6-10'] + Math.round(breakdown['11-17'] * 0.2), // Estimate
    '13-17': Math.round(breakdown['11-17'] * 0.8) // Estimate
  };
}
```

### County Data Aggregation

```typescript
/**
 * Calculate summary statistics from county data
 */
function calculateSummary(counties: CountyData[]): StateSummary {
  const totalChildren = counties.reduce(
    (sum, c) => sum + c.totalChildren,
    0
  );
  
  const waitingAdoption = counties.reduce(
    (sum, c) => sum + c.waitingAdoption,
    0
  );
  
  // Calculate weighted average age
  let totalAge = 0;
  counties.forEach(county => {
    totalAge += county.ageBreakdown['0-5'] * 2.5;  // Midpoint
    totalAge += county.ageBreakdown['6-10'] * 8;   // Midpoint
    totalAge += county.ageBreakdown['11-17'] * 14; // Midpoint
  });
  const averageAge = Math.round(totalAge / totalChildren);
  
  return {
    totalChildren,
    waitingAdoption,
    adoptionsThisYear: 0, // Would come from separate source
    averageAge,
    agedOutLastYear: 0 // Would come from separate source
  };
}
```

---

## Data Loading & Caching

### Loading Strategy

```typescript
/**
 * Load county data with caching
 */
export function useCountyData() {
  const [data, setData] = useState<CountyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Check cache first
        const cached = getCachedData();
        if (cached && !isCacheExpired(cached)) {
          setData(cached.data);
          setIsLoading(false);
          return;
        }
        
        // Load from source
        const response = await fetch('/data/counties.json');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const counties = await response.json();
        
        // Validate all counties
        counties.forEach((county: unknown) => {
          if (!isCountyData(county)) {
            throw new Error('Invalid county data format');
          }
          validateCountyData(county);
        });
        
        // Cache for future use
        setCachedData(counties);
        setData(counties);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  return { data, isLoading, error };
}

/**
 * Cache helpers
 */
const CACHE_KEY = 'michigan_foster_care_data';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

function getCachedData(): { data: CountyData[], timestamp: number } | null {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}

function setCachedData(data: CountyData[]): void {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

function isCacheExpired(cached: { timestamp: number }): boolean {
  return Date.now() - cached.timestamp > CACHE_DURATION;
}
```

---

## Data Update Process

### Update Checklist

When updating county data:

1. **Obtain Official Data**
   - Source: Michigan DHHS or AFCARS
   - Verify data is current (quarterly updates)
   - Check for any methodology changes

2. **Validate New Data**
   ```bash
   npm run validate-data
   ```

3. **Update County Files**
   - Edit `src/data/countyData.ts`
   - Update `lastUpdated` timestamp
   - Run validation tests

4. **Test Changes**
   ```bash
   npm test
   npm run build
   ```

5. **Document Changes**
   - Update CHANGELOG.md
   - Note source and date in comments
   - Update any affected documentation

6. **Deploy**
   - Create PR with data update
   - Get review from data lead
   - Deploy to production
   - Monitor for issues

### Data Update Script

```typescript
/**
 * Script to update county data from CSV
 * Usage: npm run update-data -- --file counties.csv
 */
import fs from 'fs';
import Papa from 'papaparse';

interface CSVRow {
  county_name: string;
  fips: string;
  total_children: string;
  waiting_adoption: string;
  // ... other fields
}

function updateDataFromCSV(csvPath: string): void {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  
  const result = Papa.parse<CSVRow>(csv, {
    header: true,
    skipEmptyLines: true
  });
  
  const updatedCounties = result.data.map(row => {
    const existing = getCountyByFips(row.fips);
    
    return {
      ...existing, // Keep existing data like coordinates
      totalChildren: parseInt(row.total_children),
      waitingAdoption: parseInt(row.waiting_adoption),
      // ... update other fields
    };
  });
  
  // Validate all updated data
  updatedCounties.forEach(validateCountyData);
  
  // Write to file
  const output = `// Auto-generated on ${new Date().toISOString()}
export const michiganCounties: CountyData[] = ${JSON.stringify(updatedCounties, null, 2)};
`;
  
  fs.writeFileSync('src/data/countyData.ts', output);
  console.log(`✅ Updated ${updatedCounties.length} counties`);
}
```

---

## Data Privacy & Ethics

### What Data We Collect

**✅ ALWAYS ALLOWED:**
- County-level aggregate numbers
- Age group statistics (ranges only)
- Gender ratios (percentages)
- Geographic boundaries
- Public agency information

**❌ NEVER COLLECTED:**
- Individual child names
- Specific addresses
- Case details
- Family information
- School information
- Medical information
- Photos (without explicit consent)

### Data Aggregation Rules

```typescript
/**
 * Ensure data is properly aggregated and anonymized
 */
function ensureProperAggregation(data: CountyData[]): void {
  data.forEach(county => {
    // Rule 1: Minimum threshold for reporting
    // Don't show data for counties with < 5 children (prevents identification)
    if (county.totalChildren < 5) {
      console.warn(
        `${county.name} has only ${county.totalChildren} children. ` +
        `Consider aggregating with neighboring county.`
      );
    }
    
    // Rule 2: No individual-level data
    // All numbers must represent groups
    const hasIndividualData = 
      county.totalChildren === 1 || 
      county.waitingAdoption === 1;
    
    if (hasIndividualData) {
      throw new Error(
        `${county.name} has individual-level data. ` +
        `Must aggregate to protect privacy.`
      );
    }
    
    // Rule 3: Geographic precision limits
    // No more precise than county level
    if (county.distributionCenters && county.distributionCenters.length > 10) {
      throw new Error(
        `${county.name} has too many distribution centers. ` +
        `Maximum 10 to maintain appropriate geographic aggregation.`
      );
    }
  });
}
```

---

## Data Constants

### Michigan Geographic Constants

```typescript
export const MICHIGAN_BOUNDS = {
  north: 48.3,    // Copper Harbor, UP
  south: 41.7,    // Ohio border
  east: -82.4,    // Ontario border
  west: -90.4     // Wisconsin border
};

export const MICHIGAN_CENTER = {
  lat: 44.3148,
  lng: -85.6024
};

export const GREAT_LAKES = {
  superior: { minLat: 46.5, maxLat: 49.0, minLng: -92.0, maxLng: -84.0 },
  michigan: { minLat: 41.6, maxLat: 46.0, minLng: -87.5, maxLng: -84.8 },
  huron: { minLat: 43.0, maxLat: 46.5, minLng: -84.8, maxLng: -79.8 },
  erie: { minLat: 41.3, maxLat: 42.9, minLng: -83.5, maxLng: -78.8 }
};
```

### Application Constants

```typescript
export const APP_CONSTANTS = {
  // Data source information
  DATA_SOURCE: 'Michigan DHHS / AFCARS FY 2023',
  LAST_UPDATED: '2025-10-01',
  
  // Contact information
  MARE_PHONE: '1-800-589-6273',
  MARE_PHONE_FORMATTED: '1-800-589-MARE',
  MARE_WEBSITE: 'https://www.mare.org',
  
  // Map configuration
  DEFAULT_ZOOM: 7,
  MIN_ZOOM: 6,
  MAX_ZOOM: 11,
  
  // Distribution algorithm
  BASE_RADIUS_KM: 25,
  POWER_FACTOR: 0.6,
  MAX_PLACEMENT_RETRIES: 10,
  
  // Performance
  MAX_CHILD_ICONS: 2000,
  ENABLE_CLUSTERING_THRESHOLD: 1000,
  
  // Cache
  CACHE_DURATION_HOURS: 24,
  
  // Colors
  HEAT_MAP_COLORS: {
    veryHigh: '#dc2626',  // 1000+ children
    high: '#f97316',      // 500-1000
    medium: '#fbbf24',    // 200-500
    low: '#60a5fa',       // 100-200
    veryLow: '#93c5fd'    // <100
  },
  
  GENDER_COLORS: {
    boy: '#3b82f6',       // Blue
    girl: '#ec4899'       // Pink
  }
};
```

---

## Example Queries

### Common Data Operations

```typescript
/**
 * Get total children waiting in a region
 */
function getTotalWaitingInRegion(
  counties: CountyData[],
  region: string
): number {
  return counties
    .filter(c => isInRegion(c, region))
    .reduce((sum, c) => sum + c.waitingAdoption, 0);
}

/**
 * Get counties sorted by need
 */
function getCountiesByNeed(counties: CountyData[]): CountyData[] {
  return [...counties].sort((a, b) => 
    b.waitingAdoption - a.waitingAdoption
  );
}

/**
 * Get age distribution for a county
 */
function getAgeDistribution(county: CountyData) {
  const total = county.totalChildren;
  return {
    '0-5': {
      count: county.ageBreakdown['0-5'],
      percentage: (county.ageBreakdown['0-5'] / total * 100).toFixed(1)
    },
    '6-10': {
      count: county.ageBreakdown['6-10'],
      percentage: (county.ageBreakdown['6-10'] / total * 100).toFixed(1)
    },
    '11-17': {
      count: county.ageBreakdown['11-17'],
      percentage: (county.ageBreakdown['11-17'] / total * 100).toFixed(1)
    }
  };
}

/**
 * Filter counties by criteria
 */
function filterCounties(
  counties: CountyData[],
  filters: MapFilters
): CountyData[] {
  return counties.filter(county => {
    // Age filter
    if (filters.ageGroup !== 'all') {
      const ageKey = mapFilterToBreakdownKey(filters.ageGroup);
      if (!ageKey || county.ageBreakdown[ageKey] === 0) {
        return false;
      }
    }
    
    // Region filter
    if (filters.region && !isInRegion(county, filters.region)) {
      return false;
    }
    
    // Gender filter  
    if (filters.gender === 'boys' && county.genderBreakdown.boys === 0) {
      return false;
    }
    if (filters.gender === 'girls' && county.genderBreakdown.girls === 0) {
      return false;
    }
    
    return true;
  });
}
```

---

## iOS Platform Considerations

### Overview

The Michigan Foster Care Map has both web and iOS native implementations. Both platforms must maintain identical privacy and compliance standards.

### Data Sync Between Web and iOS

**Shared Data:**
- County-level aggregate statistics (same JSON source)
- State summary data
- Agency contact information (public only)
- Geographic boundaries and county centroids

**Sync Method:**
- iOS app fetches the same aggregate data endpoints as web
- No user-specific data to sync
- No cloud storage of personal information
- Cache expiration: 24 hours (same as web)

**Privacy Compliance:**
- ✅ No iCloud sync of user-generated content (none exists)
- ✅ No cross-device tracking
- ✅ No user accounts or authentication
- ✅ Offline mode uses locally cached aggregate data only

### Privacy Settings on iOS

**Required Settings:**

#### Info.plist Privacy Keys (if location used for map centering only)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Your location is used only to center the map on your region. We never collect, store, or transmit your location data.</string>
```

**IMPORTANT:** Only request location permission if absolutely necessary for UX. Current design does not require user location.

#### App Store Privacy Declarations

**Data Collection: NONE**

When submitting to App Store, declare:
- ❌ Contact Info: Not collected
- ❌ Health & Fitness: Not collected
- ❌ Financial Info: Not collected
- ❌ Location: Not collected
- ❌ User Content: Not collected
- ❌ Identifiers: Not collected
- ❌ Usage Data: Not collected
- ❌ Diagnostics: Not collected

**Data Used to Track You: NONE**

**Data Linked to You: NONE**

**Data Not Linked to You:**
- May collect anonymous crash reports (if enabled)
- No advertising identifiers
- No analytics that track individuals

### Core Location Framework - CRITICAL PRIVACY NOTES

**Current Implementation: NO LOCATION TRACKING**

The app does NOT use Core Location for:
- ❌ User tracking
- ❌ Background location updates
- ❌ Geofencing
- ❌ Visit monitoring
- ❌ Significant location changes
- ❌ Beacon ranging

**Permitted Use (if implemented):**
- ✅ One-time location request to center map on user's region (optional)
- ✅ Location data used locally only, never transmitted
- ✅ No storage of location history
- ✅ Clear user consent and explanation

**Code Example - Compliant Location Usage:**
```swift
import CoreLocation

class MapViewController: UIViewController, CLLocationManagerDelegate {
    let locationManager = CLLocationManager()

    func requestLocationForMapCentering() {
        // PRIVACY: Only request when user explicitly taps "Center on my location"
        // Never automatically or in background

        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()

        // Request single location, don't start continuous monitoring
        locationManager.requestLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else { return }

        // PRIVACY: Use location ONLY to center map, then discard
        centerMap(on: location.coordinate)

        // DO NOT STORE - DO NOT TRANSMIT
        // Location data stays on device and is not persisted
    }

    func centerMap(on coordinate: CLLocationCoordinate2D) {
        // Find nearest county center and zoom to that county
        // We work with county-level data only
        let nearestCounty = findNearestCounty(to: coordinate)
        mapView.setRegion(nearestCounty.region, animated: true)

        // User's actual coordinate is not stored or used further
    }
}
```

**NON-COMPLIANT Code (NEVER implement):**
```swift
// ❌ WRONG - DO NOT IMPLEMENT
locationManager.startUpdatingLocation()  // Continuous tracking
locationManager.allowsBackgroundLocationUpdates = true  // Background tracking
locationManager.startMonitoringSignificantLocationChanges()  // Tracking
locationManager.startMonitoring(for: region)  // Geofencing

// ❌ WRONG - DO NOT STORE
UserDefaults.standard.set(location, forKey: "userLocation")
try location.save(to: database)
sendLocationToServer(location)
```

### TestFlight Data Handling

**During TestFlight Distribution:**

**Crash Reports:**
- ✅ Allowed: Anonymous crash reports through TestFlight
- ✅ Contains: Stack traces, device model, OS version
- ❌ NEVER include: User data, location data, personal information
- Implementation: Use standard Apple crash reporting, no custom logging of sensitive data

**Beta Feedback:**
- ✅ Allowed: Screenshots submitted by testers
- ❌ Ensure screenshots don't contain: Real child data (none exists in app anyway)
- ⚠️ Warning to testers: "This app displays aggregate statistics only. No personal information is collected or displayed."

**Analytics:**
- ❌ Disable: Custom analytics during TestFlight
- ✅ Use only: Apple's built-in TestFlight analytics (session counts, crashes)
- ❌ Never track: Individual user behavior, locations, or identifiable data

**Data Collection Notice:**
```swift
// In app initialization or first launch
if isTestFlightBuild() {
    // Optional: Show TestFlight-specific privacy notice
    let alert = UIAlertController(
        title: "TestFlight Privacy",
        message: "This app collects no personal data. Anonymous crash reports may be sent to Apple for debugging purposes. All displayed data is aggregate county-level statistics.",
        preferredStyle: .alert
    )
    alert.addAction(UIAlertAction(title: "I Understand", style: .default))
    present(alert, animated: true)
}
```

### iOS-Specific Privacy Features

**Required Implementations:**

1. **No App Tracking Transparency (ATT) Prompt**
   - Not needed because we don't track users
   - Don't call `requestTrackingAuthorization()`

2. **No IDFA (Identifier for Advertisers)**
   - Don't access `ASIdentifierManager.shared()`
   - No advertising SDKs

3. **Minimal Permissions**
   - Don't request camera access (no photos)
   - Don't request photo library access
   - Don't request contacts access
   - Don't request microphone access
   - Don't request notification permissions (unless clearly beneficial and disclosed)

4. **Local Data Only**
   - Use UserDefaults only for UI preferences:
     ```swift
     // ✅ ALLOWED
     UserDefaults.standard.set(isDarkMode, forKey: "darkMode")
     UserDefaults.standard.set(lastZoomLevel, forKey: "mapZoom")

     // ❌ NOT ALLOWED
     UserDefaults.standard.set(userLocation, forKey: "location")
     UserDefaults.standard.set(viewedCounties, forKey: "userActivity")
     ```

5. **Network Requests**
   - Only to fetch aggregate county data (same as web)
   - Use HTTPS only
   - No tracking headers or cookies
   - No third-party analytics services

### SwiftUI Privacy Example

```swift
import SwiftUI

struct CountyMapView: View {
    // PRIVACY: All data is aggregate, fetched from public API
    @StateObject private var dataManager = CountyDataManager()

    var body: some View {
        Map(coordinateRegion: $region, annotationItems: counties) { county in
            // PRIVACY: Each annotation represents aggregate county data
            // NOT individual child locations
            MapAnnotation(coordinate: county.centerCoordinate) {
                CountyMarker(
                    count: county.totalChildren,  // Aggregate count
                    name: county.name  // County name
                )
            }
        }
        .onAppear {
            // PRIVACY: Fetch aggregate data from same source as web app
            dataManager.fetchCountyData()
        }
    }
}

// PRIVACY: This manager only handles aggregate county statistics
class CountyDataManager: ObservableObject {
    @Published var counties: [CountyData] = []

    func fetchCountyData() {
        // Fetch from public aggregate data source
        // NO user data collected or transmitted
        // NO location tracking
        // NO personal information

        let url = URL(string: "https://api.example.com/aggregate/counties")!
        URLSession.shared.dataTask(with: url) { data, response, error in
            // Handle aggregate data only
            // No user context sent in request
        }.resume()
    }
}
```

### App Store Review Preparation

**Privacy Questionnaire Answers:**

1. **Does this app collect data?**
   - NO

2. **Does this app use data for tracking?**
   - NO

3. **Does this app share data with third parties?**
   - NO

4. **Does this app use location services?**
   - Optional: Only if you implement "center on my location" feature
   - If YES: Explain it's used once, locally, never stored or transmitted

5. **Does this app use encryption?**
   - YES (HTTPS for data fetching)

**App Description Privacy Statement:**
```
Privacy: This app collects NO personal information. All data displayed represents
aggregate county-level statistics from Michigan DHHS. No individual children are
identified or tracked. No user data is collected, stored, or shared. Your privacy
is completely protected.
```

### Compliance Checklist for iOS

**Before submitting to App Store:**

- [ ] Verified no PII collection in code
- [ ] Verified no location tracking (or only compliant one-time use)
- [ ] Removed all analytics SDKs that track individuals
- [ ] Removed all advertising SDKs
- [ ] Set correct App Store privacy declarations (all "Not collected")
- [ ] Added privacy policy URL to App Store listing
- [ ] Tested offline mode uses only cached aggregate data
- [ ] Verified no iCloud sync of user data
- [ ] Verified no background data collection
- [ ] Confirmed UserDefaults only stores UI preferences
- [ ] Tested that app works without any permissions granted
- [ ] Added Info.plist privacy descriptions (if location used)
- [ ] Verified HTTPS-only network requests
- [ ] Confirmed no third-party data sharing
- [ ] Tested with network logging to verify no PII transmitted

---

**This data schema documentation provides complete context for understanding and working with all data structures in the application. Any developer or AI assistant should be able to understand the data model from this document.**

**PRIVACY COMMITMENT:** This application exists to dramatize the scale of children in need through aggregate statistics and data visualization. We achieve impact through numbers and trends, never through individual stories or identifiable information. Every design decision prioritizes complete privacy and legal compliance while maximizing awareness and urgency.
