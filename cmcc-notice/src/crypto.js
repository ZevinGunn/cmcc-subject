const crypto = require("crypto");

function encryptAES(plaintext, key, iv) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );
  cipher.setAutoPadding(true);
  return cipher.update(plaintext, "utf8", "base64") + cipher.final("base64");
}

function decryptAES(ciphertext, key, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );
  decipher.setAutoPadding(true);
  return (
    decipher.update(ciphertext, "base64", "utf8") + decipher.final("utf8")
  );
}

function md5(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

module.exports = {
  encryptAES,
  decryptAES,
  md5,
};
