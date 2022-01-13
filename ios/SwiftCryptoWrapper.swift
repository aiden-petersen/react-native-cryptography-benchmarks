//
//  SwiftCryptoWrapper.swift
//  BenchmarkEcdsa
//
//  Created by Aiden Petersen on 10/01/22.
//

import Foundation

import Crypto

@objc public class SwiftCryptoWrapper : NSObject {
  @objc func verify(_ signature: Data, forMessage message: Data, withPublicKey publicKey: Data) -> Bool {
    guard let pubKey = try? P256.Signing.PublicKey(derRepresentation: publicKey) else {
      return false
    }
    guard let sig = try? P256.Signing.ECDSASignature(derRepresentation: signature) else {
      return false
    }
    
    return pubKey.isValidSignature(sig, for: message)
  }
}
