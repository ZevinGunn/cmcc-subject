import fs from "fs";
import path from "path";
import vm from "vm";
import CryptoJS from "crypto-js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sm2Path = path.resolve(
  __dirname,
  "../../qqt-res.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/scripts/common/sm2.js"
);

let legacyEncrypt;

function loadLegacy() {
  if (legacyEncrypt) return legacyEncrypt;
  const code = fs.readFileSync(sm2Path, "utf8");
  const context = {
    window: {},
    CryptoJS,
    console,
    navigator: { appName: "Netscape" },
  };
  context.window = context;
  context.navigator = context.navigator;
  vm.createContext(context);
  vm.runInContext(code, context);
  legacyEncrypt = context.sm2Encrypt;
  if (typeof legacyEncrypt !== "function") {
    throw new Error("sm2Encrypt not found in legacy sm2.js");
  }
  return legacyEncrypt;
}

export function legacySm2Encrypt(data, publicKey) {
  const fn = loadLegacy();
  return fn(data, publicKey, 0);
}

