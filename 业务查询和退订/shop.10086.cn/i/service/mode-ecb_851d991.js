CryptoJS.mode.ECB = (function () {
  var c = CryptoJS.lib.BlockCipherMode.extend();
  return (
    (c.Encryptor = c.extend({
      processBlock: function (c, y) {
        this._cipher.encryptBlock(c, y);
      },
    })),
    (c.Decryptor = c.extend({
      processBlock: function (c, y) {
        this._cipher.decryptBlock(c, y);
      },
    })),
    c
  );
})();
