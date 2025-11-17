# FamilyUp - Michigan Foster Care Awareness Platform

> An ethical, privacy-first multi-platform application (website + iOS app) that humanizes Michigan's foster care system through cutting-edge visualization and aggregate county-level data, driving awareness and increasing adoptions.

---

## 🎯 Project Mission

**Primary Goal:** Help 160-320 more Michigan children find permanent homes annually by making the invisible visible through dramatic visualization of the vast number of children in need.

**How:** Cutting-edge interactive map with Snapchat-quality (or better) graphics showing the scope and geographic distribution of children waiting for adoption, combined with accurate information about the adoption process.

**Core Principle:** Privacy-first approach using ONLY publicly available aggregate statistics - never individual child information, exact locations, or personally identifiable data.

**Deployment Target:** Initial MVP deployment TODAY with website and iOS app, including full iOS testing.

**Legal Compliance:** All software fully complies with national, state, and local laws regarding child privacy, data protection, and ethical representation.

---

## 📊 The Impact

### The Problem
- **~10,000 children** in Michigan's foster care system
- **250-300 children** waiting for adoption without identified families
- **1,600-2,000 youth** aging out annually without permanent homes
- **Common misconceptions** about cost ($0-$150 actual vs $30k-$60k perceived)

### Our Solution
An interactive map that:
- ✅ Shows realistic geographic distribution across all 83 Michigan counties
- ✅ Provides accurate, encouraging information about adoption
- ✅ Creates direct pathways to action (contact MARE)
- ✅ Maintains strict ethical standards around data privacy

---

## 🚀 Quick Start

### Deployment Platforms

**Website (Web App)**
- Responsive web application
- Cutting-edge map graphics with Snapchat+ quality
- Accessible via all modern browsers
- PWA support for mobile web

**iOS App (Native)**
- Native iOS application built with React Native / Swift
- Optimized for iPhone and iPad
- TestFlight deployment for today's testing
- App Store submission ready

### For Developers

**Web Development**
```bash
# Clone the repository
git clone https://github.com/your-org/familyup.git
cd familyup

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

**iOS Development**
```bash
# Navigate to iOS directory
cd ios

# Install iOS dependencies
pod install

# Open in Xcode
open FamilyUp.xcworkspace

# Run on simulator
npm run ios

# Build for TestFlight
npm run build:ios
```

### For AI Coding Assistants

**Essential Documentation:**
1. **[PROJECT.md](./PROJECT.md)** - Complete project overview, context, and philosophy
2. **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Detailed technical architecture and specifications
3. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Coding standards and best practices
4. **[COMPONENTS.md](./COMPONENTS.md)** - Component architecture and API documentation
5. **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** - Data structures and schemas

**Start Here:**
- New to the project? Read **PROJECT.md** first
- Building a feature? Check **COMPONENTS.md** and **TECHNICAL_SPEC.md**
- Fixing a bug? Review **DEVELOPMENT_GUIDE.md** for standards
- Working with data? See **DATA_SCHEMA.md**

---

## 📁 Project Structure

```
michigan-foster-map/
├── docs/                          # 📚 Documentation
│   ├── PROJECT.md                 # Complete project overview
│   ├── TECHNICAL_SPEC.md          # Technical architecture
│   ├── DEVELOPMENT_GUIDE.md       # Coding standards
│   ├── COMPONENTS.md              # Component documentation
│   └── DATA_SCHEMA.md             # Data structures
│
├── src/
│   ├── components/                # 🧩 React components
│   │   ├── Map/                   # Map-related components
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── CountyMarker.tsx
│   │   │   ├── ChildIcon.tsx
│   │   │   └── CustomPopup.tsx
│   │   ├── Sidebar/               # Sidebar components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── Legend.tsx
│   │   ├── Header/                # Header component
│   │   └── Common/                # Reusable components
│   │
│   ├── data/                      # 📊 Static data
│   │   ├── countyData.ts          # All 83 Michigan counties
│   │   ├── michiganBoundaries.json # GeoJSON boundaries
│   │   └── constants.ts           # App constants
│   │
│   ├── types/                     # 📝 TypeScript definitions
│   │   └── index.ts               # All type definitions
│   │
│   ├── utils/                     # 🛠️ Utility functions
│   │   ├── colorScale.ts          # Heat map colors
│   │   ├── boundaryCheck.ts       # Geographic validation
│   │   ├── distribution.ts        # Icon distribution algorithm
│   │   └── calculations.ts        # Statistical utilities
│   │
│   ├── hooks/                     # 🎣 Custom React hooks
│   │   ├── useMapFilters.ts
│   │   └── useCountyData.ts
│   │
│   ├── App.tsx                    # 📱 Root component
│   └── index.tsx                  # 🚀 Application entry
│
├── public/                        # 🌐 Static assets
├── package.json                   # 📦 Dependencies
├── tsconfig.json                  # ⚙️ TypeScript config
└── README.md                      # 📖 This file
```

---

## 🔑 Key Features

### 1. Interactive County Map
- **Heat map coloring** based on child population
- **All 83 Michigan counties** represented
- **Clickable markers** with detailed statistics
- **Smooth zoom and pan** interactions

### 2. Geographic Distribution Algorithm
- **Realistic placement** using power-law distribution
- **Multi-center spread** for large counties (Detroit, Grand Rapids)
- **Boundary validation** (no water, no Canada)
- **Natural clustering** based on population density

### 3. Individual Child Icons
- **Each icon = 1 child** (aggregate representation)
- **Gender color-coding**: 👦 Blue (boys) | 👧 Pink (girls)
- **Age group filtering**: 0-5, 6-10, 11-17 years
- **Hover effects** for engagement

### 4. Statistics Dashboard
- **Statewide totals** (10,000 in care, 250 waiting)
- **County breakdowns** (age, gender, agencies)
- **Real-time filtering** by age group
- **Map legend** for easy interpretation

### 5. Educational Content
- **Complete adoption process** guide
- **Cost breakdown** ($0-$150 total)
- **Eligibility requirements** (anyone 18+)
- **Financial support info** ($500-$700/month subsidy)

### 6. Direct Call-to-Action
- **MARE hotline**: 1-800-589-MARE
- **One-click calling** on mobile
- **Visible on every page**
- **County-specific resources**

---

## 🛠️ Technology Stack

### Web Platform
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Advanced Graphics Engine** - Cutting-edge map visualization (Snapchat+ quality)
  - WebGL-accelerated rendering
  - Custom shaders for dramatic effects
  - Smooth animations and transitions
  - Particle effects for emotional impact
- **Mapbox GL JS / Three.js** - 3D map rendering with cinematic quality
- **Tailwind CSS** - Styling framework

### iOS Platform
- **React Native / Swift** - Native iOS development
- **Metal API** - High-performance 3D graphics rendering
- **MapKit / Custom GL Renderer** - Advanced map visualization
- **Core Location** - Geographic services (aggregate data only)
- **TestFlight** - Beta testing platform

### Why These Choices?
- ✅ **Cutting-edge graphics** (Snapchat+ quality visualization)
- ✅ **Cross-platform** (Web + iOS with shared codebase where possible)
- ✅ **Excellent performance** (60fps animations, < 2s load time)
- ✅ **Privacy-first** (zero personal data collection, aggregate only)
- ✅ **Legally compliant** (COPPA, FERPA, state privacy laws)
- ✅ **Accessible** (WCAG 2.1 AA compliant)
- ✅ **Scalable** (handles all 83 counties + 10,000 icons smoothly)

See **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** for complete architecture details.

---

## 📐 Data Schema

### CountyData
```typescript
interface CountyData {
  name: string;              // "Wayne County"
  fips: string;              // "26163"
  lat: number;               // 42.2808
  lng: number;               // -83.3733
  totalChildren: number;     // 3813
  waitingAdoption: number;   // 950
  ageBreakdown: {
    "0-5": number;           // 1068
    "6-10": number;          // 953
    "11-17": number;         // 1792
  };
  genderBreakdown: {
    boys: number;            // 1944
    girls: number;           // 1869
  };
  agencies: string[];
  contactInfo: { phone, email?, website? };
  distributionCenters?: DistributionCenter[];
}
```

See **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** for complete data documentation.

---

## 🎨 Component Architecture

### Hierarchy
```
App
├── Header
├── InteractiveMap
│   ├── CountyMarker (×83)
│   └── ChildIcon (×3,813)
└── Sidebar
    ├── StatCard (×3)
    ├── FilterPanel
    ├── Legend
    └── ContactCTA
```

### Key Components
- **InteractiveMap** - Main Leaflet map with markers
- **CountyMarker** - Individual county with popup
- **ChildIcon** - Single child representation (👦/👧)
- **Sidebar** - Statistics and filters
- **FilterPanel** - Age group filtering

See **[COMPONENTS.md](./COMPONENTS.md)** for complete component documentation.

---

## 🔐 Privacy & Ethics

### Legal Compliance Framework
**FamilyUp strictly complies with all applicable laws:**

**Federal Laws:**
- COPPA (Children's Online Privacy Protection Act)
- FERPA (Family Educational Rights and Privacy Act)
- HIPAA (Health Insurance Portability and Accountability Act)
- Americans with Disabilities Act (ADA)

**State Laws:**
- Michigan Child Protection Law
- Michigan Data Privacy Act
- State foster care confidentiality requirements

**Local Regulations:**
- County-specific child welfare regulations
- Municipal data protection ordinances

### What We Show (Aggregate Data Only)
- ✅ County-level aggregate numbers (never specific locations)
- ✅ Age group statistics in ranges (0-5, 6-10, 11-17)
- ✅ Gender ratios as percentages (51% boys, 49% girls)
- ✅ Public agency information
- ✅ Dramatic visualization showing the SCALE of children in need
- ✅ Geographic distribution patterns (NOT exact locations)

### What We NEVER Show or Collect
- ❌ Individual child names, photos, or identities
- ❌ Exact addresses or specific locations
- ❌ School information or neighborhoods
- ❌ Case details or family information
- ❌ Medical or psychological data
- ❌ Any data that could identify a specific child
- ❌ GPS coordinates of individual children
- ❌ User location data or personal information
- ❌ Tracking cookies or behavioral data

### Data Sources
- **AFCARS** (federal database - publicly available aggregates)
- **Michigan DHHS** (state agency - official statistics)
- **MARE** (Michigan Adoption Resource Exchange)

**All data is publicly available, appropriately aggregated, and compliant with all privacy regulations. The goal is to dramatize the vast number of children in need WITHOUT compromising any individual's privacy or safety.**

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Test coverage
npm run test:coverage

# E2E tests (future)
npm run test:e2e
```

### Coverage Goals
- **Utilities**: 100%
- **Components**: 90%+
- **Hooks**: 95%+
- **Overall**: 90%+

### What We Test
- ✅ Component rendering
- ✅ User interactions
- ✅ Data transformations
- ✅ Boundary validation
- ✅ Filter logic
- ✅ Accessibility

---

## 🚢 Deployment

### TODAY'S DEPLOYMENT TARGETS

**Website Deployment (Production)**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Verify deployment
npm run test:production
```

**iOS App Deployment (TestFlight)**
```bash
# Build iOS app
cd ios
npm run build:ios

# Upload to TestFlight
fastlane beta

# Send to internal testers
fastlane distribute_internal

# Monitor crash reports
npm run monitor:ios
```

### Deployment Checklist for TODAY

**Website:**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Lighthouse score 90+ (all metrics)
- [ ] Privacy audit complete
- [ ] Legal compliance verified
- [ ] Graphics performance validated (60fps)
- [ ] Cross-browser testing complete
- [ ] Production deployment successful
- [ ] Monitoring active

**iOS App:**
- [ ] Xcode build successful
- [ ] TestFlight upload complete
- [ ] Internal testing initiated
- [ ] Graphics rendering validated on devices
- [ ] Privacy settings verified
- [ ] Location services disabled (aggregate data only)
- [ ] App Store compliance check passed
- [ ] Beta testers invited

### Performance Requirements
- ✅ First Contentful Paint: < 1.5s (web), < 1s (iOS)
- ✅ Time to Interactive: < 2s (web), < 1.5s (iOS)
- ✅ Graphics: 60fps smooth animations
- ✅ Map rendering: Snapchat+ quality
- ✅ Lighthouse Score: 90+ all metrics
- ✅ Mobile-friendly (responsive web + native iOS)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Privacy compliant (zero tracking, aggregate data only)

---

## 📊 Success Metrics

### Primary KPIs (12 months)
- **Unique Visitors**: 10,000+
- **Avg Session Duration**: 3+ minutes
- **MARE Contact Rate**: 5%+ conversion
- **Adoption Inquiries**: +15-20%
- **Completed Adoptions**: +10% (160 children)

### Analytics Tracking
- Page views and navigation
- County clicks and filters used
- CTA button clicks
- MARE phone calls (trackable number)
- Referral sources

---

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Coding Standards**
   - See **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**
   - Run `npm run lint` before committing
   - Write tests for new features

3. **Commit with Convention**
   ```bash
   git commit -m "feat: Add county filtering by region"
   ```

4. **Create Pull Request**
   - Fill out PR template
   - Request review
   - Address feedback

5. **Merge & Deploy**

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript types properly defined
- [ ] Tests written and passing
- [ ] Accessibility considered
- [ ] Documentation updated
- [ ] No console.logs in production

---

## 📞 Support & Contact

### Technical Questions
- GitHub Issues for bugs/features
- Technical Lead: [to be assigned]

### Data Questions
- Michigan DHHS: (517) 256-1060
- MARE: 1-800-589-MARE

### General Inquiries
- Project Manager: [to be assigned]

---

## 📄 License

This project is licensed under [LICENSE TYPE] - see LICENSE file for details.

**Important:** This project serves vulnerable children. All contributors must:
- Respect privacy and ethical guidelines
- Use only approved data sources
- Follow security best practices
- Maintain professional standards

---

## 🙏 Acknowledgments

### Data Sources
- **Michigan Department of Health and Human Services**
- **AFCARS (Adoption and Foster Care Analysis Reporting System)**
- **Michigan Adoption Resource Exchange (MARE)**

### Technology
- **Leaflet.js** for mapping
- **OpenStreetMap** for tiles
- **React** and **TypeScript** communities

### Inspiration
Every child deserves a loving, permanent home. This project exists to help make that happen.

---

## 📚 Additional Resources

### Documentation
- **[PROJECT.md](./PROJECT.md)** - Complete project context and philosophy
- **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Technical architecture details
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Coding standards and practices
- **[COMPONENTS.md](./COMPONENTS.md)** - Component API documentation
- **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** - Data structures and validation

### External Links
- [MARE Website](https://www.mare.org)
- [Michigan DHHS](https://www.michigan.gov/mdhhs)
- [AFCARS Data](https://www.acf.hhs.gov/cb/research-data-technology/reporting-systems/afcars)

### Related Projects
- [AdoptUSKids](https://www.adoptuskids.org/) - National adoption resource
- [Dave Thomas Foundation](https://davethomasfoundation.org/) - Foster care advocacy

---

## 🎯 Quick Reference

### Common Commands
```bash
npm start              # Start development server
npm test               # Run tests
npm run build          # Build for production
npm run lint           # Check code style
npm run type-check     # Check TypeScript types
```

### Important Files
- `src/App.tsx` - Root component
- `src/data/countyData.ts` - All county data
- `src/types/index.ts` - TypeScript definitions
- `src/components/Map/InteractiveMap.tsx` - Main map

### Key Constants
- **MARE Phone**: 1-800-589-MARE (1-800-589-6273)
- **Total Counties**: 83
- **Total Children**: ~10,000
- **Waiting for Adoption**: ~250-300

---

## 🔄 Version History

- **v1.0** (Current) - Full production release with all 83 counties
- **v0.9** - Beta testing with realistic distribution
- **v0.5** - Initial prototype with 10 counties
- **v0.1** - Research and planning phase

---

## 💡 Development Tips

### For New Developers
1. **Start with PROJECT.md** to understand the mission
2. **Review TECHNICAL_SPEC.md** for architecture
3. **Follow DEVELOPMENT_GUIDE.md** for standards
4. **Check COMPONENTS.md** when building features
5. **Reference DATA_SCHEMA.md** when working with data

### For AI Assistants
- All documentation uses consistent TypeScript types
- Component props are fully documented with examples
- Data validation functions provided
- Common patterns documented in DEVELOPMENT_GUIDE.md
- Test examples provided for each component type

### Common Patterns
```typescript
// Loading data
const { data, isLoading, error } = useCountyData();

// Filtering
const filtered = useMemo(
  () => applyFilters(counties, filters),
  [counties, filters]
);

// Error handling
if (error) return <ErrorMessage message={error} />;
if (isLoading) return <LoadingSpinner />;
```

---

## 🌟 Project Values

### Privacy First
Never compromise on child safety or data privacy. Every decision should protect the children we're trying to help.

### Accuracy Matters
All statistics must be verifiable from official sources. When in doubt, cite the source.

### Accessibility Required
Not optional. Every user should be able to access this information regardless of ability.

### Performance Critical
Many users will be on mobile with slower connections. Respect their time and data.

### Empathy in Design
Remember these are real children waiting for homes. Design with empathy and respect.

---

**This project is about more than technology - it's about giving children hope and helping families grow. Thank you for contributing.** 🏡💙

---

## 📞 Emergency Contacts

**Michigan Adoption Resource Exchange (MARE)**
- Phone: 1-800-589-MARE (1-800-589-6273)
- Email: mare@judsoncenter.org
- Website: https://www.mare.org

**Michigan DHHS Adoption Services**
- Phone: (517) 256-1060
- Website: https://www.michigan.gov/mdhhs

**National Adoption Hotline**
- Phone: 1-888-200-4005
- Website: https://www.adoptuskids.org

---

*Last Updated: November 2025*
*Version: 1.0*
*Status: Production Ready*
