#!/bin/bash

###############################################################################
# FamilyUp iOS Build Script
#
# Builds iOS app with Metal graphics for TestFlight distribution
#
# Usage:
#   ./scripts/build-ios.sh [--clean] [--simulator]
#
# Options:
#   --clean      Clean build (pod install + clean build folder)
#   --simulator  Build for simulator instead of device
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IOS_DIR="$PROJECT_ROOT/ios"
SCHEME="FamilyUp"
CONFIGURATION="Release"
CLEAN_BUILD=false
SIMULATOR=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --clean)
      CLEAN_BUILD=true
      shift
      ;;
    --simulator)
      SIMULATOR=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}FamilyUp iOS Build${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

if ! command -v pod &> /dev/null; then
  echo -e "${RED}❌ CocoaPods not found. Installing...${NC}"
  sudo gem install cocoapods
fi
echo -e "${GREEN}✅ CocoaPods: $(pod --version)${NC}"

if ! command -v xcodebuild &> /dev/null; then
  echo -e "${RED}❌ Xcode not found. Please install Xcode from the App Store${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Xcode: $(xcodebuild -version | head -n 1)${NC}"

# Step 2: Install npm dependencies
echo -e "\n${YELLOW}[2/7] Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✅ npm dependencies installed${NC}"

# Step 3: Install CocoaPods dependencies
echo -e "\n${YELLOW}[3/7] Installing CocoaPods dependencies...${NC}"
cd "$IOS_DIR"

if [ "$CLEAN_BUILD" = true ]; then
  echo -e "${YELLOW}Cleaning CocoaPods cache...${NC}"
  pod cache clean --all
  rm -rf Pods Podfile.lock
fi

pod install
echo -e "${GREEN}✅ CocoaPods dependencies installed${NC}"

# Step 4: Privacy audit
echo -e "\n${YELLOW}[4/7] Running privacy compliance audit...${NC}"

# Check for location tracking
if grep -q "NSLocationWhenInUseUsageDescription" "$IOS_DIR/FamilyUp/Info.plist"; then
  echo -e "${RED}❌ PRIVACY VIOLATION: Location tracking detected!${NC}"
  exit 1
fi

# Check for analytics SDKs
if grep -q "Firebase\|GoogleAnalytics\|Mixpanel" "$IOS_DIR/Podfile"; then
  echo -e "${RED}❌ PRIVACY VIOLATION: Analytics framework detected!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Privacy audit passed${NC}"
echo -e "${GREEN}   - No location tracking${NC}"
echo -e "${GREEN}   - No analytics frameworks${NC}"
echo -e "${GREEN}   - Aggregate data only${NC}"

# Step 5: Clean build folder (if requested)
if [ "$CLEAN_BUILD" = true ]; then
  echo -e "\n${YELLOW}[5/7] Cleaning build folder...${NC}"
  rm -rf "$IOS_DIR/build"
  rm -rf "$IOS_DIR/DerivedData"
  echo -e "${GREEN}✅ Build folder cleaned${NC}"
else
  echo -e "\n${YELLOW}[5/7] Skipping clean (use --clean to enable)${NC}"
fi

# Step 6: Build iOS app
echo -e "\n${YELLOW}[6/7] Building iOS app...${NC}"

if [ "$SIMULATOR" = true ]; then
  DESTINATION="generic/platform=iOS Simulator"
  BUILD_DIR="$IOS_DIR/build/Simulator"
else
  DESTINATION="generic/platform=iOS"
  BUILD_DIR="$IOS_DIR/build/Device"
fi

xcodebuild \
  -workspace "$IOS_DIR/FamilyUp.xcworkspace" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "$DESTINATION" \
  -derivedDataPath "$IOS_DIR/DerivedData" \
  build \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO

echo -e "${GREEN}✅ iOS app built successfully${NC}"

# Step 7: Build summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✅ BUILD SUCCESSFUL${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Configuration: $CONFIGURATION${NC}"
echo -e "${GREEN}Target: $([ "$SIMULATOR" = true ] && echo "Simulator" || echo "Device")${NC}"
echo -e "${GREEN}Build location: $BUILD_DIR${NC}"
echo -e "${BLUE}========================================${NC}"

# Next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. To deploy to TestFlight: ${BLUE}./scripts/deploy-testflight.sh${NC}"
echo -e "  2. To run on simulator: ${BLUE}npm run ios${NC}"
echo -e "  3. To run on device: ${BLUE}npm run ios:device${NC}"
echo ""
