import { encryptPhone } from "./src/crypto.js";

const phone = process.argv[2] || "15210334812";
const encrypted = encryptPhone(phone);
console.log(encrypted);
console.log("length:", encrypted.length);

