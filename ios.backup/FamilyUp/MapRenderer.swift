/**
 * FamilyUp Metal Map Renderer
 *
 * High-performance GPU-accelerated map visualization using Metal API
 * Renders county polygons and particle effects for dramatic impact
 *
 * PRIVACY: All rendering is based on aggregate county data only
 */

import Foundation
import MetalKit
import UIKit

@objc(MapRenderer)
class MapRenderer: NSObject {

  private var metalDevice: MTLDevice?
  private var commandQueue: MTLCommandQueue?
  private var renderPipelineState: MTLRenderPipelineState?
  private var particleEngine: ParticleEngine?

  // County data
  private var counties: [[String: Any]] = []
  private var selectedCountyFIPS: String?

  // View dimensions
  private var viewportWidth: Float = 0
  private var viewportHeight: Float = 0

  @objc
  func initialize(_ viewTag: NSNumber, counties: [[String: Any]]) {
    self.counties = counties

    guard let device = MTLCreateSystemDefaultDevice() else {
      print("Metal is not supported on this device")
      return
    }

    self.metalDevice = device
    self.commandQueue = device.makeCommandQueue()

    // Initialize particle engine
    self.particleEngine = ParticleEngine(device: device)

    // Setup render pipeline
    setupRenderPipeline()

    // Generate particles from county data
    generateParticlesFromCounties()

    print("MapRenderer initialized with \(counties.count) counties")
  }

  private func setupRenderPipeline() {
    guard let device = metalDevice else { return }

    let library = device.makeDefaultLibrary()
    let vertexFunction = library?.makeFunction(name: "particle_vertex")
    let fragmentFunction = library?.makeFunction(name: "particle_fragment")

    let pipelineDescriptor = MTLRenderPipelineDescriptor()
    pipelineDescriptor.vertexFunction = vertexFunction
    pipelineDescriptor.fragmentFunction = fragmentFunction
    pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm

    // Enable blending for particle effects
    pipelineDescriptor.colorAttachments[0].isBlendingEnabled = true
    pipelineDescriptor.colorAttachments[0].rgbBlendOperation = .add
    pipelineDescriptor.colorAttachments[0].alphaBlendOperation = .add
    pipelineDescriptor.colorAttachments[0].sourceRGBBlendFactor = .sourceAlpha
    pipelineDescriptor.colorAttachments[0].sourceAlphaBlendFactor = .sourceAlpha
    pipelineDescriptor.colorAttachments[0].destinationRGBBlendFactor = .oneMinusSourceAlpha
    pipelineDescriptor.colorAttachments[0].destinationAlphaBlendFactor = .oneMinusSourceAlpha

    do {
      renderPipelineState = try device.makeRenderPipelineState(descriptor: pipelineDescriptor)
    } catch {
      print("Failed to create render pipeline state: \(error)")
    }
  }

  private func generateParticlesFromCounties() {
    guard let engine = particleEngine else { return }

    for county in counties {
      guard let totalChildren = county["totalChildren"] as? Int,
            let lat = county["lat"] as? Double,
            let lng = county["lng"] as? Double,
            let fips = county["fips"] as? String else {
        continue
      }

      // Generate particles based on child count
      // PRIVACY: Particles are random within county bounds, NOT real locations
      let particleCount = min(totalChildren / 10, 500) // Scale for performance

      // Convert lat/lng to normalized screen coordinates
      let normalizedLat = Float((lat - 41.6) / (47.5 - 41.6)) // Michigan bounds
      let normalizedLng = Float((lng + 90.5) / (-82.1 + 90.5))

      engine.generateParticles(
        count: particleCount,
        centerX: normalizedLng,
        centerY: 1.0 - normalizedLat, // Flip Y for screen coordinates
        spread: 0.05, // Spread within county
        countyFIPS: fips
      )
    }

    print("Generated particles for \(counties.count) counties")
  }

  @objc
  func highlightCounty(_ viewTag: NSNumber, fips: String) {
    selectedCountyFIPS = fips
    particleEngine?.highlightCounty(fips: fips)
    print("Highlighted county: \(fips)")
  }

  @objc
  func cleanup(_ viewTag: NSNumber) {
    particleEngine?.cleanup()
    particleEngine = nil
    renderPipelineState = nil
    commandQueue = nil
    metalDevice = nil
    print("MapRenderer cleaned up")
  }

  // MARK: - Render

  func render(to drawable: CAMetalDrawable, commandBuffer: MTLCommandBuffer) {
    guard let renderPipelineState = renderPipelineState,
          let particleEngine = particleEngine else {
      return
    }

    let renderPassDescriptor = MTLRenderPassDescriptor()
    renderPassDescriptor.colorAttachments[0].texture = drawable.texture
    renderPassDescriptor.colorAttachments[0].loadAction = .clear
    renderPassDescriptor.colorAttachments[0].clearColor = MTLClearColor(
      red: 0.95, green: 0.97, blue: 1.0, alpha: 1.0
    )
    renderPassDescriptor.colorAttachments[0].storeAction = .store

    guard let renderEncoder = commandBuffer.makeRenderCommandEncoder(
      descriptor: renderPassDescriptor
    ) else {
      return
    }

    renderEncoder.setRenderPipelineState(renderPipelineState)

    // Render particles
    particleEngine.render(encoder: renderEncoder)

    renderEncoder.endEncoding()
  }
}
