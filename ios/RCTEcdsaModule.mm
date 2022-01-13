//
//  Ecdsa.m
//  BenchmarkEcdsa
//
//  Created by Aiden Petersen on 3/01/22.
//

#import "RCTEcdsaModule.hpp"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import "EcdsaCpp.hpp"
#import "EcdsaSwift.h"

@implementation RCTEcdsaModule

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  _setBridgeOnMainQueue = RCTIsMainQueue();

  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (!cxxBridge.runtime) {
    return;
  }
  
  installSwiftEcdsa(*(facebook::jsi::Runtime *)cxxBridge.runtime);
  installCppEcdsa(*(facebook::jsi::Runtime *)cxxBridge.runtime);
}


@end
