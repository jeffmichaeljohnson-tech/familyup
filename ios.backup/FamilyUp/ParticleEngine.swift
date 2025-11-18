/**
 * FamilyUp GPU Particle System
 *
 * High-performance Metal-based particle engine
 * Renders thousands of particles representing aggregate foster care data
 *
 * PRIVACY: Particles are distributed randomly within county bounds
 * They do NOT represent actual child locations
 */

import Foundation
import MetalKit

struct Particle {
  var position: SIMD3<Float>
  var velocity: SIMD3<Float>
  var color: SIMD4<Float>
  var size: Float
  var age: Float
  var lifespan: Float
  var countyIndex: Int32

  static let stride = MemoryLayout<Particle>.stride
}

class ParticleEngine {

  private var device: MTLDevice
  private var particles: [Particle] = []
  private var particleBuffer: MTLBuffer?
  private var maxParticles: Int = 10000

  private var highlightedCounty: String?
  private var countyFIPSMap: [String: Int32] = [:]

  init(device: MTLDevice) {
    self.device = device
    setupBuffers()
  }

  private func setupBuffers() {
    let bufferSize = Particle.stride * maxParticles
    particleBuffer = device.makeBuffer(length: bufferSize, options: .storageModeShared)
  }

  func generateParticles(
    count: Int,
    centerX: Float,
    centerY: Float,
    spread: Float,
    countyFIPS: String
  ) {
    // Map county FIPS to index
    if countyFIPSMap[countyFIPS] == nil {
      countyFIPSMap[countyFIPS] = Int32(countyFIPSMap.count)
    }

    guard let countyIndex = countyFIPSMap[countyFIPS] else { return }

    for _ in 0..<count {
      // Random position within county bounds
      let angle = Float.random(in: 0..<Float.pi * 2)
      let radius = Float.random(in: 0..<spread)

      let x = centerX + cos(angle) * radius
      let y = centerY + sin(angle) * radius
      let z = Float.random(in: 0..<0.1)

      // Gentle floating motion
      let vx = Float.random(in: -0.0001..<0.0001)
      let vy = Float.random(in: -0.0002..<0.0002)
      let vz = Float.random(in: 0.0..<0.0001)

      // Blue color scheme with variation
      let hue = Float.random(in: 0.55..<0.65) // Blue range
      let saturation = Float.random(in: 0.6..<0.9)
      let brightness = Float.random(in: 0.7..<1.0)
      let color = hsbToRGB(h: hue, s: saturation, b: brightness)

      let particle = Particle(
        position: SIMD3<Float>(x, y, z),
        velocity: SIMD3<Float>(vx, vy, vz),
        color: SIMD4<Float>(color.0, color.1, color.2, 0.7),
        size: Float.random(in: 2.0..<4.0),
        age: 0,
        lifespan: Float.random(in: 30..<60),
        countyIndex: countyIndex
      )

      particles.append(particle)
    }

    updateBuffer()
  }

  func update(deltaTime: Float) {
    for i in 0..<particles.count {
      particles[i].age += deltaTime

      // Update position
      particles[i].position += particles[i].velocity * deltaTime

      // Bounce off edges
      if particles[i].position.x < 0 || particles[i].position.x > 1 {
        particles[i].velocity.x *= -1
      }
      if particles[i].position.y < 0 || particles[i].position.y > 1 {
        particles[i].velocity.y *= -1
      }

      // Reset if expired
      if particles[i].age >= particles[i].lifespan {
        particles[i].age = 0
        particles[i].position.z = 0
      }
    }

    updateBuffer()
  }

  func highlightCounty(fips: String) {
    highlightedCounty = fips

    guard let countyIndex = countyFIPSMap[fips] else { return }

    // Boost particles for highlighted county
    for i in 0..<particles.count {
      if particles[i].countyIndex == countyIndex {
        particles[i].color = SIMD4<Float>(1.0, 0.6, 0.2, 0.9) // Orange highlight
        particles[i].size = 6.0
      } else {
        // Dim other counties
        particles[i].color.w = 0.3
        particles[i].size = 2.0
      }
    }

    updateBuffer()
  }

  private func updateBuffer() {
    guard let buffer = particleBuffer else { return }
    let bufferPointer = buffer.contents().assumingMemoryBound(to: Particle.self)

    for (index, particle) in particles.enumerated() {
      bufferPointer[index] = particle
    }
  }

  func render(encoder: MTLRenderCommandEncoder) {
    guard let buffer = particleBuffer else { return }

    encoder.setVertexBuffer(buffer, offset: 0, index: 0)
    encoder.drawPrimitives(
      type: .point,
      vertexStart: 0,
      vertexCount: particles.count
    )
  }

  func cleanup() {
    particles.removeAll()
    particleBuffer = nil
  }

  // MARK: - Utilities

  private func hsbToRGB(h: Float, s: Float, b: Float) -> (Float, Float, Float) {
    let c = b * s
    let x = c * (1 - abs(fmod(h * 6, 2) - 1))
    let m = b - c

    var r: Float = 0, g: Float = 0, blue: Float = 0

    if h < 1.0/6.0 {
      r = c; g = x; blue = 0
    } else if h < 2.0/6.0 {
      r = x; g = c; blue = 0
    } else if h < 3.0/6.0 {
      r = 0; g = c; blue = x
    } else if h < 4.0/6.0 {
      r = 0; g = x; blue = c
    } else if h < 5.0/6.0 {
      r = x; g = 0; blue = c
    } else {
      r = c; g = 0; blue = x
    }

    return (r + m, g + m, blue + m)
  }
}
