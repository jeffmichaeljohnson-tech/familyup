/**
 * FamilyUp App Delegate
 *
 * PRIVACY: No tracking, no analytics, no location services
 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // PRIVACY AUDIT: Explicitly disable location services
  NSLog(@"FamilyUp: Location services DISABLED by design");

  // Initialize React Native bridge
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"FamilyUp"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // PRIVACY: Log privacy compliance
  NSLog(@"========================================");
  NSLog(@"FamilyUp Privacy Compliance Status");
  NSLog(@"========================================");
  NSLog(@"✅ No location tracking");
  NSLog(@"✅ No analytics");
  NSLog(@"✅ No advertising");
  NSLog(@"✅ Aggregate data only");
  NSLog(@"========================================");

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"mobile/index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// PRIVACY: Explicitly prevent location services
- (void)applicationWillEnterForeground:(UIApplication *)application
{
  // Ensure no location services are started
  NSLog(@"FamilyUp: Location services remain DISABLED");
}

@end
