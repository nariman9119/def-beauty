const crypto = require("crypto");
const config = require("config");

const encrypt = text => {
  var cipher = crypto.createCipher("aes-256-cbc", config.get("cipherKey"));
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

const decrypt = text => {
  if (text === null || typeof text === "undefined") {
    return text;
  }
  var decipher = crypto.createDecipher("aes-256-cbc", config.get("cipherKey"));
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;
