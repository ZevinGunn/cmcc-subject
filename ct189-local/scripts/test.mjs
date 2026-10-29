import { readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const backend = new URL("../backend/", import.meta.url);
execFileSync(
  process.execPath,
  [
    "--test",
    ...readdirSync(new URL("test/", backend))
      .filter((f) => f.endsWith(".test.js"))
      .map((f) => `test/${f}`),
  ],
  { cwd: backend, stdio: "inherit" },
);
