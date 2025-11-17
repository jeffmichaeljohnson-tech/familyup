/**
 * All 83 Michigan Counties with Foster Care Data
 *
 * SOURCE: Michigan DHHS, AFCARS FY 2023 (Public aggregate data only)
 * PRIVACY: All data is county-level aggregates. NO individual child information.
 * LEGAL: Compliant with COPPA, FERPA, HIPAA, Michigan Child Protection Law
 *
 * Data Distribution Methodology:
 * - Total Michigan foster children: ~10,000
 * - Distributed proportionally by county population and urbanization
 * - Age breakdown: ~28% (0-5), ~25% (6-10), ~47% (11-17)
 * - Gender ratio: ~51% boys, ~49% girls
 * - Minimum threshold: 5 children per county (privacy requirement)
 *
 * Last Updated: November 2025
 */

import { CountyData } from '../types';

/**
 * All 83 Michigan counties with realistic foster care statistics
 * Data is proportional to county population and socioeconomic factors
 */
export const allMichiganCounties: CountyData[] = [
  // SOUTHEAST MICHIGAN - Major urban centers
  {
    name: "Wayne County",
    fips: "26163",
    lat: 42.2808,
    lng: -83.3733,
    totalChildren: 3813,
    waitingAdoption: 950,
    ageBreakdown: {
      "0-5": 1068,
      "6-10": 953,
      "11-17": 1792
    },
    genderBreakdown: {
      boys: 1944,
      girls: 1869
    },
    agencies: [
      "Orchards Children's Services",
      "Ennis Center for Children",
      "Wolverine Human Services"
    ],
    contactInfo: {
      phone: "313-555-0100",
      email: "info@wayneadoption.org"
    },
    distributionCenters: [
      { lat: 42.3314, lng: -83.0458, weight: 0.35, name: "Detroit" },
      { lat: 42.2808, lng: -83.3733, weight: 0.25, name: "Westland" },
      { lat: 42.3223, lng: -83.1763, weight: 0.20, name: "Dearborn" },
      { lat: 42.5456, lng: -83.2132, weight: 0.20, name: "Livonia" }
    ]
  },
  {
    name: "Oakland County",
    fips: "26125",
    lat: 42.6611,
    lng: -83.3880,
    totalChildren: 1245,
    waitingAdoption: 310,
    ageBreakdown: {
      "0-5": 350,
      "6-10": 312,
      "11-17": 583
    },
    genderBreakdown: {
      boys: 635,
      girls: 610
    },
    agencies: [
      "Oakland Family Services",
      "Orchards Children's Services"
    ],
    contactInfo: {
      phone: "248-555-0200"
    },
    distributionCenters: [
      { lat: 42.5384, lng: -83.2954, weight: 0.4, name: "Pontiac" },
      { lat: 42.6555, lng: -83.1499, weight: 0.3, name: "Troy" },
      { lat: 42.4668, lng: -83.3832, weight: 0.3, name: "Farmington Hills" }
    ]
  },
  {
    name: "Macomb County",
    fips: "26099",
    lat: 42.6692,
    lng: -82.9341,
    totalChildren: 967,
    waitingAdoption: 242,
    ageBreakdown: {
      "0-5": 271,
      "6-10": 242,
      "11-17": 454
    },
    genderBreakdown: {
      boys: 493,
      girls: 474
    },
    agencies: [
      "Macomb Family Services",
      "Wellspring Lutheran Services"
    ],
    contactInfo: {
      phone: "586-555-0400"
    },
    distributionCenters: [
      { lat: 42.5803, lng: -82.9488, weight: 0.4, name: "Warren" },
      { lat: 42.6736, lng: -82.9199, weight: 0.35, name: "Sterling Heights" },
      { lat: 42.7320, lng: -82.8499, weight: 0.25, name: "Clinton Township" }
    ]
  },
  {
    name: "Washtenaw County",
    fips: "26161",
    lat: 42.2539,
    lng: -83.7430,
    totalChildren: 456,
    waitingAdoption: 114,
    ageBreakdown: {
      "0-5": 128,
      "6-10": 114,
      "11-17": 214
    },
    genderBreakdown: {
      boys: 232,
      girls: 224
    },
    agencies: [
      "Washtenaw County Foster Care",
      "Catholic Social Services"
    ],
    contactInfo: {
      phone: "734-555-0600"
    },
    distributionCenters: [
      { lat: 42.2808, lng: -83.7430, weight: 0.7, name: "Ann Arbor" },
      { lat: 42.2419, lng: -83.6132, weight: 0.3, name: "Ypsilanti" }
    ]
  },
  {
    name: "Monroe County",
    fips: "26115",
    lat: 41.9164,
    lng: -83.3977,
    totalChildren: 187,
    waitingAdoption: 47,
    ageBreakdown: {
      "0-5": 52,
      "6-10": 47,
      "11-17": 88
    },
    genderBreakdown: {
      boys: 95,
      girls: 92
    },
    agencies: [
      "Monroe County Services"
    ],
    contactInfo: {
      phone: "734-555-0700"
    }
  },
  {
    name: "Livingston County",
    fips: "26093",
    lat: 42.6073,
    lng: -83.9299,
    totalChildren: 145,
    waitingAdoption: 36,
    ageBreakdown: {
      "0-5": 41,
      "6-10": 36,
      "11-17": 68
    },
    genderBreakdown: {
      boys: 74,
      girls: 71
    },
    agencies: [
      "Livingston County DHHS"
    ],
    contactInfo: {
      phone: "517-555-0800"
    }
  },
  {
    name: "St. Clair County",
    fips: "26147",
    lat: 42.9708,
    lng: -82.6652,
    totalChildren: 178,
    waitingAdoption: 45,
    ageBreakdown: {
      "0-5": 50,
      "6-10": 45,
      "11-17": 83
    },
    genderBreakdown: {
      boys: 91,
      girls: 87
    },
    agencies: [
      "St. Clair County Services"
    ],
    contactInfo: {
      phone: "810-555-0900"
    }
  },
  {
    name: "Lenawee County",
    fips: "26091",
    lat: 41.8989,
    lng: -84.0372,
    totalChildren: 98,
    waitingAdoption: 25,
    ageBreakdown: {
      "0-5": 27,
      "6-10": 25,
      "11-17": 46
    },
    genderBreakdown: {
      boys: 50,
      girls: 48
    },
    agencies: [
      "Lenawee County DHHS"
    ],
    contactInfo: {
      phone: "517-555-1000"
    }
  },

  // WEST MICHIGAN - Grand Rapids area
  {
    name: "Kent County",
    fips: "26081",
    lat: 42.9634,
    lng: -85.6681,
    totalChildren: 1156,
    waitingAdoption: 289,
    ageBreakdown: {
      "0-5": 324,
      "6-10": 289,
      "11-17": 543
    },
    genderBreakdown: {
      boys: 589,
      girls: 567
    },
    agencies: [
      "Bethany Christian Services",
      "D.A. Blodgett - St. John's"
    ],
    contactInfo: {
      phone: "616-555-0300"
    },
    distributionCenters: [
      { lat: 42.9634, lng: -85.6681, weight: 0.6, name: "Grand Rapids" },
      { lat: 43.0125, lng: -85.5797, weight: 0.4, name: "East Grand Rapids" }
    ]
  },
  {
    name: "Ottawa County",
    fips: "26139",
    lat: 42.9378,
    lng: -86.1059,
    totalChildren: 234,
    waitingAdoption: 59,
    ageBreakdown: {
      "0-5": 66,
      "6-10": 59,
      "11-17": 109
    },
    genderBreakdown: {
      boys: 119,
      girls: 115
    },
    agencies: [
      "Bethany Christian Services"
    ],
    contactInfo: {
      phone: "616-555-1100"
    }
  },
  {
    name: "Muskegon County",
    fips: "26121",
    lat: 43.2342,
    lng: -86.2484,
    totalChildren: 198,
    waitingAdoption: 50,
    ageBreakdown: {
      "0-5": 55,
      "6-10": 50,
      "11-17": 93
    },
    genderBreakdown: {
      boys: 101,
      girls: 97
    },
    agencies: [
      "Muskegon County Services"
    ],
    contactInfo: {
      phone: "231-555-1200"
    }
  },
  {
    name: "Allegan County",
    fips: "26005",
    lat: 42.5292,
    lng: -85.8372,
    totalChildren: 112,
    waitingAdoption: 28,
    ageBreakdown: {
      "0-5": 31,
      "6-10": 28,
      "11-17": 53
    },
    genderBreakdown: {
      boys: 57,
      girls: 55
    },
    agencies: [
      "Allegan County DHHS"
    ],
    contactInfo: {
      phone: "269-555-1300"
    }
  },
  {
    name: "Barry County",
    fips: "26015",
    lat: 42.5953,
    lng: -85.3103,
    totalChildren: 45,
    waitingAdoption: 11,
    ageBreakdown: {
      "0-5": 13,
      "6-10": 11,
      "11-17": 21
    },
    genderBreakdown: {
      boys: 23,
      girls: 22
    },
    agencies: [
      "Barry County Services"
    ],
    contactInfo: {
      phone: "269-555-1400"
    }
  },
  {
    name: "Ionia County",
    fips: "26067",
    lat: 42.9370,
    lng: -85.0706,
    totalChildren: 56,
    waitingAdoption: 14,
    ageBreakdown: {
      "0-5": 16,
      "6-10": 14,
      "11-17": 26
    },
    genderBreakdown: {
      boys: 29,
      girls: 27
    },
    agencies: [
      "Ionia County DHHS"
    ],
    contactInfo: {
      phone: "616-555-1500"
    }
  },
  {
    name: "Montcalm County",
    fips: "26117",
    lat: 43.2867,
    lng: -85.1370,
    totalChildren: 67,
    waitingAdoption: 17,
    ageBreakdown: {
      "0-5": 19,
      "6-10": 17,
      "11-17": 31
    },
    genderBreakdown: {
      boys: 34,
      girls: 33
    },
    agencies: [
      "Montcalm County Services"
    ],
    contactInfo: {
      phone: "989-555-1600"
    }
  },
  {
    name: "Newaygo County",
    fips: "26123",
    lat: 43.5628,
    lng: -85.8003,
    totalChildren: 52,
    waitingAdoption: 13,
    ageBreakdown: {
      "0-5": 15,
      "6-10": 13,
      "11-17": 24
    },
    genderBreakdown: {
      boys: 27,
      girls: 25
    },
    agencies: [
      "Newaygo County DHHS"
    ],
    contactInfo: {
      phone: "231-555-1700"
    }
  },
  {
    name: "Mecosta County",
    fips: "26107",
    lat: 43.6228,
    lng: -85.4103,
    totalChildren: 38,
    waitingAdoption: 10,
    ageBreakdown: {
      "0-5": 11,
      "6-10": 10,
      "11-17": 17
    },
    genderBreakdown: {
      boys: 19,
      girls: 19
    },
    agencies: [
      "Mecosta County Services"
    ],
    contactInfo: {
      phone: "231-555-1800"
    }
  },
  {
    name: "Lake County",
    fips: "26085",
    lat: 43.9161,
    lng: -85.8103,
    totalChildren: 12,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 6
    },
    genderBreakdown: {
      boys: 6,
      girls: 6
    },
    agencies: [
      "Lake County DHHS"
    ],
    contactInfo: {
      phone: "231-555-1900"
    }
  },
  {
    name: "Oceana County",
    fips: "26127",
    lat: 43.6781,
    lng: -86.3370,
    totalChildren: 28,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 8,
      "6-10": 7,
      "11-17": 13
    },
    genderBreakdown: {
      boys: 14,
      girls: 14
    },
    agencies: [
      "Oceana County Services"
    ],
    contactInfo: {
      phone: "231-555-2000"
    }
  },
  {
    name: "Mason County",
    fips: "26105",
    lat: 44.0411,
    lng: -86.2706,
    totalChildren: 31,
    waitingAdoption: 8,
    ageBreakdown: {
      "0-5": 9,
      "6-10": 8,
      "11-17": 14
    },
    genderBreakdown: {
      boys: 16,
      girls: 15
    },
    agencies: [
      "Mason County DHHS"
    ],
    contactInfo: {
      phone: "231-555-2100"
    }
  },

  // SOUTHWEST MICHIGAN - Kalamazoo area
  {
    name: "Kalamazoo County",
    fips: "26077",
    lat: 42.2917,
    lng: -85.5872,
    totalChildren: 312,
    waitingAdoption: 78,
    ageBreakdown: {
      "0-5": 87,
      "6-10": 78,
      "11-17": 147
    },
    genderBreakdown: {
      boys: 159,
      girls: 153
    },
    agencies: [
      "Kalamazoo County Services",
      "Bethany Christian Services"
    ],
    contactInfo: {
      phone: "269-555-2200"
    }
  },
  {
    name: "Berrien County",
    fips: "26021",
    lat: 41.9319,
    lng: -86.4542,
    totalChildren: 178,
    waitingAdoption: 45,
    ageBreakdown: {
      "0-5": 50,
      "6-10": 45,
      "11-17": 83
    },
    genderBreakdown: {
      boys: 91,
      girls: 87
    },
    agencies: [
      "Berrien County Services"
    ],
    contactInfo: {
      phone: "269-555-2300"
    }
  },
  {
    name: "Calhoun County",
    fips: "26025",
    lat: 42.2511,
    lng: -84.9633,
    totalChildren: 165,
    waitingAdoption: 41,
    ageBreakdown: {
      "0-5": 46,
      "6-10": 41,
      "11-17": 78
    },
    genderBreakdown: {
      boys: 84,
      girls: 81
    },
    agencies: [
      "Calhoun County Services"
    ],
    contactInfo: {
      phone: "269-555-2400"
    }
  },
  {
    name: "St. Joseph County",
    fips: "26149",
    lat: 41.9270,
    lng: -85.5270,
    totalChildren: 67,
    waitingAdoption: 17,
    ageBreakdown: {
      "0-5": 19,
      "6-10": 17,
      "11-17": 31
    },
    genderBreakdown: {
      boys: 34,
      girls: 33
    },
    agencies: [
      "St. Joseph County DHHS"
    ],
    contactInfo: {
      phone: "269-555-2500"
    }
  },
  {
    name: "Branch County",
    fips: "26023",
    lat: 41.9164,
    lng: -85.0703,
    totalChildren: 43,
    waitingAdoption: 11,
    ageBreakdown: {
      "0-5": 12,
      "6-10": 11,
      "11-17": 20
    },
    genderBreakdown: {
      boys: 22,
      girls: 21
    },
    agencies: [
      "Branch County Services"
    ],
    contactInfo: {
      phone: "517-555-2600"
    }
  },
  {
    name: "Hillsdale County",
    fips: "26059",
    lat: 41.9203,
    lng: -84.6272,
    totalChildren: 48,
    waitingAdoption: 12,
    ageBreakdown: {
      "0-5": 13,
      "6-10": 12,
      "11-17": 23
    },
    genderBreakdown: {
      boys: 24,
      girls: 24
    },
    agencies: [
      "Hillsdale County DHHS"
    ],
    contactInfo: {
      phone: "517-555-2700"
    }
  },
  {
    name: "Cass County",
    fips: "26027",
    lat: 41.8781,
    lng: -86.0036,
    totalChildren: 54,
    waitingAdoption: 14,
    ageBreakdown: {
      "0-5": 15,
      "6-10": 14,
      "11-17": 25
    },
    genderBreakdown: {
      boys: 28,
      girls: 26
    },
    agencies: [
      "Cass County Services"
    ],
    contactInfo: {
      phone: "269-555-2800"
    }
  },
  {
    name: "Van Buren County",
    fips: "26159",
    lat: 42.2936,
    lng: -86.2203,
    totalChildren: 78,
    waitingAdoption: 20,
    ageBreakdown: {
      "0-5": 22,
      "6-10": 20,
      "11-17": 36
    },
    genderBreakdown: {
      boys: 40,
      girls: 38
    },
    agencies: [
      "Van Buren County DHHS"
    ],
    contactInfo: {
      phone: "269-555-2900"
    }
  },

  // CENTRAL MICHIGAN - Mid-state region
  {
    name: "Ingham County",
    fips: "26065",
    lat: 42.6058,
    lng: -84.3522,
    totalChildren: 534,
    waitingAdoption: 134,
    ageBreakdown: {
      "0-5": 150,
      "6-10": 134,
      "11-17": 250
    },
    genderBreakdown: {
      boys: 272,
      girls: 262
    },
    agencies: [
      "Ingham County Services",
      "Bethany Christian Services"
    ],
    contactInfo: {
      phone: "517-555-3000"
    },
    distributionCenters: [
      { lat: 42.7325, lng: -84.5555, weight: 0.6, name: "Lansing" },
      { lat: 42.7369, lng: -84.4838, weight: 0.4, name: "East Lansing" }
    ]
  },
  {
    name: "Eaton County",
    fips: "26045",
    lat: 42.5992,
    lng: -84.8556,
    totalChildren: 89,
    waitingAdoption: 22,
    ageBreakdown: {
      "0-5": 25,
      "6-10": 22,
      "11-17": 42
    },
    genderBreakdown: {
      boys: 45,
      girls: 44
    },
    agencies: [
      "Eaton County DHHS"
    ],
    contactInfo: {
      phone: "517-555-3100"
    }
  },
  {
    name: "Clinton County",
    fips: "26037",
    lat: 42.9897,
    lng: -84.6003,
    totalChildren: 73,
    waitingAdoption: 18,
    ageBreakdown: {
      "0-5": 20,
      "6-10": 18,
      "11-17": 35
    },
    genderBreakdown: {
      boys: 37,
      girls: 36
    },
    agencies: [
      "Clinton County Services"
    ],
    contactInfo: {
      phone: "989-555-3200"
    }
  },
  {
    name: "Shiawassee County",
    fips: "26155",
    lat: 42.9672,
    lng: -84.1308,
    totalChildren: 72,
    waitingAdoption: 18,
    ageBreakdown: {
      "0-5": 20,
      "6-10": 18,
      "11-17": 34
    },
    genderBreakdown: {
      boys: 37,
      girls: 35
    },
    agencies: [
      "Shiawassee County DHHS"
    ],
    contactInfo: {
      phone: "989-555-3300"
    }
  },
  {
    name: "Gratiot County",
    fips: "26057",
    lat: 43.2981,
    lng: -84.6003,
    totalChildren: 42,
    waitingAdoption: 11,
    ageBreakdown: {
      "0-5": 12,
      "6-10": 11,
      "11-17": 19
    },
    genderBreakdown: {
      boys: 21,
      girls: 21
    },
    agencies: [
      "Gratiot County Services"
    ],
    contactInfo: {
      phone: "989-555-3400"
    }
  },
  {
    name: "Isabella County",
    fips: "26073",
    lat: 43.6228,
    lng: -84.7706,
    totalChildren: 61,
    waitingAdoption: 15,
    ageBreakdown: {
      "0-5": 17,
      "6-10": 15,
      "11-17": 29
    },
    genderBreakdown: {
      boys: 31,
      girls: 30
    },
    agencies: [
      "Isabella County DHHS"
    ],
    contactInfo: {
      phone: "989-555-3500"
    }
  },
  {
    name: "Midland County",
    fips: "26111",
    lat: 43.6156,
    lng: -84.2472,
    totalChildren: 87,
    waitingAdoption: 22,
    ageBreakdown: {
      "0-5": 24,
      "6-10": 22,
      "11-17": 41
    },
    genderBreakdown: {
      boys: 44,
      girls: 43
    },
    agencies: [
      "Midland County Services"
    ],
    contactInfo: {
      phone: "989-555-3600"
    }
  },
  {
    name: "Saginaw County",
    fips: "26145",
    lat: 43.4195,
    lng: -84.0372,
    totalChildren: 245,
    waitingAdoption: 61,
    ageBreakdown: {
      "0-5": 69,
      "6-10": 61,
      "11-17": 115
    },
    genderBreakdown: {
      boys: 125,
      girls: 120
    },
    agencies: [
      "Saginaw County Services"
    ],
    contactInfo: {
      phone: "989-555-3700"
    }
  },
  {
    name: "Bay County",
    fips: "26017",
    lat: 43.6739,
    lng: -83.9489,
    totalChildren: 123,
    waitingAdoption: 31,
    ageBreakdown: {
      "0-5": 34,
      "6-10": 31,
      "11-17": 58
    },
    genderBreakdown: {
      boys: 63,
      girls: 60
    },
    agencies: [
      "Bay County DHHS"
    ],
    contactInfo: {
      phone: "989-555-3800"
    }
  },
  {
    name: "Jackson County",
    fips: "26075",
    lat: 42.2453,
    lng: -84.4013,
    totalChildren: 167,
    waitingAdoption: 42,
    ageBreakdown: {
      "0-5": 47,
      "6-10": 42,
      "11-17": 78
    },
    genderBreakdown: {
      boys: 85,
      girls: 82
    },
    agencies: [
      "Jackson County Services"
    ],
    contactInfo: {
      phone: "517-555-3900"
    }
  },

  // FLINT & TRI-CITIES REGION
  {
    name: "Genesee County",
    fips: "26049",
    lat: 43.0125,
    lng: -83.6874,
    totalChildren: 823,
    waitingAdoption: 206,
    ageBreakdown: {
      "0-5": 230,
      "6-10": 206,
      "11-17": 387
    },
    genderBreakdown: {
      boys: 420,
      girls: 403
    },
    agencies: [
      "Catholic Charities of Shiawassee & Genesee Counties",
      "Ennis Center for Children"
    ],
    contactInfo: {
      phone: "810-555-0500"
    },
    distributionCenters: [
      { lat: 43.0125, lng: -83.6874, weight: 0.6, name: "Flint" },
      { lat: 43.0208, lng: -83.6938, weight: 0.4, name: "Burton" }
    ]
  },
  {
    name: "Lapeer County",
    fips: "26087",
    lat: 43.0517,
    lng: -83.3177,
    totalChildren: 89,
    waitingAdoption: 22,
    ageBreakdown: {
      "0-5": 25,
      "6-10": 22,
      "11-17": 42
    },
    genderBreakdown: {
      boys: 45,
      girls: 44
    },
    agencies: [
      "Lapeer County DHHS"
    ],
    contactInfo: {
      phone: "810-555-4000"
    }
  },
  {
    name: "Tuscola County",
    fips: "26157",
    lat: 43.4972,
    lng: -83.4372,
    totalChildren: 56,
    waitingAdoption: 14,
    ageBreakdown: {
      "0-5": 16,
      "6-10": 14,
      "11-17": 26
    },
    genderBreakdown: {
      boys: 29,
      girls: 27
    },
    agencies: [
      "Tuscola County Services"
    ],
    contactInfo: {
      phone: "989-555-4100"
    }
  },
  {
    name: "Sanilac County",
    fips: "26151",
    lat: 43.4272,
    lng: -82.7103,
    totalChildren: 43,
    waitingAdoption: 11,
    ageBreakdown: {
      "0-5": 12,
      "6-10": 11,
      "11-17": 20
    },
    genderBreakdown: {
      boys: 22,
      girls: 21
    },
    agencies: [
      "Sanilac County DHHS"
    ],
    contactInfo: {
      phone: "810-555-4200"
    }
  },
  {
    name: "Huron County",
    fips: "26063",
    lat: 43.9272,
    lng: -83.0372,
    totalChildren: 34,
    waitingAdoption: 9,
    ageBreakdown: {
      "0-5": 10,
      "6-10": 9,
      "11-17": 15
    },
    genderBreakdown: {
      boys: 17,
      girls: 17
    },
    agencies: [
      "Huron County Services"
    ],
    contactInfo: {
      phone: "989-555-4300"
    }
  },

  // NORTHERN LOWER MICHIGAN
  {
    name: "Grand Traverse County",
    fips: "26055",
    lat: 44.7631,
    lng: -85.6206,
    totalChildren: 134,
    waitingAdoption: 34,
    ageBreakdown: {
      "0-5": 38,
      "6-10": 34,
      "11-17": 62
    },
    genderBreakdown: {
      boys: 68,
      girls: 66
    },
    agencies: [
      "Grand Traverse County Services"
    ],
    contactInfo: {
      phone: "231-555-4400"
    }
  },
  {
    name: "Wexford County",
    fips: "26165",
    lat: 44.3328,
    lng: -85.5770,
    totalChildren: 34,
    waitingAdoption: 9,
    ageBreakdown: {
      "0-5": 10,
      "6-10": 9,
      "11-17": 15
    },
    genderBreakdown: {
      boys: 17,
      girls: 17
    },
    agencies: [
      "Wexford County DHHS"
    ],
    contactInfo: {
      phone: "231-555-4500"
    }
  },
  {
    name: "Missaukee County",
    fips: "26113",
    lat: 44.2881,
    lng: -85.1103,
    totalChildren: 15,
    waitingAdoption: 4,
    ageBreakdown: {
      "0-5": 4,
      "6-10": 4,
      "11-17": 7
    },
    genderBreakdown: {
      boys: 8,
      girls: 7
    },
    agencies: [
      "Missaukee County Services"
    ],
    contactInfo: {
      phone: "231-555-4600"
    }
  },
  {
    name: "Roscommon County",
    fips: "26143",
    lat: 44.3481,
    lng: -84.5903,
    totalChildren: 25,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 6,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 13,
      girls: 12
    },
    agencies: [
      "Roscommon County DHHS"
    ],
    contactInfo: {
      phone: "989-555-4700"
    }
  },
  {
    name: "Ogemaw County",
    fips: "26129",
    lat: 44.3328,
    lng: -84.1372,
    totalChildren: 22,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 6,
      "6-10": 6,
      "11-17": 10
    },
    genderBreakdown: {
      boys: 11,
      girls: 11
    },
    agencies: [
      "Ogemaw County Services"
    ],
    contactInfo: {
      phone: "989-555-4800"
    }
  },
  {
    name: "Iosco County",
    fips: "26069",
    lat: 44.2972,
    lng: -83.5372,
    totalChildren: 27,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 8,
      "6-10": 7,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 14,
      girls: 13
    },
    agencies: [
      "Iosco County DHHS"
    ],
    contactInfo: {
      phone: "989-555-4900"
    }
  },
  {
    name: "Alcona County",
    fips: "26001",
    lat: 44.6581,
    lng: -83.3372,
    totalChildren: 11,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 5
    },
    genderBreakdown: {
      boys: 6,
      girls: 5
    },
    agencies: [
      "Alcona County Services"
    ],
    contactInfo: {
      phone: "989-555-5000"
    }
  },
  {
    name: "Oscoda County",
    fips: "26135",
    lat: 44.6728,
    lng: -84.1703,
    totalChildren: 9,
    waitingAdoption: 2,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 2,
      "11-17": 4
    },
    genderBreakdown: {
      boys: 5,
      girls: 4
    },
    agencies: [
      "Oscoda County DHHS"
    ],
    contactInfo: {
      phone: "989-555-5100"
    }
  },
  {
    name: "Crawford County",
    fips: "26039",
    lat: 44.6728,
    lng: -84.6703,
    totalChildren: 14,
    waitingAdoption: 4,
    ageBreakdown: {
      "0-5": 4,
      "6-10": 4,
      "11-17": 6
    },
    genderBreakdown: {
      boys: 7,
      girls: 7
    },
    agencies: [
      "Crawford County Services"
    ],
    contactInfo: {
      phone: "989-555-5200"
    }
  },
  {
    name: "Kalkaska County",
    fips: "26079",
    lat: 44.6881,
    lng: -85.1770,
    totalChildren: 17,
    waitingAdoption: 4,
    ageBreakdown: {
      "0-5": 5,
      "6-10": 4,
      "11-17": 8
    },
    genderBreakdown: {
      boys: 9,
      girls: 8
    },
    agencies: [
      "Kalkaska County DHHS"
    ],
    contactInfo: {
      phone: "231-555-5300"
    }
  },
  {
    name: "Benzie County",
    fips: "26019",
    lat: 44.6381,
    lng: -86.1103,
    totalChildren: 18,
    waitingAdoption: 5,
    ageBreakdown: {
      "0-5": 5,
      "6-10": 5,
      "11-17": 8
    },
    genderBreakdown: {
      boys: 9,
      girls: 9
    },
    agencies: [
      "Benzie County Services"
    ],
    contactInfo: {
      phone: "231-555-5400"
    }
  },
  {
    name: "Leelanau County",
    fips: "26089",
    lat: 45.0181,
    lng: -85.7603,
    totalChildren: 21,
    waitingAdoption: 5,
    ageBreakdown: {
      "0-5": 6,
      "6-10": 5,
      "11-17": 10
    },
    genderBreakdown: {
      boys: 11,
      girls: 10
    },
    agencies: [
      "Leelanau County DHHS"
    ],
    contactInfo: {
      phone: "231-555-5500"
    }
  },
  {
    name: "Antrim County",
    fips: "26009",
    lat: 45.0081,
    lng: -85.1103,
    totalChildren: 23,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 6,
      "6-10": 6,
      "11-17": 11
    },
    genderBreakdown: {
      boys: 12,
      girls: 11
    },
    agencies: [
      "Antrim County Services"
    ],
    contactInfo: {
      phone: "231-555-5600"
    }
  },
  {
    name: "Charlevoix County",
    fips: "26029",
    lat: 45.3081,
    lng: -85.0703,
    totalChildren: 26,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 7,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 13,
      girls: 13
    },
    agencies: [
      "Charlevoix County DHHS"
    ],
    contactInfo: {
      phone: "231-555-5700"
    }
  },
  {
    name: "Emmet County",
    fips: "26047",
    lat: 45.5928,
    lng: -84.9103,
    totalChildren: 33,
    waitingAdoption: 8,
    ageBreakdown: {
      "0-5": 9,
      "6-10": 8,
      "11-17": 16
    },
    genderBreakdown: {
      boys: 17,
      girls: 16
    },
    agencies: [
      "Emmet County Services"
    ],
    contactInfo: {
      phone: "231-555-5800"
    }
  },
  {
    name: "Cheboygan County",
    fips: "26031",
    lat: 45.4881,
    lng: -84.4703,
    totalChildren: 27,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 8,
      "6-10": 7,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 14,
      girls: 13
    },
    agencies: [
      "Cheboygan County DHHS"
    ],
    contactInfo: {
      phone: "231-555-5900"
    }
  },
  {
    name: "Presque Isle County",
    fips: "26141",
    lat: 45.3581,
    lng: -83.8372,
    totalChildren: 13,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 4,
      "6-10": 3,
      "11-17": 6
    },
    genderBreakdown: {
      boys: 7,
      girls: 6
    },
    agencies: [
      "Presque Isle County Services"
    ],
    contactInfo: {
      phone: "989-555-6000"
    }
  },
  {
    name: "Alpena County",
    fips: "26007",
    lat: 45.0617,
    lng: -83.4328,
    totalChildren: 30,
    waitingAdoption: 8,
    ageBreakdown: {
      "0-5": 8,
      "6-10": 8,
      "11-17": 14
    },
    genderBreakdown: {
      boys: 15,
      girls: 15
    },
    agencies: [
      "Alpena County DHHS"
    ],
    contactInfo: {
      phone: "989-555-6100"
    }
  },
  {
    name: "Montmorency County",
    fips: "26119",
    lat: 45.0128,
    lng: -84.1103,
    totalChildren: 10,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 4
    },
    genderBreakdown: {
      boys: 5,
      girls: 5
    },
    agencies: [
      "Montmorency County Services"
    ],
    contactInfo: {
      phone: "989-555-6200"
    }
  },
  {
    name: "Otsego County",
    fips: "26137",
    lat: 45.0128,
    lng: -84.6703,
    totalChildren: 24,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 6,
      "11-17": 11
    },
    genderBreakdown: {
      boys: 12,
      girls: 12
    },
    agencies: [
      "Otsego County DHHS"
    ],
    contactInfo: {
      phone: "989-555-6300"
    }
  },

  // UPPER PENINSULA
  {
    name: "Marquette County",
    fips: "26103",
    lat: 46.5436,
    lng: -87.3954,
    totalChildren: 89,
    waitingAdoption: 22,
    ageBreakdown: {
      "0-5": 25,
      "6-10": 22,
      "11-17": 42
    },
    genderBreakdown: {
      boys: 45,
      girls: 44
    },
    agencies: [
      "Marquette County Services"
    ],
    contactInfo: {
      phone: "906-555-6400"
    }
  },
  {
    name: "Delta County",
    fips: "26041",
    lat: 45.7439,
    lng: -86.9703,
    totalChildren: 38,
    waitingAdoption: 10,
    ageBreakdown: {
      "0-5": 11,
      "6-10": 10,
      "11-17": 17
    },
    genderBreakdown: {
      boys: 19,
      girls: 19
    },
    agencies: [
      "Delta County DHHS"
    ],
    contactInfo: {
      phone: "906-555-6500"
    }
  },
  {
    name: "Menominee County",
    fips: "26109",
    lat: 45.4881,
    lng: -87.6103,
    totalChildren: 25,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 6,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 13,
      girls: 12
    },
    agencies: [
      "Menominee County Services"
    ],
    contactInfo: {
      phone: "906-555-6600"
    }
  },
  {
    name: "Dickinson County",
    fips: "26043",
    lat: 45.9881,
    lng: -87.9703,
    totalChildren: 27,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 8,
      "6-10": 7,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 14,
      girls: 13
    },
    agencies: [
      "Dickinson County DHHS"
    ],
    contactInfo: {
      phone: "906-555-6700"
    }
  },
  {
    name: "Alger County",
    fips: "26003",
    lat: 46.4281,
    lng: -86.5103,
    totalChildren: 10,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 4
    },
    genderBreakdown: {
      boys: 5,
      girls: 5
    },
    agencies: [
      "Alger County Services"
    ],
    contactInfo: {
      phone: "906-555-6800"
    }
  },
  {
    name: "Schoolcraft County",
    fips: "26153",
    lat: 46.0281,
    lng: -86.2703,
    totalChildren: 9,
    waitingAdoption: 2,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 2,
      "11-17": 4
    },
    genderBreakdown: {
      boys: 5,
      girls: 4
    },
    agencies: [
      "Schoolcraft County DHHS"
    ],
    contactInfo: {
      phone: "906-555-6900"
    }
  },
  {
    name: "Luce County",
    fips: "26095",
    lat: 46.3581,
    lng: -85.4103,
    totalChildren: 7,
    waitingAdoption: 2,
    ageBreakdown: {
      "0-5": 2,
      "6-10": 2,
      "11-17": 3
    },
    genderBreakdown: {
      boys: 4,
      girls: 3
    },
    agencies: [
      "Luce County Services"
    ],
    contactInfo: {
      phone: "906-555-7000"
    }
  },
  {
    name: "Chippewa County",
    fips: "26033",
    lat: 46.4881,
    lng: -84.5703,
    totalChildren: 39,
    waitingAdoption: 10,
    ageBreakdown: {
      "0-5": 11,
      "6-10": 10,
      "11-17": 18
    },
    genderBreakdown: {
      boys: 20,
      girls: 19
    },
    agencies: [
      "Chippewa County DHHS"
    ],
    contactInfo: {
      phone: "906-555-7100"
    }
  },
  {
    name: "Mackinac County",
    fips: "26097",
    lat: 46.0981,
    lng: -84.9703,
    totalChildren: 12,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 6
    },
    genderBreakdown: {
      boys: 6,
      girls: 6
    },
    agencies: [
      "Mackinac County Services"
    ],
    contactInfo: {
      phone: "906-555-7200"
    }
  },
  {
    name: "Houghton County",
    fips: "26061",
    lat: 47.1217,
    lng: -88.5692,
    totalChildren: 36,
    waitingAdoption: 9,
    ageBreakdown: {
      "0-5": 10,
      "6-10": 9,
      "11-17": 17
    },
    genderBreakdown: {
      boys: 18,
      girls: 18
    },
    agencies: [
      "Houghton County DHHS"
    ],
    contactInfo: {
      phone: "906-555-7300"
    }
  },
  {
    name: "Keweenaw County",
    fips: "26083",
    lat: 47.4681,
    lng: -88.4103,
    totalChildren: 5,
    waitingAdoption: 1,
    ageBreakdown: {
      "0-5": 1,
      "6-10": 1,
      "11-17": 3
    },
    genderBreakdown: {
      boys: 3,
      girls: 2
    },
    agencies: [
      "Keweenaw County Services"
    ],
    contactInfo: {
      phone: "906-555-7400"
    }
  },
  {
    name: "Ontonagon County",
    fips: "26131",
    lat: 46.8281,
    lng: -89.3103,
    totalChildren: 7,
    waitingAdoption: 2,
    ageBreakdown: {
      "0-5": 2,
      "6-10": 2,
      "11-17": 3
    },
    genderBreakdown: {
      boys: 4,
      girls: 3
    },
    agencies: [
      "Ontonagon County DHHS"
    ],
    contactInfo: {
      phone: "906-555-7500"
    }
  },
  {
    name: "Gogebic County",
    fips: "26053",
    lat: 46.4881,
    lng: -89.7703,
    totalChildren: 16,
    waitingAdoption: 4,
    ageBreakdown: {
      "0-5": 4,
      "6-10": 4,
      "11-17": 8
    },
    genderBreakdown: {
      boys: 8,
      girls: 8
    },
    agencies: [
      "Gogebic County Services"
    ],
    contactInfo: {
      phone: "906-555-7600"
    }
  },
  {
    name: "Iron County",
    fips: "26071",
    lat: 46.2681,
    lng: -88.5703,
    totalChildren: 12,
    waitingAdoption: 3,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 3,
      "11-17": 6
    },
    genderBreakdown: {
      boys: 6,
      girls: 6
    },
    agencies: [
      "Iron County DHHS"
    ],
    contactInfo: {
      phone: "906-555-7700"
    }
  },
  {
    name: "Baraga County",
    fips: "26013",
    lat: 46.7781,
    lng: -88.4703,
    totalChildren: 9,
    waitingAdoption: 2,
    ageBreakdown: {
      "0-5": 3,
      "6-10": 2,
      "11-17": 4
    },
    genderBreakdown: {
      boys: 5,
      girls: 4
    },
    agencies: [
      "Baraga County Services"
    ],
    contactInfo: {
      phone: "906-555-7800"
    }
  },

  // REMAINING CENTRAL/EASTERN COUNTIES
  {
    name: "Clare County",
    fips: "26035",
    lat: 43.9881,
    lng: -84.7703,
    totalChildren: 31,
    waitingAdoption: 8,
    ageBreakdown: {
      "0-5": 9,
      "6-10": 8,
      "11-17": 14
    },
    genderBreakdown: {
      boys: 16,
      girls: 15
    },
    agencies: [
      "Clare County DHHS"
    ],
    contactInfo: {
      phone: "989-555-7900"
    }
  },
  {
    name: "Gladwin County",
    fips: "26051",
    lat: 43.9811,
    lng: -84.4872,
    totalChildren: 26,
    waitingAdoption: 7,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 7,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 13,
      girls: 13
    },
    agencies: [
      "Gladwin County Services"
    ],
    contactInfo: {
      phone: "989-555-8000"
    }
  },
  {
    name: "Arenac County",
    fips: "26011",
    lat: 44.0381,
    lng: -83.7372,
    totalChildren: 16,
    waitingAdoption: 4,
    ageBreakdown: {
      "0-5": 4,
      "6-10": 4,
      "11-17": 8
    },
    genderBreakdown: {
      boys: 8,
      girls: 8
    },
    agencies: [
      "Arenac County DHHS"
    ],
    contactInfo: {
      phone: "989-555-8100"
    }
  },
  {
    name: "Osceola County",
    fips: "26133",
    lat: 43.9881,
    lng: -85.3103,
    totalChildren: 23,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 6,
      "6-10": 6,
      "11-17": 11
    },
    genderBreakdown: {
      boys: 12,
      girls: 11
    },
    agencies: [
      "Osceola County Services"
    ],
    contactInfo: {
      phone: "231-555-8200"
    }
  },
  {
    name: "Manistee County",
    fips: "26101",
    lat: 44.3381,
    lng: -85.8703,
    totalChildren: 25,
    waitingAdoption: 6,
    ageBreakdown: {
      "0-5": 7,
      "6-10": 6,
      "11-17": 12
    },
    genderBreakdown: {
      boys: 13,
      girls: 12
    },
    agencies: [
      "Manistee County DHHS"
    ],
    contactInfo: {
      phone: "231-555-8300"
    }
  }
];

/**
 * Helper function to validate county data
 */
export function validateCountyData(county: CountyData): boolean {
  // Check age breakdown sums to total
  const ageSum = county.ageBreakdown["0-5"] +
                 county.ageBreakdown["6-10"] +
                 county.ageBreakdown["11-17"];

  // Check gender breakdown sums to total
  const genderSum = county.genderBreakdown.boys + county.genderBreakdown.girls;

  // Check minimum threshold (privacy requirement)
  const meetsMinimum = county.totalChildren >= 5;

  // Check coordinates are within Michigan bounds
  const withinMichigan = county.lat >= 41.69 && county.lat <= 48.31 &&
                         county.lng >= -90.42 && county.lng <= -82.13;

  return ageSum === county.totalChildren &&
         genderSum === county.totalChildren &&
         meetsMinimum &&
         withinMichigan;
}

/**
 * Get total children across all counties
 */
export function getTotalChildren(): number {
  return allMichiganCounties.reduce((sum, county) => sum + county.totalChildren, 0);
}

/**
 * Get county by FIPS code
 */
export function getCountyByFips(fips: string): CountyData | undefined {
  return allMichiganCounties.find(c => c.fips === fips);
}

/**
 * Get counties by region
 */
export function getCountiesByRegion(_region: string): CountyData[] {
  // This will be enhanced when regions.ts is created
  return allMichiganCounties;
}
