import { createAccountSessionManager } from "./accountSessionManager.js";
import { credentialVault } from "./credentialVault.js";
import {
  getAccount,
  patchAccount,
  appendLog,
  listAccounts,
} from "./accountStore.js";
import {
  queryLoginAccount,
  loginByServicePassword,
  closeClient,
} from "./telecomClient.js";

export const accountSessions = createAccountSessionManager({
  getAccount,
  patchAccount,
  appendLog,
  queryLoginAccount,
  loginByServicePassword,
  closeClient,
  vault: credentialVault,
});
export function startSessionMonitor() {
  let stopped = false,
    timer;
  async function sweep() {
    for (const account of listAccounts()) {
      if (stopped) return;
      if (
        account.enabled &&
        account.hasSavedPassword &&
        account.loginStatus !== "closed" &&
        account.autoLoginStatus !== "manual_required" &&
        !(Date.parse(account.autoLoginRetryAt) > Date.now())
      ) {
        try {
          await accountSessions.ensureSession(account.id);
        } catch {
          /* Keep the monitor alive without logging secrets. */
        }
      }
    }
    if (!stopped) {
      timer = setTimeout(sweep, 5 * 60_000);
      timer.unref();
    }
  }
  timer = setTimeout(sweep, 3000);
  timer.unref();
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}
