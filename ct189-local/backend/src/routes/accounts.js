import express from "express";
import {
  deleteAccount,
  getAccount,
  listAccounts,
  listLogs,
  patchAccount,
  upsertAccount
} from "../services/accountStore.js";
import { closeClient } from "../services/telecomClient.js";

export const accountsRouter = express.Router();

accountsRouter.get("/", (req, res) => {
  res.json({ ok: true, accounts: listAccounts() });
});

accountsRouter.post("/", (req, res) => {
  const { id, phone, label } = req.body || {};
  if (!phone || !/^1\d{10}$/.test(String(phone))) {
    res.status(400).json({ ok: false, message: "请输入 11 位手机号" });
    return;
  }
  res.json({ ok: true, account: upsertAccount({ id, phone, label }) });
});

accountsRouter.patch("/:id", (req, res) => {
  const account = patchAccount(req.params.id, req.body || {});
  if (!account) {
    res.status(404).json({ ok: false, message: "账号不存在" });
    return;
  }
  res.json({ ok: true, account });
});

accountsRouter.delete("/:id", async (req, res) => {
  const existing = getAccount(req.params.id);
  if (!existing) {
    res.status(404).json({ ok: false, message: "账号不存在" });
    return;
  }
  await closeClient(req.params.id);
  deleteAccount(req.params.id);
  res.json({ ok: true });
});

accountsRouter.get("/:id/logs", (req, res) => {
  res.json({ ok: true, logs: listLogs(req.params.id) });
});
