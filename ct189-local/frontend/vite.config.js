import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

function revision() {
  const fallback = `${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git`;
  try {
    return execFileSync(
      existsSync(fallback) ? fallback : "git",
      ["rev-parse", "--short=12", "HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    return "development";
  }
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "ct189-version",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "version.json",
          source: JSON.stringify({
            name: "北京电信快捷服务",
            revision: revision(),
          }),
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5710",
    },
  },
});
