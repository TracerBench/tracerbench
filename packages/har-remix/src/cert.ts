import { asn1, md, pki, util } from 'node-forge';

export function createX509Cert() {
  const pair = pki.rsa.generateKeyPair(2048);
  const cert = pki.createCertificate();
  cert.setSubject([
    { shortName: 'CN', value: 'localhost' },
    { shortName: 'OU', value: 'Test' },
    { shortName: 'O', value: 'Test' },
    { shortName: 'L', value: 'Sunnyvale' },
    { shortName: 'ST', value: 'California' },
    { shortName: 'C', value: 'US' },
  ]);
  cert.publicKey = pair.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  cert.sign(pair.privateKey, md.sha256.create());

  return {
    cert: pki.certificateToPem(cert),
    key: pki.privateKeyToPem(pair.privateKey),
  };
}

export function spkiFingerprint(pem: string) {
  const cert = pki.certificateFromPem(pem);
  const publicKey = asn1.toDer(pki.publicKeyToAsn1(cert.publicKey));
  const sha256 = md.sha256.create();
  sha256.update(publicKey.getBytes(), 'raw');
  const digest = sha256.digest().getBytes();
  return util.encode64(digest);
}
