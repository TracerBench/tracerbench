import * as fs from 'fs';
import { asn1, md, pki, util } from 'node-forge';
import { homedir } from 'os';
import * as path from 'path';
import { CertificateInfo } from '../types';

export default function getCertificateInfo(
  cacheDir = getCacheDir()
): CertificateInfo {
  let certInfo = readCertificateInfo(cacheDir);
  if (certInfo === undefined) {
    certInfo = createCertificateAndPrivateKey();
    saveCertificateInfo(certInfo, cacheDir);
  }
  return certInfo;
}

function getCacheDir(dir = homedir()) {
  return path.join(dir, '.har-remix');
}

function readCertificateInfo(
  cacheDir = getCacheDir()
): CertificateInfo | undefined {
  const text = tryRead(path.join(cacheDir, 'certificate.json'));
  if (text !== undefined) {
    return validateCertificateInfo(text);
  }
}

function validateCertificateInfo(text: string): CertificateInfo | undefined {
  try {
    const info: CertificateInfo = JSON.parse(text);
    const cert = pki.certificateFromPem(info.cert);
    if (
      Date.now() < cert.validity.notBefore.getTime() ||
      Date.now() > cert.validity.notAfter.getTime()
    ) {
      return;
    }
    pki.privateKeyFromPem(info.key);
    const fingerprint = util.decode64(info.fingerprint);
    if (fingerprint.length !== 32) {
      return;
    }
    return info;
  } catch (e) {
    // TODO use debug
    // tslint:disable-next-line: no-console
    console.error(`cached certificate is invalid, regenerating`);
  }
}

function saveCertificateInfo(
  certificateInfo: CertificateInfo,
  cacheDir = getCacheDir()
) {
  ensureDir(cacheDir);
  fs.writeFileSync(
    path.join(cacheDir, 'certificate.json'),
    JSON.stringify(certificateInfo)
  );
}

function createCertificateAndPrivateKey(): CertificateInfo {
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

  const notBefore = new Date();
  const notAfter = new Date();
  notAfter.setFullYear(notBefore.getFullYear() + 5);

  cert.validity.notBefore = notBefore;
  cert.validity.notAfter = notAfter;

  cert.sign(pair.privateKey, md.sha256.create());

  return {
    cert: pki.certificateToPem(cert),
    fingerprint: spkiFingerprint(pair.publicKey),
    key: pki.privateKeyToPem(pair.privateKey),
  };
}

function spkiFingerprint(publicKey: pki.PublicKey) {
  const der = asn1.toDer(pki.publicKeyToAsn1(publicKey));
  const sha256 = md.sha256.create();
  sha256.update(der.getBytes(), 'raw');
  const digest = sha256.digest().getBytes();
  return util.encode64(digest);
}

function ensureDir(dir: string) {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

function tryRead(file: string): string | undefined {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}
