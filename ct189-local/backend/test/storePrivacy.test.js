import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("account migration removes numeric remarks, hides sealed passwords and pauses interrupted auto-login", async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ct189-store-privacy-"),
  );
  process.env.CT189_DATA_DIR = directory;
  try {
    const { createCredentialVault } =
      await import("../src/services/credentialVault.js");
    const vault = createCredentialVault(directory),
      id = "a7b2f133-5610-4f43-8adc-39279c7b01a9";
    const sealed = vault.seal(id, "001234");
    fs.writeFileSync(
      path.join(directory, "accounts.json"),
      JSON.stringify({
        accounts: [
          {
            id,
            phone: "18900000001",
            label: "001234",
            savedPassword: sealed,
            autoLoginStatus: "running",
            loginStatus: "valid",
            loginNumber: "18900000001",
          },
        ],
        logs: [],
      }),
    );
    const { listAccounts, getAccount } =
      await import("../src/services/accountStore.js");
    const account = listAccounts()[0];
    assert.equal(account.label, "189****0001");
    assert.equal(account.hasSavedPassword, true);
    assert.equal(account.autoLoginStatus, "manual_required");
    assert.equal(account.loginStatus, "invalid");
    assert.equal(account.loginNumber, "");
    assert.equal(Object.hasOwn(account, "savedPassword"), false);
    assert.ok(!JSON.stringify(account).includes(sealed.ciphertext));
    assert.ok(!JSON.stringify(account).includes("001234"));
    assert.equal(vault.open(id, getAccount(id).savedPassword), "001234");
    const persisted = fs.readFileSync(
      path.join(directory, "accounts.json"),
      "utf8",
    );
    assert.ok(!persisted.includes("001234"));
    assert.equal(
      JSON.parse(persisted).accounts[0].autoLoginStatus,
      "manual_required",
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
