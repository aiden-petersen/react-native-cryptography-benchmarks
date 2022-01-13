//
//  Ecdsa.h
//  BenchmarkEcdsa
//
//  Created by Aiden Petersen on 3/01/22.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTEcdsaModule : NSObject <RCTBridgeModule>

@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
