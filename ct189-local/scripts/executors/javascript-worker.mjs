import fs from "node:fs";

const payload = JSON.parse(fs.readFileSync(0, "utf8"));
const response = await fetch(payload.callbackUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const result = await response.json();
console.log(JSON.stringify(result));
if (!response.ok || result.ok === false) process.exitCode = 1;
