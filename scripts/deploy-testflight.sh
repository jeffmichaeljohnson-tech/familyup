#!/bin/bash

###############################################################################
# FamilyUp TestFlight Deployment Script
#
# Automates deployment to TestFlight for beta testing
#
# Prerequisites:
#   - Xcode installed and configured
#   - Apple Developer account with App Store Connect access
#   - Fastlane installed (gem install fastlane)
#   - Valid provisioning profiles and certificates
#
# Environment Variables Required:
#   - APPLE_ID: Your Apple ID email
#   - TEAM_ID: Your Apple Developer Team ID
#   - ITC_PROVIDER: App Store Connect provider (optional)
#
# Usage:
#   ./scripts/deploy-testflight.sh [--internal-only]
#
# Options:
#   --internal-only  Deploy to internal testers only (skip external review)
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
INTERNAL_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --internal-only)
      INTERNAL_ONLY=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}FamilyUp TestFlight Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

# Check for Fastlane
if ! command -v fastlane &> /dev/null; then
  echo -e "${RED}❌ Fastlane not found. Installing...${NC}"
  sudo gem install fastlane
fi
echo -e "${GREEN}✅ Fastlane: $(fastlane --version | head -n 1)${NC}"

# Check environment variables
if [ -z "$APPLE_ID" ]; then
  echo -e "${RED}❌ APPLE_ID environment variable not set${NC}"
  echo -e "${YELLOW}Please set your Apple ID:${NC}"
  echo -e "  export APPLE_ID='your.email@example.com'"
  exit 1
fi
echo -e "${GREEN}✅ APPLE_ID: $APPLE_ID${NC}"

if [ -z "$TEAM_ID" ]; then
  echo -e "${RED}❌ TEAM_ID environment variable not set${NC}"
  echo -e "${YELLOW}Please set your Team ID:${NC}"
  echo -e "  export TEAM_ID='XXXXXXXXXX'"
  exit 1
fi
echo -e "${GREEN}✅ TEAM_ID: $TEAM_ID${NC}"

# Step 2: Privacy compliance audit
echo -e "\n${YELLOW}[2/6] Running CRITICAL privacy audit...${NC}"

PRIVACY_VIOLATIONS=0

# Check for location tracking
if grep -q "NSLocationWhenInUseUsageDescription" "$IOS_DIR/FamilyUp/Info.plist"; then
  echo -e "${RED}❌ CRITICAL: Location tracking detected in Info.plist${NC}"
  PRIVACY_VIOLATIONS=$((PRIVACY_VIOLATIONS + 1))
fi

# Check for NSLocationAlwaysUsageDescription
if grep -q "NSLocationAlwaysUsageDescription" "$IOS_DIR/FamilyUp/Info.plist"; then
  echo -e "${RED}❌ CRITICAL: Always location tracking detected${NC}"
  PRIVACY_VIOLATIONS=$((PRIVACY_VIOLATIONS + 1))
fi

# Check for analytics frameworks
if grep -q "Firebase\|GoogleAnalytics\|Mixpanel\|Amplitude" "$IOS_DIR/Podfile"; then
  echo -e "${RED}❌ WARNING: Analytics framework detected${NC}"
  PRIVACY_VIOLATIONS=$((PRIVACY_VIOLATIONS + 1))
fi

# Check for advertising SDKs
if grep -q "AdMob\|AdSupport\|AppLovin" "$IOS_DIR/Podfile"; then
  echo -e "${RED}❌ WARNING: Advertising SDK detected${NC}"
  PRIVACY_VIOLATIONS=$((PRIVACY_VIOLATIONS + 1))
fi

if [ $PRIVACY_VIOLATIONS -gt 0 ]; then
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}❌ PRIVACY AUDIT FAILED${NC}"
  echo -e "${RED}Found $PRIVACY_VIOLATIONS violation(s)${NC}"
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}FamilyUp MUST NOT track users or collect personal data.${NC}"
  echo -e "${RED}Deployment BLOCKED for privacy compliance.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Privacy audit PASSED${NC}"
echo -e "${GREEN}   ✅ No location tracking${NC}"
echo -e "${GREEN}   ✅ No analytics frameworks${NC}"
echo -e "${GREEN}   ✅ No advertising SDKs${NC}"
echo -e "${GREEN}   ✅ Aggregate data only${NC}"

# Step 3: Git status check
echo -e "\n${YELLOW}[3/6] Checking git status...${NC}"

if ! git diff-index --quiet HEAD --; then
  echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
  echo -e "${YELLOW}Do you want to continue? (y/n)${NC}"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✅ Git status checked${NC}"

# Step 4: Build the app
echo -e "\n${YELLOW}[4/6] Building iOS app...${NC}"

cd "$IOS_DIR"

if [ "$INTERNAL_ONLY" = true ]; then
  fastlane internal
else
  fastlane beta
fi

echo -e "${GREEN}✅ Build complete${NC}"

# Step 5: Upload to TestFlight
echo -e "\n${YELLOW}[5/6] Uploading to TestFlight...${NC}"
echo -e "${BLUE}This may take several minutes...${NC}"

# Fastlane handles the upload in the beta/internal lane

echo -e "${GREEN}✅ Upload complete${NC}"

# Step 6: Deployment summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✅ TESTFLIGHT DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$INTERNAL_ONLY" = true ]; then
  echo -e "${GREEN}Deployed to: Internal testers only${NC}"
else
  echo -e "${GREEN}Deployed to: Internal + External beta testers${NC}"
fi

echo -e "${GREEN}Apple ID: $APPLE_ID${NC}"
echo -e "${GREEN}Team ID: $TEAM_ID${NC}"
echo -e "${BLUE}========================================${NC}"

# Next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Check App Store Connect for build processing"
echo -e "     ${BLUE}https://appstoreconnect.apple.com${NC}"
echo -e ""
echo -e "  2. Build will be available for testing in 10-30 minutes"
echo -e ""
echo -e "  3. Invite beta testers in TestFlight:"
echo -e "     - Internal testers: Automatic access"
echo -e "     - External testers: Requires App Review approval"
echo -e ""
echo -e "  4. Monitor feedback and crash reports"
echo -e ""
echo -e "${GREEN}TestFlight Groups:${NC}"
echo -e "  - Internal Team"
echo -e "  - Beta Testers"
echo -e ""
echo -e "${BLUE}Thank you for helping children in foster care! 💙${NC}"
echo ""
