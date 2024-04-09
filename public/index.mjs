const name = 'RSA-OAEP';
const hash = 'SHA-256';
const modulusLength = 2048;
const publicExponent = new Uint8Array([1, 0, 1]);
const format = 'spki';

const { privateKey, publicKey } = await crypto.subtle.generateKey(
  { name, hash, modulusLength, publicExponent },
  true,
  ['decrypt']
);

const exportedPublicKey = await crypto.subtle.exportKey(format, publicKey);

const response = await fetch('/keys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: exportedPublicKey,
});

const encrypted = await response.arrayBuffer();

const decrypted = await crypto.subtle.decrypt({ name }, privateKey, encrypted);
const decoded = new TextDecoder().decode(decrypted);

console.log(decoded);
