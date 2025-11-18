/**
 * FamilyUp React Native Bridge
 *
 * Connects React Native JavaScript to Swift Metal renderer
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

// MapRenderer Bridge
@interface RCT_EXTERN_MODULE(MapRenderer, NSObject)

RCT_EXTERN_METHOD(initializeRenderer:(nonnull NSNumber *)viewTag
                  counties:(NSArray *)counties)

RCT_EXTERN_METHOD(highlightCounty:(nonnull NSNumber *)viewTag
                  fips:(NSString *)fips)

RCT_EXTERN_METHOD(cleanup:(nonnull NSNumber *)viewTag)

@end

// PrivacyManager Bridge
@interface RCT_EXTERN_MODULE(PrivacyManager, NSObject)

RCT_EXTERN_METHOD(checkLocationPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(validateCountyData:(NSArray *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(auditPrivacyCompliance:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateAppStorePrivacyReport:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

// MetalMapView Manager
@interface MetalMapViewManager : RCTViewManager
@end

@implementation MetalMapViewManager

RCT_EXPORT_MODULE(MetalMapView)

RCT_EXPORT_VIEW_PROPERTY(onCountyTap, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(enableParticles, BOOL)
RCT_EXPORT_VIEW_PROPERTY(enableGlow, BOOL)
RCT_EXPORT_VIEW_PROPERTY(quality, NSString)

- (UIView *)view
{
  // Return Metal-backed UIView
  return [[MTKView alloc] init];
}

@end
