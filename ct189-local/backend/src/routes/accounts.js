import express from "express";
import {
  deleteAccount,
  getAccount,
  listAccounts,
  listLogs,
  patchAccount,
  upsertAccount,
} from "../services/accountStore.js";
import { removeClient } from "../services/telecomClient.js";
import { accountHasPendingTask } from "../services/taskRunner.js";

export const accountsRouter = express.Router();
const metadata = (body) => ({
  ...(body.label !== undefined
    ? { label: String(body.label).trim().slice(0, 80) }
    : {}),
  ...(body.group !== undefined
    ? { group: String(body.group).trim().slice(0, 40) || "未分组" }
    : {}),
  ...(typeof body.enabled === "boolean" ? { enabled: body.enabled } : {}),
});
accountsRouter.get("/", (req, res) =>
  res.json({ ok: true, accounts: listAccounts() }),
);
accountsRouter.get("/logs", (req, res) =>
  res.json({ ok: true, logs: listLogs() }),
);
accountsRouter.post("/import", (req, res) => {
  const rows = req.body?.accounts;
  if (
    !Array.isArray(rows) ||
    rows.length < 1 ||
    rows.length > 200 ||
    rows.some((row) => !row || !/^1\d{10}$/.test(String(row.phone)))
  ) {
    return res
      .status(400)
      .json({
        ok: false,
        message: "请导入 1–200 个有效手机号，整批验证通过后才会保存",
      });
  }
  const known = new Set(listAccounts().map((item) => item.phone));
  const added = [];
  let skipped = 0;
  for (const row of rows) {
    const phone = String(row.phone);
    if (known.has(phone)) {
      skipped++;
      continue;
    }
    known.add(phone);
    added.push(upsertAccount({ phone, ...metadata(row) }));
  }
  res.json({ ok: true, added: added.length, skipped, accounts: added });
});
accountsRouter.post("/", (req, res) => {
  const { id, phone } = req.body || {};
  if (!/^1\d{10}$/.test(String(phone)))
    return res.status(400).json({ ok: false, message: "请输入 11 位手机号" });
  if (id && getAccount(id)?.phone !== String(phone))
    return res
      .status(400)
      .json({ ok: false, message: "手机号不可修改，请添加新账号" });
  if (!id && listAccounts().some((item) => item.phone === String(phone)))
    return res.status(409).json({ ok: false, message: "该手机号已存在" });
  res.json({
    ok: true,
    account: upsertAccount({ id, phone: String(phone), ...metadata(req.body) }),
  });
});
accountsRouter.patch("/:id", (req, res) => {
  const account = patchAccount(req.params.id, metadata(req.body || {}));
  if (!account)
    return res.status(404).json({ ok: false, message: "账号不存在" });
  res.json({ ok: true, account });
});
accountsRouter.delete("/:id", async (req, res, next) => {
  try {
    if (!getAccount(req.params.id))
      return res.status(404).json({ ok: false, message: "账号不存在" });
    if (accountHasPendingTask(req.params.id))
      return res
        .status(409)
        .json({ ok: false, message: "账号仍有任务排队或执行中，请完成后删除" });
    await removeClient(req.params.id);
    deleteAccount(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
accountsRouter.get("/:id/logs", (req, res) =>
  res.json({ ok: true, logs: listLogs(req.params.id) }),
);
