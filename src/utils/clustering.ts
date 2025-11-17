/**
 * Marker Clustering System for FamilyUp
 *
 * High-performance clustering for thousands of child icons
 * Uses supercluster for efficient spatial indexing
 *
 * PERFORMANCE TARGETS:
 * - Handle 10,000+ markers smoothly
 * - Sub-millisecond cluster updates on zoom
 * - Smooth animations between cluster states
 */

import Supercluster, { PointFeature } from 'supercluster';
import { ChildIcon, GeoPoint } from '../types';

export interface ClusterPoint extends GeoPoint {
  count: number;
  clusterId: number;
  isCluster: boolean;
  children?: ChildIcon[];
  expansion?: number;
}

export interface ClusterConfig {
  radius: number;        // Cluster radius in pixels
  maxZoom: number;       // Max zoom to cluster points on
  minZoom: number;       // Min zoom to cluster points on
  minPoints: number;     // Minimum points to form a cluster
  extent: number;        // Tile extent (default: 512)
}

export const DEFAULT_CLUSTER_CONFIG: ClusterConfig = {
  radius: 60,
  maxZoom: 16,
  minZoom: 0,
  minPoints: 2,
  extent: 512,
};

/**
 * Marker Clustering Manager
 * Efficiently clusters child icons based on zoom level
 */
export class MarkerClusterManager {
  private supercluster: Supercluster;
  private config: ClusterConfig;
  private points: PointFeature<ChildIcon>[] = [];

  constructor(config: Partial<ClusterConfig> = {}) {
    this.config = { ...DEFAULT_CLUSTER_CONFIG, ...config };

    this.supercluster = new Supercluster({
      radius: this.config.radius,
      maxZoom: this.config.maxZoom,
      minZoom: this.config.minZoom,
      minPoints: this.config.minPoints,
      extent: this.config.extent,
      // Custom reduce function to aggregate child data
      reduce: (accumulated, props) => {
        if (!accumulated.children) {
          accumulated.children = [];
        }
        accumulated.children.push(props);
      },
      // Map function to extract properties
      map: (props) => props,
    });
  }

  /**
   * Load child icons into the clustering system
   */
  loadMarkers(childIcons: ChildIcon[]): void {
    // Convert child icons to GeoJSON points
    this.points = childIcons.map((icon) => ({
      type: 'Feature',
      properties: icon,
      geometry: {
        type: 'Point',
        coordinates: [icon.position.lng, icon.position.lat],
      },
    }));

    this.supercluster.load(this.points);
  }

  /**
   * Get clusters for current viewport
   * PERFORMANCE: O(log n) with spatial indexing
   */
  getClusters(
    bounds: [number, number, number, number], // [west, south, east, north]
    zoom: number
  ): ClusterPoint[] {
    const clusters = this.supercluster.getClusters(bounds, Math.floor(zoom));

    return clusters.map((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const properties = cluster.properties;

      if (cluster.properties.cluster) {
        // This is a cluster
        return {
          lat,
          lng,
          count: properties.point_count || 0,
          clusterId: cluster.id as number,
          isCluster: true,
          expansion: this.supercluster.getClusterExpansionZoom(cluster.id as number),
        };
      } else {
        // This is an individual point
        const childIcon = properties as unknown as ChildIcon;
        return {
          lat,
          lng,
          count: 1,
          clusterId: -1,
          isCluster: false,
          children: [childIcon],
        };
      }
    });
  }

  /**
   * Get children of a specific cluster
   */
  getClusterChildren(clusterId: number): ChildIcon[] {
    const children = this.supercluster.getLeaves(clusterId, Infinity);
    return children.map((child) => child.properties as unknown as ChildIcon);
  }

  /**
   * Get zoom level to expand a cluster
   */
  getClusterExpansionZoom(clusterId: number): number {
    return this.supercluster.getClusterExpansionZoom(clusterId);
  }

  /**
   * Update cluster configuration dynamically
   */
  updateConfig(config: Partial<ClusterConfig>): void {
    this.config = { ...this.config, ...config };
    // Recreate supercluster with new config
    this.supercluster = new Supercluster({
      radius: this.config.radius,
      maxZoom: this.config.maxZoom,
      minZoom: this.config.minZoom,
      minPoints: this.config.minPoints,
      extent: this.config.extent,
    });
    // Reload points
    if (this.points.length > 0) {
      this.supercluster.load(this.points);
    }
  }

  /**
   * Get total number of markers
   */
  getTotalMarkers(): number {
    return this.points.length;
  }

  /**
   * Clear all markers
   */
  clear(): void {
    this.points = [];
    this.supercluster.load([]);
  }
}

/**
 * Calculate optimal cluster radius based on zoom level
 * Higher zoom = smaller radius for more granular clustering
 */
export function getOptimalClusterRadius(zoom: number): number {
  // Exponential decay: more clustering at lower zoom levels
  const minRadius = 30;
  const maxRadius = 120;
  const zoomFactor = Math.max(0, (16 - zoom) / 16);

  return minRadius + (maxRadius - minRadius) * zoomFactor;
}

/**
 * Calculate cluster size for visual representation
 * Larger clusters = bigger circles
 */
export function getClusterSize(count: number): number {
  // Logarithmic scaling for better visual distribution
  const minSize = 30;
  const maxSize = 100;
  const scaleFactor = Math.log10(count + 1) / Math.log10(10000);

  return minSize + (maxSize - minSize) * Math.min(1, scaleFactor);
}

/**
 * Get cluster color based on density
 * More children = warmer/more intense color
 */
export function getClusterColor(count: number): string {
  if (count < 10) return '#3b82f6'; // blue
  if (count < 50) return '#8b5cf6'; // purple
  if (count < 100) return '#f59e0b'; // orange
  if (count < 500) return '#ef4444'; // red
  return '#dc2626'; // dark red
}

/**
 * Animate cluster transitions smoothly
 * Prevents jarring visual changes when zooming
 */
export interface ClusterTransition {
  from: ClusterPoint[];
  to: ClusterPoint[];
  duration: number;
}

export function createClusterTransition(
  from: ClusterPoint[],
  to: ClusterPoint[],
  duration: number = 300
): ClusterTransition {
  return { from, to, duration };
}

/**
 * Interpolate between cluster states for smooth animation
 */
export function interpolateClusters(
  transition: ClusterTransition,
  progress: number // 0-1
): ClusterPoint[] {
  // Simple approach: cross-fade between states
  // Advanced: match clusters by proximity and morph
  if (progress < 0.5) return transition.from;
  return transition.to;
}

/**
 * Calculate viewport bounds from map view
 */
export function getViewportBounds(
  center: GeoPoint,
  zoom: number,
  width: number,
  height: number
): [number, number, number, number] {
  // Approximate calculation - in production use proper projection
  const lngDelta = 360 / Math.pow(2, zoom) * (width / 256);
  const latDelta = 180 / Math.pow(2, zoom) * (height / 256);

  return [
    center.lng - lngDelta / 2, // west
    center.lat - latDelta / 2, // south
    center.lng + lngDelta / 2, // east
    center.lat + latDelta / 2, // north
  ];
}

/**
 * Spatial index for fast proximity queries
 * Used for hit testing and hover detection
 */
export class SpatialIndex {
  private grid: Map<string, ClusterPoint[]>;
  private cellSize: number;

  constructor(cellSize: number = 0.1) {
    this.grid = new Map();
    this.cellSize = cellSize;
  }

  private getGridKey(lat: number, lng: number): string {
    const gridLat = Math.floor(lat / this.cellSize);
    const gridLng = Math.floor(lng / this.cellSize);
    return `${gridLat},${gridLng}`;
  }

  /**
   * Add points to spatial index
   */
  index(points: ClusterPoint[]): void {
    this.grid.clear();

    points.forEach((point) => {
      const key = this.getGridKey(point.lat, point.lng);
      const cell = this.grid.get(key) || [];
      cell.push(point);
      this.grid.set(key, cell);
    });
  }

  /**
   * Find points near a location (for hit testing)
   * PERFORMANCE: O(1) average case with spatial hashing
   */
  findNearby(lat: number, lng: number, radius: number = 0.05): ClusterPoint[] {
    const results: ClusterPoint[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const centerGridLat = Math.floor(lat / this.cellSize);
    const centerGridLng = Math.floor(lng / this.cellSize);

    // Search neighboring cells
    for (let dLat = -cellRadius; dLat <= cellRadius; dLat++) {
      for (let dLng = -cellRadius; dLng <= cellRadius; dLng++) {
        const key = `${centerGridLat + dLat},${centerGridLng + dLng}`;
        const cell = this.grid.get(key);

        if (cell) {
          // Filter by actual distance
          cell.forEach((point) => {
            const distance = Math.sqrt(
              Math.pow(point.lat - lat, 2) + Math.pow(point.lng - lng, 2)
            );
            if (distance <= radius) {
              results.push(point);
            }
          });
        }
      }
    }

    return results;
  }

  /**
   * Clear the spatial index
   */
  clear(): void {
    this.grid.clear();
  }
}
