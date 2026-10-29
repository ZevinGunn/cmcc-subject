import { sm2 } from "sm-crypto";
import { SM2_PUBLIC_KEY } from "./src/config.js";

const message = "15210334812:1234567890";
console.log("mode-0:", sm2.doEncrypt(message, SM2_PUBLIC_KEY, 0));
console.log("mode-1:", sm2.doEncrypt(message, SM2_PUBLIC_KEY, 1));

