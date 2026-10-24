import {
  isTelecomSuccess,
  loginSummary,
  loginErrorDiagnostic,
  responseDiagnostic,
} from "./passwordLogin.js";

export function createAccountSessionManager(deps) {
  const {
    getAccount,
    patchAccount,
    queryLoginAccount,
    loginByServicePassword,
    closeClient,
    vault,
    appendLog,
  } = deps;
  const now = deps.now || Date.now;
  const SESSION_LEASE_MS = 30 * 60_000;
  const queues = new Map(),
    checks = new Map();
  // The telecom login flow is stateful at the browser/profile level and the
  // upstream service can challenge concurrent handshakes. Serialize login
  // attempts across accounts while retaining per-account operation queues.
  let loginTail = Promise.resolve();
  function withLoginSlot(action) {
    const run = loginTail.catch(() => {}).then(action);
    loginTail = run.catch(() => {});
    return run;
  }
  const timestamp = () => new Date(now()).toISOString();
  const get = (id) => {
    const account = getAccount(id);
    if (!account) throw Object.assign(new Error("账号不存在"), { status: 404 });
    return account;
  };
  const identityMismatch = (response, phone) => Boolean(
    response?.ok &&
      isTelecomSuccess(response) &&
      response.data?.object &&
      response.data.object !== phone,
  );
  const sessionLeaseActive = (account) => {
    if (account.loginStatus !== "valid") return false;
    const timestamps = [account.lastLoginAt, account.lastSessionCheckAt]
      .map((value) => Date.parse(value || ""))
      .filter(Number.isFinite);
    return timestamps.length > 0 && now() - Math.max(...timestamps) < SESSION_LEASE_MS;
  };
  const transientIdentityFailure = (response) =>
    !response ||
    [0, 400, 408, 412, 429, 500, 502, 503, 504].includes(Number(response.status || 0)) ||
    ["timeout", "error", "abort", "status_zero"].includes(response.diagnostic?.failureType);
  async function exclusive(id, action) {
    const current = (queues.get(id) || Promise.resolve())
      .catch(() => {})
      .then(action);
    queues.set(id, current);
    try {
      return await current;
    } finally {
      if (queues.get(id) === current) queues.delete(id);
    }
  }
  function outcome(id, ok, message, patch = {}) {
    const account = patchAccount(id, patch);
    return { ok, message, account };
  }
  function completed(id, automatic, result, password, remember, preserveValid) {
    const account = get(id);
    if (result.ok) {
      // Persist a replacement only after both password submission and identity verification.
      const saved = automatic
        ? account.savedPassword
        : remember
          ? vault.seal(id, password)
          : null;
      return outcome(
        id,
        true,
        automatic ? "已自动补登并核验号码" : "登录成功，已核验号码",
        {
          savedPassword: saved,
          loginStatus: "valid",
          loginNumber: account.phone,
          autoLoginStatus: saved ? "enabled" : "not_saved",
          autoLoginRetryAt: "",
          lastLoginAt: timestamp(),
          lastSessionCheckAt: timestamp(),
          lastError: "",
          ...(automatic ? { lastAutoLoginAt: timestamp() } : {}),
          ...(account.label === password ? { label: "" } : {}),
          ...(account.group === password ? { group: "未分组" } : {}),
        },
      );
    }
    const rejected =
      result.login?.ok &&
      typeof result.login.data === "object" &&
      !isTelecomSuccess(result.login);
    const passwordWrong =
      rejected &&
      /(?:密码|password).*(?:错误|不正确|有误|incorrect|invalid)|(?:错误|incorrect|invalid).*(?:密码|password)/i.test(
        String(result.login?.data?.retMsg || ""),
      );
    const submitted = Boolean(result.login);
    const mismatchedIdentity = identityMismatch(result.loginAccount, account.phone);
    const failedIdentity = result.loginAccount && !isTelecomSuccess(result.loginAccount);
    const missingIdentity = Boolean(
      result.loginAccount &&
        isTelecomSuccess(result.loginAccount) &&
        !result.loginAccount.data?.object,
    );
    const diagnostic = responseDiagnostic(
      failedIdentity ? result.loginAccount : result.login || result.initialization,
      failedIdentity ? "account_confirmation" : submitted ? "password_submission" : "initialization",
    );
    const message = mismatchedIdentity
      ? "登录成功但手机号核验不匹配，请重新登录"
      : missingIdentity
        ? "登录成功但未返回手机号，请稍后重试"
      : passwordWrong || diagnostic.category === "password_rejected"
      ? "服务密码错误，请手动重新登录并更新密码"
      : diagnostic.category === "waf_challenge"
        ? "电信安全验证未完成，请稍后重试"
        : diagnostic.category === "timeout"
          ? "电信请求超时，请稍后重试"
          : diagnostic.category === "page_reloaded"
            ? "电信验证页面刚刚刷新，请重新登录"
        : [502, 503, 504].includes(diagnostic.status)
          ? `电信上游暂不可用（HTTP ${diagnostic.status}），请稍后重试`
          : diagnostic.category === "network_error"
            ? "电信网络连接失败，请检查网络后重试"
            : submitted
              ? `登录未完成${diagnostic.retMsg ? `：${diagnostic.retMsg}` : "，请手动重新登录"}`
              : "电信会话初始化失败，请稍后重试";
    const transientFailure = [
      "network_error",
      "timeout",
      "waf_challenge",
      "upstream_unavailable",
      "page_reloaded",
    ].includes(diagnostic.category);
    const keepValid = preserveValid && transientFailure;
    return outcome(id, false, message, {
      loginStatus: keepValid ? "valid" : "invalid",
      loginNumber: keepValid ? account.phone : "",
      lastError: keepValid ? "" : message,
      autoLoginStatus: !account.savedPassword
        ? "not_saved"
        : keepValid
          ? "retry_wait"
          : submitted || !automatic
          ? "manual_required"
          : "retry_wait",
      autoLoginRetryAt:
        automatic && (keepValid || !submitted)
          ? new Date(now() + 15 * 60_000).toISOString()
          : "",
    });
  }
  async function submit(id, password, automatic, remember = true) {
    const preserveValid = automatic && sessionLeaseActive(get(id));
    get(id);
    patchAccount(id, {
      loginStatus: "invalid",
      loginNumber: "",
      lastError: "",
      autoLoginStatus: automatic ? "running" : "manual_required",
    });
    try {
      const result = await loginByServicePassword(id, get(id).phone, password);
      const response = completed(id, automatic, result, password, remember, preserveValid);
      const mismatchedIdentity = identityMismatch(result.loginAccount, get(id).phone);
      const failedIdentity = result.loginAccount && !isTelecomSuccess(result.loginAccount);
      const failureResponse = failedIdentity
        ? result.loginAccount
        : result.login || result.initialization;
      appendLog(id, automatic ? "auto_login" : "password_login", {
        ok: response.ok,
        stage: response.ok
          ? "complete"
          : mismatchedIdentity || failedIdentity
            ? "account_confirmation"
            : result.login
              ? "password_submission"
              : "initialization",
        initialization: loginSummary(result.initialization, "initialization"),
        initializationAttempts: result.initializationAttempts,
        login: loginSummary(result.login, "password_submission"),
        loginAccount: loginSummary(result.loginAccount, "account_confirmation"),
        failure: response.ok ? null : responseDiagnostic(
          mismatchedIdentity || failedIdentity ? result.loginAccount : failureResponse,
          mismatchedIdentity || failedIdentity
            ? "account_confirmation"
            : (result.login ? "password_submission" : "initialization"),
        ),
      });
      return response;
    } catch (error) {
      const diagnostic = loginErrorDiagnostic(error);
      const ambiguousSubmission = [
        "password_submission",
        "account_confirmation",
      ].includes(diagnostic.stage);
      const message = diagnostic.category === "timeout"
        ? "电信请求超时，请稍后重试"
        : diagnostic.category === "page_reloaded"
          ? "电信验证页面刚刚刷新，请重新登录"
          : diagnostic.category === "network_error"
            ? "电信网络连接失败，请检查网络后重试"
            : diagnostic.category === "engine_unavailable" || diagnostic.category === "engine_closed"
              ? "本地登录引擎不可用，请联系管理员"
              : "电信登录连接失败，请稍后手动重试";
      const response = outcome(id, false, message, {
        loginStatus: "invalid",
        loginNumber: "",
        lastError: message,
        autoLoginStatus: !get(id).savedPassword
          ? "not_saved"
          : !automatic || ambiguousSubmission
            ? "manual_required"
            : "retry_wait",
        autoLoginRetryAt:
          automatic && !ambiguousSubmission
            ? new Date(now() + 15 * 60_000).toISOString()
            : "",
      });
      appendLog(id, automatic ? "auto_login" : "password_login", {
        ok: false,
        error: diagnostic,
      });
      return { ...response, connectionFailed: true };
    }
  }
  return {
    closeSession(id) {
      return exclusive(id, async () => {
        get(id);
        await closeClient(id);
        return outcome(id, true, "会话已关闭，自动补登已暂停", {
          loginStatus: "closed",
          loginNumber: "",
          autoLoginStatus: "paused",
          lastError: "",
        });
      });
    },
    manualLogin(id, password, remember = true) {
      return withLoginSlot(() => exclusive(id, async () => {
          const account = get(id);
          if (account.enabled === false)
            return { ok: false, message: "账号已停用，请先启用" };
          if (!/^\d{1,32}$/.test(password))
            throw Object.assign(new Error("请输入数字服务密码（最多 32 位）"), {
              status: 400,
            });
          if (!remember)
            patchAccount(id, {
              savedPassword: null,
              autoLoginStatus: "not_saved",
            });
          return submit(id, password, false, remember);
        }));
    },
    reloginSaved(id) {
      return withLoginSlot(() => exclusive(id, async () => {
          const account = get(id);
          if (account.enabled === false) return { ok: false, message: "账号已停用，请先启用" };
          if (!account.savedPassword)
            return { ok: false, message: "没有已保存的服务密码，请手动输入并记住密码" };
          let password;
          try {
            password = vault.open(id, account.savedPassword);
          } catch {
            return outcome(id, false, "已保存的服务密码无法解密，请手动重新登录", {
              autoLoginStatus: "manual_required",
              lastError: "已保存的服务密码无法解密，请手动重新登录",
            });
          }
          return submit(id, password, true);
        }));
    },
    ensureSession(id) {
      if (checks.has(id)) return checks.get(id);
      const pending = withLoginSlot(() => exclusive(id, async () => {
        let account = get(id);
        if (account.enabled === false || account.loginStatus === "closed")
          return {
            ok: false,
            message:
              account.enabled === false
                ? "账号已停用"
                : "会话已关闭，请手动重新登录",
          };
        let identity;
        try {
          identity = await queryLoginAccount(id);
          const retryableStatus = [0, 400, 408, 412, 502, 503, 504];
          if (!isTelecomSuccess(identity) && retryableStatus.includes(Number(identity?.status || 0)))
            identity = await queryLoginAccount(id, { reinitialize: true });
        } catch {
          /* A network failure is not proof of expiry. */
        }
        account = get(id);
        if (account.enabled === false || account.loginStatus === "closed")
          return { ok: false, message: "账号已停用或会话已关闭" };
        if (!isTelecomSuccess(identity)) {
          if (sessionLeaseActive(account) && transientIdentityFailure(identity))
            return outcome(id, true, "登录会话仍在有效期内，暂跳过本次核验", {
              loginStatus: "valid",
              loginNumber: account.phone,
              lastError: "",
            });
          return outcome(id, false, "暂时无法核验登录状态，请稍后重试", {
            loginStatus: "unknown",
            loginNumber: "",
            lastError: "暂时无法核验登录状态，请稍后重试",
          });
        }
        if (identity.data.object === account.phone)
          return outcome(id, true, "登录号码核验通过", {
            loginStatus: "valid",
            loginNumber: account.phone,
            lastSessionCheckAt: timestamp(),
            lastError: "",
          });
        if (identity.data.object)
          return outcome(id, false, "登录号码不匹配，请手动重新登录", {
            loginStatus: "invalid",
            loginNumber: "",
            autoLoginStatus: "manual_required",
            lastError: "登录号码不匹配，请手动重新登录",
          });
        patchAccount(id, {
          loginStatus: "invalid",
          loginNumber: "",
          lastSessionCheckAt: timestamp(),
        });
        account = get(id);
        if (!account.savedPassword)
          return outcome(id, false, "会话已过期，请登录并记住服务密码", {
            lastError: "会话已过期，请登录并记住服务密码",
          });
        const transientFailure = /网络连接失败|请求超时|上游暂不可用|安全验证未完成|验证页面刚刚刷新/.test(
          String(account.lastError || ""),
        );
        if (account.autoLoginStatus === "manual_required" && !transientFailure)
          return {
            ok: false,
            message: account.lastError || "请手动重新登录并更新服务密码",
          };
        if (Date.parse(account.autoLoginRetryAt) > now())
          return { ok: false, message: "自动补登稍后重试，也可手动重新登录" };
        let password;
        try {
          password = vault.open(id, account.savedPassword);
        } catch {
          return outcome(id, false, "已保存的服务密码不可用，请手动重新登录", {
            autoLoginStatus: "manual_required",
            lastError: "已保存的服务密码不可用，请手动重新登录",
          });
        }
        return submit(id, password, true);
      }));
      checks.set(id, pending);
      pending
        .finally(() => {
          if (checks.get(id) === pending) checks.delete(id);
        })
        .catch(() => {});
      return pending;
    },
  };
}
