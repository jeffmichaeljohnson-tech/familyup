/**
 * FamilyUp County Glow Effect Shader
 *
 * Creates dramatic glow effects for county highlights
 * Emphasizes selected counties and creates emotional impact
 */

#include <metal_stdlib>
using namespace metal;

struct GlowVertex {
  float2 position [[attribute(0)]];
  float2 texCoord [[attribute(1)]];
};

struct GlowOut {
  float4 position [[position]];
  float2 texCoord;
};

// Vertex shader for fullscreen quad
vertex GlowOut county_glow_vertex(
  GlowVertex in [[stage_in]]
) {
  GlowOut out;
  out.position = float4(in.position, 0.0, 1.0);
  out.texCoord = in.texCoord;
  return out;
}

// Fragment shader for county glow effect
fragment float4 county_glow_fragment(
  GlowOut in [[stage_in]],
  texture2d<float> sourceTexture [[texture(0)]],
  constant float &glowIntensity [[buffer(0)]],
  constant float4 &glowColor [[buffer(1)]]
) {
  constexpr sampler textureSampler(
    mag_filter::linear,
    min_filter::linear
  );

  float4 color = sourceTexture.sample(textureSampler, in.texCoord);

  // Multi-pass blur for glow effect
  float2 texelSize = 1.0 / float2(sourceTexture.get_width(), sourceTexture.get_height());
  float4 blur = float4(0.0);

  // Gaussian blur kernel
  const int kernelSize = 9;
  const float kernel[kernelSize] = {
    0.05, 0.09, 0.12, 0.15, 0.16, 0.15, 0.12, 0.09, 0.05
  };

  for (int x = -4; x <= 4; x++) {
    for (int y = -4; y <= 4; y++) {
      float2 offset = float2(x, y) * texelSize * 2.0;
      float weight = kernel[x + 4] * kernel[y + 4];
      blur += sourceTexture.sample(textureSampler, in.texCoord + offset) * weight;
    }
  }

  // Combine original with glow
  float4 glow = blur * glowColor * glowIntensity;
  float4 result = color + glow;

  // Add chromatic aberration for dramatic effect
  float2 direction = in.texCoord - float2(0.5, 0.5);
  float dist = length(direction) * 0.1;

  float4 r = sourceTexture.sample(textureSampler, in.texCoord + direction * dist * 0.01);
  float4 g = sourceTexture.sample(textureSampler, in.texCoord);
  float4 b = sourceTexture.sample(textureSampler, in.texCoord - direction * dist * 0.01);

  result.r = mix(result.r, r.r, glowIntensity * 0.3);
  result.b = mix(result.b, b.b, glowIntensity * 0.3);

  return result;
}

// Radial glow for county centers
fragment float4 radial_glow_fragment(
  GlowOut in [[stage_in]],
  constant float2 &centerPoint [[buffer(0)]],
  constant float &radius [[buffer(1)]],
  constant float4 &color [[buffer(2)]]
) {
  float2 dir = in.texCoord - centerPoint;
  float dist = length(dir);

  // Soft radial gradient
  float intensity = 1.0 - smoothstep(0.0, radius, dist);
  intensity = pow(intensity, 2.0); // Sharper falloff

  // Pulsing effect
  float pulse = sin(dist * 10.0) * 0.1 + 0.9;
  intensity *= pulse;

  float4 glowColor = color;
  glowColor.a *= intensity;

  return glowColor;
}
