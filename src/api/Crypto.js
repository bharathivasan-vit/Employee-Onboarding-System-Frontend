import CryptoJS from "crypto-js";

const SECRET_KEY = "MyUltraSecureAES256KeyEncrypt123"; // 32 chars

export function encrypt(plainText) {
  // generate random IV
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Combine IV + cipher
  const combined = iv.concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(combined);
}

export function decrypt(base64Text) {
  // decode from Base64
  const combined = CryptoJS.enc.Base64.parse(base64Text);

  // extract IV (first 16 bytes)
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);

  // extract ciphertext (remaining data)
  const ciphertext = CryptoJS.lib.WordArray.create(
    combined.words.slice(4),
    combined.sigBytes - 16
  );

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext },
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}



const SECRET = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 chars

export const encryptUserId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(id.toString()),
    SECRET,
    { mode: CryptoJS.mode.ECB }
  );

  return encrypted.toString();  // Base64
};
