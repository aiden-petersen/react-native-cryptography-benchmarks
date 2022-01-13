//
//  EcdsaSwift.m
//  BenchmarkEcdsa
//
//  Created by Aiden Petersen on 10/01/22.
//

#import "EcdsaSwift.h"
#import "BenchmarkEcdsa-Swift.h"

#include <iostream>

using namespace facebook;

void installSwiftEcdsa(jsi::Runtime& jsiRuntime) {
  std::cout << "Initializing swift ecdsa jsi" << "\n";

  auto verify = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "ecdsaVerifySwift"),
      3,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        
        auto messageBuf = arguments[0].asObject(runtime).getArrayBuffer(runtime);
        NSData *messageNSData = [NSData dataWithBytes:messageBuf.data(runtime) length:messageBuf.size(runtime)];
        
        auto signatureBuf = arguments[1].asObject(runtime).getArrayBuffer(runtime);
        NSData *signatureNSData = [NSData dataWithBytes:signatureBuf.data(runtime) length:signatureBuf.size(runtime)];
        
        auto pubKeyBuf = arguments[2].asObject(runtime).getArrayBuffer(runtime);
        NSData *pubKeyNSData = [NSData dataWithBytes:pubKeyBuf.data(runtime) length:pubKeyBuf.size(runtime)];
        

        SwiftCryptoWrapper * wrapper = [[SwiftCryptoWrapper alloc] init];
        return [wrapper verify:signatureNSData forMessage:messageNSData withPublicKey:pubKeyNSData];
      }
  );
  jsiRuntime.global().setProperty(jsiRuntime, "ecdsaVerifySwift", std::move(verify));
}
