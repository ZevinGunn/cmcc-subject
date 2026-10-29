import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { AES_KEY, SM2_PUBLIC_KEY } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load SM2 Lib
const sm2Path = path.join(__dirname, "sm2_lib.js");
const sm2Code = fs.readFileSync(sm2Path, "utf8");

const context = {
    window: {},
    CryptoJS,
    console,
    navigator: { appName: "Netscape" }
};
context.window = context;
vm.createContext(context);
vm.runInContext(sm2Code, context);
// The lib defines SM2Utils on window
const SM2Utils = context.SM2Utils;

function encryptPhone(phone) {
    // Note: The original logic appends timestamp.
    // However, if we want to be deterministic or let caller control it, we might want to pass it.
    // But for now, let's stick to the original logic: phone:timestamp
    const payload = `${phone}:${Date.now()}`;
    return SM2Utils.encs(SM2_PUBLIC_KEY, payload, 0);
}

function encryptWithAes(value) {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const src = CryptoJS.enc.Utf8.parse(value);
    return CryptoJS.AES.encrypt(src, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
}

// CLI Interface
const args = process.argv.slice(2);
if (args.length >= 2) {
    const type = args[0];
    const data = args[1];
    
    try {
        if (type === 'sm2') {
            console.log(encryptPhone(data));
        } else if (type === 'aes') {
            console.log(encryptWithAes(data));
        } else {
            console.error("Unknown type. Use 'sm2' or 'aes'");
            process.exit(1);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
