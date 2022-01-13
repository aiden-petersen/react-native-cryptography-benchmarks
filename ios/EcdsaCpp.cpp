//
//  Ecdsa.cpp
//  BenchmarkEcdsa
//
//  Created by Aiden Petersen on 3/01/22.
//
#import "EcdsaCpp.hpp"

#include <iostream>
#include <sstream>

using namespace std;

#define HAVE_ECC

#include <wolfssl/wolfcrypt/ecc.h>
#include <wolfssl/wolfcrypt/asn_public.h>
#include <wolfssl/wolfcrypt/sha256.h>

static ecc_key eccKey;

using namespace facebook;

bool verifyMessage(byte* msgBuf, word32 msgLen, const byte* sigBuf, word32 sigLen, const byte* pubKeyDer, word32 pubKeyLen){
  int ret = 0;

  word32 hashLen = WC_SHA256_DIGEST_SIZE;
  byte hashBuf[hashLen];
  wc_Sha256 sha;
  ret = wc_InitSha256(&sha);
  if (ret < 0) {
    return false;
  }
  
  ret = wc_Sha256Update(&sha, msgBuf, msgLen);
  if (ret < 0) {
    return false;
  }
  
  ret = wc_Sha256Final(&sha, hashBuf);
  if (ret < 0) {
    return false;
  }

  if (ret < 0) {
    return false;
  }
    
  word32 idx = 0;
  int isValidSig;
    
  ret = wc_ecc_init(&eccKey);
  if (ret < 0) {
    return false;
  }
    
  ret = wc_EccPublicKeyDecode(pubKeyDer, &idx, &eccKey, pubKeyLen);
  if (ret < 0) {
    return false;
  }


  ret = wc_ecc_verify_hash(sigBuf, sigLen, hashBuf, hashLen, &isValidSig, &eccKey);
  //  printf("Verify ret %d, is_valid_sig %d\n", ret, isValidSig);
  if (ret == 0) {
     return isValidSig;
  }
  return false;
}

void installCppEcdsa(jsi::Runtime& jsiRuntime) {
  std::cout << "Initializing cpp ecdsa jsi" << "\n";

  auto verify = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "ecdsaVerifyCpp"),
      3,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        auto messageBuf = arguments[0].asObject(runtime).getArrayBuffer(runtime);
        auto signatureBuf = arguments[1].asObject(runtime).getArrayBuffer(runtime);
        auto pubKeyBuf = arguments[2].asObject(runtime).getArrayBuffer(runtime);
        
        return verifyMessage(messageBuf.data(runtime), messageBuf.size(runtime), signatureBuf.data(runtime), signatureBuf.size(runtime), pubKeyBuf.data(runtime), pubKeyBuf.size(runtime));
      }
  );
  jsiRuntime.global().setProperty(jsiRuntime, "ecdsaVerifyCpp", std::move(verify));
}
