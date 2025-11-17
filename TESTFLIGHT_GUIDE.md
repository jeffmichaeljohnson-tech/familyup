# FamilyUp TestFlight Deployment Guide

> Complete guide to deploying FamilyUp to TestFlight for beta testing

## Prerequisites Checklist

### Apple Developer Account
- [ ] Active Apple Developer Program membership ($99/year)
- [ ] Access to App Store Connect
- [ ] Team ID from Apple Developer portal

### Development Environment
- [ ] macOS with Xcode 14+ installed
- [ ] Xcode command line tools: `xcode-select --install`
- [ ] CocoaPods installed: `sudo gem install cocoapods`
- [ ] Fastlane installed: `sudo gem install fastlane`
- [ ] Node.js 18+ installed

### Certificates & Provisioning
- [ ] iOS Distribution Certificate
- [ ] App Store Provisioning Profile
- [ ] Certificates installed in Xcode

## Quick Start

### 1. Initial Setup

```bash
# Set environment variables (add to ~/.zshrc or ~/.bash_profile)
export APPLE_ID="your.email@apple.com"
export TEAM_ID="XXXXXXXXXX"  # Find in Apple Developer portal

# Install dependencies
npm install
cd ios && pod install && cd ..
```

### 2. First Build

```bash
# Run privacy audit
cd ios && fastlane privacy_audit

# Build for device (clean build recommended)
./scripts/build-ios.sh --clean
```

### 3. Deploy to TestFlight

```bash
# Full deployment (internal + external testers)
./scripts/deploy-testflight.sh

# Or internal only (faster, no App Review)
./scripts/deploy-testflight.sh --internal-only
```

## Detailed Deployment Process

### Step 1: Privacy Compliance Verification

**CRITICAL**: FamilyUp MUST NOT track users or collect personal data.

Before deployment, the script automatically checks:
- ✅ No location tracking keys in Info.plist
- ✅ No analytics frameworks (Firebase, Google Analytics, etc.)
- ✅ No advertising SDKs (AdMob, etc.)
- ✅ Aggregate county data only

**If privacy violations are found, deployment is BLOCKED.**

Manual audit:
```bash
cd ios
fastlane privacy_audit
```

### Step 2: Version Management

Fastlane automatically:
1. Increments build number
2. Commits version bump to git
3. Pushes changes to remote

Manual version bump:
```bash
cd ios
agvtool next-version -all
```

### Step 3: Build & Archive

The deployment script:
1. Cleans build folder
2. Builds Release configuration
3. Archives the app
4. Exports IPA for App Store distribution

Manual build:
```bash
cd ios
xcodebuild \
  -workspace FamilyUp.xcworkspace \
  -scheme FamilyUp \
  -configuration Release \
  -archivePath ./build/FamilyUp.xcarchive \
  archive
```

### Step 4: Upload to App Store Connect

Fastlane uploads to TestFlight with:
- Beta App Review notes
- Privacy compliance explanation
- Testing instructions
- Contact information

Upload time: **5-15 minutes** depending on connection speed

### Step 5: Build Processing

Apple processes the build:
- Binary validation
- Malware scanning
- Privacy analysis
- Crash symbolication

Processing time: **10-30 minutes**

Check status: [App Store Connect](https://appstoreconnect.apple.com)

### Step 6: Beta App Review (External Testing Only)

If deploying to external testers:
1. Build enters "Waiting for Review" status
2. Apple reviews app (1-2 business days)
3. Approval notification sent via email
4. Build available to external testers

Internal testing: **No review required** (immediate availability)

## TestFlight Groups

### Internal Testers (Up to 100)
- **Automatic access**: No App Review required
- **Immediate availability**: As soon as build processes
- **Use case**: Development team, QA, stakeholders

### External Testers (Up to 10,000)
- **Requires App Review**: 1-2 business days
- **Public link available**: Share with anyone
- **Use case**: Beta community, user testing

## Inviting Testers

### Via App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → FamilyUp → TestFlight
3. Select group: "Internal Team" or "Beta Testers"
4. Click "Add Testers"
5. Enter email addresses
6. Testers receive invitation email

### Via Public Link (External Only)

1. App Store Connect → TestFlight → FamilyUp
2. External Testing → Public Link
3. Enable public link
4. Share link: `https://testflight.apple.com/join/XXXXXXXX`

## Tester Experience

### Installation

1. Tester receives email invitation
2. Click "View in TestFlight"
3. Install TestFlight app from App Store (if not installed)
4. Accept invitation
5. Install FamilyUp

### Feedback

Testers can provide:
- Screenshots with annotations
- Written feedback
- Crash reports (automatic)

Access feedback: App Store Connect → TestFlight → Feedback

## Automation with Fastlane

### Available Lanes

```bash
cd ios

# Deploy to TestFlight (internal + external)
fastlane beta

# Internal testers only
fastlane internal

# Privacy compliance audit
fastlane privacy_audit

# Build without uploading
fastlane build_only
```

### Fastfile Configuration

Key settings in `/fastlane/Fastfile`:
- Build scheme: `FamilyUp`
- Export method: `app-store`
- Groups: `["Beta Testers", "Internal Team"]`
- App Review notes: Privacy compliance explanation

## Continuous Integration

### GitHub Actions (Optional)

Create `.github/workflows/testflight.yml`:

```yaml
name: Deploy to TestFlight

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          npm install
          cd ios && pod install
      - name: Deploy to TestFlight
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          TEAM_ID: ${{ secrets.TEAM_ID }}
        run: ./scripts/deploy-testflight.sh
```

## Troubleshooting

### Common Issues

**"No Apple ID found"**
```bash
export APPLE_ID="your.email@apple.com"
./scripts/deploy-testflight.sh
```

**"No provisioning profile found"**
- Open Xcode
- Sign in with Apple ID (Preferences → Accounts)
- Select project → Signing & Capabilities
- Enable "Automatically manage signing"

**"Build processing failed"**
- Check Info.plist for required keys
- Verify bundle identifier matches App Store Connect
- Review Xcode warnings/errors

**"Privacy violation detected"**
```bash
# Audit Info.plist
cat ios/FamilyUp/Info.plist | grep NSLocation

# Should return EMPTY (no location keys)

# If location keys found, REMOVE them immediately
```

**"Fastlane upload failed"**
```bash
# Check App Store Connect credentials
fastlane fastlane-credentials add --username your.email@apple.com

# Retry upload
cd ios && fastlane beta
```

### Build Processing Stuck

If build is stuck "Processing" for >60 minutes:
1. Check App Store Connect for errors
2. Look for email from Apple
3. Contact Apple Developer Support
4. Try uploading again with new build number

## App Review Guidelines

### Privacy Compliance

FamilyUp MUST show:
- ✅ Privacy policy URL (in App Store metadata)
- ✅ "Data Not Collected" privacy label
- ✅ No location permission requests
- ✅ Aggregate data source citation

### Beta App Review Notes

The deployment script includes comprehensive notes:

```
FamilyUp - Michigan Foster Care Awareness Platform

PRIVACY NOTE:
This app displays aggregate county-level foster care statistics only.
NO individual child information, exact locations, or PII is collected or shown.
NO location tracking is used.

COMPLIANCE:
- COPPA compliant
- FERPA compliant
- HIPAA compliant
- Michigan Child Protection Law compliant

DATA SOURCE:
Michigan DHHS, AFCARS FY 2023 (public aggregate data)

FEATURES TO TEST:
- Interactive map with Metal graphics
- County selection and statistics display
- Particle effects and animations
- Contact information (phone link)

NO ACCOUNT REQUIRED - App is fully functional without sign-in.
```

## Monitoring & Analytics

### TestFlight Metrics

Track in App Store Connect:
- Installs
- Sessions
- Crashes (symbolicated)
- Feedback submissions

### Crash Reporting

- **Automatic**: TestFlight symbolicates crashes
- **Privacy compliant**: No user data in crash reports
- **Access**: App Store Connect → TestFlight → Crashes

## Release to Production

Once beta testing is complete:

1. App Store Connect → My Apps → FamilyUp
2. Click "+" to create new version
3. Fill in metadata:
   - Description
   - Screenshots
   - Privacy policy URL
   - Keywords
   - Support URL
4. Select TestFlight build
5. Submit for App Review
6. Review time: 1-3 business days
7. Publish to App Store

## Best Practices

### Testing Checklist

Before each TestFlight deployment:
- [ ] Run privacy audit
- [ ] Test on physical device
- [ ] Verify Metal graphics work
- [ ] Test all county selections
- [ ] Verify phone link works
- [ ] Check for memory leaks
- [ ] Test on various iOS versions (14+)

### Deployment Schedule

Recommended cadence:
- **Daily**: Internal builds for active development
- **Weekly**: External beta builds for testing
- **Bi-weekly**: Release candidates

### Feedback Loop

1. Collect tester feedback
2. Prioritize issues
3. Fix bugs
4. Deploy new build
5. Notify testers of changes

## Support & Resources

### Documentation
- [TestFlight Help](https://developer.apple.com/testflight/)
- [Fastlane Docs](https://docs.fastlane.tools)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)

### Contact
- FamilyUp Support: support@familyup.org
- Apple Developer Support: https://developer.apple.com/support/

## Privacy Commitment

FamilyUp is committed to **ZERO tracking** and **complete privacy**:

- ❌ NO location tracking
- ❌ NO data collection
- ❌ NO analytics
- ❌ NO advertising
- ✅ Aggregate data only
- ✅ Privacy-first design
- ✅ Full legal compliance

**Every deployment is automatically audited for privacy compliance.**

---

Built with compassion for children in foster care. 💙
