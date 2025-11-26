# CLAUDE.md - FamilyUp Development Guide

> This file provides guidance for AI assistants working on the FamilyUp codebase.

## Project Overview

**FamilyUp** is a Michigan Foster Care Awareness Platform that visualizes the scale of children in foster care across Michigan's 83 counties. The platform runs on both **Web** (React + Vite) and **iOS** (Capacitor).

### Mission
Dramatize the vast number of children in foster care while maintaining **absolute privacy and legal compliance**. The platform displays only **aggregate county-level statistics** - never individual child information.

### Live Development
```bash
npm install        # Install dependencies
npm run dev:open   # Start dev server with hot reload at http://localhost:3000
```

---

## Tech Stack

### Core Technologies
- **React 18** + **TypeScript** - Frontend framework
- **Vite 5** - Build tool with HMR
- **Mapbox GL JS** - Interactive map rendering
- **Three.js / React Three Fiber** - 3D graphics and effects
- **Capacitor 7** - iOS/Android native wrapper
- **Tailwind CSS** - Styling

### Key Dependencies
| Package | Purpose |
|---------|---------|
| `mapbox-gl` / `react-map-gl` | Map visualization |
| `three` / `@react-three/fiber` / `@react-three/drei` | 3D graphics engine |
| `framer-motion` / `gsap` | Animations |
| `zustand` | State management |
| `supercluster` | Marker clustering |
| `better-sqlite3` | Local database |

---

## Project Structure

```
familyup/
├── src/
│   ├── components/          # React components
│   │   ├── InteractiveMap.tsx       # Main Mapbox map
│   │   ├── OptimizedInteractiveMap.tsx  # Performance-optimized version
│   │   ├── Enhanced3DMap.tsx        # 3D visualization
│   │   ├── CanvasRenderer.tsx       # WebGL rendering
│   │   ├── ParticleSystem.tsx       # Particle effects
│   │   ├── PerformanceMonitor.tsx   # FPS/performance tracking
│   │   └── GraphicsToggle.tsx       # Quality settings toggle
│   ├── data/
│   │   ├── allCounties.ts           # All 83 Michigan counties data
│   │   ├── countyData.ts            # County data utilities
│   │   ├── regions.ts               # Geographic regions
│   │   └── dbCounties.ts            # Database integration
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   ├── colorScale.ts            # Heat map color calculations
│   │   ├── distribution.ts          # Child icon distribution algorithm
│   │   ├── countyBoundaries.ts      # Geographic boundary checking
│   │   ├── clustering.ts            # Marker clustering logic
│   │   ├── performance.ts           # Performance utilities
│   │   ├── visualEffects.ts         # Visual effect helpers
│   │   ├── memorySystem.ts          # Session/memory management
│   │   └── dataValidation.ts        # Data validation utilities
│   ├── shaders/                     # WebGL/GLSL shaders
│   ├── styles/                      # CSS styles
│   ├── config/                      # Configuration files
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
├── ios/                             # Capacitor iOS project
├── docs/                            # Documentation
│   ├── DEVELOPMENT_GUIDE.md         # Comprehensive dev guide
│   ├── TECHNICAL_SPEC.md            # Technical specifications
│   ├── PRIVACY_POLICY.md            # Privacy policy
│   └── DATA_SCHEMA.md               # Data structure docs
├── .claude/                         # Claude Code configuration
│   ├── Skills/                      # 60+ skill packages (.zip)
│   ├── MEMORY_SYSTEM.md             # Memory system docs
│   └── AGENT_RULES.md               # Agent behavior rules
├── mcp-skills-server/               # MCP skills server
└── scripts/                         # Build/utility scripts
```

---

## Development Commands

### Primary Commands
```bash
npm run dev          # Start Vite dev server
npm run dev:open     # Start and open browser
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run type-check   # TypeScript type checking
```

### iOS Development (Capacitor)
```bash
npm run ios:build    # Build web + sync to iOS
npm run ios:open     # Build and open Xcode
npm run cap:sync:ios # Sync web assets to iOS
npm run cap:run:ios  # Run on iOS device/simulator
```

---

## Key Conventions

### TypeScript Standards
- **Strict mode enabled** - No implicit `any`
- **Use explicit types** - Always type function parameters and returns
- **Path aliases** - Use `@/` for imports from `src/` (e.g., `@/components/Map`)

### React Patterns
- **Functional components only** - No class components
- **Hooks for state** - useState, useEffect, useMemo, useCallback
- **Memoization required** for expensive computations
- **Performance target: 60fps** - Use PerformanceMonitor component

### Component Guidelines
```typescript
// Standard component structure
import React, { useState, useMemo, useCallback } from 'react';
import { CountyData } from '@/types';

interface ComponentProps {
  counties: CountyData[];
  onSelect?: (county: CountyData) => void;
}

export const Component: React.FC<ComponentProps> = ({ counties, onSelect }) => {
  const [selected, setSelected] = useState<CountyData | null>(null);

  const processed = useMemo(() =>
    counties.map(c => ({ ...c, color: getColor(c) })),
    [counties]
  );

  const handleClick = useCallback((county: CountyData) => {
    setSelected(county);
    onSelect?.(county);
  }, [onSelect]);

  return (/* JSX */);
};
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `InteractiveMap` |
| Functions/Variables | camelCase | `getCountyColor` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ZOOM_LEVEL` |
| Types/Interfaces | PascalCase | `CountyData` |
| Files | camelCase for utils, PascalCase for components | `colorScale.ts`, `InteractiveMap.tsx` |

---

## CRITICAL: Privacy & Legal Compliance

### Core Principles
1. **Aggregate Data Only** - Display county-level totals, NEVER individual records
2. **No User Tracking** - No cookies, analytics, or location tracking
3. **No PII Collection** - No forms collecting personal information
4. **Public Data Only** - Use only publicly available DHHS statistics

### Data Types - What's Allowed vs Prohibited

**ALLOWED:**
```typescript
interface CountyData {
  name: string;           // County name
  fips: string;           // County FIPS code
  totalChildren: number;  // AGGREGATE count
  ageBreakdown: {...};    // PERCENTAGES, not individuals
}
```

**PROHIBITED (Never include):**
```typescript
// NEVER store or display:
childName, dateOfBirth, address, caseNumber,
fosterParentInfo, schoolName, exactLocation,
medicalHistory, ipAddress, userLocation
```

### Legal Compliance
- **COPPA** - No data collection from users
- **FERPA** - Aggregate education statistics only
- **HIPAA** - No individual health information
- **MCL 722.621** - Michigan Child Protection Law compliance
- **MCL 722.954** - Foster Care Confidentiality compliance
- **ADA/WCAG 2.1 AA** - Accessibility requirements

### Before Every Commit
Verify:
- [ ] No PII in code or data
- [ ] No user tracking mechanisms
- [ ] Only county-level aggregate data
- [ ] No exact locations (only county centers)
- [ ] Minimum aggregate count of 10 per county

---

## Key Algorithms

### Color Scale (Heat Map)
Location: `src/utils/colorScale.ts`
```typescript
function getCountyColor(totalChildren: number): string {
  if (totalChildren >= 1000) return '#dc2626';  // Red - Very High
  if (totalChildren >= 500)  return '#f97316';  // Orange - High
  if (totalChildren >= 200)  return '#fbbf24';  // Yellow - Medium
  if (totalChildren >= 100)  return '#60a5fa';  // Blue - Low
  return '#93c5fd';                              // Light Blue - Very Low
}
```

### Child Icon Distribution
Location: `src/utils/distribution.ts`

The algorithm distributes child icons randomly within county boundaries for visualization:
1. Get county center or distribution centers
2. Use power-law distribution for natural clustering
3. Validate positions are on land (not water/Canada)
4. Assign age group and gender based on county ratios

### Boundary Checking
Location: `src/utils/countyBoundaries.ts`

Validates icon positions:
- Within Michigan state bounds
- Not on Great Lakes
- Not in Canada
- Within county polygon

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler config with chunk splitting |
| `tsconfig.json` | TypeScript config (strict mode, path aliases) |
| `capacitor.config.ts` | iOS/Android native config |
| `tailwind.config.js` | Tailwind CSS configuration |
| `.env.example` | Environment variable template |

### Vite Chunk Splitting
The build splits into optimized chunks:
- `react-vendor` - React, ReactDOM, Router
- `map-vendor` - Mapbox GL, react-map-gl
- `3d-vendor` - Three.js, React Three Fiber
- `animation-vendor` - Framer Motion, GSAP

---

## Testing

### Test Commands
```bash
npm test              # Run tests
npm run type-check    # TypeScript validation
npm run lint          # ESLint checks
```

### Coverage Targets
- Utilities: 100%
- Components: 90%+
- Overall: 90%+

### Key Test Areas
- Distribution algorithm boundary checking
- Color scale calculations
- Component rendering with different data
- Accessibility (keyboard navigation, screen readers)

---

## Common Tasks

### Adding a New County
1. Add data to `src/data/allCounties.ts`
2. Include: name, fips, lat/lng (county center), aggregate stats
3. Optionally add distribution centers for large counties

### Modifying Map Style
Edit `src/components/InteractiveMap.tsx`:
```typescript
style: 'mapbox://styles/mapbox/dark-v11',  // Map style
center: [-85.6024, 44.3148],                // Michigan center
zoom: 6,                                     // Initial zoom
pitch: 45,                                   // 3D tilt
```

### Adding Visual Effects
1. Create effect in `src/shaders/` or `src/utils/visualEffects.ts`
2. Integrate in `ParticleSystem.tsx` or `CanvasRenderer.tsx`
3. Test performance with `PerformanceMonitor`
4. Add quality toggle in `GraphicsToggle.tsx`

### iOS Deployment
1. Build: `npm run ios:build`
2. Open Xcode: `npm run cap:open:ios`
3. Configure signing in Xcode
4. Build and run on device/simulator

---

## Environment Variables

Create `.env` from `.env.example`:
```env
VITE_MAPBOX_TOKEN=pk.xxx          # Mapbox API token (required)
VITE_ENABLE_ANALYTICS=false       # Analytics (should remain false)
VITE_MARE_PHONE=1-800-589-6273    # MARE contact number
```

---

## MCP & Skills System

The project includes an MCP (Model Context Protocol) configuration in `.claude/`:

### Available MCP Servers
- **GitHub** - Repository operations
- **SQLite** - Database + memory system
- **Skills** - 60+ skill packages in `.claude/Skills/`

### Memory System
Session and long-term memory via SQLite:
```typescript
import { storeLongTermMemory, getLongTermMemory } from '@/utils/memorySystem';
```

See `.claude/MEMORY_SYSTEM.md` for details.

---

## Git Workflow

### Branch Naming
```
feature/county-filter-panel
bugfix/map-zoom-issue
hotfix/critical-data-error
docs/update-readme
```

### Commit Messages
```
feat: Add county filter functionality
fix: Correct boundary checking for Upper Peninsula
docs: Update API documentation
refactor: Simplify distribution algorithm
test: Add unit tests for colorScale
chore: Update dependencies
```

---

## Performance Guidelines

### Targets
- **60fps** animations
- **< 2s** initial load
- **Lighthouse 90+** score
- **Bundle < 150KB** gzipped (excluding vendor chunks)

### Optimization Checklist
- [ ] Memoize expensive calculations with `useMemo`
- [ ] Use `useCallback` for event handlers
- [ ] Lazy load routes with `React.lazy()`
- [ ] Enable adaptive quality for graphics
- [ ] Test on low-end devices

---

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels)
- Color contrast 4.5:1 minimum
- No content flashing > 3 times/second
- Text resizable to 200%

---

## Troubleshooting

### Common Issues

**Mapbox not loading:**
- Check `VITE_MAPBOX_TOKEN` in `.env`
- Verify token has correct scopes

**iOS build fails:**
- Run `npm run cap:sync:ios`
- Check Xcode signing configuration
- Ensure CocoaPods installed: `cd ios && pod install`

**Performance issues:**
- Use `PerformanceMonitor` component
- Check chunk loading in Network tab
- Enable adaptive quality

**TypeScript errors:**
- Run `npm run type-check`
- Check for missing type imports
- Verify `@/` path alias configuration

---

## Documentation References

| Document | Purpose |
|----------|---------|
| `docs/DEVELOPMENT_GUIDE.md` | Comprehensive coding standards |
| `docs/TECHNICAL_SPEC.md` | Technical architecture |
| `docs/PRIVACY_POLICY.md` | Privacy compliance |
| `IOS_README.md` | iOS-specific setup |
| `TESTFLIGHT_GUIDE.md` | iOS TestFlight deployment |

---

## Quick Reference

### Most Important Files
- `src/App.tsx` - Main application component
- `src/components/InteractiveMap.tsx` - Primary map component
- `src/data/allCounties.ts` - County data (83 counties)
- `src/utils/colorScale.ts` - Heat map colors
- `src/types/index.ts` - TypeScript interfaces

### Emergency Contacts (in code)
- MARE Phone: `1-800-589-6273`
- Default email: `info@mare.org`

---

**Remember: Privacy and child protection are paramount. When in doubt about any data handling, err on the side of caution and use only aggregate, county-level statistics.**
