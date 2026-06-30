import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: Number(process.env.PORT || 5710),
  host: process.env.HOST || "127.0.0.1",
  dataDir: path.resolve(__dirname, "../data"),
  officialOrigin: "https://wapbj.189.cn",
  officialEntry: "https://wapbj.189.cn/echnwap/scratchLogon",
  headless: process.env.CT189_HEADLESS !== "false",
  requestTimeoutMs: Number(process.env.CT189_REQUEST_TIMEOUT_MS || 30000)
};
