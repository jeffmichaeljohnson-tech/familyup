# FamilyUp - Michigan Foster Care Awareness Platform

> Cutting-edge visualization platform (Web + iOS) dramatizing the scale of children in Michigan's foster care system while maintaining complete privacy and legal compliance.

## 🚀 Quick Start - Live Development

### Install Dependencies
```bash
npm install
```

### Start Development Server (with Hot Reload)
```bash
npm run dev:open
```

This will:
- Start Vite development server on http://localhost:3000
- Automatically open your browser
- Enable hot module replacement (HMR) for instant visual updates
- Watch for file changes and reload automatically

### See Visual Changes Live

Every time you save a file, the browser will automatically update to show your changes! This includes:
- Component updates
- Style changes
- Data modifications
- Graphics adjustments

## 📁 Project Structure

```
familyup/
├── src/
│   ├── components/         # React components
│   │   └── InteractiveMap.tsx  # Main map with Mapbox GL
│   ├── data/              # County data (aggregate only)
│   │   └── countyData.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── colorScale.ts  # Heat map colors
│   │   └── distribution.ts # Icon distribution
│   ├── styles/            # CSS styles
│   │   └── index.css
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── docs/                  # Comprehensive documentation
├── public/                # Static assets
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript config
```

## 🎨 Visual Features Implemented

### Current Features
- ✅ Dark Mapbox GL map with dramatic styling
- ✅ County markers with heat map coloring
- ✅ Pulsing glow effects on counties
- ✅ Interactive popups with county statistics
- ✅ Child icon visualization (aggregate)
- ✅ Privacy notices and legal compliance
- ✅ Responsive sidebar with statistics
- ✅ Smooth animations and transitions

### Next Features to Add (for Snapchat+ Quality)
- 🔄 WebGL particle system for child icons
- 🔄 3D terrain elevation based on child count
- 🔄 Advanced shader effects
- 🔄 Camera animations
- 🔄 More dramatic lighting effects

## 🛠️ Making Visual Changes

### To Change Map Style
Edit `src/components/InteractiveMap.tsx` line ~47:
```typescript
style: 'mapbox://styles/mapbox/dark-v11', // Try: streets-v12, satellite-v9, etc.
```

### To Adjust Colors
Edit `src/utils/colorScale.ts`:
```typescript
export function getCountyColor(totalChildren: number): string {
  // Modify thresholds and colors here
}
```

### To Change Map Position/Zoom
Edit `src/components/InteractiveMap.tsx`:
```typescript
center: [-85.6024, 44.3148], // [lng, lat]
zoom: 6,                      // 0-20
pitch: 45,                    // 0-60 degrees
```

## 📊 Adding More Counties

Edit `src/data/countyData.ts` and add more county objects to the array.

## 🔒 Privacy & Legal Compliance

**CRITICAL: This project displays AGGREGATE DATA ONLY**

- ✅ County-level statistics (public data)
- ✅ No individual child information
- ✅ No exact GPS locations
- ✅ Random visualization positions
- ✅ Compliant with COPPA, FERPA, HIPAA
- ✅ Michigan state law compliant

## 📱 iOS Development (Coming Next)

The iOS version will use:
- React Native for cross-platform code sharing
- Native Swift modules for Metal graphics
- Same data sources (aggregate only)
- TestFlight for today's deployment

## 🌐 Deployment

### Web Deployment
```bash
npm run build
vercel --prod
```

### Preview Build Locally
```bash
npm run preview:open
```

## 📈 Performance Targets

- ✅ 60fps animations
- ✅ < 2s load time
- ✅ Lighthouse score 90+
- ✅ Mobile-optimized

## 🎯 Today's Goals

1. ✅ Web application with live preview
2. 🔄 Enhance graphics to Snapchat+ quality
3. 🔄 iOS TestFlight deployment
4. 🔄 Testing on actual iOS devices

---

**Built with privacy, compassion, and cutting-edge technology** 🏡💙
