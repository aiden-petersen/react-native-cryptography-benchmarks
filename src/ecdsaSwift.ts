import {EcdsaModule, SignatureDetails} from './ecdsa';

// Defining the JSI function available globally
declare function ecdsaVerifySwift(
  message: ArrayBuffer,
  signature: ArrayBuffer,
  pubKey: ArrayBuffer,
): boolean;

const ecdsaSwift: EcdsaModule = {
  verify: ({msg, pubKeyDer, sig}: SignatureDetails) =>
    ecdsaVerifySwift(msg.buffer, sig.buffer, pubKeyDer.buffer),
};

export {ecdsaSwift};
