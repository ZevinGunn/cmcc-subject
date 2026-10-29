import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOGIN_LOG_FILE = path.join(LOG_DIR, "login.log");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export function logLogin(data) {
  try {
    ensureLogDir();
    const record = {
      timestamp: new Date().toISOString(),
      ...data,
    };
    fs.appendFile(
      LOGIN_LOG_FILE,
      `${JSON.stringify(record)}\n`,
      (error) => {
        if (error) {
          console.error("[logger] append login log failed", error);
        }
      }
    );
  } catch (error) {
    console.error("[logger] unexpected failure", error);
  }
}


