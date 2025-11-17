# Technical Specifications - FamilyUp Platform

## Multi-Platform Architecture Overview

### System Architecture - Web + iOS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WEB PLATFORM (Browser)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐              │
│  │    React     │  │  Advanced 3D     │  │   Tailwind   │              │
│  │  Components  │  │  Graphics Engine │  │     CSS      │              │
│  │ (TypeScript) │  │  (WebGL/Three.js)│  │              │              │
│  └──────────────┘  └──────────────────┘  └──────────────┘              │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │       Cutting-Edge Visualization (Snapchat+ Quality)    │            │
│  │  • WebGL Shaders  • Particle Effects  • 60fps Rendering │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │            State Management (React Hooks)                │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │     Privacy-First Data Layer (Aggregate Only, No PII)   │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         iOS PLATFORM (Native)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  React Native    │  │  Native Swift    │  │  Metal Graphics  │      │
│  │  + TypeScript    │  │    Modules       │  │     Engine       │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │        High-Performance 3D Rendering (Metal API)        │            │
│  │  • Custom GL Renderer  • Core Animation  • 60fps Target │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │      Privacy Controls (No Location Tracking, No PII)    │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SHARED DATA BACKEND                                   │
│              (Aggregate County Data - No Personal Information)           │
│                         CDN / API (Vercel)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Mapbox GL / Custom Tile Server (3D Map Data)                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Loads Page
    │
    ├─> HTML/CSS/JS Bundle Loads
    │
    ├─> React App Initializes
    │
    ├─> County Data Parsed (Static JSON)
    │
    ├─> Map Component Mounts
    │       │
    │       ├─> Leaflet Initializes
    │       ├─> Map Tiles Load (OpenStreetMap)
    │       └─> County Markers Render
    │
    ├─> Distribution Algorithm Executes
    │       │
    │       ├─> Calculate Child Positions
    │       ├─> Validate Boundaries
    │       └─> Place Icons on Map
    │
    └─> User Interactions
            │
            ├─> Click County → Show Popup
            ├─> Filter by Age → Re-render Markers  
            ├─> Zoom/Pan → Update View
            └─> Click MARE Link → Initiate Call/Visit
```

---

## Technology Stack Details

### Web Platform Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "typescript": "^5.3.0",

    // Advanced Graphics & Mapping
    "mapbox-gl": "^3.0.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.95.0",
    "react-map-gl": "^7.1.0",
    "deck.gl": "^8.9.0",

    // Animation & Effects
    "framer-motion": "^10.16.0",
    "gsap": "^3.12.0",
    "lottie-react": "^2.4.0",

    // Performance & Optimization
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.160.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### iOS Platform Dependencies

```json
{
  "dependencies": {
    "react-native": "^0.73.0",
    "react-native-maps": "^1.10.0",
    "@react-native-mapbox-gl/maps": "^10.0.0",

    // Native Modules
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-svg": "^14.0.0",

    // Graphics & Animation
    "lottie-react-native": "^6.4.0",

    // State Management
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "metro-react-native-babel-preset": "^0.77.0"
  }
}
```

### Why These Choices?

**React 18+ (Web) / React Native (iOS)**
- Modern hooks API (no class components)
- Excellent performance with concurrent features
- Strong TypeScript support
- Huge ecosystem and community
- Code sharing between platforms

**Mapbox GL JS / Three.js (Web) + Metal API (iOS)**
- Cutting-edge 3D graphics capabilities
- WebGL/Metal acceleration for smooth 60fps
- Custom shader support for dramatic effects
- Professional-grade map rendering
- Snapchat+ quality achievable

**TypeScript**
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring
- Cross-platform type sharing

**Tailwind CSS / React Native Styling**
- Rapid development
- Consistent design system
- Small production bundles
- Responsive utilities built-in

---

## Cutting-Edge Graphics Specification

### Visual Quality Standards (Snapchat+ Quality)

**Target Benchmarks:**
- **Frame Rate**: Consistent 60fps on all supported devices
- **Render Quality**: 1080p+ on web, Retina quality on iOS
- **Animation Smoothness**: Imperceptible frame drops
- **Visual Effects**: Professional-grade particle systems, lighting, and transitions
- **Emotional Impact**: Graphics designed to dramatize the scale of children in need

### Web Platform Graphics Engine

**3D Rendering Stack:**
```typescript
// WebGL-accelerated rendering with Three.js
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Mapbox } from 'react-map-gl';

const GraphicsConfig = {
  // Renderer settings for maximum quality
  renderer: {
    antialias: true,
    powerPreference: 'high-performance',
    precision: 'highp',
    alpha: true,
  },

  // Post-processing effects
  effects: {
    bloom: true,
    depthOfField: true,
    ambientOcclusion: true,
    colorGrading: true,
  },

  // Performance targets
  performance: {
    targetFPS: 60,
    adaptiveQuality: true,
    throttle: false,
  }
};
```

**Visual Effects System:**
```typescript
// Particle effects for dramatic visualization
interface ParticleEffects {
  // Rising particles to show scale
  risingParticles: {
    count: number;  // One per child in county
    speed: number;  // Slow rise for dramatic effect
    opacity: number; // Fades as it rises
    color: string;  // Gender-based color
  };

  // Glow effects for emphasis
  glowEffects: {
    intensity: number; // Higher for counties with more children
    pulsate: boolean;  // Gentle pulse animation
    radius: number;    // Scales with population
  };

  // Heat map overlay
  heatMapOverlay: {
    gradient: string[]; // Color scale from low to high
    blur: number;       // Smooth transitions
    opacity: number;    // Subtle overlay
  };
}
```

**Custom Shaders for Impact:**
```glsl
// GLSL Vertex Shader for child icon particles
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vPosition = position;
  vUv = uv;

  // Dramatic vertical movement
  vec3 newPosition = position;
  newPosition.y += sin(time * 0.5) * 2.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

// Fragment Shader for emotional glow effect
varying vec3 vPosition;
varying vec2 vUv;
uniform vec3 color;
uniform float intensity;

void main() {
  // Radial gradient glow
  float dist = distance(vUv, vec2(0.5, 0.5));
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);

  vec3 finalColor = color * glow * intensity;
  float alpha = glow * 0.8;

  gl_FragColor = vec4(finalColor, alpha);
}
```

### iOS Platform Graphics Engine

**Metal API Implementation:**
```swift
// Metal shader for high-performance iOS rendering
import Metal
import MetalKit

class MapRenderer {
    var device: MTLDevice
    var commandQueue: MTLCommandQueue
    var pipelineState: MTLRenderPipelineState

    // Configure for maximum quality
    func setupRenderer() {
        // Enable all Metal features
        device = MTLCreateSystemDefaultDevice()!

        // High-performance command queue
        commandQueue = device.makeCommandQueue()!

        // Render pipeline with anti-aliasing
        let pipelineDescriptor = MTLRenderPipelineDescriptor()
        pipelineDescriptor.sampleCount = 4  // 4x MSAA
        pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm_srgb

        // Performance optimizations
        pipelineDescriptor.isRasterizationEnabled = true
        pipelineDescriptor.rasterSampleCount = 4
    }

    // 60fps rendering loop
    func render(deltaTime: Double) {
        guard let commandBuffer = commandQueue.makeCommandBuffer() else { return }

        // Render dramatic visualization
        renderParticleEffects(commandBuffer)
        renderMapOverlay(commandBuffer)
        renderChildIcons(commandBuffer)

        commandBuffer.present(drawable)
        commandBuffer.commit()
    }
}
```

**Core Animation for Smooth Transitions:**
```swift
// Smooth, dramatic animations
import UIKit

extension MapViewController {
    func animateCountySelection(_ county: County) {
        // Smooth zoom animation
        let zoom = CABasicAnimation(keyPath: "transform.scale")
        zoom.fromValue = 1.0
        zoom.toValue = 1.5
        zoom.duration = 0.6
        zoom.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)

        // Glow effect
        let glow = CABasicAnimation(keyPath: "shadowOpacity")
        glow.fromValue = 0.0
        glow.toValue = 0.8
        glow.duration = 0.4

        // Apply animations
        countyLayer.add(zoom, forKey: "zoom")
        countyLayer.add(glow, forKey: "glow")
    }
}
```

### Dramatic Visualization Features

**Emotional Impact Through Graphics:**

1. **Rising Particle Effect**
   - Each child represented by a glowing particle
   - Particles slowly rise from county center
   - Creates sense of hope and movement
   - Color-coded by gender

2. **Heat Map Intensity**
   - Counties with more children glow brighter
   - Dramatic color gradient (cool to warm)
   - Pulsating effect draws attention
   - Shows geographic distribution at a glance

3. **3D Terrain Visualization**
   - Counties elevated based on child population
   - Creates dramatic "landscape of need"
   - Camera angles emphasize scale
   - Smooth camera movements for cinematic feel

4. **Interactive Animations**
   - Touch/click triggers smooth zoom
   - Icon clusters expand on interaction
   - Statistics appear with elegant transitions
   - Micro-interactions provide feedback

### Performance Optimization

**60fps Guaranteed:**
```typescript
// Performance monitoring and adaptive quality
class GraphicsPerformanceManager {
  private targetFPS = 60;
  private currentFPS = 60;
  private qualityLevel: 'ultra' | 'high' | 'medium' = 'ultra';

  monitorPerformance() {
    // Track FPS
    this.currentFPS = this.measureFPS();

    // Adjust quality dynamically
    if (this.currentFPS < 55) {
      this.downgradeQuality();
    } else if (this.currentFPS > 60 && this.qualityLevel !== 'ultra') {
      this.upgradeQuality();
    }
  }

  private downgradeQuality() {
    // Reduce particle count
    // Disable some post-processing
    // Simplify shadows
    console.log('Adjusting quality for performance');
  }
}
```

---

## TypeScript Type System

### Core Type Definitions

```typescript
// src/types/index.ts

/**
 * Represents a Michigan county with foster care data
 */
export interface CountyData {
  /** County name (e.g., "Wayne County") */
  name: string;
  
  /** FIPS code (5-digit federal code) */
  fips: string;
  
  /** Geographic center latitude */
  lat: number;
  
  /** Geographic center longitude */
  lng: number;
  
  /** Total children currently in foster care */
  totalChildren: number;
  
  /** Children waiting for adoption (subset of totalChildren) */
  waitingAdoption: number;
  
  /** Breakdown by age groups */
  ageBreakdown: {
    "0-5": number;    // Infants and young children
    "6-10": number;   // School age
    "11-17": number;  // Pre-teens and teenagers
  };
  
  /** Gender distribution (should sum to totalChildren) */
  genderBreakdown: {
    boys: number;
    girls: number;
  };
  
  /** Local adoption agencies serving this county */
  agencies: string[];
  
  /** Contact information for inquiries */
  contactInfo: {
    phone: string;
    email?: string;
    website?: string;
  };
  
  /** Optional: Distribution centers for multi-center counties */
  distributionCenters?: DistributionCenter[];
}

/**
 * Distribution center for placing child icons
 * Large counties (Detroit, Grand Rapids) have multiple centers
 */
export interface DistributionCenter {
  /** Center point latitude */
  lat: number;
  
  /** Center point longitude */
  lng: number;
  
  /** Weight factor (0-1) for how many children in this area */
  weight: number;
  
  /** Optional name/description */
  name?: string;
}

/**
 * Geographic point (lat/lng coordinate)
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * User-selected filters for the map
 */
export interface MapFilters {
  /** Age group filter */
  ageGroup: 'all' | '0-2' | '3-5' | '6-12' | '13-17';
  
  /** Optional region filter (e.g., "Upper Peninsula") */
  region?: string;
  
  /** Optional gender filter */
  gender?: 'all' | 'boys' | 'girls';
}

/**
 * Statewide summary statistics
 */
export interface StateSummary {
  /** Total children in Michigan foster care */
  totalChildren: number;
  
  /** Children waiting for adoption */
  waitingAdoption: number;
  
  /** Successful adoptions in the last year */
  adoptionsThisYear: number;
  
  /** Average age of children in care */
  averageAge: number;
  
  /** Youth who aged out without adoption */
  agedOutLastYear: number;
}

/**
 * Child icon position on map
 */
export interface ChildIcon {
  /** Unique identifier */
  id: string;
  
  /** Position on map */
  position: GeoPoint;
  
  /** Gender (for icon color) */
  gender: 'boy' | 'girl';
  
  /** County this child belongs to */
  countyFips: string;
  
  /** Age group (for filtering) */
  ageGroup: '0-5' | '6-10' | '11-17';
}

/**
 * Configuration for the distribution algorithm
 */
export interface DistributionConfig {
  /** Base radius in kilometers for distribution */
  baseRadiusKm: number;
  
  /** Power factor for distance distribution (< 1 = more spread) */
  powerFactor: number;
  
  /** Maximum retry attempts for valid placement */
  maxRetries: number;
  
  /** Enable boundary checking (water, Canada) */
  enableBoundaryCheck: boolean;
}
```

---

## Geographic Distribution Algorithm

### Overview

The distribution algorithm places child icons across Michigan in a realistic, natural-looking pattern while respecting geographic boundaries.

### Algorithm Steps

```typescript
/**
 * Main distribution function
 * 
 * @param county - County data including totals and centers
 * @param config - Distribution configuration
 * @returns Array of child icon positions
 */
function distributeChildrenInCounty(
  county: CountyData,
  config: DistributionConfig
): ChildIcon[] {
  const icons: ChildIcon[] = [];
  
  // Step 1: Determine distribution centers
  const centers = county.distributionCenters || [
    { lat: county.lat, lng: county.lng, weight: 1.0 }
  ];
  
  // Step 2: Calculate how many boys and girls per center
  const { boys, girls } = county.genderBreakdown;
  
  // Step 3: Distribute boys across centers
  centers.forEach((center, idx) => {
    const boysForCenter = Math.round(boys * center.weight);
    const positions = generatePositions(
      center,
      boysForCenter,
      config
    );
    
    positions.forEach(pos => {
      icons.push({
        id: `${county.fips}-boy-${icons.length}`,
        position: pos,
        gender: 'boy',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    });
  });
  
  // Step 4: Distribute girls across centers
  centers.forEach((center, idx) => {
    const girlsForCenter = Math.round(girls * center.weight);
    const positions = generatePositions(
      center,
      girlsForCenter,
      config
    );
    
    positions.forEach(pos => {
      icons.push({
        id: `${county.fips}-girl-${icons.length}`,
        position: pos,
        gender: 'girl',
        countyFips: county.fips,
        ageGroup: assignAgeGroup(county.ageBreakdown)
      });
    });
  });
  
  return icons;
}

/**
 * Generate random positions around a center point
 * Uses power-law distribution for natural clustering
 */
function generatePositions(
  center: DistributionCenter,
  count: number,
  config: DistributionConfig
): GeoPoint[] {
  const positions: GeoPoint[] = [];
  const radiusDeg = config.baseRadiusKm / 111; // Convert km to degrees
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition: GeoPoint | null = null;
    
    // Try to find a valid position
    while (attempts < config.maxRetries && !validPosition) {
      // Power-law distribution: Math.pow(random, power) * radius
      // power < 1 = more spread out
      // power > 1 = more clustered at center
      const distance = Math.pow(Math.random(), config.powerFactor) * radiusDeg;
      const angle = Math.random() * 2 * Math.PI;
      
      const lat = center.lat + (distance * Math.cos(angle));
      const lng = center.lng + (distance * Math.sin(angle) * 1.5); // Longitude compression
      
      const candidate = { lat, lng };
      
      // Validate position if boundary checking enabled
      if (!config.enableBoundaryCheck || isValidPosition(candidate)) {
        validPosition = candidate;
      }
      
      attempts++;
    }
    
    // If we found a valid position, use it; otherwise skip this child
    if (validPosition) {
      positions.push(validPosition);
    }
  }
  
  return positions;
}

/**
 * Check if a position is on land (not water or Canada)
 */
function isValidPosition(point: GeoPoint): boolean {
  // Step 1: Check Michigan state bounds
  if (!isWithinMichiganBounds(point)) {
    return false;
  }
  
  // Step 2: Check not on Great Lakes
  if (isOnGreatLakes(point)) {
    return false;
  }
  
  // Step 3: Check not in Canada
  if (isInCanada(point)) {
    return false;
  }
  
  // Step 4: Check not on rivers/bays (optional, more precise)
  if (isOnWaterBody(point)) {
    return false;
  }
  
  return true;
}
```

### Boundary Checking Details

```typescript
/**
 * Michigan state boundary box
 */
const MICHIGAN_BOUNDS = {
  north: 48.3,   // Upper Peninsula northern tip
  south: 41.7,   // Ohio border
  east: -82.4,   // Ontario border (east)
  west: -90.4    // Wisconsin border (west)
};

function isWithinMichiganBounds(point: GeoPoint): boolean {
  return (
    point.lat >= MICHIGAN_BOUNDS.south &&
    point.lat <= MICHIGAN_BOUNDS.north &&
    point.lng >= MICHIGAN_BOUNDS.west &&
    point.lng <= MICHIGAN_BOUNDS.east
  );
}

/**
 * Great Lakes rough boundaries
 * More precise checking can use GeoJSON polygons
 */
function isOnGreatLakes(point: GeoPoint): boolean {
  // Lake Michigan (west)
  if (point.lng < -86.0 && point.lat < 46.0) {
    return true;
  }
  
  // Lake Huron (east)
  if (point.lng > -83.5 && point.lat > 43.5) {
    return true;
  }
  
  // Lake Superior (north)
  if (point.lat > 47.0) {
    return true;
  }
  
  // Lake Erie (southeast)
  if (point.lng > -83.0 && point.lat < 42.5) {
    return true;
  }
  
  return false;
}

/**
 * Check if point is in Canada (north of Michigan)
 */
function isInCanada(point: GeoPoint): boolean {
  // Simple check: north of St. Clair River / Detroit River
  if (point.lng > -83.0 && point.lat > 42.7) {
    return true;
  }
  
  // More sophisticated: use actual border GeoJSON
  // TODO: Implement polygon containment check
  
  return false;
}
```

---

## Color Scale System

### Heat Map Colors

```typescript
/**
 * Get color for county based on child population
 * Uses a logarithmic scale for better visual distribution
 */
export function getCountyColor(totalChildren: number): string {
  // Thresholds determined by natural breaks in Michigan data
  if (totalChildren >= 1000) return '#dc2626';  // Red - Very High
  if (totalChildren >= 500)  return '#f97316';  // Orange - High
  if (totalChildren >= 200)  return '#fbbf24';  // Yellow - Medium
  if (totalChildren >= 100)  return '#60a5fa';  // Blue - Low
  return '#93c5fd';                              // Light Blue - Very Low
}

/**
 * Get color with opacity for overlapping areas
 */
export function getCountyColorWithOpacity(
  totalChildren: number,
  opacity: number = 0.6
): string {
  const baseColor = getCountyColor(totalChildren);
  return `${baseColor}${Math.round(opacity * 255).toString(16)}`;
}

/**
 * Color palette definition
 */
export const COLOR_PALETTE = {
  veryHigh: {
    hex: '#dc2626',
    rgb: 'rgb(220, 38, 38)',
    name: 'Red',
    threshold: 1000
  },
  high: {
    hex: '#f97316',
    rgb: 'rgb(249, 115, 22)',
    name: 'Orange',
    threshold: 500
  },
  medium: {
    hex: '#fbbf24',
    rgb: 'rgb(251, 191, 36)',
    name: 'Yellow',
    threshold: 200
  },
  low: {
    hex: '#60a5fa',
    rgb: 'rgb(96, 165, 250)',
    name: 'Blue',
    threshold: 100
  },
  veryLow: {
    hex: '#93c5fd',
    rgb: 'rgb(147, 197, 253)',
    name: 'Light Blue',
    threshold: 0
  }
};
```

---

## Map Configuration

### Leaflet Setup

```typescript
// Map initialization configuration
export const MAP_CONFIG = {
  // Michigan center point
  center: {
    lat: 44.3148,
    lng: -85.6024
  },
  
  // Zoom levels
  zoom: {
    initial: 7,
    min: 6,
    max: 11
  },
  
  // Map bounds (prevents panning too far)
  maxBounds: [
    [41.0, -91.0],  // Southwest corner
    [49.0, -82.0]   // Northeast corner
  ],
  
  // Tile layer
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }
};

// Marker sizing based on population
export function getMarkerRadius(totalChildren: number): number {
  // Square root scaling for area-based sizing
  return Math.max(5, Math.min(50, Math.sqrt(totalChildren) * 0.8));
}

// Child icon configuration
export const CHILD_ICON_CONFIG = {
  boy: {
    emoji: '👦',
    color: '#3b82f6',  // Blue
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
  },
  girl: {
    emoji: '👧',
    color: '#ec4899',  // Pink
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
  },
  size: {
    width: 14,
    height: 14,
    borderWidth: 1.5
  }
};
```

---

## Component Specifications

### InteractiveMap Component

```typescript
interface InteractiveMapProps {
  /** County data to display */
  counties: CountyData[];
  
  /** Current filters */
  filters: MapFilters;
  
  /** Callback when county is clicked */
  onCountyClick?: (county: CountyData) => void;
  
  /** Optional: Initial center override */
  initialCenter?: GeoPoint;
  
  /** Optional: Initial zoom override */
  initialZoom?: number;
}

interface InteractiveMapState {
  /** Child icon positions (computed) */
  childIcons: ChildIcon[];
  
  /** Currently selected county */
  selectedCounty: CountyData | null;
  
  /** Loading state */
  isLoading: boolean;
}
```

### CountyMarker Component

```typescript
interface CountyMarkerProps {
  /** County data */
  county: CountyData;
  
  /** Marker color (from heat map) */
  color: string;
  
  /** Marker radius (based on population) */
  radius: number;
  
  /** Is this county currently selected? */
  isSelected: boolean;
  
  /** Click handler */
  onClick: () => void;
}
```

### Sidebar Component

```typescript
interface SidebarProps {
  /** Current filters */
  filters: MapFilters;
  
  /** Filter change handler */
  onFilterChange: (filters: MapFilters) => void;
  
  /** State summary stats */
  summary: StateSummary;
  
  /** Optional: Selected county for details */
  selectedCounty?: CountyData;
}
```

---

## Data Schema

### County Data JSON Structure

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
    {
      "lat": 42.3314,
      "lng": -83.0458,
      "weight": 0.35,
      "name": "Detroit"
    },
    {
      "lat": 42.2808,
      "lng": -83.3733,
      "weight": 0.25,
      "name": "Westland"
    },
    {
      "lat": 42.3223,
      "lng": -83.1763,
      "weight": 0.20,
      "name": "Dearborn"
    },
    {
      "lat": 42.5456,
      "lng": -83.2132,
      "weight": 0.20,
      "name": "Livonia"
    }
  ]
}
```

---

## Performance Optimization

### Bundle Size Targets

```
Component              | Size (gzipped)
-----------------------|---------------
React + ReactDOM       | ~42 KB
Leaflet                | ~40 KB
React-Leaflet          | ~10 KB
Custom Code            | ~30 KB
-----------------------|---------------
Total JS               | ~122 KB
CSS                    | ~15 KB
-----------------------|---------------
TOTAL                  | ~137 KB
```

### Code Splitting Strategy

```typescript
// Lazy load routes
const ProcessGuide = lazy(() => import('./components/Education/ProcessGuide'));
const FAQSection = lazy(() => import('./components/Education/FAQSection'));
const ResourceLibrary = lazy(() => import('./components/Education/ResourceLibrary'));

// Lazy load heavy utilities
const boundaryChecker = lazy(() => import('./utils/boundaryCheck'));
```

### Memoization Strategy

```typescript
// Memoize expensive computations
const childIcons = useMemo(
  () => distributeAllChildren(counties, config),
  [counties, config]
);

// Memoize filtered data
const filteredCounties = useMemo(
  () => applyFilters(counties, filters),
  [counties, filters]
);

// Memoize color calculations
const countyColors = useMemo(
  () => counties.map(c => getCountyColor(c.totalChildren)),
  [counties]
);
```

---

## API Endpoints (Future)

### Potential Backend Integration

```typescript
// If/when we add a backend API

/**
 * Get all county data
 */
GET /api/counties
Response: CountyData[]

/**
 * Get specific county
 */
GET /api/counties/:fips
Response: CountyData

/**
 * Get state summary
 */
GET /api/summary
Response: StateSummary

/**
 * Submit contact form
 */
POST /api/contact
Body: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  county?: string;
}
Response: { success: boolean; }

/**
 * Track analytics event
 */
POST /api/analytics
Body: {
  event: 'page_view' | 'county_click' | 'contact_attempt';
  data: Record<string, any>;
}
Response: { tracked: boolean; }
```

---

## Testing Specifications

### Unit Test Coverage Requirements

- **Utilities**: 100% coverage
- **Components**: 90%+ coverage
- **Hooks**: 95%+ coverage
- **Overall**: 90%+ coverage

### Test Examples

```typescript
// Example: Test distribution algorithm
describe('distributeChildrenInCounty', () => {
  it('should place correct number of children', () => {
    const county = mockCounty({ totalChildren: 100 });
    const icons = distributeChildrenInCounty(county, config);
    expect(icons).toHaveLength(100);
  });
  
  it('should respect gender ratio', () => {
    const county = mockCounty({ boys: 60, girls: 40 });
    const icons = distributeChildrenInCounty(county, config);
    const boys = icons.filter(i => i.gender === 'boy');
    expect(boys).toHaveLength(60);
  });
  
  it('should not place icons on water', () => {
    const county = mockCounty({ lat: 45.0, lng: -87.0 });
    const config = { enableBoundaryCheck: true };
    const icons = distributeChildrenInCounty(county, config);
    icons.forEach(icon => {
      expect(isOnGreatLakes(icon.position)).toBe(false);
    });
  });
});

// Example: Test component rendering
describe('CountyMarker', () => {
  it('should render with correct color', () => {
    const { container } = render(
      <CountyMarker county={mockCounty()} color="#dc2626" radius={20} />
    );
    const circle = container.querySelector('circle');
    expect(circle).toHaveStyle({ fill: '#dc2626' });
  });
  
  it('should show popup on click', () => {
    const { container } = render(
      <CountyMarker county={mockCounty()} />
    );
    fireEvent.click(container.querySelector('circle'));
    expect(screen.getByText(/Wayne County/i)).toBeInTheDocument();
  });
});
```

---

## Security Considerations

### Input Validation

```typescript
// Sanitize all user inputs
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Validate email
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate phone
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}
```

### Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://unpkg.com;
        style-src 'self' 'unsafe-inline' https://unpkg.com;
        img-src 'self' data: https://*.tile.openstreetmap.org;
        connect-src 'self' https://*.tile.openstreetmap.org;
        font-src 'self' data:;
      "
/>
```

---

## Browser Support

### Target Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions  
- Safari: Last 2 versions
- iOS Safari: Last 2 versions
- Android Chrome: Last 2 versions

### Polyfills Needed

```javascript
// Already included in Create React App:
// - Promise
// - Object.assign
// - Array.from
// - Symbol

// May need to add:
// - Intersection Observer (for lazy loading)
// - ResizeObserver (for responsive layouts)
```

---

## Environment Variables

```env
# .env.example

# API endpoints (if backend added)
REACT_APP_API_URL=https://api.michiganfostercare.org

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Feature flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ADVANCED_FILTERS=false

# Map configuration
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_MAP_ATTRIBUTION=© OpenStreetMap contributors

# Contact
REACT_APP_MARE_PHONE=1-800-589-6273
REACT_APP_CONTACT_EMAIL=info@michiganfostercare.org
```

---

## Build Configuration

### Production Build

```bash
# Build with optimizations
npm run build

# Output structure
build/
├── static/
│   ├── css/
│   │   └── main.[hash].css      # Minified CSS
│   ├── js/
│   │   ├── main.[hash].js       # Main bundle
│   │   └── [number].[hash].js   # Code-split chunks
│   └── media/
│       └── [assets]              # Images, fonts
├── index.html                    # Entry point
├── manifest.json                 # PWA manifest
└── asset-manifest.json           # Build metadata
```

### Webpack Optimizations

```javascript
// Custom webpack config (if needed)
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        leaflet: {
          test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
          name: 'leaflet',
          priority: 20
        }
      }
    },
    minimize: true,
    usedExports: true
  }
};
```

---

## Monitoring & Logging

### Error Tracking

```typescript
// Setup Sentry (or similar)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1
});

// Custom error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }
}
```

### Performance Monitoring

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] TypeScript compile errors resolved
- [ ] ESLint warnings addressed
- [ ] Lighthouse score 90+ on all metrics
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Backup plan documented

### Post-Deployment

- [ ] Verify production build loads
- [ ] Test all interactive features
- [ ] Check analytics tracking
- [ ] Monitor error logs
- [ ] Performance metrics baseline
- [ ] Uptime monitoring active
- [ ] SSL certificate valid
- [ ] DNS propagated
- [ ] Social media cards working
- [ ] Contact forms functional

---

## Version Control Strategy

### Branch Structure

```
main           # Production-ready code
├── develop    # Integration branch
├── feature/*  # New features
├── bugfix/*   # Bug fixes
└── hotfix/*   # Emergency fixes
```

### Commit Convention

```
feat: Add county filter functionality
fix: Correct boundary checking for Upper Peninsula
docs: Update API documentation
style: Format with Prettier
refactor: Simplify distribution algorithm
test: Add unit tests for colorScale
chore: Update dependencies
```

---

**This technical specification should provide complete context for any developer (human or AI) working on this project. All implementation details, patterns, and standards are documented here.**
