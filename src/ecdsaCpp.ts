import {EcdsaModule, SignatureDetails} from './ecdsa';

// Defining the JSI function available globally
declare function ecdsaVerifyCpp(
  message: ArrayBuffer,
  signature: ArrayBuffer,
  pubKey: ArrayBuffer,
): boolean;

const ecdsaCpp: EcdsaModule = {
  verify: ({msg, pubKeyDer, sig}: SignatureDetails) =>
    ecdsaVerifyCpp(msg.buffer, sig.buffer, pubKeyDer.buffer),
};

export {ecdsaCpp};
