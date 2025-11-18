# Mapbox iOS Token Configuration Guide for Capacitor

**Complete guide to fixing 403 errors when deploying Mapbox GL JS apps to iOS with Capacitor**

## Table of Contents
1. [Problem Overview](#problem-overview)
2. [Step-by-Step Token Configuration](#step-by-step-token-configuration)
3. [Code Implementation](#code-implementation)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Testing & Verification](#testing--verification)

---

## Problem Overview

### The Issue
When deploying Mapbox GL JS applications to iOS using Capacitor, you may encounter **403 Forbidden** errors when the map tries to load tiles, styles, or other resources. This happens because:

1. Capacitor iOS apps run from the `capacitor://localhost` protocol (not `http://` or `https://`)
2. Mapbox tokens created through the web interface don't include this protocol in their URL allowlist by default
3. Without proper URL restrictions, Mapbox API requests are blocked for security reasons

### The Solution
Create a properly configured Mapbox token with:
- The `capacitor://localhost` URL explicitly allowed
- Correct token scopes (especially `DOWNLOADS:READ`)
- Proper environment variable configuration

**Related GitHub Issue**: [mapbox/mapbox-gl-js#11170](https://github.com/mapbox/mapbox-gl-js/issues/11170)

---

## Step-by-Step Token Configuration

### Step 1: Access Your Mapbox Account

1. Navigate to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign in to your Mapbox account
3. Click on **"Tokens"** in the left sidebar

### Step 2: Create a New Token

1. Click the **"Create a token"** button (blue button in top-right)
2. Give your token a descriptive name, such as:
   - `FamilyUp iOS Production`
   - `familyup-capacitor-ios`
   - `ios-mobile-app-token`

### Step 3: Configure Token Scopes

**CRITICAL**: You must enable the correct scopes for iOS deployment.

#### Required Scopes:
Check the following boxes in the "Token scopes" section:

- **Public Scopes** (all checked by default - leave them):
  - `styles:tiles` - Read styles and tiles
  - `styles:read` - Read styles
  - `fonts:read` - Read fonts
  - `datasets:read` - Read datasets
  - `vision:read` - Read vision

- **Secret Scopes** (MUST manually enable):
  - **`downloads:read`** ← **CRITICAL FOR iOS**
    - This scope is required for mobile apps
    - Without it, you'll get 403 errors on iOS
    - Location in dashboard: Under "Secret scopes" section

#### Dashboard Screenshot Description:
```
Token scopes section:
┌─────────────────────────────────────────────┐
│ Public scopes                                │
│ ☑ styles:tiles                              │
│ ☑ styles:read                               │
│ ☑ fonts:read                                │
│ ☑ datasets:read                             │
│ ☑ vision:read                               │
│                                              │
│ Secret scopes                                │
│ ☑ downloads:read  ← MUST CHECK THIS         │
│ ☐ styles:list                               │
│ ☐ styles:write                              │
│ ☐ fonts:list                                │
│ ... (other scopes)                          │
└─────────────────────────────────────────────┘
```

### Step 4: Configure URL Restrictions

**CRITICAL**: This is the key step that fixes the 403 error.

1. Scroll down to the **"Token restrictions"** section
2. Under **"URL restrictions"**, click **"Add a URL"**
3. Add the following URLs (one per line):

```
capacitor://localhost
http://localhost:5173
http://localhost:4173
https://your-production-domain.com
```

#### Explanation of Each URL:

| URL | Purpose |
|-----|---------|
| `capacitor://localhost` | **Required for iOS** - Capacitor's iOS protocol |
| `http://localhost:5173` | Vite dev server (development) |
| `http://localhost:4173` | Vite preview server (pre-production testing) |
| `https://your-production-domain.com` | Your actual production web URL |

**IMPORTANT**: The `capacitor://localhost` URL is **non-negotiable** for iOS. Without it, you'll get 403 errors.

#### Dashboard Screenshot Description:
```
Token restrictions section:
┌─────────────────────────────────────────────┐
│ URL restrictions                             │
│                                              │
│ Restrict this token to specific URLs        │
│ ┌─────────────────────────────────────────┐ │
│ │ capacitor://localhost                   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ http://localhost:5173                   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ http://localhost:4173                   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ https://familyup.org                    │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ [+ Add a URL]                               │
└─────────────────────────────────────────────┘
```

### Step 5: Create the Token

1. Review your token configuration:
   - ✅ `downloads:read` scope is checked
   - ✅ `capacitor://localhost` is in URL restrictions
   - ✅ Token name is descriptive
2. Click the **"Create token"** button at the bottom
3. **IMMEDIATELY COPY YOUR TOKEN** - you won't see it again!

Your token will look like:
```
pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG1pM28wNWw2MXNlZDJrcHdhaHJuY3M4ZyJ9.aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

---

## Code Implementation

### Option 1: Environment Variables (Recommended)

#### Update `InteractiveMap.tsx`

Replace the hardcoded token on line 17 with an environment variable:

**Before:**
```tsx
// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiamVmZm1pY2hhZWxqb2huc29uLXRlY2giLCJhIjoiY21pM28wNWw2MXNlZDJrcHdhaHJuY3M4ZyJ9.LD85_bwC_M-3JKjhjtDhqQ';
```

**After:**
```tsx
// Mapbox token - configured for iOS Capacitor deployment
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Validate token is present
if (!mapboxgl.accessToken) {
  console.error('❌ MAPBOX TOKEN MISSING - Check your .env file!');
  console.error('Required: VITE_MAPBOX_TOKEN environment variable');
}
```

#### Full Updated Component (lines 16-23):
```tsx
import { debugLog } from '../utils/debugLog';

// Mapbox token - configured for iOS Capacitor deployment
// Token must include:
// - Scope: downloads:read (required for mobile)
// - URL: capacitor://localhost (required for iOS)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Validate token is present
if (!mapboxgl.accessToken) {
  console.error('❌ MAPBOX TOKEN MISSING - Check your .env file!');
  console.error('Required: VITE_MAPBOX_TOKEN environment variable');
  console.error('See docs/MAPBOX_IOS_SETUP.md for configuration guide');
}

interface InteractiveMapProps {
  counties: CountyData[];
  onCountyClick?: (county: CountyData) => void;
}
```

### Option 2: Direct Token Replacement (Not Recommended for Production)

If you must use a hardcoded token for testing:

```tsx
// TEMPORARY: Replace with your iOS-compatible token for testing
// TODO: Move to environment variable before committing
mapboxgl.accessToken = 'pk.your_new_ios_compatible_token_here';
```

**Warning**: Never commit tokens directly to source code! Use environment variables.

---

## Environment Variables Setup

### Step 1: Update `.env` File

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your new token:
   ```bash
   # FamilyUp Environment Variables

   # Mapbox Access Token (required for production)
   # Get yours at https://account.mapbox.com/access-tokens/
   # Token must include:
   # - Scope: downloads:read (for iOS/mobile)
   # - URL restriction: capacitor://localhost (for iOS)
   VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG1...your_full_token

   # Development Settings
   VITE_DEV_MODE=true
   VITE_ENABLE_ANALYTICS=false

   # Privacy Settings (DO NOT CHANGE - Legal Requirement)
   VITE_COLLECT_PII=false
   VITE_TRACK_LOCATION=false
   VITE_AGGREGATE_DATA_ONLY=true
   ```

### Step 2: Update `.env.example` (Optional)

Update the example file with better instructions:

```bash
# Mapbox Access Token (required for production)
# Get yours at https://account.mapbox.com/access-tokens/
#
# IMPORTANT FOR iOS DEPLOYMENT:
# - Enable scope: downloads:read
# - Add URL restriction: capacitor://localhost
# - See docs/MAPBOX_IOS_SETUP.md for full guide
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### Step 3: Verify `.gitignore` Protection

Confirm `.env` is listed in `.gitignore` (already configured in your project):

```bash
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

✅ Your `.gitignore` already includes these patterns - tokens are protected!

---

## Security Best Practices

### ✅ DO:
1. **Use environment variables** for all tokens
2. **Add `.env` to `.gitignore`** (already done in this project)
3. **Use URL restrictions** to limit where tokens work
4. **Create separate tokens** for development, staging, and production
5. **Rotate tokens periodically** (every 6-12 months)
6. **Use minimal scopes** - only enable what you need
7. **Share tokens securely** via password managers (1Password, LastPass, etc.)

### ❌ DON'T:
1. **Never commit tokens to Git** (even in private repos)
2. **Never share tokens in Slack/email** as plain text
3. **Never use the same token** for web and mobile
4. **Never give tokens more scopes** than needed
5. **Never skip URL restrictions** (always use them)
6. **Never put tokens in client-side code** without restrictions

### Token Management Checklist

- [ ] Token has `downloads:read` scope enabled
- [ ] Token includes `capacitor://localhost` in URL restrictions
- [ ] Token is stored in `.env` file (not committed)
- [ ] `.env` is in `.gitignore`
- [ ] Code uses `import.meta.env.VITE_MAPBOX_TOKEN`
- [ ] `.env.example` has placeholder (not real token)
- [ ] Production token is different from development token
- [ ] Team members have their own tokens

---

## Troubleshooting

### Problem: 403 Forbidden Error on iOS

**Symptoms:**
- Map loads fine in browser
- Map fails with 403 error in iOS simulator/device
- Console shows: `Failed to load resource: the server responded with a status of 403`

**Solution:**
1. Verify `capacitor://localhost` is in token's URL restrictions
2. Verify `downloads:read` scope is enabled
3. Clear app data and reinstall:
   ```bash
   npx cap sync ios
   npx cap open ios
   # Then: Clean Build Folder in Xcode (Cmd+Shift+K)
   ```

### Problem: Token Not Found / Blank Map

**Symptoms:**
- Map container is visible but no tiles load
- Console shows: `MAPBOX TOKEN MISSING`
- White/gray blank map

**Solution:**
1. Check `.env` file exists in project root
2. Verify `VITE_MAPBOX_TOKEN` is set correctly
3. Restart dev server:
   ```bash
   npm run dev
   ```
4. Check token format starts with `pk.` (public token)

### Problem: Token Works in Web but Not in iOS

**Symptoms:**
- `http://localhost:5173` works perfectly
- iOS build shows 403 errors

**Root Cause:**
Token missing `capacitor://localhost` in URL restrictions

**Solution:**
1. Go to [Mapbox tokens page](https://account.mapbox.com/access-tokens/)
2. Find your token and click "Edit"
3. Add `capacitor://localhost` to URL restrictions
4. Save changes
5. Rebuild iOS app:
   ```bash
   npx cap sync ios
   ```

### Problem: Map Loads Slowly on iOS

**Symptoms:**
- Map eventually loads but takes 10+ seconds
- Tiles load one-by-one slowly

**Possible Causes:**
1. Network throttling in simulator
2. Token missing `downloads:read` scope (causes fallback to slower method)
3. Large number of markers (13,000+ in your case)

**Solutions:**
1. Verify `downloads:read` scope is enabled
2. Test on physical device (simulators are slower)
3. Consider marker clustering for performance (future optimization)

### Problem: "Invalid Token" Error

**Symptoms:**
- Console shows: `Unauthorized: Access token is invalid`

**Solutions:**
1. Verify token was copied completely (they're long!)
2. Check for extra spaces/newlines in `.env` file
3. Verify token hasn't been deleted from Mapbox dashboard
4. Create a new token if the old one was deleted

---

## Testing & Verification

### Pre-Deployment Checklist

Before deploying to iOS, verify:

#### 1. Token Configuration
- [ ] Token created on Mapbox dashboard
- [ ] `downloads:read` scope is enabled
- [ ] `capacitor://localhost` is in URL restrictions
- [ ] Token is copied to `.env` as `VITE_MAPBOX_TOKEN`

#### 2. Code Configuration
- [ ] `InteractiveMap.tsx` uses `import.meta.env.VITE_MAPBOX_TOKEN`
- [ ] No hardcoded tokens in source code
- [ ] `.env` is in `.gitignore`
- [ ] Token validation code is present

#### 3. Development Testing
- [ ] Map loads in browser (`npm run dev`)
- [ ] No console errors about missing token
- [ ] All 13,596+ child markers render correctly
- [ ] Navigation controls work

#### 4. iOS Testing
- [ ] Capacitor iOS configured (`npx cap add ios`)
- [ ] iOS build succeeds (`npx cap sync ios`)
- [ ] Map loads in iOS simulator
- [ ] Map loads on physical iPhone/iPad
- [ ] No 403 errors in Xcode console

### Step-by-Step Testing Process

#### Test 1: Development Environment
```bash
# 1. Start dev server
npm run dev

# 2. Open in browser
# http://localhost:5173

# 3. Verify in console:
# ✓ Mapbox initialized successfully
# ✓ Mapbox map loaded successfully
# ✓ Rendered 13,596 markers in XXms
```

**Expected Result:** Map loads with all Michigan counties and child markers visible.

#### Test 2: Production Build
```bash
# 1. Build production version
npm run build

# 2. Preview production build
npm run preview

# 3. Open in browser
# http://localhost:4173

# 4. Verify map still works
```

**Expected Result:** Same as development, no token errors.

#### Test 3: iOS Simulator
```bash
# 1. Sync Capacitor
npx cap sync ios

# 2. Open in Xcode
npx cap open ios

# 3. Select iPhone simulator
# 4. Click "Run" (play button)
# 5. Wait for app to launch
# 6. Navigate to map view
```

**Expected Result:**
- Map loads without errors
- All counties visible
- Child markers render
- No 403 errors in Xcode console

#### Test 4: Physical iOS Device
```bash
# 1. Connect iPhone/iPad via USB
# 2. In Xcode, select your device from device list
# 3. Click "Run"
# 4. Trust certificate on device if prompted
# 5. Test map functionality
```

**Expected Result:** Same as simulator, but with better performance.

### Verification Commands

#### Check Environment Variable
```bash
# In project root
cat .env | grep MAPBOX
```

**Expected Output:**
```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiamVmZm1pY2hhZWxqb2huc29uLXRlY2giLCJhIjoiY21pM28...
```

#### Check Token in Running App
Open browser console on `http://localhost:5173` and run:
```javascript
console.log('Mapbox token:', mapboxgl.accessToken);
```

**Expected Output:** Should show your full token (starts with `pk.`)

#### Verify Capacitor iOS Files
```bash
# Check iOS platform is added
ls -la ios/

# Check Capacitor config
cat capacitor.config.ts
```

### Common Test Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank white map | Token missing/invalid | Check `.env` file |
| 403 error in iOS | Missing `capacitor://localhost` | Update token URL restrictions |
| 403 error in browser | Missing `localhost` URLs | Add dev URLs to token |
| Slow loading | Missing `downloads:read` | Add scope to token |
| Map works in dev but not build | Token not in `.env` | Don't hardcode tokens |

---

## Quick Reference

### Token Creation Summary
1. Go to [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
2. Click "Create a token"
3. Enable scope: `downloads:read`
4. Add URL: `capacitor://localhost`
5. Copy token to `.env` as `VITE_MAPBOX_TOKEN`

### Required URLs for Token Restrictions
```
capacitor://localhost          # iOS (REQUIRED)
http://localhost:5173          # Vite dev
http://localhost:4173          # Vite preview
https://your-domain.com        # Production web
```

### Environment Variable Format
```bash
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsbWkzbzA1bDYxc2VkMmtwd2Focm5jczhnIn0.aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

### Code Pattern
```tsx
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
```

---

## Additional Resources

### Official Documentation
- [Mapbox Access Tokens](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/)
- [Mapbox Token Scopes](https://docs.mapbox.com/help/tutorials/manage-access-tokens/)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

### Related Issues
- [mapbox/mapbox-gl-js#11170](https://github.com/mapbox/mapbox-gl-js/issues/11170) - Capacitor iOS 403 error fix
- [Capacitor iOS Protocol Discussion](https://github.com/ionic-team/capacitor/discussions/5644)

### Project Documentation
- [FamilyUp README](../README.md)
- [Technical Specification](./TECHNICAL_SPEC.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Component Documentation](./COMPONENTS.md)

---

## Support

If you encounter issues not covered in this guide:

1. **Check Mapbox Status**: [https://status.mapbox.com/](https://status.mapbox.com/)
2. **Review Token Dashboard**: [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
3. **Verify Xcode Console**: Look for specific error messages
4. **Check Browser Console**: Compare web vs iOS behavior
5. **Create GitHub Issue**: Include error messages and token configuration (NOT the token itself!)

---

**Last Updated:** November 17, 2025
**Mapbox GL JS Version:** 3.0.1
**Capacitor iOS Version:** Latest
**Project:** FamilyUp Michigan Foster Care Awareness Platform
