import {SignatureDetails} from './ecdsa';
import elliptic from 'elliptic';
import KeyEncoder from 'key-encoder';
import * as sha256 from '@stablelib/sha256';

// Convert a hex string to a byte array
function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

const getRandomUint8Array = (length: number): Uint8Array => {
  const randomData = new Uint8Array(length);
  return randomData.map(() => Math.floor(Math.random() * 256));
};

/**
 * Util function that generates a signature for a randomly generated message
 */
export const genSignature = (messageSize: number): SignatureDetails => {
  const p256 = new elliptic.ec('p256');

  // Generate keys
  var entropy = getRandomUint8Array(32);
  const keyPair = p256.genKeyPair({entropy: entropy});

  const msg = getRandomUint8Array(messageSize);

  const msgHash = sha256.hash(msg);
  const signature = keyPair.sign(msgHash);

  const encoderOptions = {
    curveParameters: [1, 2, 840, 10045, 3, 1, 7],
    privatePEMOptions: {label: 'EC PRIVATE KEY'},
    publicPEMOptions: {label: 'PUBLIC KEY'},
    curve: p256,
  };

  const keyEncoder = new KeyEncoder(encoderOptions);
  // Need a DER encoded pub key
  const derPublicKey = hexToBytes(
    keyEncoder.encodePublic(keyPair.getPublic('hex'), 'raw', 'der'),
  );

  return {
    msg,
    sig: new Uint8Array(signature.toDER()),
    pubKeyRaw: new Uint8Array(keyPair.getPublic('array')),
    pubKeyDer: new Uint8Array(derPublicKey),
  };
};
