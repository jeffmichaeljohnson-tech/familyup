/**
 * Color scale utilities for heat map visualization
 * Designed to create dramatic visual impact showing scale of children in need
 */

/**
 * Get heat map color based on total children in county
 * Creates dramatic gradient to emphasize counties with more children
 */
export function getCountyColor(totalChildren: number): string {
  if (totalChildren >= 1000) return '#dc2626';  // Red - Very High (1000+)
  if (totalChildren >= 500)  return '#f97316';  // Orange - High (500-1000)
  if (totalChildren >= 200)  return '#fbbf24';  // Yellow - Medium (200-500)
  if (totalChildren >= 100)  return '#60a5fa';  // Blue - Low (100-200)
  return '#93c5fd';                              // Light Blue - Very Low (<100)
}

/**
 * Get color with opacity for overlays
 */
export function getCountyColorWithOpacity(totalChildren: number, opacity: number = 0.6): string {
  const baseColor = getCountyColor(totalChildren);
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get marker radius based on population (for dramatic effect)
 * Minimum size increased to ensure all counties are visible
 */
export function getMarkerRadius(totalChildren: number): number {
  return Math.max(15, Math.min(60, Math.sqrt(totalChildren) * 1.5));
}

/**
 * Get glow intensity based on population
 */
export function getGlowIntensity(totalChildren: number): number {
  return Math.min(1, totalChildren / 1000);
}

/**
 * Color palette definition
 */
export const COLOR_PALETTE = {
  veryHigh: { hex: '#dc2626', name: 'Very High', threshold: 1000 },
  high: { hex: '#f97316', name: 'High', threshold: 500 },
  medium: { hex: '#fbbf24', name: 'Medium', threshold: 200 },
  low: { hex: '#60a5fa', name: 'Low', threshold: 100 },
  veryLow: { hex: '#93c5fd', name: 'Very Low', threshold: 0 }
};

/**
 * Gender colors for child icons
 */
export const GENDER_COLORS = {
  boy: '#3b82f6',   // Blue
  girl: '#ec4899'   // Pink
};
