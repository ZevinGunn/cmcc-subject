import {
  isTelecomSuccess,
  loginSummary,
  loginErrorDiagnostic,
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
  const queues = new Map(),
    checks = new Map();
  const timestamp = () => new Date(now()).toISOString();
  const get = (id) => {
    const account = getAccount(id);
    if (!account) throw Object.assign(new Error("账号不存在"), { status: 404 });
    return account;
  };
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
  function completed(id, automatic, result, password, remember) {
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
    const message = passwordWrong
      ? "服务密码错误，请手动重新登录并更新密码"
      : submitted
        ? "登录未完成，请手动重新登录"
        : "电信连接暂不可用，请稍后重试";
    return outcome(id, false, message, {
      loginStatus: "invalid",
      loginNumber: "",
      lastError: message,
      autoLoginStatus: !account.savedPassword
        ? "not_saved"
        : submitted || !automatic
          ? "manual_required"
          : "retry_wait",
      autoLoginRetryAt:
        automatic && !submitted
          ? new Date(now() + 15 * 60_000).toISOString()
          : "",
    });
  }
  async function submit(id, password, automatic, remember = true) {
    get(id);
    patchAccount(id, {
      loginStatus: "invalid",
      loginNumber: "",
      lastError: "",
      autoLoginStatus: automatic ? "running" : "manual_required",
    });
    try {
      const result = await loginByServicePassword(id, get(id).phone, password);
      const response = completed(id, automatic, result, password, remember);
      appendLog(id, automatic ? "auto_login" : "password_login", {
        ok: response.ok,
        initialization: loginSummary(result.initialization),
        initializationAttempts: result.initializationAttempts,
        login: loginSummary(result.login),
        loginAccount: loginSummary(result.loginAccount),
      });
      return response;
    } catch (error) {
      const diagnostic = loginErrorDiagnostic(error);
      const ambiguousSubmission = [
        "password_submission",
        "account_confirmation",
      ].includes(diagnostic.stage);
      const message = "电信登录连接失败，请稍后手动重试";
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
      return exclusive(id, async () => {
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
      });
    },
    ensureSession(id) {
      if (checks.has(id)) return checks.get(id);
      const pending = exclusive(id, async () => {
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
        } catch {
          /* A network failure is not proof of expiry. */
        }
        account = get(id);
        if (account.enabled === false || account.loginStatus === "closed")
          return { ok: false, message: "账号已停用或会话已关闭" };
        if (!isTelecomSuccess(identity))
          return outcome(id, false, "暂时无法核验登录状态，请稍后重试", {
            loginStatus: "unknown",
            loginNumber: "",
            lastError: "暂时无法核验登录状态，请稍后重试",
          });
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
        if (account.autoLoginStatus === "manual_required")
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
      });
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
