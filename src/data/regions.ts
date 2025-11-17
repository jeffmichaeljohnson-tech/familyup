/**
 * Michigan Regional Groupings for Foster Care Data
 *
 * Divides Michigan's 83 counties into 6 geographic regions for
 * filtering and analysis purposes.
 *
 * PRIVACY NOTE: All data remains county-level aggregates only.
 */

export interface Region {
  name: string;
  id: string;
  description: string;
  counties: string[]; // Array of county FIPS codes
}

/**
 * All Michigan regions with county FIPS code assignments
 */
export const michiganRegions: Region[] = [
  {
    name: "Southeast Michigan",
    id: "southeast",
    description: "Metropolitan Detroit and surrounding counties",
    counties: [
      "26163", // Wayne County
      "26125", // Oakland County
      "26099", // Macomb County
      "26161", // Washtenaw County
      "26115", // Monroe County
      "26093", // Livingston County
      "26147", // St. Clair County
      "26091"  // Lenawee County
    ]
  },
  {
    name: "West Michigan",
    id: "west",
    description: "Grand Rapids metropolitan area and Lake Michigan coast",
    counties: [
      "26081", // Kent County
      "26139", // Ottawa County
      "26121", // Muskegon County
      "26005", // Allegan County
      "26015", // Barry County
      "26067", // Ionia County
      "26117", // Montcalm County
      "26123", // Newaygo County
      "26107", // Mecosta County
      "26085", // Lake County
      "26127", // Oceana County
      "26105"  // Mason County
    ]
  },
  {
    name: "Southwest Michigan",
    id: "southwest",
    description: "Kalamazoo, Battle Creek, and Indiana border region",
    counties: [
      "26077", // Kalamazoo County
      "26021", // Berrien County
      "26025", // Calhoun County
      "26149", // St. Joseph County
      "26023", // Branch County
      "26059", // Hillsdale County
      "26027", // Cass County
      "26159"  // Van Buren County
    ]
  },
  {
    name: "Central Michigan",
    id: "central",
    description: "Lansing metropolitan area and mid-state counties",
    counties: [
      "26065", // Ingham County
      "26045", // Eaton County
      "26037", // Clinton County
      "26155", // Shiawassee County
      "26057", // Gratiot County
      "26073", // Isabella County
      "26111", // Midland County
      "26145", // Saginaw County
      "26017", // Bay County
      "26075", // Jackson County
      "26049", // Genesee County
      "26087", // Lapeer County
      "26157", // Tuscola County
      "26151", // Sanilac County
      "26063", // Huron County
      "26035", // Clare County
      "26051", // Gladwin County
      "26011", // Arenac County
      "26133"  // Osceola County
    ]
  },
  {
    name: "Northern Michigan",
    id: "northern",
    description: "Traverse City and northern lower peninsula",
    counties: [
      "26055", // Grand Traverse County
      "26165", // Wexford County
      "26113", // Missaukee County
      "26143", // Roscommon County
      "26129", // Ogemaw County
      "26069", // Iosco County
      "26001", // Alcona County
      "26135", // Oscoda County
      "26039", // Crawford County
      "26079", // Kalkaska County
      "26019", // Benzie County
      "26089", // Leelanau County
      "26009", // Antrim County
      "26029", // Charlevoix County
      "26047", // Emmet County
      "26031", // Cheboygan County
      "26141", // Presque Isle County
      "26007", // Alpena County
      "26119", // Montmorency County
      "26137", // Otsego County
      "26101"  // Manistee County
    ]
  },
  {
    name: "Upper Peninsula",
    id: "upper-peninsula",
    description: "Michigan's Upper Peninsula counties",
    counties: [
      "26103", // Marquette County
      "26041", // Delta County
      "26109", // Menominee County
      "26043", // Dickinson County
      "26003", // Alger County
      "26153", // Schoolcraft County
      "26095", // Luce County
      "26033", // Chippewa County
      "26097", // Mackinac County
      "26061", // Houghton County
      "26083", // Keweenaw County
      "26131", // Ontonagon County
      "26053", // Gogebic County
      "26071", // Iron County
      "26013"  // Baraga County
    ]
  }
];

/**
 * Get region by ID
 */
export function getRegionById(id: string): Region | undefined {
  return michiganRegions.find(r => r.id === id);
}

/**
 * Get region for a specific county FIPS code
 */
export function getRegionByCountyFips(fips: string): Region | undefined {
  return michiganRegions.find(r => r.counties.includes(fips));
}

/**
 * Get all counties in a region
 */
export function getCountiesInRegion(regionId: string): string[] {
  const region = getRegionById(regionId);
  return region ? region.counties : [];
}

/**
 * Get region summary statistics
 */
export interface RegionSummary {
  name: string;
  id: string;
  countyCount: number;
}

export function getRegionSummaries(): RegionSummary[] {
  return michiganRegions.map(region => ({
    name: region.name,
    id: region.id,
    countyCount: region.counties.length
  }));
}

/**
 * Validate that all 83 counties are assigned to exactly one region
 */
export function validateRegionCoverage(): {
  valid: boolean;
  totalCounties: number;
  duplicates: string[];
  missing: string[];
} {
  const allFips = new Set<string>();
  const duplicates = new Set<string>();

  // Check for duplicates
  michiganRegions.forEach(region => {
    region.counties.forEach(fips => {
      if (allFips.has(fips)) {
        duplicates.add(fips);
      }
      allFips.add(fips);
    });
  });

  // Expected 83 Michigan county FIPS codes
  const expectedFips = new Set([
    "26001", "26003", "26005", "26007", "26009", "26011", "26013", "26015",
    "26017", "26019", "26021", "26023", "26025", "26027", "26029", "26031",
    "26033", "26035", "26037", "26039", "26041", "26043", "26045", "26047",
    "26049", "26051", "26053", "26055", "26057", "26059", "26061", "26063",
    "26065", "26067", "26069", "26071", "26073", "26075", "26077", "26079",
    "26081", "26083", "26085", "26087", "26089", "26091", "26093", "26095",
    "26097", "26099", "26101", "26103", "26105", "26107", "26109", "26111",
    "26113", "26115", "26117", "26119", "26121", "26123", "26125", "26127",
    "26129", "26131", "26133", "26135", "26137", "26139", "26141", "26143",
    "26145", "26147", "26149", "26151", "26153", "26155", "26157", "26159",
    "26161", "26163", "26165"
  ]);

  const missing: string[] = [];
  expectedFips.forEach(fips => {
    if (!allFips.has(fips)) {
      missing.push(fips);
    }
  });

  return {
    valid: duplicates.size === 0 && missing.length === 0 && allFips.size === 83,
    totalCounties: allFips.size,
    duplicates: Array.from(duplicates),
    missing
  };
}
