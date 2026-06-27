import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const logPath = path.join(dataDir, "offer-order-logs.jsonl");

export function appendOfferOrderLog(entry) {
  const record = {
    loggedAt: new Date().toISOString(),
    ...entry
  };
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.appendFileSync(logPath, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.error("[offer-order-log] write failed:", error.message);
  }
  return record;
}

export function getOfferOrderLogPath() {
  return logPath;
}
