export type SignatureDetails = {
  msg: Uint8Array;
  sig: Uint8Array;
  pubKeyRaw: Uint8Array;
  pubKeyDer: Uint8Array;
};

export interface EcdsaModule {
  verify: (signatureDetails: SignatureDetails) => boolean;
}
