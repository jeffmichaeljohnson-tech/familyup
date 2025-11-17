# FamilyUp iOS - React Native + Metal Graphics

> Michigan Foster Care Awareness Platform - High-Performance iOS App

## Architecture

### Technology Stack

- **React Native 0.73**: Cross-platform mobile framework
- **Metal API**: GPU-accelerated graphics rendering
- **Swift 5+**: Native iOS modules
- **Objective-C**: React Native bridge
- **TypeScript**: Type-safe application code
- **CocoaPods**: iOS dependency management
- **Fastlane**: Automated deployment to TestFlight

### Metal Graphics Pipeline

The iOS app uses Metal API for cutting-edge visualization:

1. **ParticleEngine.swift**: GPU particle system rendering thousands of particles
2. **MapRenderer.swift**: Metal-based map renderer with county visualization
3. **Particle.metal**: Vertex and fragment shaders for particle effects
4. **CountyGlow.metal**: Post-processing effects for county highlights

## Privacy Architecture (CRITICAL)

### Zero Tracking Guarantee

FamilyUp implements privacy-first design:

#### What We DON'T Collect:
- ❌ NO location tracking (NSLocation* keys intentionally omitted)
- ❌ NO user data collection
- ❌ NO analytics or crash reporting with PII
- ❌ NO advertising SDKs
- ❌ NO user accounts or profiles
- ❌ NO device identifiers

#### What We DO Show:
- ✅ Aggregate county-level statistics only
- ✅ Publicly available DHHS data
- ✅ Minimum 5 children per county (de-identification threshold)
- ✅ Source: Michigan DHHS, AFCARS FY 2023

#### Compliance:
- ✅ COPPA compliant (no data on children under 13)
- ✅ FERPA compliant (no educational records)
- ✅ HIPAA compliant (no health information)
- ✅ Michigan Child Protection Law compliant

#### App Store Privacy Label:
**"Data Not Collected"**

### Privacy Enforcement

The `PrivacyManager.swift` module enforces privacy at runtime:

```swift
// Validates all data is aggregate county-level only
func validateCountyData(_ data: [[String: Any]]) -> Bool

// Generates privacy report for App Store submission
func generateAppStorePrivacyReport() -> String

// Audits app for privacy compliance
func auditPrivacyCompliance() -> [String: Any]
```

## Project Structure

```
familyup/
├── mobile/                          # React Native mobile app
│   ├── src/
│   │   ├── App.tsx                 # Main app component
│   │   ├── components/
│   │   │   ├── MapView.tsx         # Metal-accelerated map
│   │   │   └── StatisticsPanel.tsx # Stats sidebar
│   │   ├── screens/
│   │   │   └── HomeScreen.tsx      # Main screen
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript definitions
│   │   └── data/
│   │       └── countyData.ts       # County statistics
│   └── index.js                    # Entry point
│
├── ios/                             # iOS native code
│   ├── FamilyUp/
│   │   ├── AppDelegate.h/m         # iOS app delegate
│   │   ├── main.m                  # iOS entry point
│   │   ├── Info.plist              # Privacy settings (CRITICAL)
│   │   ├── MapRenderer.swift       # Metal map renderer
│   │   ├── ParticleEngine.swift    # GPU particle system
│   │   ├── PrivacyManager.swift    # Privacy enforcement
│   │   ├── RNBridge.m              # React Native bridge
│   │   └── Shaders/
│   │       ├── Particle.metal      # Particle shader
│   │       └── CountyGlow.metal    # Glow effect shader
│   └── Podfile                     # CocoaPods dependencies
│
├── fastlane/                        # Automated deployment
│   ├── Fastfile                    # Deployment lanes
│   └── Appfile                     # App configuration
│
├── scripts/
│   ├── build-ios.sh                # iOS build script
│   └── deploy-testflight.sh        # TestFlight deployment
│
├── package.mobile.json              # React Native dependencies
├── metro.config.js                  # React Native bundler
└── babel.config.js                  # Babel configuration
```

## Setup Instructions

### Prerequisites

1. **macOS** with Xcode 14+ installed
2. **Node.js** 18+ installed
3. **CocoaPods** installed: `sudo gem install cocoapods`
4. **Fastlane** installed: `sudo gem install fastlane`
5. **Apple Developer** account with App Store Connect access

### Installation

```bash
# 1. Install npm dependencies
npm install

# 2. Install CocoaPods dependencies
cd ios && pod install && cd ..

# 3. Set environment variables
export APPLE_ID="your.email@apple.com"
export TEAM_ID="YOUR_TEAM_ID"
export ITC_PROVIDER="YOUR_PROVIDER_ID"  # Optional
```

### Development

```bash
# Run on iOS simulator
npm run ios

# Run on physical device
npm run ios:device

# Start Metro bundler
npm start
```

## Build & Deployment

### Local Build

```bash
# Standard build
./scripts/build-ios.sh

# Clean build (recommended for first build)
./scripts/build-ios.sh --clean

# Build for simulator
./scripts/build-ios.sh --simulator
```

### TestFlight Deployment

```bash
# Full deployment (internal + external beta)
./scripts/deploy-testflight.sh

# Internal testers only (skip App Review)
./scripts/deploy-testflight.sh --internal-only
```

### Using Fastlane Directly

```bash
cd ios

# Deploy to TestFlight
fastlane beta

# Internal testers only
fastlane internal

# Run privacy audit
fastlane privacy_audit

# Build without uploading
fastlane build_only
```

## Privacy Audit

Before every deployment, run the privacy audit:

```bash
cd ios && fastlane privacy_audit
```

This checks for:
- ✅ No location tracking keys in Info.plist
- ✅ No analytics frameworks in Podfile
- ✅ No advertising SDKs
- ✅ Privacy-first compliance

**The deployment script automatically runs this audit and BLOCKS deployment if privacy violations are detected.**

## TestFlight Setup

### Beta Testing Groups

1. **Internal Team**: Immediate access, no App Review required
2. **Beta Testers**: External testers, requires App Review approval

### Inviting Testers

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to: TestFlight > FamilyUp
3. Add testers to appropriate groups
4. Testers receive email with TestFlight download link

### App Review for External Testing

External beta testers require App Review approval. The deployment script includes comprehensive notes for reviewers:

- Privacy policy explanation
- No tracking justification
- Data source citation
- Feature testing instructions

## Metal Graphics Performance

### Optimization Tips

1. **Particle Count**: Adjust in `ParticleEngine.swift`
   ```swift
   let particleCount = min(totalChildren / 10, 500)
   ```

2. **Quality Settings**: Configure in `MapView.tsx`
   ```typescript
   quality="high"  // Options: ultra, high, medium, low
   ```

3. **Enable/Disable Effects**:
   ```typescript
   enableParticles={true}
   enableGlow={true}
   ```

### Performance Metrics

Target: **60 FPS** on iPhone 12+
- Particles: Up to 10,000 simultaneous
- Metal API: Hardware-accelerated rendering
- Optimizations: Instanced rendering, efficient memory management

## Troubleshooting

### Build Issues

**"Metal is not supported on this device"**
- Metal requires iOS 14+ and A7 chip or newer
- Simulators: Use iPhone 12+ simulators for Metal support

**"CocoaPods dependencies not found"**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**"No provisioning profile found"**
- Ensure you're logged into Xcode with Apple ID
- Automatic signing is enabled in Xcode project settings

### TestFlight Issues

**"Build processing takes too long"**
- Normal processing time: 10-30 minutes
- Check App Store Connect for status

**"Privacy violation detected"**
- Run `fastlane privacy_audit`
- Review Info.plist for location keys
- Check Podfile for analytics frameworks

### Runtime Issues

**"Particles not rendering"**
- Check device supports Metal (iOS 14+, A7+)
- Review Metal shader compilation in Xcode console
- Verify `enableParticles={true}` in MapView

## App Store Submission

### Privacy Nutrition Label

When submitting to App Store, use these settings:

**Data Collection**: None
- ❌ Contact Info
- ❌ Location
- ❌ Identifiers
- ❌ Usage Data
- ❌ Diagnostics

**Tracking**: No
- ❌ Does not track users

**Data Linked to User**: None
**Data Not Linked to User**: None

### App Description (Template)

```
FamilyUp - Michigan Foster Care Awareness

Dramatize the vast number of children in Michigan's foster care system to increase awareness and drive adoptions.

PRIVACY FIRST:
• NO location tracking
• NO data collection
• Aggregate county statistics only
• Fully compliant with COPPA, FERPA, HIPAA

FEATURES:
• Interactive Michigan map
• Real-time county statistics
• Beautiful Metal graphics
• Contact MARE directly

Every child deserves a loving home. 💙
```

### Keywords

foster care, adoption, michigan, children, families, mare, dhhs, social services, community, awareness

## Support

### Documentation
- React Native: https://reactnative.dev
- Metal: https://developer.apple.com/metal
- Fastlane: https://docs.fastlane.tools
- TestFlight: https://developer.apple.com/testflight

### Contact
- Support: support@familyup.org
- MARE: 1-800-589-MARE (6273)

## License

Copyright © 2025 FamilyUp. All rights reserved.

Built with privacy, compassion, and cutting-edge technology.
