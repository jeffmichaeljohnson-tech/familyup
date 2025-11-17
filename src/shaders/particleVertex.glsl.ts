/**
 * Particle Vertex Shader
 *
 * GPU-accelerated particle animation with:
 * - Realistic physics-based motion
 * - Individual particle lifetimes
 * - Smooth acceleration curves
 * - Billboard rotation for camera facing
 */

export const particleVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uCameraPosition;

attribute float aSize;
attribute float aLifetime;
attribute float aSpeed;
attribute vec3 aVelocity;
attribute float aPhase;

varying float vAlpha;
varying vec3 vColor;

void main() {
  // Calculate particle age (0 to 1)
  float age = mod(uTime * aSpeed + aPhase, aLifetime) / aLifetime;

  // Rising motion with easing (cubic ease-out)
  float rise = age * age * (3.0 - 2.0 * age);

  // Position calculation with vertical rise
  vec3 pos = position;
  pos.y += rise * 5000.0; // Rise 5km in normalized space

  // Add slight horizontal drift for realism
  pos.x += sin(uTime * aSpeed + aPhase) * 200.0 * age;
  pos.z += cos(uTime * aSpeed + aPhase) * 200.0 * age;

  // Apply velocity vector for directional movement
  pos += aVelocity * age * 1000.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation based on distance and age
  float sizeAttenuation = 1.0 / -mvPosition.z;

  // Fade in/out curve (smooth at both ends)
  float fadeIn = smoothstep(0.0, 0.1, age);
  float fadeOut = smoothstep(1.0, 0.8, age);
  vAlpha = fadeIn * fadeOut;

  // Size varies with lifetime for sparkle effect
  float sizePulse = 1.0 + sin(age * 3.14159 * 4.0) * 0.3;
  gl_PointSize = aSize * uPixelRatio * sizeAttenuation * sizePulse;

  // Pass color to fragment shader
  vColor = color;
}
`;
