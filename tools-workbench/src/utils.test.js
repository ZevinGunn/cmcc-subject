import { describe, expect, it } from "vitest";
import {
  buildLink,
  decryptAes,
  defaultRecordName,
  encryptAes,
  formatJson,
  qxRegexFromUrl,
  unescapeAndFormatJson,
} from "./utils";

describe("tools utilities", () => {
  it("builds links with optional URL encoding", () => {
    expect(buildLink({ prefix: "prefix=", suffix: "https://a.cn/a b", encode: true }))
      .toBe("prefix=https%3A%2F%2Fa.cn%2Fa%20b");
    expect(buildLink({ prefix: "prefix=", suffix: "tail", encode: false })).toBe("prefix=tail");
  });

  it("round trips AES passphrase encryption", async () => {
    const encrypted = await encryptAes("移动工具", "secret-key");
    expect(encrypted).not.toContain("移动工具");
    expect(await decryptAes(encrypted, "secret-key")).toBe("移动工具");
  });

  it("formats JSON and escaped JSON", () => {
    expect(formatJson('{"a":1}', "format")).toContain('\n  "a": 1');
    expect(formatJson('{"a":1}', "minify")).toBe('{"a":1}');
    expect(unescapeAndFormatJson('"{\\\"a\\\":1}"')).toContain('"a": 1');
  });

  it("creates a path-aware QX regex", () => {
    expect(qxRegexFromUrl("https://a.example/x/y?q=1")).toBe("^https?:\\/\\/a\\.example\\/x\\/y(?:\\?.*)?$");
  });

  it("creates stable automatic scan names", () => {
    expect(defaultRecordName(new Date(2026, 7, 23, 9, 5))).toBe("扫码记录 2026-08-23 09:05");
  });
});
