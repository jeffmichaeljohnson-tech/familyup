# Quick Start: Enhanced Graphics Mode

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

All required packages are already in package.json:
- ✅ three@^0.160.0
- ✅ @react-three/fiber@^8.15.12
- ✅ @react-three/drei@^9.95.0
- ✅ mapbox-gl@^3.0.1
- ✅ framer-motion@^10.16.16
- ✅ gsap@^3.12.4

### 2. Start Development Server
```bash
npm run dev
```

### 3. Enable 3D Graphics
1. Open http://localhost:5173
2. Click the **"🚀 Enable 3D Mode"** button (top-right corner)
3. Enjoy Snapchat+ quality visualizations!

## What You'll See

### 2D Mode (Default)
- Mapbox GL interactive map
- County markers with glow effects
- Pulsing animations
- Click counties for details

### 3D Mode (Enhanced)
- 3D terrain columns (height = child population)
- Thousands of GPU-accelerated particles
- Color-coded particles (blue = boys, pink = girls)
- Dramatic lighting and shadows
- Bloom/glow post-processing
- Auto fly-through camera animations

## Settings Panel

Click **"⚙️ Settings"** in 3D mode to adjust:

### Quality Presets
- **Ultra**: Best visuals (requires powerful GPU)
- **High**: Recommended for most systems
- **Medium**: Good for older hardware
- **Low**: Maximum compatibility

### Features
- ✅ Particle Effects
- ✅ Bloom & Glow
- ✅ Auto Fly-Through

## Controls (3D Mode)

| Action | Control |
|--------|---------|
| Rotate | Left-click + drag |
| Pan | Right-click + drag |
| Zoom | Scroll wheel |
| County Info | Click county |
| Performance Stats | Press F3 |

## Performance Tips

1. **Start with "High" quality** (recommended)
2. **If FPS < 30**, reduce to Medium or Low
3. **Press F3** to see real-time performance stats
4. **Disable auto fly-through** if experiencing lag

## File Summary

### New Components Created
```
src/
├── components/
│   ├── ParticleSystem.tsx       ← GPU particle system
│   ├── Enhanced3DMap.tsx        ← 3D map with effects
│   └── GraphicsToggle.tsx       ← Mode switcher
├── shaders/
│   ├── particleVertex.glsl.ts   ← Vertex shader
│   └── particleFragment.glsl.ts ← Fragment shader
└── utils/
    └── visualEffects.ts         ← Animation utilities
```

### Files Modified
- `src/App.tsx` ← Uses GraphicsToggle component

## Privacy Notice

All enhanced graphics maintain FamilyUp's strict privacy compliance:
- ✅ Aggregate county data only
- ✅ No individual locations
- ✅ No personal information
- ✅ Educational visualization only

## Troubleshooting

### Black Screen?
- Check browser console for errors
- Ensure hardware acceleration is enabled
- Try Chrome/Firefox browsers

### Low FPS?
- Reduce quality preset
- Close other applications
- Update graphics drivers

### Particles Not Visible?
- Check WebGL support: visit chrome://gpu
- Try different quality preset
- Update browser to latest version

## Next Steps

1. ✅ **Explore 3D mode** with different quality settings
2. ✅ **Try auto fly-through** for dramatic presentation
3. ✅ **Click counties** to see detailed information
4. ✅ **Check performance stats** (F3) to optimize

## Full Documentation

For complete documentation, see:
- 📖 `GRAPHICS_ENHANCEMENT_GUIDE.md` - Complete technical guide
- 📖 `README.md` - Project overview
- 📖 `src/components/` - Component source code

---

**Built with cutting-edge WebGL/Three.js technology for Snapchat+ quality graphics!** 🚀

Every particle represents a real child in Michigan's foster care system. 💙💗
