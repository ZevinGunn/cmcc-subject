const fs = require("fs");
const crypto = require("crypto");

const [harPath, outputPath] = process.argv.slice(2);
if (!harPath || !outputPath) {
  throw new Error("Usage: node _extract_order_evidence.js <har> <output-json>");
}

const har = JSON.parse(fs.readFileSync(harPath, "utf8"));

function decryptCbc(ciphertext, algorithm, key, iv, inputEncoding) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );
  return Buffer.concat([
    decipher.update(ciphertext, inputEncoding),
    decipher.final(),
  ]).toString("utf8");
}

function decryptUserAuth(value) {
  return decryptCbc(
    value,
    "aes-128-cbc",
    "1234123412ABCDEF",
    "ABCDEF1234123412",
    "hex"
  );
}

function decryptBusiness(value) {
  const normalized = String(value)
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s/g, "");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return decryptCbc(
    padded,
    "aes-256-cbc",
    "03054BD8937F62FA8FE72F00012B9658",
    "82787D91132E6AE5",
    "base64"
  );
}

function decodeHarContent(content) {
  if (!content || content.text == null) return null;
  return content.encoding === "base64"
    ? Buffer.from(content.text, "base64").toString("utf8")
    : content.text;
}

function parseMaybeJson(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function redact(value) {
  if (typeof value === "string") {
    return value
      .replace(/(?<!\d)1\d{10}(?!\d)/g, "1XX****XXXX")
      .replace(/bearer\s+[A-Za-z0-9._-]+/gi, "Bearer <ACCESS_TOKEN>");
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        const key = k.toLowerCase();
        if (key === "authorization") return [k, "<AUTH_TOKEN>"];
        if (key === "token" || key.endsWith("token")) return [k, "<TOKEN>"];
        if (["password", "cmgsmscode", "verifycode", "smscode"].includes(key)) {
          return [k, "<SMS_CODE>"];
        }
        return [k, redact(v)];
      })
    );
  }
  return value;
}

const evidence = har.log.entries
  .filter((entry) => entry.request.url.includes("/nrapigate/"))
  .map((entry) => {
    const url = new URL(entry.request.url);
    const isUserAuth = url.pathname.includes("/nrauth/auth/encryt/userAuth");
    const requestCipher = entry.request.postData?.text || null;
    let requestPlain = null;
    if (requestCipher) {
      try {
        requestPlain = isUserAuth
          ? decryptUserAuth(requestCipher)
          : decryptBusiness(requestCipher);
      } catch (error) {
        requestPlain = `<DECRYPT_ERROR: ${error.message}>`;
      }
    }

    const responseTransport = decodeHarContent(entry.response.content);
    const responseEnvelope = parseMaybeJson(responseTransport);
    let responsePlain = null;
    if (responseEnvelope && typeof responseEnvelope === "object" && responseEnvelope.body) {
      try {
        responsePlain = isUserAuth
          ? decryptUserAuth(responseEnvelope.body)
          : decryptBusiness(responseEnvelope.body);
      } catch (error) {
        responsePlain = `<DECRYPT_ERROR: ${error.message}>`;
      }
    } else {
      responsePlain = responseTransport;
    }

    const selectedHeaders = Object.fromEntries(
      entry.request.headers
        .filter((header) =>
          ["content-type", "channelid", "authorization", "x-app-version"].includes(
            header.name.toLowerCase()
          )
        )
        .map((header) => [header.name, header.value])
    );

    return redact({
      time: entry.startedDateTime,
      method: entry.request.method,
      url: `${url.origin}${url.pathname}`,
      requestHeaders: selectedHeaders,
      requestPlain: parseMaybeJson(requestPlain),
      responseStatus: entry.response.status,
      responsePlain: parseMaybeJson(responsePlain),
    });
  });

fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
