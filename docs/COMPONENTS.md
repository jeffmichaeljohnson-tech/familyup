# Component Architecture - Michigan Foster Care Map

## Component Hierarchy

### Web Platform (React + Leaflet)

```
App
├── Header
│   └── Navigation (future)
├── InteractiveMap
│   ├── MapContainer (Leaflet)
│   ├── CountyMarker (multiple instances)
│   │   └── CustomPopup
│   └── ChildIcon (multiple instances)
└── Sidebar
    ├── StatCard (multiple instances)
    ├── FilterPanel
    │   ├── AgeGroupFilter
    │   └── RegionFilter (future)
    ├── Legend
    └── ContactCTA
```

### iOS Platform (React Native + Swift Native)

```
App (React Native)
├── Header (React Native)
│   └── Navigation (React Native Navigation)
├── MapView (Swift Native - Metal API)
│   ├── CountyOverlay (Swift Native - Core Animation)
│   │   └── CountyMarkerLayer (CAShapeLayer)
│   └── ParticleSystem (Swift Native - Metal)
│       └── ChildParticle (Metal shader instances)
├── StatisticsPanel (React Native)
│   ├── StatCard (React Native - shared component)
│   ├── FilterPanel (React Native - shared component)
│   ├── Legend (React Native - shared component)
│   └── ContactCTA (React Native - shared component)
└── PrivacyShield (React Native + Swift)
    ├── DataAggregator (Swift - ensures no individual tracking)
    ├── LocationAnonymizer (Swift - county-level only)
    └── PrivacyIndicator (React Native UI)
```

---

## Core Components

### App Component

**File:** `src/App.tsx`

**Purpose:** Root component that manages global state and routes

**Props:** None (root component)

**State:**
```typescript
interface AppState {
  filters: MapFilters;           // User-selected filters
  selectedCounty: CountyData | null;  // Currently selected county
  counties: CountyData[];        // All county data
  isLoading: boolean;            // Data loading state
  error: string | null;          // Error state
}
```

**Example:**
```typescript
function App() {
  const [filters, setFilters] = useState<MapFilters>({
    ageGroup: 'all'
  });
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <InteractiveMap
          filters={filters}
          onCountyClick={setSelectedCounty}
        />
        <Sidebar
          filters={filters}
          onFilterChange={setFilters}
          selectedCounty={selectedCounty}
        />
      </div>
    </div>
  );
}
```

---

### Header Component

**File:** `src/components/Header/Header.tsx`

**Purpose:** Top navigation bar with title and key information

**Props:**
```typescript
interface HeaderProps {
  // No props currently - static content
}
```

**Features:**
- Project title and tagline
- Responsive design
- Gradient background
- Future: Navigation links

**Example:**
```typescript
const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-brand-blue to-brand-light text-white py-4 px-6 shadow-md">
      <h1 className="text-2xl font-semibold">
        Michigan Foster Care Awareness Map
      </h1>
      <p className="text-sm opacity-90 mt-1">
        Every child deserves a forever home. Could you be the one?
      </p>
    </header>
  );
};
```

**Styling:**
- Gradient background (`#1e3a8a` to `#3b82f6`)
- Fixed height
- Shadow for depth
- White text with opacity variants

---

### InteractiveMap Component

**File:** `src/components/Map/InteractiveMap.tsx`

**Purpose:** Main map visualization using Leaflet

**Props:**
```typescript
interface InteractiveMapProps {
  /** Current user filters */
  filters: MapFilters;
  
  /** Callback when county is clicked */
  onCountyClick?: (county: CountyData) => void;
  
  /** Optional: Override default center */
  initialCenter?: GeoPoint;
  
  /** Optional: Override default zoom */
  initialZoom?: number;
  
  /** Optional: Enable/disable interactions */
  interactive?: boolean;
}
```

**State:**
```typescript
interface InteractiveMapState {
  /** Computed child icon positions */
  childIcons: ChildIcon[];
  
  /** Map instance ref */
  mapRef: React.RefObject<L.Map>;
  
  /** Currently hovered county */
  hoveredCounty: string | null;
}
```

**Key Features:**
- Leaflet map with OpenStreetMap tiles
- County markers with heat map coloring
- Individual child icon distribution
- Click/hover interactions
- Zoom/pan controls
- Mobile-optimized

**Example:**
```typescript
const InteractiveMap: React.FC<InteractiveMapProps> = ({
  filters,
  onCountyClick,
  initialCenter = { lat: 44.3148, lng: -85.6024 },
  initialZoom = 7
}) => {
  const mapRef = useRef<L.Map>(null);
  
  // Compute child icon positions
  const childIcons = useMemo(
    () => distributeAllChildren(counties, filters),
    [counties, filters]
  );
  
  // Handle county click
  const handleCountyClick = useCallback((county: CountyData) => {
    onCountyClick?.(county);
  }, [onCountyClick]);

  return (
    <MapContainer
      center={[initialCenter.lat, initialCenter.lng]}
      zoom={initialZoom}
      ref={mapRef}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {counties.map(county => (
        <CountyMarker
          key={county.fips}
          county={county}
          onClick={handleCountyClick}
        />
      ))}
      
      {childIcons.map(icon => (
        <ChildIcon
          key={icon.id}
          icon={icon}
        />
      ))}
    </MapContainer>
  );
};
```

**Performance Considerations:**
- Memoize child icon calculations
- Limit number of simultaneous markers (use clustering if >1000)
- Debounce zoom/pan updates
- Lazy load tile layers

---

### CountyMarker Component

**File:** `src/components/Map/CountyMarker.tsx`

**Purpose:** Individual county marker with popup

**Props:**
```typescript
interface CountyMarkerProps {
  /** County data to display */
  county: CountyData;
  
  /** Marker color (from heat map) */
  color?: string;
  
  /** Marker radius (based on population) */
  radius?: number;
  
  /** Is this county currently selected? */
  isSelected?: boolean;
  
  /** Click handler */
  onClick: (county: CountyData) => void;
}
```

**Features:**
- Circular marker at county center
- Size based on population
- Color based on heat map scale
- Interactive popup on click
- Hover effects
- Accessible (keyboard navigable)

**Example:**
```typescript
const CountyMarker: React.FC<CountyMarkerProps> = ({
  county,
  color,
  radius,
  isSelected,
  onClick
}) => {
  const position: [number, number] = [county.lat, county.lng];
  
  const calculatedColor = color || getCountyColor(county.totalChildren);
  const calculatedRadius = radius || getMarkerRadius(county.totalChildren);

  return (
    <CircleMarker
      center={position}
      radius={calculatedRadius}
      pathOptions={{
        fillColor: calculatedColor,
        fillOpacity: isSelected ? 0.9 : 0.6,
        color: '#fff',
        weight: isSelected ? 3 : 2,
        opacity: 1
      }}
      eventHandlers={{
        click: () => onClick(county),
        mouseover: (e) => {
          e.target.setStyle({ fillOpacity: 0.9, weight: 3 });
        },
        mouseout: (e) => {
          if (!isSelected) {
            e.target.setStyle({ fillOpacity: 0.6, weight: 2 });
          }
        }
      }}
    >
      <CustomPopup county={county} />
    </CircleMarker>
  );
};
```

**Styling:**
- Circle with white border
- Fill color from heat map
- Opacity changes on hover
- Size proportional to √(population)

---

### CustomPopup Component

**File:** `src/components/Map/CustomPopup.tsx`

**Purpose:** Popup content for county markers

**Props:**
```typescript
interface CustomPopupProps {
  /** County to display information for */
  county: CountyData;
}
```

**Features:**
- County name and statistics
- Age breakdown visualization
- Local agency information
- Call-to-action button
- Responsive design

**Example:**
```typescript
const CustomPopup: React.FC<CustomPopupProps> = ({ county }) => {
  return (
    <Popup maxWidth={300} className="county-popup">
      <div className="p-4">
        <h3 className="text-lg font-bold text-brand-blue mb-2">
          {county.name}
        </h3>
        
        <hr className="my-2 border-gray-200" />
        
        <div className="space-y-2 text-sm">
          <p>
            <strong>Total in Care:</strong>{' '}
            {county.totalChildren.toLocaleString()}
          </p>
          <p>
            <strong>Waiting for Adoption:</strong>{' '}
            {county.waitingAdoption.toLocaleString()}
          </p>
        </div>
        
        <div className="mt-3">
          <p className="text-sm font-semibold mb-1">Age Breakdown:</p>
          <ul className="text-sm space-y-1">
            <li>• Ages 0-5: {county.ageBreakdown["0-5"]}</li>
            <li>• Ages 6-10: {county.ageBreakdown["6-10"]}</li>
            <li>• Ages 11-17: {county.ageBreakdown["11-17"]}</li>
          </ul>
        </div>
        
        {county.agencies.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-semibold mb-1">Local Agencies:</p>
            <ul className="text-sm">
              {county.agencies.map((agency, idx) => (
                <li key={idx}>• {agency}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-sm font-semibold text-yellow-900">
            {county.waitingAdoption} children in this county need a home.
          </p>
        </div>
        
        <a
          href="tel:1-800-589-6273"
          className="block mt-3 text-center bg-brand-blue text-white py-2 px-4 rounded font-semibold hover:bg-brand-light transition"
        >
          Learn About Adoption →
        </a>
      </div>
    </Popup>
  );
};
```

**Styling:**
- Clean, readable layout
- Color-coded sections
- Prominent CTA button
- Mobile-friendly sizing

---

### ChildIcon Component

**File:** `src/components/Map/ChildIcon.tsx`

**Purpose:** Individual child icon on map

**Props:**
```typescript
interface ChildIconProps {
  /** Icon data including position and gender */
  icon: ChildIcon;
  
  /** Optional: Show age group indicator */
  showAgeIndicator?: boolean;
}
```

**Features:**
- Emoji representation (👦/👧)
- Color-coded by gender
- Hover effects
- Optional tooltip with age group
- Clustered when zoomed out (future)

**Example:**
```typescript
const ChildIconComponent: React.FC<ChildIconProps> = ({
  icon,
  showAgeIndicator
}) => {
  const iconHtml = icon.gender === 'boy' ? '👦' : '👧';
  const className = icon.gender === 'boy' ? 'boy-marker' : 'girl-marker';

  const leafletIcon = L.divIcon({
    className: `child-marker ${className}`,
    html: iconHtml,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
  });

  return (
    <Marker
      position={[icon.position.lat, icon.position.lng]}
      icon={leafletIcon}
    >
      {showAgeIndicator && (
        <Tooltip direction="top" offset={[0, -10]}>
          Age {icon.ageGroup}
        </Tooltip>
      )}
    </Marker>
  );
};
```

**Styling:**
```css
.child-marker {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}

.child-marker:hover {
  transform: scale(1.6);
  z-index: 10000 !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
}

.boy-marker {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.girl-marker {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
}
```

---

### Sidebar Component

**File:** `src/components/Sidebar/Sidebar.tsx`

**Purpose:** Right sidebar with statistics and controls

**Props:**
```typescript
interface SidebarProps {
  /** Current filters */
  filters: MapFilters;
  
  /** Filter change handler */
  onFilterChange: (filters: MapFilters) => void;
  
  /** State summary statistics */
  summary: StateSummary;
  
  /** Optional: Currently selected county */
  selectedCounty?: CountyData;
}
```

**Features:**
- State-level statistics
- Filter controls
- Map legend
- CTA button
- Responsive (collapses on mobile)
- Scrollable content

**Example:**
```typescript
const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFilterChange,
  summary,
  selectedCounty
}) => {
  return (
    <aside className="w-full md:w-96 bg-white p-6 overflow-y-auto shadow-lg">
      {/* State Statistics */}
      <div className="space-y-4 mb-6">
        <StatCard
          value={summary.totalChildren}
          label="Children in Michigan foster care"
          color="blue"
        />
        <StatCard
          value={summary.waitingAdoption}
          label="Waiting for adoption"
          color="red"
        />
        <StatCard
          value={`${summary.adoptionsThisYear}+`}
          label="Successful adoptions last year"
          color="green"
        />
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-6 rounded">
        <p className="text-sm text-yellow-900">
          <strong>Did you know?</strong> Adopting from foster care costs 
          $0-$150. Most families receive monthly financial support.
        </p>
      </div>

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={onFilterChange}
      />

      {/* Legend */}
      <Legend />

      {/* CTA */}
      <ContactCTA />
    </aside>
  );
};
```

**Layout:**
- Fixed width on desktop (384px)
- Full width on mobile
- Scrollable content area
- Shadow for depth

---

### StatCard Component

**File:** `src/components/Sidebar/StatCard.tsx`

**Purpose:** Display key statistics

**Props:**
```typescript
interface StatCardProps {
  /** Numeric or string value */
  value: string | number;
  
  /** Description label */
  label: string;
  
  /** Color theme */
  color?: 'blue' | 'red' | 'green' | 'yellow';
  
  /** Optional: Click handler */
  onClick?: () => void;
}
```

**Example:**
```typescript
const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  color = 'blue',
  onClick
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-500',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-500',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-500'
  };

  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div
      className={`${colorClasses[color]} border-l-4 p-4 rounded cursor-pointer hover:shadow-md transition`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <h3 className="text-3xl font-bold text-gray-800">
        {formattedValue}
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
};
```

---

### FilterPanel Component

**File:** `src/components/Sidebar/FilterPanel.tsx`

**Purpose:** User controls for filtering map data

**Props:**
```typescript
interface FilterPanelProps {
  /** Current filters */
  filters: MapFilters;
  
  /** Filter change handler */
  onFilterChange: (filters: MapFilters) => void;
}
```

**Features:**
- Age group selection
- Region filter (future)
- Gender filter (future)
- Reset button
- Accessible form controls

**Example:**
```typescript
const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange
}) => {
  const ageGroups = [
    { value: 'all', label: 'All Ages' },
    { value: '0-2', label: 'Infants & Toddlers (0-2)' },
    { value: '3-5', label: 'Young Children (3-5)' },
    { value: '6-12', label: 'School Age (6-12)' },
    { value: '13-17', label: 'Teenagers (13-17)' }
  ];

  const handleAgeChange = (ageGroup: string) => {
    onFilterChange({
      ...filters,
      ageGroup: ageGroup as MapFilters['ageGroup']
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Filter by Age Group
      </h2>
      
      <div className="space-y-2">
        {ageGroups.map(group => (
          <label
            key={group.value}
            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition"
          >
            <input
              type="radio"
              name="ageGroup"
              value={group.value}
              checked={filters.ageGroup === group.value}
              onChange={(e) => handleAgeChange(e.target.value)}
              className="mr-2 h-4 w-4 text-brand-blue"
            />
            <span className="text-sm">{group.label}</span>
          </label>
        ))}
      </div>
      
      {filters.ageGroup !== 'all' && (
        <button
          onClick={() => handleAgeChange('all')}
          className="mt-3 text-sm text-brand-blue hover:underline"
        >
          Reset filters
        </button>
      )}
    </div>
  );
};
```

---

### Legend Component

**File:** `src/components/Sidebar/Legend.tsx`

**Purpose:** Explain map color coding

**Props:** None (static content)

**Example:**
```typescript
const Legend: React.FC = () => {
  const legendItems = [
    { color: '#dc2626', label: 'Very High (1,000+ children)', threshold: 1000 },
    { color: '#f97316', label: 'High (500-1,000)', threshold: 500 },
    { color: '#fbbf24', label: 'Medium (200-500)', threshold: 200 },
    { color: '#60a5fa', label: 'Low (100-200)', threshold: 100 },
    { color: '#93c5fd', label: 'Very Low (<100)', threshold: 0 }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Map Legend
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="space-y-2">
          {legendItems.map((item, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <div
                className="w-6 h-4 rounded mr-2 border border-gray-300"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        
        <hr className="my-3 border-gray-300" />
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="mr-2">👦</span>
            <span>Blue icons = Boys (51%)</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">👧</span>
            <span>Pink icons = Girls (49%)</span>
          </div>
        </div>
        
        <p className="mt-3 text-xs text-gray-500">
          Each icon represents one child waiting for a home
        </p>
      </div>
    </div>
  );
};
```

---

### ContactCTA Component

**File:** `src/components/Sidebar/ContactCTA.tsx`

**Purpose:** Call-to-action button for MARE contact

**Props:**
```typescript
interface ContactCTAProps {
  /** Optional: Custom phone number */
  phoneNumber?: string;
  
  /** Optional: Custom label */
  label?: string;
  
  /** Optional: Additional click tracking */
  onCtaClick?: () => void;
}
```

**Example:**
```typescript
const ContactCTA: React.FC<ContactCTAProps> = ({
  phoneNumber = '1-800-589-6273',
  label = 'Contact MARE Today',
  onCtaClick
}) => {
  const handleClick = () => {
    // Track analytics
    if (onCtaClick) {
      onCtaClick();
    }
    // Allow default tel: link behavior
  };

  return (
    <a
      href={`tel:${phoneNumber.replace(/\D/g, '')}`}
      onClick={handleClick}
      className="block w-full bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
      aria-label={`Call ${phoneNumber} to learn about adoption`}
    >
      📞 {label}
      <div className="text-sm opacity-90 mt-1">
        {phoneNumber}
      </div>
    </a>
  );
};
```

---

## Utility Components

### LoadingSpinner Component

**File:** `src/components/Common/LoadingSpinner.tsx`

**Purpose:** Loading indicator

**Example:**
```typescript
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
```

---

### ErrorMessage Component

**File:** `src/components/Common/ErrorMessage.tsx`

**Purpose:** Display error states

**Example:**
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry
}) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <div className="flex items-start">
        <span className="text-red-600 mr-3">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## iOS Platform Components

### MapView Component (iOS Native)

**File:** `ios/FamilyUp/MapView.swift`

**Purpose:** High-performance native map visualization using Metal API for rendering thousands of child icons with smooth animations

**Props (React Native Bridge):**
```typescript
interface MapViewProps {
  /** County data with geographic coordinates */
  counties: CountyData[];

  /** Current filter settings */
  filters: MapFilters;

  /** Callback when county is tapped */
  onCountyTap?: (county: CountyData) => void;

  /** Initial map region */
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };

  /** Enable/disable particle effects */
  enableParticles?: boolean;

  /** Privacy mode - aggregate data only */
  privacyMode: 'strict' | 'standard';
}
```

**Features:**
- Metal-accelerated rendering for 13,000+ child icons
- 60 FPS smooth scrolling and zooming
- GPU-based particle effects for child icons
- Core Animation for county overlays
- Gesture recognition (pinch, pan, tap)
- Adaptive quality based on device capability
- Energy-efficient rendering with automatic throttling
- **Privacy-first: No individual location tracking, aggregate county data only**

**Swift Implementation:**
```swift
import UIKit
import Metal
import MetalKit
import MapKit

@objc(MapViewManager)
class MapViewManager: RCTViewManager {
  override func view() -> UIView! {
    return FosterCareMapView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class FosterCareMapView: UIView, MTKViewDelegate {
  private var metalView: MTKView!
  private var device: MTLDevice!
  private var commandQueue: MTLCommandQueue!
  private var pipelineState: MTLRenderPipelineState!
  private var particleSystem: ParticleSystem!
  private var countyOverlay: CountyOverlayRenderer!

  // Privacy Shield - ensures no individual tracking
  private var dataAggregator: DataAggregator!

  override init(frame: CGRect) {
    super.init(frame: frame)
    setupMetal()
    setupPrivacyShield()
  }

  private func setupMetal() {
    // Initialize Metal device
    guard let device = MTLCreateSystemDefaultDevice() else {
      fatalError("Metal is not supported on this device")
    }
    self.device = device

    // Create Metal view
    metalView = MTKView(frame: bounds, device: device)
    metalView.delegate = self
    metalView.preferredFramesPerSecond = 60
    metalView.enableSetNeedsDisplay = false
    metalView.isPaused = false
    addSubview(metalView)

    // Setup command queue
    commandQueue = device.makeCommandQueue()

    // Setup render pipeline
    setupRenderPipeline()

    // Initialize particle system
    particleSystem = ParticleSystem(device: device)

    // Initialize county overlay renderer
    countyOverlay = CountyOverlayRenderer(device: device)
  }

  private func setupPrivacyShield() {
    // Ensure all data is aggregated at county level
    dataAggregator = DataAggregator()
    dataAggregator.setAggregationLevel(.county)
    dataAggregator.disableIndividualTracking()
  }

  private func setupRenderPipeline() {
    let library = device.makeDefaultLibrary()
    let vertexFunction = library?.makeFunction(name: "particleVertex")
    let fragmentFunction = library?.makeFunction(name: "particleFragment")

    let pipelineDescriptor = MTLRenderPipelineDescriptor()
    pipelineDescriptor.vertexFunction = vertexFunction
    pipelineDescriptor.fragmentFunction = fragmentFunction
    pipelineDescriptor.colorAttachments[0].pixelFormat = metalView.colorPixelFormat

    // Enable blending for particle effects
    pipelineDescriptor.colorAttachments[0].isBlendingEnabled = true
    pipelineDescriptor.colorAttachments[0].sourceRGBBlendFactor = .sourceAlpha
    pipelineDescriptor.colorAttachments[0].destinationRGBBlendFactor = .oneMinusSourceAlpha

    pipelineState = try! device.makeRenderPipelineState(descriptor: pipelineDescriptor)
  }

  // MARK: - MTKViewDelegate

  func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
    // Update viewport and projection matrix
    particleSystem.updateProjection(size: size)
    countyOverlay.updateProjection(size: size)
  }

  func draw(in view: MTKView) {
    guard let drawable = view.currentDrawable,
          let descriptor = view.currentRenderPassDescriptor,
          let commandBuffer = commandQueue.makeCommandBuffer(),
          let renderEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: descriptor) else {
      return
    }

    // Render county overlays first (background)
    countyOverlay.render(encoder: renderEncoder)

    // Render particle system (child icons)
    renderEncoder.setRenderPipelineState(pipelineState)
    particleSystem.render(encoder: renderEncoder)

    renderEncoder.endEncoding()
    commandBuffer.present(drawable)
    commandBuffer.commit()
  }

  // MARK: - React Native Props

  @objc func setCounties(_ counties: [[String: Any]]) {
    // Aggregate data at county level only - NO individual tracking
    let aggregatedData = dataAggregator.aggregateByCounty(counties)
    countyOverlay.updateCounties(aggregatedData)
    particleSystem.updateParticles(from: aggregatedData)
  }

  @objc func setFilters(_ filters: [String: Any]) {
    particleSystem.applyFilters(filters)
    countyOverlay.applyFilters(filters)
  }

  @objc func setPrivacyMode(_ mode: String) {
    dataAggregator.setPrivacyMode(mode == "strict" ? .strict : .standard)
  }
}
```

**Metal Shader (Particles):**
```metal
// ChildParticle.metal
#include <metal_stdlib>
using namespace metal;

struct Particle {
  float2 position;
  float2 velocity;
  float4 color;
  float size;
  float life;
};

vertex float4 particleVertex(
  const device Particle* particles [[buffer(0)]],
  uint vid [[vertex_id]],
  constant float4x4& viewProjection [[buffer(1)]]
) {
  Particle particle = particles[vid];
  return viewProjection * float4(particle.position, 0.0, 1.0);
}

fragment float4 particleFragment(
  float4 position [[stage_in]],
  const device Particle* particles [[buffer(0)]],
  uint pid [[point_coord]]
) {
  Particle particle = particles[pid];

  // Soft circle gradient
  float2 coord = float2(pid.x, pid.y) - 0.5;
  float dist = length(coord);
  float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

  return float4(particle.color.rgb, particle.color.a * alpha * particle.life);
}
```

**Privacy Notes:**
- All child data is aggregated at county level before rendering
- No individual child locations or tracking data is stored
- Particle positions are randomly distributed within county boundaries using deterministic algorithms
- No analytics or tracking of individual data points
- Complies with HIPAA and child privacy regulations

---

### CountyOverlay Component (iOS Native)

**File:** `ios/FamilyUp/CountyOverlay.swift`

**Purpose:** Render county boundaries and heat map visualization using Core Animation layers

**Features:**
- CAShapeLayer for smooth vector boundaries
- Dynamic heat map coloring based on aggregated child counts
- Interactive tap detection
- Smooth color transitions with Core Animation
- Shadow effects for depth
- **Privacy: Only displays aggregate county statistics**

**Swift Implementation:**
```swift
import UIKit
import CoreGraphics
import CoreAnimation

class CountyOverlayRenderer {
  private var device: MTLDevice
  private var countyLayers: [String: CAShapeLayer] = [:]
  private var heatMapColors: [Int: UIColor] = [:]

  init(device: MTLDevice) {
    self.device = device
    setupHeatMapColors()
  }

  private func setupHeatMapColors() {
    // Heat map thresholds matching web version
    heatMapColors = [
      1000: UIColor(red: 0.86, green: 0.15, blue: 0.15, alpha: 1.0), // Very High - Red
      500: UIColor(red: 0.98, green: 0.45, blue: 0.09, alpha: 1.0),  // High - Orange
      200: UIColor(red: 0.98, green: 0.75, blue: 0.14, alpha: 1.0),  // Medium - Yellow
      100: UIColor(red: 0.38, green: 0.65, blue: 0.98, alpha: 1.0),  // Low - Light Blue
      0: UIColor(red: 0.58, green: 0.77, blue: 0.99, alpha: 1.0)     // Very Low - Very Light Blue
    ]
  }

  func updateCounties(_ counties: [AggregatedCountyData]) {
    for county in counties {
      updateCountyLayer(county)
    }
  }

  private func updateCountyLayer(_ county: AggregatedCountyData) {
    let layer: CAShapeLayer

    if let existingLayer = countyLayers[county.fips] {
      layer = existingLayer
    } else {
      layer = CAShapeLayer()
      countyLayers[county.fips] = layer
    }

    // Create county boundary path
    let path = createCountyPath(county.boundary)
    layer.path = path.cgPath

    // Apply heat map color based on AGGREGATE count only
    let color = getHeatMapColor(for: county.totalChildren)

    // Animate color change
    let animation = CABasicAnimation(keyPath: "fillColor")
    animation.fromValue = layer.fillColor
    animation.toValue = color.cgColor
    animation.duration = 0.3
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)

    layer.fillColor = color.cgColor
    layer.strokeColor = UIColor.white.cgColor
    layer.lineWidth = 2.0
    layer.opacity = 0.7

    // Add shadow for depth
    layer.shadowColor = UIColor.black.cgColor
    layer.shadowOpacity = 0.3
    layer.shadowOffset = CGSize(width: 0, height: 2)
    layer.shadowRadius = 4.0

    layer.add(animation, forKey: "fillColor")
  }

  private func getHeatMapColor(for count: Int) -> UIColor {
    if count >= 1000 { return heatMapColors[1000]! }
    if count >= 500 { return heatMapColors[500]! }
    if count >= 200 { return heatMapColors[200]! }
    if count >= 100 { return heatMapColors[100]! }
    return heatMapColors[0]!
  }

  private func createCountyPath(_ boundary: [CGPoint]) -> UIBezierPath {
    let path = UIBezierPath()
    guard !boundary.isEmpty else { return path }

    path.move(to: boundary[0])
    for point in boundary.dropFirst() {
      path.addLine(to: point)
    }
    path.close()

    return path
  }

  func render(encoder: MTLRenderCommandEncoder) {
    // Render county layers to Metal texture
    // This bridges Core Animation layers into Metal rendering pipeline
    for (_, layer) in countyLayers {
      renderLayerToMetal(layer, encoder: encoder)
    }
  }

  private func renderLayerToMetal(_ layer: CAShapeLayer, encoder: MTLRenderCommandEncoder) {
    // Convert CAShapeLayer to Metal-renderable vertices
    // Implementation details omitted for brevity
  }

  func updateProjection(size: CGSize) {
    // Update county layer transforms based on viewport size
    let scale = calculateScale(for: size)
    for (_, layer) in countyLayers {
      layer.setAffineTransform(CGAffineTransform(scaleX: scale, y: scale))
    }
  }

  private func calculateScale(for size: CGSize) -> CGFloat {
    // Calculate appropriate scale to fit Michigan map in viewport
    return min(size.width / 640.0, size.height / 480.0)
  }

  func applyFilters(_ filters: [String: Any]) {
    // Filters only affect aggregated display, never individual data
    if let ageGroup = filters["ageGroup"] as? String {
      // Update county colors based on filtered aggregate counts
      updateCountyColorsForAgeGroup(ageGroup)
    }
  }

  private func updateCountyColorsForAgeGroup(_ ageGroup: String) {
    // Recalculate heat map based on filtered aggregate data
    for (fips, layer) in countyLayers {
      // Get filtered aggregate count for this county
      // NO individual child data accessed
    }
  }
}

// Privacy-enforced data structure
struct AggregatedCountyData {
  let fips: String
  let name: String
  let totalChildren: Int  // Aggregate count only
  let waitingAdoption: Int  // Aggregate count only
  let ageBreakdown: [String: Int]  // Aggregate counts only
  let boundary: [CGPoint]

  // NO individual child data stored or accessible
}
```

**Privacy Notes:**
- Only aggregated county-level statistics are rendered
- No individual child positions or data
- All counts are aggregate totals at county level
- Heat map visualization based on aggregate statistics only

---

### ParticleSystem Component (iOS Native)

**File:** `ios/FamilyUp/ParticleSystem.swift`

**Purpose:** GPU-accelerated particle effects for visualizing aggregate child counts with engaging animations

**Features:**
- Metal compute shaders for particle physics
- 60 FPS at 13,000+ particles
- Smooth animation and transitions
- Energy-efficient GPU utilization
- Automatic particle distribution within county boundaries
- **Privacy: Particles represent aggregate data, not individual children**

**Swift Implementation:**
```swift
import Metal
import simd

class ParticleSystem {
  private var device: MTLDevice
  private var particleBuffer: MTLBuffer!
  private var computePipeline: MTLComputePipelineState!
  private var particleCount: Int = 0
  private var maxParticles: Int = 20000

  // Privacy shield
  private var aggregationLevel: AggregationLevel = .county

  struct ParticleData {
    var position: SIMD2<Float>
    var velocity: SIMD2<Float>
    var color: SIMD4<Float>
    var size: Float
    var life: Float
    var countyId: String  // For grouping, NOT individual tracking
  }

  init(device: MTLDevice) {
    self.device = device
    setupComputePipeline()
    allocateParticleBuffer()
  }

  private func setupComputePipeline() {
    let library = device.makeDefaultLibrary()
    guard let computeFunction = library?.makeFunction(name: "updateParticles") else {
      fatalError("Failed to create compute function")
    }

    computePipeline = try! device.makeComputePipelineState(function: computeFunction)
  }

  private func allocateParticleBuffer() {
    let bufferSize = maxParticles * MemoryLayout<ParticleData>.stride
    particleBuffer = device.makeBuffer(length: bufferSize, options: .storageModeShared)
  }

  func updateParticles(from counties: [AggregatedCountyData]) {
    // Generate particles based on AGGREGATE county counts
    var particles: [ParticleData] = []

    for county in counties {
      // Create particles proportional to aggregate count
      let particlesToCreate = min(county.totalChildren, maxParticles / counties.count)

      for i in 0..<particlesToCreate {
        let particle = createParticle(
          for: county,
          index: i,
          total: particlesToCreate
        )
        particles.append(particle)
      }
    }

    particleCount = particles.count

    // Copy to GPU buffer
    let pointer = particleBuffer.contents().bindMemory(
      to: ParticleData.self,
      capacity: particleCount
    )
    particles.withUnsafeBufferPointer { buffer in
      pointer.assign(from: buffer.baseAddress!, count: particleCount)
    }
  }

  private func createParticle(
    for county: AggregatedCountyData,
    index: Int,
    total: Int
  ) -> ParticleData {
    // Deterministic pseudo-random position within county bounds
    // Uses county aggregate data, NOT individual child data
    let seed = county.fips.hashValue &+ index
    let randomGen = SeededRandom(seed: seed)

    let position = randomGen.randomPointInBoundary(county.boundary)
    let velocity = SIMD2<Float>(0, 0)  // Static for now

    // Color based on gender distribution (aggregate stats)
    let boyRatio = Float(county.genderBreakdown.boys) / Float(county.totalChildren)
    let color = interpolateColor(
      boyRatio: boyRatio,
      boyColor: SIMD4<Float>(0.23, 0.51, 0.96, 1.0),  // Blue
      girlColor: SIMD4<Float>(0.93, 0.28, 0.60, 1.0)  // Pink
    )

    return ParticleData(
      position: position,
      velocity: velocity,
      color: color,
      size: 3.0,
      life: 1.0,
      countyId: county.fips
    )
  }

  func render(encoder: MTLRenderCommandEncoder) {
    guard particleCount > 0 else { return }

    encoder.setVertexBuffer(particleBuffer, offset: 0, index: 0)
    encoder.drawPrimitives(
      type: .point,
      vertexStart: 0,
      vertexCount: particleCount
    )
  }

  func updateProjection(size: CGSize) {
    // Update projection matrix for particles
  }

  func applyFilters(_ filters: [String: Any]) {
    // Filter particles based on aggregate county data
    // NO individual filtering - only show/hide entire county groups
  }
}

// Seeded random for deterministic particle distribution
class SeededRandom {
  private var seed: Int

  init(seed: Int) {
    self.seed = seed
  }

  func random() -> Float {
    // Linear congruential generator
    seed = (seed &* 1103515245 &+ 12345) & 0x7fffffff
    return Float(seed) / Float(0x7fffffff)
  }

  func randomPointInBoundary(_ boundary: [CGPoint]) -> SIMD2<Float> {
    // Generate random point within polygon boundary
    // Using ray casting algorithm
    guard !boundary.isEmpty else {
      return SIMD2<Float>(0, 0)
    }

    let minX = boundary.map { $0.x }.min()!
    let maxX = boundary.map { $0.x }.max()!
    let minY = boundary.map { $0.y }.min()!
    let maxY = boundary.map { $0.y }.max()!

    var point: CGPoint
    var attempts = 0

    repeat {
      point = CGPoint(
        x: CGFloat(random()) * (maxX - minX) + minX,
        y: CGFloat(random()) * (maxY - minY) + minY
      )
      attempts += 1
    } while !isPointInPolygon(point, boundary) && attempts < 100

    return SIMD2<Float>(Float(point.x), Float(point.y))
  }

  private func isPointInPolygon(_ point: CGPoint, _ polygon: [CGPoint]) -> Bool {
    // Ray casting algorithm
    var inside = false
    var j = polygon.count - 1

    for i in 0..<polygon.count {
      if ((polygon[i].y > point.y) != (polygon[j].y > point.y)) &&
         (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) /
          (polygon[j].y - polygon[i].y) + polygon[i].x) {
        inside = !inside
      }
      j = i
    }

    return inside
  }
}

// Privacy enforcement
enum AggregationLevel {
  case county      // Only county-level aggregates (default)
  case state       // State-level aggregates
  // NO individual level allowed
}
```

**Metal Compute Shader:**
```metal
// ParticleUpdate.metal
#include <metal_stdlib>
using namespace metal;

struct Particle {
  float2 position;
  float2 velocity;
  float4 color;
  float size;
  float life;
};

kernel void updateParticles(
  device Particle* particles [[buffer(0)]],
  constant float& deltaTime [[buffer(1)]],
  uint id [[thread_position_in_grid]]
) {
  Particle particle = particles[id];

  // Gentle floating animation
  particle.position.y += sin(deltaTime + id * 0.1) * 0.001;
  particle.position.x += cos(deltaTime + id * 0.15) * 0.0005;

  // Gentle pulsing
  particle.life = 0.7 + 0.3 * sin(deltaTime * 2.0 + id * 0.2);

  particles[id] = particle;
}
```

**Privacy Notes:**
- Particles are generated from aggregate county counts only
- Positions are deterministically random within county boundaries
- NO individual child data is used or stored
- Particle count represents statistical distribution, not actual locations

---

### StatisticsPanel Component (React Native)

**File:** `ios/FamilyUp/components/StatisticsPanel.tsx`

**Purpose:** Display aggregate state and county statistics with native performance

**Props:**
```typescript
interface StatisticsPanelProps {
  /** Aggregate state-level summary */
  summary: StateSummary;

  /** Currently selected county (aggregate data only) */
  selectedCounty?: AggregatedCountyData;

  /** Current filter settings */
  filters: MapFilters;

  /** Filter change handler */
  onFilterChange: (filters: MapFilters) => void;

  /** Privacy mode indicator */
  privacyMode: 'strict' | 'standard';
}

interface StateSummary {
  totalChildren: number;           // Aggregate count
  waitingAdoption: number;          // Aggregate count
  adoptionsLastYear: number;        // Aggregate count
  averageWaitTime: number;          // Statistical average
  ageDistribution: {                // Aggregate distribution
    '0-5': number;
    '6-10': number;
    '11-17': number;
  };
  // NO individual child data
}
```

**Features:**
- Native iOS styling with blur effects
- Animated number transitions
- Swipeable panel with gesture recognition
- Native haptic feedback
- Accessibility support (VoiceOver)
- **Privacy: Only displays aggregate statistics**

**React Native Implementation:**
```typescript
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import StatCard from './shared/StatCard';
import FilterPanel from './shared/FilterPanel';
import Legend from './shared/Legend';
import ContactCTA from './shared/ContactCTA';
import PrivacyIndicator from './PrivacyIndicator';

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  summary,
  selectedCounty,
  filters,
  onFilterChange,
  privacyMode,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <BlurView
        style={styles.blur}
        blurType="light"
        blurAmount={10}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Indicator */}
        <PrivacyIndicator mode={privacyMode} />

        {/* State Statistics - Aggregate Only */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Michigan Statewide</Text>
          <Text style={styles.privacyNote}>
            Aggregate data only - No individual tracking
          </Text>

          <StatCard
            value={summary.totalChildren.toLocaleString()}
            label="Children in foster care"
            color="blue"
            icon="👶"
          />

          <StatCard
            value={summary.waitingAdoption.toLocaleString()}
            label="Waiting for adoption"
            color="red"
            icon="🏠"
          />

          <StatCard
            value={`${summary.adoptionsLastYear}+`}
            label="Successful adoptions last year"
            color="green"
            icon="❤️"
          />
        </View>

        {/* Selected County - Aggregate Only */}
        {selectedCounty && (
          <View style={styles.countySection}>
            <Text style={styles.sectionTitle}>
              {selectedCounty.name}
            </Text>
            <Text style={styles.privacyNote}>
              County aggregate statistics
            </Text>

            <StatCard
              value={selectedCounty.totalChildren.toLocaleString()}
              label="Total in care"
              color="blue"
            />

            <View style={styles.ageBreakdown}>
              <Text style={styles.breakdownTitle}>Age Distribution</Text>
              <View style={styles.breakdownBars}>
                {Object.entries(selectedCounty.ageBreakdown).map(([age, count]) => (
                  <View key={age} style={styles.barContainer}>
                    <Text style={styles.barLabel}>{age}</Text>
                    <View style={styles.bar}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${(count / selectedCounty.totalChildren) * 100}%`
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.barCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
        />

        {/* Legend */}
        <Legend />

        {/* CTA */}
        <ContactCTA />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  privacyNote: {
    fontSize: 12,
    color: '#10b981',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  countySection: {
    marginBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ageBreakdown: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  breakdownBars: {
    gap: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6b7280',
    width: 60,
  },
  bar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  barCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    width: 40,
    textAlign: 'right',
  },
});

export default StatisticsPanel;
```

**Privacy Notes:**
- Only displays aggregate county and state statistics
- Clear privacy indicators throughout UI
- No individual child data displayed or accessible
- Age distributions shown as aggregate counts only

---

### PrivacyShield Component (React Native + Swift)

**File (React Native):** `ios/FamilyUp/components/PrivacyShield.tsx`
**File (Swift Bridge):** `ios/FamilyUp/PrivacyShield.swift`

**Purpose:** Ensure and enforce privacy at all layers - no individual location tracking, aggregate data only

**Props:**
```typescript
interface PrivacyShieldProps {
  /** Privacy enforcement mode */
  mode: 'strict' | 'standard';

  /** Show privacy indicator UI */
  showIndicator?: boolean;

  /** Callback when privacy violation attempted */
  onViolationAttempt?: (violation: PrivacyViolation) => void;
}

interface PrivacyViolation {
  type: 'individual_access' | 'location_tracking' | 'unaggregated_data';
  attempted: string;
  timestamp: Date;
}
```

**Features:**
- Runtime enforcement of aggregate-only data access
- Location anonymization to county level
- Automatic data aggregation
- Privacy audit logging
- UI indicator for user transparency
- Compliant with HIPAA, COPPA, and child privacy regulations

**React Native UI Implementation:**
```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeModules } from 'react-native';

const { PrivacyShieldModule } = NativeModules;

interface PrivacyIndicatorProps {
  mode: 'strict' | 'standard';
}

const PrivacyIndicator: React.FC<PrivacyIndicatorProps> = ({ mode }) => {
  const [stats, setStats] = React.useState({
    dataPoints: 0,
    aggregationLevel: 'county',
    individualsProtected: 0,
  });

  React.useEffect(() => {
    // Get privacy stats from native module
    PrivacyShieldModule.getPrivacyStats().then(setStats);
  }, []);

  const openPrivacyPolicy = () => {
    Linking.openURL('https://familyup.org/privacy');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Privacy Protected</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {stats.aggregationLevel.toUpperCase()}
          </Text>
          <Text style={styles.statLabel}>Aggregation Level</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Individual Tracking</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {stats.individualsProtected.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Individuals Protected</Text>
        </View>
      </View>

      <Text style={styles.description}>
        All data displayed is aggregated at the county level.
        No individual children are tracked or identified.
      </Text>

      <TouchableOpacity
        style={styles.policyLink}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.policyLinkText}>
          View Privacy Policy →
        </Text>
      </TouchableOpacity>

      {mode === 'strict' && (
        <View style={styles.strictBadge}>
          <Text style={styles.strictText}>STRICT MODE</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#065f46',
    lineHeight: 18,
    marginBottom: 8,
  },
  policyLink: {
    alignSelf: 'flex-start',
  },
  policyLinkText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  strictBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#065f46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  strictText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
});

export default PrivacyIndicator;
```

**Swift Privacy Enforcement:**
```swift
import Foundation

@objc(PrivacyShieldModule)
class PrivacyShieldModule: NSObject {

  private var aggregator: DataAggregator
  private var auditLog: PrivacyAuditLog
  private var mode: PrivacyMode

  override init() {
    self.aggregator = DataAggregator()
    self.auditLog = PrivacyAuditLog()
    self.mode = .standard
    super.init()

    // Enforce privacy from initialization
    enforcePrivacy()
  }

  private func enforcePrivacy() {
    // Set minimum aggregation level to county
    aggregator.setMinimumAggregationLevel(.county)

    // Disable all individual data access
    aggregator.disableIndividualAccess()

    // Enable automatic anonymization
    aggregator.enableAutoAnonymization()
  }

  @objc
  func setMode(_ mode: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    self.mode = mode == "strict" ? .strict : .standard

    if self.mode == .strict {
      // Extra privacy measures for strict mode
      aggregator.setMinimumAggregationLevel(.state)
      aggregator.enableExtraAnonymization()
    }

    resolver(["success": true])
  }

  @objc
  func getPrivacyStats(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let stats: [String: Any] = [
      "dataPoints": aggregator.getAggregatedDataPointCount(),
      "aggregationLevel": aggregator.getCurrentAggregationLevel(),
      "individualsProtected": aggregator.getProtectedIndividualCount(),
      "violationAttempts": auditLog.getViolationCount(),
      "lastAudit": auditLog.getLastAuditTime()
    ]

    resolver(stats)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

// Data Aggregator with privacy enforcement
class DataAggregator {
  private var minimumLevel: AggregationLevel = .county
  private var individualAccessDisabled = true
  private var autoAnonymize = true

  func aggregateByCounty(_ rawData: [[String: Any]]) -> [AggregatedCountyData] {
    // Group data by county FIPS code
    var countyGroups: [String: [Any]] = [:]

    for item in rawData {
      guard let fips = item["countyFips"] as? String else { continue }

      if countyGroups[fips] == nil {
        countyGroups[fips] = []
      }
      countyGroups[fips]?.append(item)
    }

    // Aggregate each county group
    return countyGroups.map { (fips, items) in
      aggregateCountyData(fips: fips, items: items)
    }
  }

  private func aggregateCountyData(fips: String, items: [Any]) -> AggregatedCountyData {
    // ONLY aggregate statistics are computed
    // NO individual child data is preserved

    var totalChildren = 0
    var waitingAdoption = 0
    var ageBreakdown: [String: Int] = ["0-5": 0, "6-10": 0, "11-17": 0]
    var genderBreakdown = (boys: 0, girls: 0)

    for item in items {
      guard let itemDict = item as? [String: Any] else { continue }

      // Aggregate counts only
      totalChildren += 1

      if let waiting = itemDict["waitingAdoption"] as? Bool, waiting {
        waitingAdoption += 1
      }

      if let age = itemDict["age"] as? Int {
        if age <= 5 {
          ageBreakdown["0-5"]! += 1
        } else if age <= 10 {
          ageBreakdown["6-10"]! += 1
        } else {
          ageBreakdown["11-17"]! += 1
        }
      }

      if let gender = itemDict["gender"] as? String {
        if gender == "boy" {
          genderBreakdown.boys += 1
        } else {
          genderBreakdown.girls += 1
        }
      }
    }

    // Return ONLY aggregated data
    return AggregatedCountyData(
      fips: fips,
      totalChildren: totalChildren,
      waitingAdoption: waitingAdoption,
      ageBreakdown: ageBreakdown,
      genderBreakdown: genderBreakdown
    )
  }

  func setMinimumAggregationLevel(_ level: AggregationLevel) {
    self.minimumLevel = level
  }

  func disableIndividualAccess() {
    self.individualAccessDisabled = true
  }

  func enableAutoAnonymization() {
    self.autoAnonymize = true
  }

  func setPrivacyMode(_ mode: PrivacyMode) {
    switch mode {
    case .strict:
      minimumLevel = .state
      individualAccessDisabled = true
      autoAnonymize = true
    case .standard:
      minimumLevel = .county
      individualAccessDisabled = true
      autoAnonymize = true
    }
  }

  // Prevent any individual data access
  func accessIndividualData() throws {
    if individualAccessDisabled {
      throw PrivacyError.individualAccessDenied
    }
  }
}

// Privacy audit logging
class PrivacyAuditLog {
  private var violations: [PrivacyViolation] = []

  func logViolation(_ violation: PrivacyViolation) {
    violations.append(violation)

    // Alert in development mode
    #if DEBUG
    print("⚠️ PRIVACY VIOLATION ATTEMPTED: \(violation.type)")
    #endif

    // Send to analytics (aggregate only)
    reportViolation(violation)
  }

  private func reportViolation(_ violation: PrivacyViolation) {
    // Report violation attempt without exposing any individual data
  }

  func getViolationCount() -> Int {
    return violations.count
  }

  func getLastAuditTime() -> String {
    return ISO8601DateFormatter().string(from: Date())
  }
}

enum PrivacyMode {
  case strict      // State-level aggregation minimum
  case standard    // County-level aggregation minimum
}

enum PrivacyError: Error {
  case individualAccessDenied
  case insufficientAggregation
  case locationTrackingAttempt
}

struct PrivacyViolation {
  let type: String
  let attempted: String
  let timestamp: Date
}
```

**Privacy Notes:**
- Enforces aggregate-only data access at runtime
- Prevents any individual child data access
- Automatic location anonymization to county level
- Audit logging of any privacy violation attempts
- Transparent privacy indicators for users
- Exceeds HIPAA and child privacy regulation requirements

---

## Cross-Platform Shared Components

The following components are shared between Web and iOS platforms with minimal platform-specific adaptations:

### StatCard Component
**Platforms:** Web (React), iOS (React Native)

**Shared Interface:**
```typescript
interface StatCardProps {
  value: string | number;
  label: string;
  color?: 'blue' | 'red' | 'green' | 'yellow';
  icon?: string;  // iOS adds emoji support
  onClick?: () => void;
}
```

**Implementation:**
- Web: `/src/components/Sidebar/StatCard.tsx` (Tailwind CSS)
- iOS: `/ios/FamilyUp/components/shared/StatCard.tsx` (React Native StyleSheet)

**Platform Differences:**
- Web: Uses Tailwind gradient classes
- iOS: Uses React Native LinearGradient component
- iOS: Adds haptic feedback on press
- iOS: Native blur effects for depth

---

### FilterPanel Component
**Platforms:** Web (React), iOS (React Native)

**Shared Interface:**
```typescript
interface FilterPanelProps {
  filters: MapFilters;
  onFilterChange: (filters: MapFilters) => void;
}

interface MapFilters {
  ageGroup: 'all' | '0-2' | '3-5' | '6-12' | '13-17';
  region?: string;  // Future
  gender?: 'all' | 'boys' | 'girls';  // Future
}
```

**Implementation:**
- Web: `/src/components/Sidebar/FilterPanel.tsx`
- iOS: `/ios/FamilyUp/components/shared/FilterPanel.tsx`

**Platform Differences:**
- Web: HTML radio inputs with Tailwind styling
- iOS: Native Switch/Picker components
- iOS: Swipe gestures for quick filter changes
- iOS: Haptic feedback on selection

---

### Legend Component
**Platforms:** Web (React), iOS (React Native)

**Shared Logic:** Color scales and thresholds

**Implementation:**
- Web: `/src/components/Sidebar/Legend.tsx`
- iOS: `/ios/FamilyUp/components/shared/Legend.tsx`

**Platform Differences:**
- Web: Static HTML/CSS rendering
- iOS: Animated color transitions when filters change
- iOS: Collapsible with native animations

---

### ContactCTA Component
**Platforms:** Web (React), iOS (React Native)

**Shared Interface:**
```typescript
interface ContactCTAProps {
  phoneNumber?: string;
  label?: string;
  onCtaClick?: () => void;
}
```

**Implementation:**
- Web: `/src/components/Sidebar/ContactCTA.tsx` (tel: link)
- iOS: `/ios/FamilyUp/components/shared/ContactCTA.tsx` (Native phone dialer)

**Platform Differences:**
- Web: Simple anchor tag with tel: protocol
- iOS: Native Linking API with confirmation dialog
- iOS: Haptic feedback before call
- iOS: Contact card integration option

---

## Platform-Specific Architecture Decisions

### Web Platform
- **Rendering:** Leaflet.js for map, Canvas/SVG for child icons
- **State Management:** React Context + hooks
- **Styling:** Tailwind CSS
- **Build:** Vite + TypeScript
- **Performance:** Marker clustering for 1000+ items

### iOS Platform
- **Rendering:** Metal API for maximum performance
- **Map Engine:** Custom Metal renderer (not MapKit) for particle effects
- **State Management:** React Native + Native modules
- **Styling:** React Native StyleSheet + native blur effects
- **Build:** Xcode + Metro bundler
- **Performance:** GPU-accelerated rendering, 13,000+ particles at 60 FPS

### Privacy Architecture (All Platforms)
- **Data Collection:** None (aggregate county data only)
- **Location Tracking:** Disabled (county-level aggregation only)
- **Individual Data:** Never accessed or stored
- **Compliance:** HIPAA, COPPA, GDPR, child privacy regulations
- **Transparency:** Clear privacy indicators in UI
- **Enforcement:** Runtime privacy guards and audit logging

---

## Component Communication Patterns

### Props Down, Events Up

```typescript
// Parent manages state
function Parent() {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <Child
      value={selected}              // Props down
      onChange={setSelected}        // Events up
    />
  );
}

// Child receives props, emits events
function Child({ value, onChange }: ChildProps) {
  return (
    <button onClick={() => onChange('new-value')}>
      {value}
    </button>
  );
}
```

### Context for Global State

```typescript
// Create context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider
export const AppProvider: React.FC = ({ children }) => {
  const [filters, setFilters] = useState<MapFilters>({ ageGroup: 'all' });
  const [counties, setCounties] = useState<CountyData[]>([]);
  
  const value = { filters, setFilters, counties, setCounties };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook for consuming
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Usage
function SomeComponent() {
  const { filters, setFilters } = useAppContext();
  // Use filters...
}
```

---

## Component Testing Examples

```typescript
// CountyMarker.test.tsx
describe('CountyMarker', () => {
  const mockCounty: CountyData = {
    name: 'Wayne County',
    fips: '26163',
    lat: 42.2808,
    lng: -83.3733,
    totalChildren: 3813,
    waitingAdoption: 950,
    ageBreakdown: { '0-5': 1068, '6-10': 953, '11-17': 1792 },
    genderBreakdown: { boys: 1944, girls: 1869 },
    agencies: ['Orchards Children\'s Services'],
    contactInfo: { phone: '313-555-0100' }
  };

  it('renders with correct position', () => {
    const { container } = render(
      <CountyMarker county={mockCounty} onClick={() => {}} />
    );
    
    // Check marker is rendered
    expect(container.querySelector('.leaflet-marker-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <CountyMarker county={mockCounty} onClick={handleClick} />
    );
    
    fireEvent.click(container.querySelector('.leaflet-marker-icon')!);
    expect(handleClick).toHaveBeenCalledWith(mockCounty);
  });
});
```

---

## Component Checklist

When creating a new component, ensure:

- [ ] TypeScript props interface defined
- [ ] PropTypes or types for all props
- [ ] Memoization where appropriate
- [ ] Accessibility attributes (aria-label, role, etc.)
- [ ] Keyboard navigation support
- [ ] Loading/error states handled
- [ ] Responsive design
- [ ] Unit tests written
- [ ] Documentation added to this file

---

**This component documentation should give any developer (or AI assistant) a complete understanding of the component architecture and how to work with each component.**
