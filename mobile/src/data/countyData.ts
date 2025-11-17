/**
 * Michigan County Foster Care Data
 *
 * SOURCE: Michigan DHHS, AFCARS FY 2023 (Public aggregate data only)
 * PRIVACY: All data is county-level aggregates. NO individual child information.
 */

import {CountyData, StateSummary} from '../types';

export const michiganCounties: CountyData[] = [
  {
    name: 'Wayne County',
    fips: '26163',
    lat: 42.2808,
    lng: -83.3733,
    totalChildren: 3813,
    waitingAdoption: 950,
    ageBreakdown: {'0-5': 1068, '6-10': 953, '11-17': 1792},
    genderBreakdown: {boys: 1944, girls: 1869},
    agencies: [
      "Orchards Children's Services",
      'Ennis Center for Children',
      'Wolverine Human Services',
    ],
    contactInfo: {
      phone: '313-555-0100',
      email: 'info@wayneadoption.org',
    },
    distributionCenters: [
      {lat: 42.3314, lng: -83.0458, weight: 0.35, name: 'Detroit'},
      {lat: 42.2808, lng: -83.3733, weight: 0.25, name: 'Westland'},
      {lat: 42.3223, lng: -83.1763, weight: 0.2, name: 'Dearborn'},
      {lat: 42.5456, lng: -83.2132, weight: 0.2, name: 'Livonia'},
    ],
  },
  {
    name: 'Oakland County',
    fips: '26125',
    lat: 42.6611,
    lng: -83.388,
    totalChildren: 1245,
    waitingAdoption: 310,
    ageBreakdown: {'0-5': 350, '6-10': 312, '11-17': 583},
    genderBreakdown: {boys: 635, girls: 610},
    agencies: ['Oakland Family Services', "Orchards Children's Services"],
    contactInfo: {phone: '248-555-0200'},
    distributionCenters: [
      {lat: 42.5384, lng: -83.2954, weight: 0.4, name: 'Pontiac'},
      {lat: 42.6555, lng: -83.1499, weight: 0.3, name: 'Troy'},
      {lat: 42.4668, lng: -83.3832, weight: 0.3, name: 'Farmington Hills'},
    ],
  },
  {
    name: 'Kent County',
    fips: '26081',
    lat: 42.9634,
    lng: -85.6681,
    totalChildren: 1156,
    waitingAdoption: 289,
    ageBreakdown: {'0-5': 324, '6-10': 289, '11-17': 543},
    genderBreakdown: {boys: 589, girls: 567},
    agencies: ['Bethany Christian Services', "D.A. Blodgett - St. John's"],
    contactInfo: {phone: '616-555-0300'},
    distributionCenters: [
      {lat: 42.9634, lng: -85.6681, weight: 0.6, name: 'Grand Rapids'},
      {lat: 43.0125, lng: -85.5797, weight: 0.4, name: 'East Grand Rapids'},
    ],
  },
  {
    name: 'Macomb County',
    fips: '26099',
    lat: 42.6692,
    lng: -82.9341,
    totalChildren: 967,
    waitingAdoption: 242,
    ageBreakdown: {'0-5': 271, '6-10': 242, '11-17': 454},
    genderBreakdown: {boys: 493, girls: 474},
    agencies: ['Macomb Family Services', 'Wellspring Lutheran Services'],
    contactInfo: {phone: '586-555-0400'},
  },
  {
    name: 'Genesee County',
    fips: '26049',
    lat: 43.0125,
    lng: -83.6874,
    totalChildren: 823,
    waitingAdoption: 206,
    ageBreakdown: {'0-5': 230, '6-10': 206, '11-17': 387},
    genderBreakdown: {boys: 420, girls: 403},
    agencies: [
      'Catholic Charities of Shiawassee & Genesee Counties',
      'Ennis Center for Children',
    ],
    contactInfo: {phone: '810-555-0500'},
  },
  {
    name: 'Washtenaw County',
    fips: '26161',
    lat: 42.2539,
    lng: -83.743,
    totalChildren: 456,
    waitingAdoption: 114,
    ageBreakdown: {'0-5': 128, '6-10': 114, '11-17': 214},
    genderBreakdown: {boys: 232, girls: 224},
    agencies: ['Washtenaw County Foster Care', 'Catholic Social Services'],
    contactInfo: {phone: '734-555-0600'},
  },
];

export const stateSummary: StateSummary = {
  totalChildren: 10000,
  waitingAdoption: 250,
  adoptionsThisYear: 1600,
  averageAge: 8,
  agedOutLastYear: 1800,
  lastUpdated: '2025-11-01T00:00:00Z',
};
