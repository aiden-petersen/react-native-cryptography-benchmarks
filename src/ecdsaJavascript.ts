import {EcdsaModule, SignatureDetails} from './ecdsa';
import elliptic from 'elliptic';
import * as sha256 from '@stablelib/sha256';

const verify = ({msg, pubKeyRaw, sig}: SignatureDetails) => {
  const p256 = new elliptic.ec('p256');
  const key = p256.keyFromPublic(pubKeyRaw);
  const msgHash = sha256.hash(msg);

  return key.verify(msgHash, sig);
};

const ecdsaJavascript: EcdsaModule = {
  verify,
};

export {ecdsaJavascript};
