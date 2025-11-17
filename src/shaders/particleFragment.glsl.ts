/**
 * Particle Fragment Shader
 *
 * GPU-accelerated particle rendering with:
 * - Radial gradient glow effects
 * - Soft edges with alpha blending
 * - HDR-style bloom preparation
 * - Gender-specific color coding
 */

export const particleFragmentShader = `
uniform float uGlowIntensity;
uniform float uTime;

varying float vAlpha;
varying vec3 vColor;

void main() {
  // Calculate distance from center for radial gradient
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Soft circular edge with glow
  float circle = 1.0 - smoothstep(0.2, 0.5, dist);

  // Inner glow (brighter in center)
  float glow = exp(-dist * 8.0) * uGlowIntensity;

  // Combine circle and glow
  float alpha = (circle + glow) * vAlpha;

  // Discard fully transparent pixels for performance
  if (alpha < 0.01) discard;

  // HDR color intensity for bloom effect
  vec3 finalColor = vColor * (1.0 + glow * 2.0);

  // Add subtle shimmer effect
  float shimmer = sin(uTime * 3.0 + dist * 10.0) * 0.1 + 0.9;
  finalColor *= shimmer;

  gl_FragColor = vec4(finalColor, alpha);
}
`;
