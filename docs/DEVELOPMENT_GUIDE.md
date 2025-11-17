# Development Guide - Michigan Foster Care Map

## Purpose

This guide establishes coding standards, best practices, and development workflows for the Michigan Foster Care Map project. Following these guidelines ensures consistency, maintainability, and high quality across the codebase.

---

## Legal Compliance Standards

### Project Mission & Legal Framework

This application exists to **dramatize the vast number of children in foster care** while maintaining absolute compliance with child privacy and protection laws. Every line of code must respect these dual imperatives: showing the scale of need while protecting individual children's identities.

### Federal Law Compliance

#### COPPA (Children's Online Privacy Protection Act)

```typescript
// ✅ GOOD - No PII collection from anyone
interface AnalyticsEvent {
  eventType: 'map_interaction' | 'filter_change' | 'info_view';
  timestamp: Date;
  countyFIPS?: string; // Geographic only, no user data
  aggregateMetric?: number;
}

// ❌ BAD - Never collect this
interface ProhibitedData {
  userName: string;        // ❌ No names
  email: string;           // ❌ No emails
  ipAddress: string;       // ❌ No IP addresses
  deviceId: string;        // ❌ No device IDs
  userLocation: {          // ❌ No user locations
    lat: number;
    lng: number;
  };
}
```

**COPPA Requirements:**
- No data collection from users under 13 (or anyone)
- No cookies except essential functionality
- No third-party analytics that track users
- No registration or login systems
- No comments or user-generated content

#### FERPA (Family Educational Rights and Privacy Act)

```typescript
// ✅ GOOD - Aggregate education statistics only
interface CountyEducationStats {
  countyFIPS: string;
  totalSchoolAgeChildren: number; // Aggregate only
  percentageInPublicSchool: number; // Statistical average
  educationalSupportPrograms: string[]; // Available programs, not individual data
}

// ❌ BAD - Never include individual education records
interface ProhibitedEducationData {
  childName: string;           // ❌ No student names
  schoolName: string;          // ❌ No specific schools
  gradeLevel: string;          // ❌ No individual grades
  specialEducationStatus: boolean; // ❌ No IEP/504 data
  attendanceRecord: any;       // ❌ No attendance records
}
```

**FERPA Compliance:**
- Only aggregate statistics across entire counties
- No individual student information
- No school-specific data (use county-wide only)
- No educational records or assessments

#### HIPAA (Health Insurance Portability and Accountability Act)

```typescript
// ✅ GOOD - Aggregate health statistics only
interface CountyHealthStats {
  countyFIPS: string;
  percentageWithMedicalCoverage: number; // Aggregate percentage
  commonHealthServices: string[]; // Available services, not usage
  healthcareProviders: number; // Count of providers
}

// ❌ BAD - Never include protected health information
interface ProhibitedHealthData {
  medicalHistory: any;         // ❌ No medical records
  medications: string[];       // ❌ No prescription data
  diagnoses: string[];         // ❌ No health conditions
  healthInsuranceInfo: any;    // ❌ No insurance details
  healthcareProviderNames: string[]; // ❌ No provider names
}
```

**HIPAA Compliance:**
- No protected health information (PHI)
- No medical records or history
- No individually identifiable health data
- Aggregate statistics only (county-wide percentages)

#### ADA (Americans with Disabilities Act)

```typescript
// ✅ GOOD - Accessible design patterns
const AccessibleMapMarker: React.FC<MarkerProps> = ({ county }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${county.name}: ${county.totalChildren} children in foster care`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCountyClick(county);
        }
      }}
    >
      <MarkerIcon aria-hidden="true" />
    </div>
  );
};

// ✅ GOOD - Screen reader friendly announcements
const AnnounceLiveRegion: React.FC = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only" // Visually hidden but readable by screen readers
    >
      {message}
    </div>
  );
};
```

**ADA Compliance Requirements:**
- WCAG 2.1 Level AA compliance minimum
- Keyboard navigation for all interactive elements
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Alternative text for all images and visualizations
- No content that flashes more than 3 times per second
- Resizable text up to 200% without loss of functionality

### Michigan State Law Compliance

#### Child Protection Law (MCL 722.621)

```typescript
// ✅ GOOD - Aggregate data protects individual identities
interface CountyData {
  fips: string;
  name: string;
  totalChildren: number; // Aggregate count only
  ageGroupDistribution: {
    '0-5': number;    // Percentages, not individual children
    '6-12': number;
    '13-17': number;
  };
  // No individual child information whatsoever
}

// ❌ PROHIBITED - Never include this data
interface ProhibitedChildData {
  childFirstName: string;      // ❌ No names or initials
  childLastName: string;       // ❌ No names or initials
  dateOfBirth: Date;           // ❌ No birthdates
  caseNumber: string;          // ❌ No case identifiers
  fosterParentInfo: any;       // ❌ No foster family data
  reasonForCare: string;       // ❌ No case details
  address: string;             // ❌ No addresses
  schoolName: string;          // ❌ No schools
  exactLocation: GeoPoint;     // ❌ No precise locations
}
```

**MCL 722.621 Requirements:**
- Complete anonymity of all children in care
- No identifying information in any form
- Aggregate county-level data only
- No data that could lead to identification
- Mandatory reporting of any data breach

#### Michigan Data Privacy Act

```typescript
// ✅ GOOD - No data collection = no privacy concerns
const PrivacyCompliantComponent: React.FC = () => {
  // Only display aggregate public data
  const [countyStats] = useState<CountyData[]>(AGGREGATE_COUNTY_DATA);

  // No cookies, no tracking, no localStorage of user data
  // Analytics must be aggregate-only and privacy-preserving

  return <MapVisualization data={countyStats} />;
};

// ✅ GOOD - If analytics needed, use privacy-preserving approach
const trackAggregateInteraction = (eventType: string) => {
  // Only track what users interact with, not who they are
  // No user identification, no session tracking
  logAggregateEvent({
    type: eventType,
    timestamp: Date.now(),
    // No user ID, no session ID, no IP address
  });
};
```

**Michigan Data Privacy Requirements:**
- No collection of personal data
- No sale or sharing of any data
- Clear privacy policy
- No behavioral tracking
- No cross-site tracking

#### Foster Care Confidentiality (MCL 722.954)

```typescript
// ✅ GOOD - Statistical representation only
interface FosterCareStats {
  totalCounties: number;
  totalChildrenInCare: number;     // Statewide total
  averagePerCounty: number;        // Statistical average
  countyBreakdown: CountyAggregate[]; // Aggregate by county
}

// ❌ PROHIBITED - No case-specific information
interface ProhibitedFosterCareData {
  caseFiles: any;                  // ❌ No case records
  placementHistory: any;           // ❌ No placement data
  familyInformation: any;          // ❌ No family details
  courtRecords: any;               // ❌ No legal records
  socialWorkerNotes: any;          // ❌ No case notes
  visitationSchedules: any;        // ❌ No scheduling data
}
```

**MCL 722.954 Requirements:**
- No disclosure of foster care case information
- No identification of children in care
- No identification of foster families
- Aggregate statistics only
- No data that could compromise confidentiality

### Privacy-First Development Principles

#### Core Principles

1. **Aggregate Data Only**: Display county-level totals, never individual records
2. **No User Tracking**: No analytics that identify or track users
3. **No Location Tracking**: Display county data, never user locations
4. **Minimal Data**: Only collect what's absolutely necessary (none, in our case)
5. **Public Data Only**: Use only publicly available aggregate statistics

#### Data Collection Rules

```typescript
// ✅ ALLOWED - Public aggregate statistics
interface AllowedDataSources {
  michiganDHHSPublicReports: boolean;  // ✅ Official public statistics
  countyLevelAggregates: boolean;      // ✅ County totals
  statewideTrends: boolean;            // ✅ Historical trends
  publicPolicyDocuments: boolean;      // ✅ Published reports
}

// ❌ PROHIBITED - Any individual or identifying data
interface ProhibitedDataSources {
  individualCaseRecords: boolean;      // ❌ Never
  schoolRecords: boolean;              // ❌ Never
  medicalRecords: boolean;             // ❌ Never
  courtRecords: boolean;               // ❌ Never
  socialServiceRecords: boolean;       // ❌ Never
  userData: boolean;                   // ❌ Never
  userLocationData: boolean;           // ❌ Never
  userBehaviorData: boolean;           // ❌ Never
}
```

#### No PII Collection Rules

```typescript
// ✅ GOOD - Application-wide PII prohibition
const PII_COLLECTION_POLICY = {
  names: false,              // ❌ No names
  emails: false,             // ❌ No emails
  phoneNumbers: false,       // ❌ No phone numbers
  addresses: false,          // ❌ No addresses
  socialSecurity: false,     // ❌ No SSNs
  birthDates: false,         // ❌ No birthdates
  photos: false,             // ❌ No photographs
  biometrics: false,         // ❌ No biometric data
  ipAddresses: false,        // ❌ No IP addresses
  deviceIds: false,          // ❌ No device identifiers
  cookies: false,            // ❌ No tracking cookies (only essential)
  userLocation: false,       // ❌ No user geolocation
  behavioralData: false,     // ❌ No behavioral tracking
} as const;

// Code review checklist before every commit
const verifyNoPII = (code: string): boolean => {
  const piiPatterns = [
    /email/i, /phone/i, /address/i, /ssn/i,
    /birthdate/i, /dob/i, /name.*input/i,
    /user.*location/i, /geolocation/i,
    /track.*user/i, /analytics.*user/i,
  ];

  return !piiPatterns.some(pattern => pattern.test(code));
};
```

#### No Exact Location Rules

```typescript
// ✅ GOOD - County-level geography only
interface GeographicData {
  countyFIPS: string;          // County identifier
  countyName: string;          // County name
  countyBoundary: GeoJSON;     // County polygon
  countyCentroid: {            // County center point for marker
    lat: number;
    lng: number;
  };
}

// ❌ PROHIBITED - No precise locations
interface ProhibitedLocationData {
  streetAddress: string;       // ❌ No street addresses
  zipCode: string;             // ❌ No ZIP codes (too specific)
  coordinates: {               // ❌ No exact coordinates
    lat: number;
    lng: number;
  };
  neighborhood: string;        // ❌ No neighborhood names
  fosterHomeLocation: any;     // ❌ No home locations
  schoolLocation: any;         // ❌ No school locations
  userLocation: any;           // ❌ No user location tracking
}

// ✅ GOOD - Distributing child icons within county boundaries
const distributeIconsWithinCounty = (
  totalChildren: number,
  countyBoundary: GeoJSON
): IconPosition[] => {
  // Icons are randomly distributed within county boundary
  // This shows scale without revealing any actual locations
  return generateRandomPointsInPolygon(countyBoundary, totalChildren);
};

// ❌ BAD - Never use actual addresses or precise locations
const getNeverDoThis = () => {
  // ❌ Never fetch or display actual foster home locations
  // ❌ Never use street-level mapping
  // ❌ Never show neighborhood-specific data
};
```

### Legal Compliance Verification Checklist

Before committing any code, verify:

```typescript
interface ComplianceChecklist {
  // Data Privacy
  noPIICollected: boolean;              // ✅ Must be true
  noUserTracking: boolean;              // ✅ Must be true
  noLocationTracking: boolean;          // ✅ Must be true
  aggregateDataOnly: boolean;           // ✅ Must be true

  // Federal Compliance
  coppaCompliant: boolean;              // ✅ Must be true
  ferpaCompliant: boolean;              // ✅ Must be true
  hipaaCompliant: boolean;              // ✅ Must be true
  adaCompliant: boolean;                // ✅ Must be true

  // Michigan State Compliance
  mcl722621Compliant: boolean;          // ✅ Must be true (Child Protection)
  mcl722954Compliant: boolean;          // ✅ Must be true (Foster Care Confidentiality)
  michiganPrivacyActCompliant: boolean; // ✅ Must be true

  // Documentation
  privacyPolicyUpdated: boolean;        // ✅ Must be true
  legalReviewCompleted: boolean;        // ✅ Must be true for major features
}

// Run this check before every commit
const verifyLegalCompliance = (): ComplianceChecklist => {
  return {
    noPIICollected: verifyNoPIIInCode(),
    noUserTracking: verifyNoTrackingCode(),
    noLocationTracking: verifyNoLocationTracking(),
    aggregateDataOnly: verifyAggregateDataOnly(),
    coppaCompliant: verifyCOPPA(),
    ferpaCompliant: verifyFERPA(),
    hipaaCompliant: verifyHIPAA(),
    adaCompliant: verifyADA(),
    mcl722621Compliant: verifyChildProtection(),
    mcl722954Compliant: verifyFosterCareConfidentiality(),
    michiganPrivacyActCompliant: verifyMichiganPrivacy(),
    privacyPolicyUpdated: checkPrivacyPolicy(),
    legalReviewCompleted: checkLegalReview(),
  };
};
```

### Emergency Response Protocol

If any privacy violation or data breach is discovered:

1. **Immediate Response**
   - Stop all deployments immediately
   - Take affected systems offline if necessary
   - Document the incident completely

2. **Legal Notification**
   - Contact legal counsel immediately
   - Notify Michigan DHHS if child data involved
   - File required breach notifications per MCL 722.621

3. **Remediation**
   - Fix the vulnerability
   - Review all related code
   - Conduct security audit
   - Update policies and procedures

4. **Prevention**
   - Conduct post-mortem analysis
   - Update development guidelines
   - Implement additional safeguards
   - Train team on lessons learned

---

## Code Style & Standards

### TypeScript Standards

#### Always Use Types

```typescript
// ✅ GOOD - Explicit types
function calculateTotal(children: number, rate: number): number {
  return children * rate;
}

interface UserData {
  name: string;
  email: string;
  age?: number;
}

// ❌ BAD - No types
function calculateTotal(children, rate) {
  return children * rate;
}
```

#### Avoid `any` Type

```typescript
// ✅ GOOD - Specific types
function processCountyData(data: CountyData[]): void {
  data.forEach(county => {
    console.log(county.name);
  });
}

// ❌ BAD - Using any
function processCountyData(data: any): void {
  data.forEach((county: any) => {
    console.log(county.name);
  });
}

// ✅ ACCEPTABLE - When truly unknown, use unknown
function handleResponse(response: unknown): void {
  if (isCountyData(response)) {
    console.log(response.name);
  }
}
```

#### Use Type Guards

```typescript
// ✅ GOOD - Type guards for runtime checks
function isCountyData(obj: unknown): obj is CountyData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'totalChildren' in obj
  );
}

function processData(data: unknown): void {
  if (isCountyData(data)) {
    // TypeScript knows data is CountyData here
    console.log(data.totalChildren);
  }
}
```

---

### React Best Practices

#### Functional Components Only

```typescript
// ✅ GOOD - Functional component with hooks
const CountyMarker: React.FC<CountyMarkerProps> = ({ county, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component content */}
    </div>
  );
};

// ❌ BAD - Class component (don't use)
class CountyMarker extends React.Component {
  // ...
}
```

#### Use Proper Hook Dependencies

```typescript
// ✅ GOOD - All dependencies listed
useEffect(() => {
  const fetchData = async () => {
    const data = await loadCountyData(countyId);
    setCounty(data);
  };
  fetchData();
}, [countyId]); // countyId is listed

// ❌ BAD - Missing dependency
useEffect(() => {
  const data = loadCountyData(countyId);
  setCounty(data);
}, []); // countyId should be here!
```

#### Memoize Expensive Computations

```typescript
// ✅ GOOD - Memoized calculation
const childIcons = useMemo(() => {
  return distributeAllChildren(counties, config);
}, [counties, config]);

// ❌ BAD - Recalculates on every render
const childIcons = distributeAllChildren(counties, config);
```

#### Use Callback for Event Handlers

```typescript
// ✅ GOOD - Memoized callback
const handleCountyClick = useCallback((county: CountyData) => {
  setSelectedCounty(county);
  onCountySelect?.(county);
}, [onCountySelect]);

// ❌ BAD - New function on every render
const handleCountyClick = (county: CountyData) => {
  setSelectedCounty(county);
  onCountySelect?.(county);
};
```

---

## iOS Development Standards

### React Native Coding Standards

#### Platform-Specific Code Organization

```typescript
// ✅ GOOD - Platform-specific file structure
components/
  Map/
    InteractiveMap.tsx           // Shared logic
    InteractiveMap.ios.tsx       // iOS-specific implementation
    InteractiveMap.android.tsx   // Android-specific implementation

// ✅ GOOD - Using Platform API
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 16,
    marginTop: Platform.select({
      ios: 44,      // Account for iOS status bar
      android: 0,
    }),
  },
});

// ✅ GOOD - Platform-specific components
const MapComponent = Platform.select({
  ios: () => require('./MapView.ios').MapView,
  android: () => require('./MapView.android').MapView,
})();
```

#### React Native Performance Best Practices

```typescript
// ✅ GOOD - Optimize list rendering
import { FlatList, VirtualizedList } from 'react-native';

const CountyList: React.FC<{ counties: CountyData[] }> = ({ counties }) => {
  const renderItem = useCallback(({ item }: { item: CountyData }) => (
    <CountyListItem county={item} />
  ), []);

  const keyExtractor = useCallback((item: CountyData) => item.fips, []);

  return (
    <FlatList
      data={counties}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};

// ✅ GOOD - Animated values for smooth performance
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

const AnimatedMarker: React.FC = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {/* Marker content */}
    </Animated.View>
  );
};

// ❌ BAD - Don't use ScrollView for large lists
const BadList = () => (
  <ScrollView>
    {counties.map(county => <Item key={county.fips} county={county} />)}
  </ScrollView>
);
```

#### TypeScript for React Native

```typescript
// ✅ GOOD - Type-safe navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  CountyDetail: { countyFIPS: string };
  About: undefined;
};

type CountyDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'CountyDetail'
>;

const CountyDetailScreen: React.FC<CountyDetailProps> = ({ route, navigation }) => {
  const { countyFIPS } = route.params;

  const navigateBack = () => {
    navigation.goBack();
  };

  return <View>{/* Screen content */}</View>;
};

// ✅ GOOD - Type-safe StyleSheet
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  icon: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
```

### Swift Native Module Guidelines

#### Creating Native Modules

```swift
// ✅ GOOD - Swift native module for Metal graphics
// ios/FamilyUpMapRenderer.swift

import Foundation
import MetalKit

@objc(FamilyUpMapRenderer)
class FamilyUpMapRenderer: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  // Expose method to JavaScript
  @objc
  func renderCountyLayer(
    _ countyData: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let device = MTLCreateSystemDefaultDevice() else {
      reject("METAL_ERROR", "Metal is not supported on this device", nil)
      return
    }

    // Perform Metal rendering
    DispatchQueue.global(qos: .userInitiated).async {
      do {
        let result = try self.performMetalRendering(
          device: device,
          countyData: countyData
        )
        resolve(result)
      } catch {
        reject("RENDER_ERROR", error.localizedDescription, error)
      }
    }
  }

  private func performMetalRendering(
    device: MTLDevice,
    countyData: NSDictionary
  ) throws -> [String: Any] {
    // Metal rendering implementation
    // Returns rendered texture data
    return ["textureId": "texture_123"]
  }
}

// ios/FamilyUpMapRenderer.m (Objective-C bridge)
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FamilyUpMapRenderer, NSObject)

RCT_EXTERN_METHOD(
  renderCountyLayer:(NSDictionary *)countyData
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

@end
```

#### Using Native Modules in TypeScript

```typescript
// ✅ GOOD - Type-safe native module interface
import { NativeModules } from 'react-native';

interface FamilyUpMapRendererInterface {
  renderCountyLayer(countyData: {
    fips: string;
    childCount: number;
    boundary: number[][];
  }): Promise<{ textureId: string }>;
}

const { FamilyUpMapRenderer } = NativeModules;
const renderer = FamilyUpMapRenderer as FamilyUpMapRendererInterface;

// Usage
const useMetalRenderer = (county: CountyData) => {
  const [textureId, setTextureId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const renderCounty = async () => {
      try {
        const result = await renderer.renderCountyLayer({
          fips: county.fips,
          childCount: county.totalChildren,
          boundary: county.boundary.coordinates,
        });
        setTextureId(result.textureId);
      } catch (err) {
        setError(err as Error);
      }
    };

    renderCounty();
  }, [county]);

  return { textureId, error };
};
```

### Metal Graphics Best Practices

#### Metal Shader Implementation

```swift
// ✅ GOOD - Metal shader for child icon rendering
// ios/Shaders/ChildIconShader.metal

#include <metal_stdlib>
using namespace metal;

// Vertex structure
struct VertexIn {
    float2 position [[attribute(0)]];
    float2 texCoord [[attribute(1)]];
};

struct VertexOut {
    float4 position [[position]];
    float2 texCoord;
    float opacity;
};

// Vertex shader
vertex VertexOut childIconVertexShader(
    VertexIn in [[stage_in]],
    constant float4x4& mvpMatrix [[buffer(1)]],
    constant float& opacity [[buffer(2)]]
) {
    VertexOut out;
    out.position = mvpMatrix * float4(in.position, 0.0, 1.0);
    out.texCoord = in.texCoord;
    out.opacity = opacity;
    return out;
}

// Fragment shader
fragment float4 childIconFragmentShader(
    VertexOut in [[stage_in]],
    texture2d<float> iconTexture [[texture(0)]],
    sampler iconSampler [[sampler(0)]]
) {
    float4 color = iconTexture.sample(iconSampler, in.texCoord);
    color.a *= in.opacity;
    return color;
}
```

#### Metal Renderer Swift Class

```swift
// ✅ GOOD - Efficient Metal renderer
// ios/Renderers/CountyMapMetalRenderer.swift

import MetalKit

class CountyMapMetalRenderer: NSObject {
    private var device: MTLDevice!
    private var commandQueue: MTLCommandQueue!
    private var pipelineState: MTLRenderPipelineState!

    // Buffer pool for efficient memory management
    private var bufferPool: [MTLBuffer] = []
    private let maxBufferCount = 3

    override init() {
        super.init()
        setupMetal()
    }

    private func setupMetal() {
        guard let device = MTLCreateSystemDefaultDevice() else {
            fatalError("Metal is not supported")
        }

        self.device = device
        self.commandQueue = device.makeCommandQueue()

        // Load shaders
        guard let library = device.makeDefaultLibrary(),
              let vertexFunction = library.makeFunction(name: "childIconVertexShader"),
              let fragmentFunction = library.makeFunction(name: "childIconFragmentShader") else {
            fatalError("Failed to load shader functions")
        }

        // Create pipeline
        let pipelineDescriptor = MTLRenderPipelineDescriptor()
        pipelineDescriptor.vertexFunction = vertexFunction
        pipelineDescriptor.fragmentFunction = fragmentFunction
        pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm

        // Enable blending for transparency
        pipelineDescriptor.colorAttachments[0].isBlendingEnabled = true
        pipelineDescriptor.colorAttachments[0].rgbBlendOperation = .add
        pipelineDescriptor.colorAttachments[0].alphaBlendOperation = .add
        pipelineDescriptor.colorAttachments[0].sourceRGBBlendFactor = .sourceAlpha
        pipelineDescriptor.colorAttachments[0].sourceAlphaBlendFactor = .sourceAlpha
        pipelineDescriptor.colorAttachments[0].destinationRGBBlendFactor = .oneMinusSourceAlpha
        pipelineDescriptor.colorAttachments[0].destinationAlphaBlendFactor = .oneMinusSourceAlpha

        do {
            pipelineState = try device.makeRenderPipelineState(descriptor: pipelineDescriptor)
        } catch {
            fatalError("Failed to create pipeline state: \(error)")
        }
    }

    func renderChildIcons(
        iconPositions: [SIMD2<Float>],
        viewportSize: SIMD2<Float>,
        drawable: CAMetalDrawable
    ) {
        guard let commandBuffer = commandQueue.makeCommandBuffer(),
              let renderPassDescriptor = createRenderPassDescriptor(drawable: drawable),
              let renderEncoder = commandBuffer.makeRenderCommandEncoder(
                descriptor: renderPassDescriptor
              ) else {
            return
        }

        renderEncoder.setRenderPipelineState(pipelineState)

        // Render each icon
        for position in iconPositions {
            // Create transformation matrix
            let mvpMatrix = createMVPMatrix(
                position: position,
                viewportSize: viewportSize
            )

            // Set uniforms
            renderEncoder.setVertexBytes(
                &mvpMatrix,
                length: MemoryLayout<float4x4>.size,
                index: 1
            )

            // Draw icon
            renderEncoder.drawPrimitives(
                type: .triangleStrip,
                vertexStart: 0,
                vertexCount: 4
            )
        }

        renderEncoder.endEncoding()
        commandBuffer.present(drawable)
        commandBuffer.commit()
    }

    private func createMVPMatrix(
        position: SIMD2<Float>,
        viewportSize: SIMD2<Float>
    ) -> float4x4 {
        // Create model-view-projection matrix
        // Implementation details...
        return float4x4(1.0) // Placeholder
    }

    private func createRenderPassDescriptor(
        drawable: CAMetalDrawable
    ) -> MTLRenderPassDescriptor {
        let descriptor = MTLRenderPassDescriptor()
        descriptor.colorAttachments[0].texture = drawable.texture
        descriptor.colorAttachments[0].loadAction = .clear
        descriptor.colorAttachments[0].clearColor = MTLClearColor(
            red: 0.95,
            green: 0.95,
            blue: 0.97,
            alpha: 1.0
        )
        descriptor.colorAttachments[0].storeAction = .store
        return descriptor
    }
}
```

### TestFlight Deployment Process

#### Pre-Deployment Checklist

```typescript
// ✅ GOOD - Deployment configuration
// ios/deployment-checklist.ts

interface DeploymentChecklist {
  // Legal Compliance
  privacyPolicyUpdated: boolean;
  noPIICollection: boolean;
  aggregateDataOnly: boolean;

  // iOS Specific
  appStoreMetadata: {
    privacyLabel: boolean;        // Privacy nutrition labels configured
    ageRating: '4+' | '9+' | '12+' | '17+';
    dataCollectionDisclosure: boolean;
  };

  // Testing
  testFlightBetaTesting: boolean;
  crashlyticsIntegrated: boolean;
  performanceTesting: boolean;

  // Build Configuration
  releaseScheme: boolean;
  productionEnvironment: boolean;
  debugSymbolsUploaded: boolean;
}

const verifyDeploymentReadiness = (): DeploymentChecklist => {
  return {
    privacyPolicyUpdated: true,
    noPIICollection: true,
    aggregateDataOnly: true,
    appStoreMetadata: {
      privacyLabel: true,
      ageRating: '4+', // No sensitive content
      dataCollectionDisclosure: true,
    },
    testFlightBetaTesting: true,
    crashlyticsIntegrated: true,
    performanceTesting: true,
    releaseScheme: true,
    productionEnvironment: true,
    debugSymbolsUploaded: true,
  };
};
```

#### TestFlight Build Process

```bash
# ✅ GOOD - TestFlight deployment script
# scripts/deploy-testflight.sh

#!/bin/bash
set -e

echo "Starting TestFlight deployment..."

# 1. Verify legal compliance
npm run verify:legal-compliance

# 2. Run all tests
npm run test:ios
npm run test:integration

# 3. Verify no PII collection
npm run verify:no-pii

# 4. Update version and build number
cd ios
fastlane bump_version

# 5. Build for release
fastlane ios build_release

# 6. Upload to TestFlight
fastlane ios beta

# 7. Submit for external testing (requires manual approval)
echo "Build uploaded to TestFlight"
echo "Review privacy compliance before external testing"

# 8. Upload debug symbols
fastlane upload_symbols_to_crashlytics

echo "TestFlight deployment complete"
```

#### Fastlane Configuration

```ruby
# ✅ GOOD - Fastlane configuration
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do

  desc "Bump version number"
  lane :bump_version do
    increment_version_number(
      bump_type: "patch",
      xcodeproj: "FamilyUp.xcodeproj"
    )
    increment_build_number(
      xcodeproj: "FamilyUp.xcodeproj"
    )
  end

  desc "Build release version"
  lane :build_release do
    # Ensure clean state
    clean_build_artifacts
    clear_derived_data

    # Update provisioning profiles
    match(type: "appstore", readonly: true)

    # Build
    build_app(
      scheme: "FamilyUp",
      configuration: "Release",
      export_method: "app-store",
      export_options: {
        provisioningProfiles: {
          "com.familyup.app" => "match AppStore com.familyup.app"
        }
      }
    )
  end

  desc "Upload to TestFlight"
  lane :beta do
    # Verify legal compliance before upload
    sh("npm run verify:legal-compliance")

    # Build if needed
    build_release unless File.exist?("FamilyUp.ipa")

    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: false,
      distribute_external: false, # Require manual approval
      notify_external_testers: false,
      changelog: "Latest updates with privacy enhancements",
      beta_app_description: "Michigan Foster Care Map - Showing the scale of children in need while respecting privacy",
      beta_app_feedback_email: "support@familyup.org",
      groups: ["Internal Testers"], # Start with internal only
      demo_account_required: false,
      privacy_policy_url: "https://familyup.org/privacy"
    )
  end

  desc "Upload debug symbols"
  lane :upload_symbols_to_crashlytics do
    upload_symbols_to_crashlytics(
      gsp_path: "./GoogleService-Info.plist",
      binary_path: "./Pods/FirebaseCrashlytics/upload-symbols"
    )
  end

  desc "Run tests"
  lane :test do
    run_tests(
      scheme: "FamilyUp",
      devices: ["iPhone 14 Pro", "iPad Pro (12.9-inch)"],
      code_coverage: true
    )
  end

end
```

#### App Store Privacy Labels

```typescript
// ✅ GOOD - Privacy label configuration
// App Store Connect privacy labels must reflect this:

const APP_PRIVACY_LABELS = {
  dataCollected: [],  // We collect NO data

  dataUsedToTrackYou: [],  // We do NOT track users

  dataLinkedToYou: [],  // We do NOT link data to users

  dataNotLinkedToYou: [
    // Only if we implement privacy-preserving analytics:
    {
      type: 'Product Interaction',
      purpose: 'Analytics',
      description: 'Aggregate usage statistics only, no user identification'
    }
  ],

  privacyPolicy: 'https://familyup.org/privacy',

  ageRating: '4+',  // Suitable for all ages

  termsOfUse: 'https://familyup.org/terms',
};

// Document for App Store submission
const APP_STORE_PRIVACY_DETAILS = `
This app shows aggregate statistics about children in foster care in Michigan.

DATA COLLECTION: NONE
- We do not collect any personal information
- We do not track user behavior
- We do not use cookies for tracking
- We do not collect location data from users
- We only display public aggregate statistics

PRIVACY COMPLIANCE:
- COPPA compliant (no data from children)
- FERPA compliant (no student data)
- HIPAA compliant (no health data)
- Michigan Child Protection Law compliant (MCL 722.621)
- Foster Care Confidentiality compliant (MCL 722.954)

DATA DISPLAYED:
- County-level aggregate statistics only
- Publicly available data from Michigan DHHS
- No individual child information
- No personally identifiable information
`;
```

---

### Component Organization

#### File Structure

```typescript
// ComponentName.tsx

// 1. Imports - grouped and organized
import React, { useState, useEffect, useMemo } from 'react';
import { Map, Marker } from 'react-leaflet';
import { CountyData } from '../../types';
import { getCountyColor } from '../../utils/colorScale';
import './ComponentName.css';

// 2. Types and Interfaces
interface ComponentNameProps {
  data: CountyData[];
  onSelect?: (county: CountyData) => void;
}

// 3. Constants (component-specific)
const DEFAULT_ZOOM = 7;
const MAX_MARKERS = 100;

// 4. Helper functions (if small, else in utils/)
function formatCountyName(name: string): string {
  return name.replace(' County', '');
}

// 5. Main component
export const ComponentName: React.FC<ComponentNameProps> = ({
  data,
  onSelect
}) => {
  // 5a. State
  const [selected, setSelected] = useState<CountyData | null>(null);
  
  // 5b. Memoized values
  const processedData = useMemo(
    () => data.map(d => ({ ...d, color: getCountyColor(d.totalChildren) })),
    [data]
  );
  
  // 5c. Effects
  useEffect(() => {
    console.log('Data changed', data.length);
  }, [data]);
  
  // 5d. Event handlers
  const handleClick = useCallback((county: CountyData) => {
    setSelected(county);
    onSelect?.(county);
  }, [onSelect]);
  
  // 5e. Render helpers (optional)
  const renderMarker = (county: CountyData) => (
    <Marker key={county.fips} position={[county.lat, county.lng]} />
  );
  
  // 5f. Main render
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

// 6. Default export (if needed)
export default ComponentName;
```

---

### Naming Conventions

#### Components

```typescript
// ✅ GOOD - PascalCase for components
const CountyMarker: React.FC = () => { };
const InteractiveMap: React.FC = () => { };
const StatCard: React.FC = () => { };

// ❌ BAD - Wrong casing
const countyMarker: React.FC = () => { };
const interactive_map: React.FC = () => { };
```

#### Variables and Functions

```typescript
// ✅ GOOD - camelCase for variables and functions
const totalChildren = 100;
const isLoading = true;
function calculateAverage() { }
function getCountyColor() { }

// ❌ BAD - Wrong casing
const TotalChildren = 100;
const is_loading = true;
function CalculateAverage() { }
```

#### Constants

```typescript
// ✅ GOOD - SCREAMING_SNAKE_CASE for true constants
const MAX_ZOOM_LEVEL = 12;
const MICHIGAN_CENTER_LAT = 44.3148;
const API_BASE_URL = 'https://api.example.com';

// ✅ ALSO GOOD - PascalCase for config objects
const MapConfig = {
  center: { lat: 44.3148, lng: -85.6024 },
  zoom: 7
};

// ❌ BAD - camelCase for constants
const maxZoomLevel = 12;
```

#### Types and Interfaces

```typescript
// ✅ GOOD - PascalCase, descriptive names
interface CountyData {
  name: string;
  totalChildren: number;
}

type MapFilters = {
  ageGroup: string;
  region?: string;
};

// ❌ BAD - vague names
interface Data {
  name: string;
}

type Filters = {
  a: string;
};
```

---

## File Organization

### Directory Structure Philosophy

- **Components** - UI building blocks
- **Utils** - Pure functions, no React dependencies
- **Hooks** - Custom React hooks
- **Types** - TypeScript definitions
- **Data** - Static data files
- **Styles** - Global styles and themes

### When to Create New Files

```typescript
// ✅ Create separate file when:
// - Component is 100+ lines
// - Component is used in multiple places
// - Logic is complex and testable independently

// ✅ Keep in same file when:
// - Component is < 50 lines and used once
// - Helper functions are tiny and specific
// - Types are only used in that component
```

---

## Error Handling

### Component Error Boundaries

```typescript
// ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong</h2>
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// ✅ GOOD - Proper error handling
async function loadCountyData(fips: string): Promise<CountyData> {
  try {
    const response = await fetch(`/api/counties/${fips}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!isCountyData(data)) {
      throw new Error('Invalid county data format');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load county data:', error);
    throw error; // Re-throw to let caller handle
  }
}

// Usage in component
const [county, setCounty] = useState<CountyData | null>(null);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loadCountyData(countyId);
      setCounty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }
  
  loadData();
}, [countyId]);
```

---

## Testing Guidelines

### Test File Organization

```
src/
├── components/
│   ├── Map/
│   │   ├── InteractiveMap.tsx
│   │   ├── InteractiveMap.test.tsx  ← Test file
│   │   └── InteractiveMap.css
```

### Test Structure

```typescript
// InteractiveMap.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveMap } from './InteractiveMap';
import { mockCountyData } from '../../test/mocks';

// Group related tests
describe('InteractiveMap', () => {
  // Test basic rendering
  describe('rendering', () => {
    it('should render with county data', () => {
      render(<InteractiveMap counties={mockCountyData} />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
    
    it('should show loading state initially', () => {
      render(<InteractiveMap counties={[]} isLoading />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
  
  // Test interactions
  describe('interactions', () => {
    it('should call onCountyClick when marker is clicked', () => {
      const handleClick = jest.fn();
      render(
        <InteractiveMap 
          counties={mockCountyData} 
          onCountyClick={handleClick}
        />
      );
      
      fireEvent.click(screen.getByTestId('county-marker-26163'));
      expect(handleClick).toHaveBeenCalledWith(mockCountyData[0]);
    });
  });
  
  // Test edge cases
  describe('edge cases', () => {
    it('should handle empty county array', () => {
      render(<InteractiveMap counties={[]} />);
      expect(screen.getByText(/no counties/i)).toBeInTheDocument();
    });
  });
});
```

### Test Coverage Goals

- **Utilities**: 100% coverage
- **Components**: 90%+ coverage
- **Hooks**: 95%+ coverage
- **Overall**: 90%+ coverage

### What to Test

```typescript
// ✅ DO TEST:
// - Component renders without errors
// - Component renders with different props
// - User interactions (clicks, hovers, form inputs)
// - Conditional rendering
// - Utility function outputs
// - Edge cases and error states

// ❌ DON'T TEST:
// - Implementation details
// - Third-party library internals
// - Trivial getters/setters
// - Styles/CSS (use visual regression instead)
```

---

## Performance Best Practices

### Avoid Unnecessary Re-renders

```typescript
// ✅ GOOD - Memoized component
const CountyMarker = React.memo<CountyMarkerProps>(({ county, color }) => {
  return (
    <Marker position={[county.lat, county.lng]} color={color} />
  );
});

// Add comparison function for complex props
const areEqual = (prev: CountyMarkerProps, next: CountyMarkerProps) => {
  return (
    prev.county.fips === next.county.fips &&
    prev.color === next.color
  );
};

const CountyMarker = React.memo(CountyMarkerComponent, areEqual);
```

### Lazy Load Heavy Components

```typescript
// ✅ GOOD - Lazy load routes
import { lazy, Suspense } from 'react';

const ProcessGuide = lazy(() => import('./components/Education/ProcessGuide'));
const FAQSection = lazy(() => import('./components/Education/FAQSection'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/process" element={<ProcessGuide />} />
        <Route path="/faq" element={<FAQSection />} />
      </Routes>
    </Suspense>
  );
}
```

### Debounce/Throttle Expensive Operations

```typescript
// ✅ GOOD - Debounced search
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const SearchInput: React.FC = () => {
  const [query, setQuery] = useState('');
  
  // Debounce expensive search operation
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      performSearch(value);
    }, 300),
    []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input value={query} onChange={handleChange} />;
};
```

---

## Accessibility (A11y) Guidelines

### Semantic HTML

```typescript
// ✅ GOOD - Semantic elements
<nav>
  <ul>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// ❌ BAD - Div soup
<div className="nav">
  <div className="list">
    <div className="item">
      <div onClick={goToAbout}>About</div>
    </div>
  </div>
</div>
```

### ARIA Labels

```typescript
// ✅ GOOD - Proper ARIA labels
<button
  aria-label="Close popup"
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>

<div role="region" aria-label="County statistics">
  <StatCard value={100} label="Total children" />
</div>

// Map with label
<div role="application" aria-label="Interactive Michigan county map">
  <Map />
</div>
```

### Keyboard Navigation

```typescript
// ✅ GOOD - Keyboard accessible
const CountyMarker: React.FC = ({ county, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(county);
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(county)}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${county.name}`}
    >
      {/* Marker content */}
    </div>
  );
};
```

### Color Contrast

```typescript
// ✅ GOOD - Check contrast ratios
// Use tools like WebAIM Contrast Checker

const colors = {
  // 4.5:1 ratio for normal text
  text: '#1f2937',      // Dark gray on white
  background: '#ffffff',
  
  // 3:1 ratio for large text (18px+ or 14px+ bold)
  heading: '#374151',
  
  // Interactive elements need good contrast
  link: '#2563eb',      // Blue with 4.5:1 on white
  linkHover: '#1e40af', // Darker blue
};
```

---

## Git Workflow

### Branch Naming

```bash
# Feature branches
feature/county-filter-panel
feature/advanced-search

# Bug fixes
bugfix/map-zoom-issue
bugfix/popup-not-closing

# Hot fixes (emergency production fixes)
hotfix/critical-data-error

# Documentation
docs/update-readme
docs/api-documentation
```

### Commit Messages

```bash
# Format: <type>: <description>

# Types:
# feat - New feature
# fix - Bug fix
# docs - Documentation
# style - Formatting, no code change
# refactor - Code restructuring
# test - Add/update tests
# chore - Maintenance tasks

# Examples:
git commit -m "feat: Add age group filter to sidebar"
git commit -m "fix: Correct boundary checking for Upper Peninsula counties"
git commit -m "docs: Update component API documentation"
git commit -m "refactor: Simplify distribution algorithm"
git commit -m "test: Add unit tests for colorScale utility"
git commit -m "chore: Update dependencies to latest versions"
```

### Pull Request Process

1. **Create feature branch** from `develop`
2. **Write code** following these guidelines
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run linter** and fix issues: `npm run lint`
6. **Run tests**: `npm test`
7. **Create PR** with descriptive title and description
8. **Request review** from team member
9. **Address feedback**
10. **Merge** after approval

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

---

## Code Review Checklist

### For Reviewers

```markdown
## Code Quality
- [ ] Code is readable and well-structured
- [ ] No unnecessary complexity
- [ ] Proper error handling
- [ ] No hardcoded values (use constants/config)
- [ ] No console.logs in production code

## TypeScript
- [ ] Proper types used (no `any`)
- [ ] Type definitions are accurate
- [ ] No TypeScript errors

## React
- [ ] Components are functional (no classes)
- [ ] Hooks used correctly
- [ ] Dependencies arrays are correct
- [ ] No unnecessary re-renders
- [ ] PropTypes or TypeScript types defined

## Testing
- [ ] Tests included for new features
- [ ] Edge cases covered
- [ ] Tests pass

## Performance
- [ ] No performance regressions
- [ ] Expensive operations memoized
- [ ] Bundle size acceptable

## Accessibility
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] ARIA labels where needed
- [ ] Color contrast sufficient

## Security
- [ ] No sensitive data exposed
- [ ] Input sanitization present
- [ ] No XSS vulnerabilities

## Documentation
- [ ] Code comments for complex logic
- [ ] README updated if needed
- [ ] API documentation current

## Privacy & Legal Compliance
- [ ] No location tracking verification
- [ ] Aggregate data only checks
- [ ] No PII collection verification
- [ ] Legal compliance verification

### Privacy Code Review Details

#### No Location Tracking Verification

```typescript
// ✅ CHECK: Ensure no user location tracking
const verifyNoLocationTracking = (code: string): boolean => {
  const locationPatterns = [
    /navigator\.geolocation/i,
    /getCurrentPosition/i,
    /watchPosition/i,
    /Geolocation\.getCurrentPosition/i,
    /requestLocationPermission/i,
    /@react-native-community\/geolocation/i,
    /expo-location/i,
  ];

  const hasLocationTracking = locationPatterns.some(
    pattern => pattern.test(code)
  );

  if (hasLocationTracking) {
    console.error('❌ VIOLATION: Code contains user location tracking');
    return false;
  }

  console.log('✅ PASS: No user location tracking found');
  return true;
};

// ✅ ALLOWED: County-level geographic data only
const isCountyLevelDataOnly = (data: any): boolean => {
  // County centroids and boundaries are OK
  // User location is NOT OK
  return (
    data.hasOwnProperty('countyFIPS') ||
    data.hasOwnProperty('countyBoundary')
  ) && !data.hasOwnProperty('userLocation');
};
```

#### Aggregate Data Only Checks

```typescript
// ✅ CHECK: Ensure only aggregate data is used
const verifyAggregateDataOnly = (dataStructure: any): boolean => {
  const prohibitedFields = [
    'childName',
    'childFirstName',
    'childLastName',
    'childId',
    'caseNumber',
    'fosterParentName',
    'address',
    'streetAddress',
    'zipCode',
    'schoolName',
    'dateOfBirth',
    'dob',
    'age', // Individual age is prohibited, age groups are OK
    'medicalHistory',
    'caseNotes',
    'socialWorkerName',
  ];

  const allowedFields = [
    'countyFIPS',
    'countyName',
    'totalChildren',
    'ageGroupDistribution', // Percentages, not individual ages
    'percentageByGender',
    'averageDaysInCare',
    'countyBoundary',
  ];

  // Check for prohibited fields
  for (const field of prohibitedFields) {
    if (field in dataStructure) {
      console.error(`❌ VIOLATION: Prohibited field found: ${field}`);
      return false;
    }
  }

  // Verify it's county-level aggregate
  if (!('countyFIPS' in dataStructure || 'countyName' in dataStructure)) {
    console.error('❌ VIOLATION: Not county-level data');
    return false;
  }

  console.log('✅ PASS: Data is aggregate county-level only');
  return true;
};

// ✅ CHECK: Verify aggregation level
const verifyAggregationLevel = (childCount: number): boolean => {
  // Never show counts less than 10 to prevent identification
  const MIN_AGGREGATE_COUNT = 10;

  if (childCount > 0 && childCount < MIN_AGGREGATE_COUNT) {
    console.warn(
      `⚠️  WARNING: Count of ${childCount} may allow identification. ` +
      `Minimum aggregate count is ${MIN_AGGREGATE_COUNT}.`
    );
    return false;
  }

  return true;
};
```

#### No PII Collection Verification

```typescript
// ✅ CHECK: Ensure no PII collection anywhere in the app
const verifyNoPIICollection = (codebase: string[]): boolean => {
  const piiCollectionPatterns = [
    // Form inputs
    /type=["']email["']/i,
    /type=["']tel["']/i,
    /placeholder.*email/i,
    /placeholder.*phone/i,
    /placeholder.*name/i,

    // Data storage
    /localStorage\.setItem.*user/i,
    /sessionStorage\.setItem.*user/i,
    /AsyncStorage\.setItem.*user/i,

    // Cookies
    /document\.cookie/i,
    /setCookie.*user/i,

    // Analytics with user tracking
    /analytics\.identify/i,
    /analytics\.setUserId/i,
    /ga\(['"]set['"],\s*['"]userId/i,

    // Third-party trackers
    /facebook.*pixel/i,
    /google.*analytics.*clientId/i,
    /mixpanel\.identify/i,
    /amplitude\.setUserId/i,
  ];

  const violations: string[] = [];

  for (const file of codebase) {
    for (const pattern of piiCollectionPatterns) {
      if (pattern.test(file)) {
        violations.push(`Pattern matched: ${pattern}`);
      }
    }
  }

  if (violations.length > 0) {
    console.error('❌ VIOLATION: PII collection patterns found:');
    violations.forEach(v => console.error(`  - ${v}`));
    return false;
  }

  console.log('✅ PASS: No PII collection found');
  return true;
};

// ✅ CHECK: Verify analytics is privacy-preserving
const verifyPrivacyPreservingAnalytics = (analyticsConfig: any): boolean => {
  const requiredSettings = {
    anonymizeIP: true,          // Must anonymize IP addresses
    disablePersonalization: true, // No user profiling
    allowAdFeatures: false,     // No ad tracking
    allowAdPersonalization: false,
    storage: 'none',            // No cookies
  };

  for (const [key, value] of Object.entries(requiredSettings)) {
    if (analyticsConfig[key] !== value) {
      console.error(
        `❌ VIOLATION: Analytics setting ${key} must be ${value}, ` +
        `got ${analyticsConfig[key]}`
      );
      return false;
    }
  }

  console.log('✅ PASS: Analytics is privacy-preserving');
  return true;
};
```

#### Legal Compliance Verification

```typescript
// ✅ CHECK: Comprehensive legal compliance
const verifyLegalCompliance = (): {
  compliant: boolean;
  violations: string[];
  warnings: string[];
} => {
  const violations: string[] = [];
  const warnings: string[] = [];

  // 1. COPPA Compliance
  if (!verifyNoPIICollection(getAllCodeFiles())) {
    violations.push('COPPA: PII collection detected');
  }

  // 2. FERPA Compliance
  if (hasSchoolSpecificData()) {
    violations.push('FERPA: School-specific data detected');
  }

  // 3. HIPAA Compliance
  if (hasHealthInformation()) {
    violations.push('HIPAA: Individual health information detected');
  }

  // 4. Michigan MCL 722.621 (Child Protection)
  if (hasIdentifiableChildData()) {
    violations.push('MCL 722.621: Identifiable child data detected');
  }

  // 5. Michigan MCL 722.954 (Foster Care Confidentiality)
  if (hasFosterCareRecords()) {
    violations.push('MCL 722.954: Foster care records detected');
  }

  // 6. Location Privacy
  if (!verifyNoLocationTracking(getAllCodeFiles().join('\n'))) {
    violations.push('Privacy: User location tracking detected');
  }

  // 7. Aggregate Data Only
  const allDataStructures = getAllDataStructures();
  for (const data of allDataStructures) {
    if (!verifyAggregateDataOnly(data)) {
      violations.push(`Privacy: Non-aggregate data in ${data.name}`);
    }
  }

  // 8. Small Count Warning (statistical disclosure control)
  const countiesWithSmallCounts = getCountiesWithSmallCounts();
  if (countiesWithSmallCounts.length > 0) {
    warnings.push(
      `Small counts detected in ${countiesWithSmallCounts.length} counties. ` +
      'Consider suppression to prevent identification.'
    );
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
};

// Run before every commit
const preCommitLegalCheck = (): void => {
  console.log('Running legal compliance checks...\n');

  const result = verifyLegalCompliance();

  if (result.warnings.length > 0) {
    console.warn('⚠️  WARNINGS:');
    result.warnings.forEach(w => console.warn(`  - ${w}`));
    console.warn('');
  }

  if (!result.compliant) {
    console.error('❌ LEGAL COMPLIANCE FAILED');
    console.error('Violations:');
    result.violations.forEach(v => console.error(`  - ${v}`));
    console.error('\nCommit blocked. Fix violations before committing.');
    process.exit(1);
  }

  console.log('✅ ALL LEGAL COMPLIANCE CHECKS PASSED\n');
};
```

#### Privacy Review Workflow

```markdown
## Before Every Code Review

### Reviewer Checklist

1. **No Location Tracking**
   - [ ] Search for `geolocation` APIs
   - [ ] Check for GPS/location permissions
   - [ ] Verify map shows only county data, not user location
   - [ ] Confirm no "near me" features

2. **Aggregate Data Only**
   - [ ] Review all data structures for prohibited fields
   - [ ] Verify no individual child information
   - [ ] Check that all counts are county-level totals
   - [ ] Confirm age groups used instead of individual ages
   - [ ] Verify small count suppression (< 10)

3. **No PII Collection**
   - [ ] Search for form inputs collecting personal data
   - [ ] Check for email/phone number fields
   - [ ] Verify no user registration/login
   - [ ] Confirm no tracking cookies
   - [ ] Review analytics configuration

4. **Legal Compliance**
   - [ ] COPPA: No data from users under 13 (or any users)
   - [ ] FERPA: No school-specific data
   - [ ] HIPAA: No individual health information
   - [ ] MCL 722.621: No identifiable child data
   - [ ] MCL 722.954: No foster care case records
   - [ ] ADA: Accessibility requirements met

5. **Privacy Policy**
   - [ ] Privacy policy updated if data practices changed
   - [ ] App Store privacy labels accurate
   - [ ] Terms of service current

### Red Flags - Reject Immediately

❌ Any of these require immediate rejection:
- User location tracking
- Individual child identifiers
- PII collection forms
- Tracking cookies or user IDs
- Analytics with user identification
- Email/contact forms without privacy review
- Data export features without aggregation
- Search features that could identify individuals
- Exact addresses or precise coordinates
- School names or other identifying locations

### Questions to Ask

Before approving any PR, ask:
1. Could this data be used to identify a specific child?
2. Is this aggregated at the county level or higher?
3. Does this collect any user information?
4. Does this track user behavior or location?
5. Would a legal expert approve this?
6. Is this documented in our privacy policy?
7. Does this comply with App Store privacy labels?

If the answer to #1, #3, or #4 is "yes" or "maybe", REJECT the PR.
If the answer to #2 is "no", REJECT the PR.
If the answer to #5, #6, or #7 is "no" or "unsure", REQUEST legal review.
```

```

---

## Common Pitfalls & Solutions

### Pitfall 1: Stale Closure in useEffect

```typescript
// ❌ PROBLEM - Stale closure
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // Always logs 0!
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Empty deps = closure captures initial count
  
  return <button onClick={() => setCount(c => c + 1)}>+</button>;
}

// ✅ SOLUTION 1 - Include dependency
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // Logs current count
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // count is dependency

// ✅ SOLUTION 2 - Use functional update
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1); // Always has current value
  }, 1000);
  return () => clearInterval(timer);
}, []); // No dependency needed
```

### Pitfall 2: Object/Array Dependencies

```typescript
// ❌ PROBLEM - New object every render
function Component() {
  const filters = { age: '0-5', region: 'all' }; // New object!
  
  useEffect(() => {
    loadData(filters);
  }, [filters]); // Runs every render!
}

// ✅ SOLUTION 1 - useMemo
function Component() {
  const filters = useMemo(
    () => ({ age: '0-5', region: 'all' }),
    [] // Only create once
  );
  
  useEffect(() => {
    loadData(filters);
  }, [filters]); // Stable reference
}

// ✅ SOLUTION 2 - Individual dependencies
function Component() {
  const age = '0-5';
  const region = 'all';
  
  useEffect(() => {
    loadData({ age, region });
  }, [age, region]); // Primitive values
}
```

### Pitfall 3: Large Component Files

```typescript
// ❌ PROBLEM - 500+ line component file
const HugeComponent: React.FC = () => {
  // ... tons of logic
  return (
    <div>
      {/* ... hundreds of lines of JSX */}
    </div>
  );
};

// ✅ SOLUTION - Break into smaller components
const HugeComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
};

// Each subcomponent in its own file
const Header: React.FC = () => { /* ... */ };
const Sidebar: React.FC = () => { /* ... */ };
// etc.
```

---

## Environment Setup

### Required Tools

```bash
# Node.js (LTS version)
node --version  # Should be v18.x or higher

# Package manager
npm --version   # Or yarn/pnpm

# Git
git --version

# Code editor (recommended: VS Code)
code --version
```

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Editor Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Documentation Standards

### Component Documentation

```typescript
/**
 * Displays an interactive map of Michigan counties with foster care data
 * 
 * Features:
 * - Heat map coloring based on child population
 * - Clickable county markers with detailed popups
 * - Zoom and pan interactions
 * - Mobile-optimized touch controls
 * 
 * @example
 * ```tsx
 * <InteractiveMap
 *   counties={countyData}
 *   filters={{ ageGroup: 'all' }}
 *   onCountyClick={handleCountyClick}
 * />
 * ```
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  counties,
  filters,
  onCountyClick
}) => {
  // Implementation
};
```

### Function Documentation

```typescript
/**
 * Calculates the color for a county marker based on population
 * 
 * Uses a logarithmic scale to ensure visual distribution:
 * - Red (>1000 children): High concentration urban areas
 * - Orange (500-1000): Moderate urban/suburban
 * - Yellow (200-500): Small cities
 * - Blue (<200): Rural counties
 * 
 * @param totalChildren - Number of children in foster care in the county
 * @returns Hex color code for the marker
 * 
 * @example
 * ```typescript
 * const color = getCountyColor(950); // Returns '#dc2626' (red)
 * const color = getCountyColor(150); // Returns '#60a5fa' (blue)
 * ```
 */
export function getCountyColor(totalChildren: number): string {
  if (totalChildren >= 1000) return '#dc2626';
  if (totalChildren >= 500) return '#f97316';
  if (totalChildren >= 200) return '#fbbf24';
  return '#60a5fa';
}
```

---

## Questions & Support

### Where to Get Help

1. **Check existing documentation** (you're reading it!)
2. **Search GitHub Issues** for similar problems
3. **Ask in team chat** for quick questions
4. **Create GitHub Issue** for bugs/features
5. **Update docs** if you find gaps

### Contributing to Docs

Found something unclear? Learned something new? Update these docs!

```bash
# 1. Edit the doc file
# 2. Commit with descriptive message
git commit -m "docs: Clarify error handling best practices"

# 3. Push and create PR
git push origin docs/clarify-error-handling
```

---

**Remember: These guidelines exist to help us build better software. If you have suggestions for improvements, speak up! Good development practices evolve over time.**

---

## Quick Reference

### Before Every Commit

```bash
# 1. Run linter
npm run lint

# 2. Run tests
npm test

# 3. Check types
npm run type-check

# 4. Build (ensure no errors)
npm run build
```

### Before Every PR

```bash
# 1. All the above, plus:
npm run test:coverage  # Ensure coverage targets met
npm run lighthouse     # Check performance
npm run a11y-check     # Accessibility audit
```

### Common Commands

```bash
# Start development server
npm start

# Run tests in watch mode
npm test

# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Format all files
npm run format

# Lint and fix
npm run lint:fix
```

---

**Happy coding! Remember, we're building something that matters.** 🏡💙
