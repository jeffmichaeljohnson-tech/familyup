/**
 * FamilyUp Metal Particle Shader
 *
 * GPU-accelerated particle rendering for high-performance visualization
 * Renders thousands of particles representing aggregate foster care data
 */

#include <metal_stdlib>
using namespace metal;

struct Particle {
  float3 position;
  float3 velocity;
  float4 color;
  float size;
  float age;
  float lifespan;
  int countyIndex;
};

struct VertexOut {
  float4 position [[position]];
  float4 color;
  float pointSize [[point_size]];
};

// Vertex shader - transforms particle to screen space
vertex VertexOut particle_vertex(
  constant Particle *particles [[buffer(0)]],
  uint vid [[vertex_id]]
) {
  VertexOut out;

  Particle particle = particles[vid];

  // Transform to clip space (-1 to 1)
  float x = particle.position.x * 2.0 - 1.0;
  float y = particle.position.y * 2.0 - 1.0;
  float z = particle.position.z;

  out.position = float4(x, y, z, 1.0);
  out.color = particle.color;
  out.pointSize = particle.size;

  // Fade based on age
  float ageRatio = particle.age / particle.lifespan;
  out.color.a *= (1.0 - ageRatio);

  return out;
}

// Fragment shader - renders circular particles with soft edges
fragment float4 particle_fragment(
  VertexOut in [[stage_in]],
  float2 pointCoord [[point_coord]]
) {
  // Calculate distance from center
  float2 centered = pointCoord - float2(0.5, 0.5);
  float dist = length(centered);

  // Discard fragments outside circle
  if (dist > 0.5) {
    discard_fragment();
  }

  // Soft edge falloff
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  float4 color = in.color;
  color.a *= alpha;

  // Add subtle glow
  float glow = exp(-dist * 3.0);
  color.rgb += float3(glow * 0.2);

  return color;
}
