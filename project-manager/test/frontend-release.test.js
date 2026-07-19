import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

process.env.PROJECT_MANAGER_NO_LISTEN = "1";
process.env.MANAGER_PASSWORD ||= "test-manager-password";
process.env.MANAGER_SESSION_SECRET ||= "test-session-secret-at-least-32-bytes";

const { testHelpers } = await import("../server.js");
const testDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(testDir, "../..");

async function fixture() {
  const id = `frontend-test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const relativeDir = `project-manager/runtime/${id}`;
  const absoluteDir = path.join(workspaceRoot, relativeDir);
  const liveDist = path.join(absoluteDir, "dist");
  await mkdir(liveDist, { recursive: true });
  await writeFile(path.join(liveDist, "index.html"), "old");
  await writeFile(path.join(absoluteDir, "package.json"), JSON.stringify({
    private: true,
    scripts: { build: "node build.mjs" },
  }));
  await writeFile(path.join(absoluteDir, "build.mjs"), [
    'import { mkdir, writeFile } from "node:fs/promises";',
    'const index = process.argv.indexOf("--outDir");',
    'if (index < 0 || !process.argv[index + 1]) process.exit(2);',
    'await mkdir(process.argv[index + 1], { recursive: true });',
    'await writeFile(new URL("index.html", `file://${process.argv[index + 1]}/`), "new");',
  ].join("\n"));
  return {
    absoluteDir,
    liveDist,
    project: {
      id,
      name: id,
      frontend: { cwd: relativeDir, dist: `${relativeDir}/dist`, build: ["npm", "run", "build"] },
    },
  };
}

test("stages without touching live output and restores it after rollback", async () => {
  const current = await fixture();
  try {
    const staged = await testHelpers.stageFrontend(current.project);
    assert.equal(staged.result.ok, true, staged.result.stderr);
    assert.equal(await readFile(path.join(current.liveDist, "index.html"), "utf8"), "old");

    const activation = await testHelpers.activateStagedFrontend(staged.context);
    assert.equal(activation.ok, true, activation.stderr);
    assert.equal(await readFile(path.join(current.liveDist, "index.html"), "utf8"), "new");

    const rollback = await testHelpers.rollbackFrontend(staged.context);
    assert.equal(rollback.ok, true, rollback.stderr);
    assert.equal(await readFile(path.join(current.liveDist, "index.html"), "utf8"), "old");
  } finally {
    await rm(current.absoluteDir, { recursive: true, force: true });
  }
});

test("finalizes an activated candidate and removes its rollback backup", async () => {
  const current = await fixture();
  try {
    const staged = await testHelpers.stageFrontend(current.project);
    assert.equal(staged.result.ok, true, staged.result.stderr);
    assert.equal((await testHelpers.activateStagedFrontend(staged.context)).ok, true);
    await testHelpers.finalizeFrontend(staged.context);
    assert.equal(await readFile(path.join(current.liveDist, "index.html"), "utf8"), "new");
  } finally {
    await rm(current.absoluteDir, { recursive: true, force: true });
  }
});

test("rejects a candidate whose index references a missing local asset", async () => {
  const absoluteDir = path.join(workspaceRoot, `project-manager/runtime/frontend-validation-${Date.now()}`);
  try {
    await mkdir(absoluteDir, { recursive: true });
    await writeFile(path.join(absoluteDir, "index.html"), '<script type="module" src="/assets/app.js"></script>');
    const validation = await testHelpers.validateFrontendArtifact(absoluteDir);
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join("\n"), /assets\/app\.js/);
  } finally {
    await rm(absoluteDir, { recursive: true, force: true });
  }
});

test("recovers the newest valid backup when activation was interrupted", async () => {
  const absoluteDir = path.join(workspaceRoot, `project-manager/runtime/frontend-recovery-${Date.now()}`);
  const liveDist = path.join(absoluteDir, "dist");
  const olderBackup = path.join(absoluteDir, "dist.bak-100");
  const newestBackup = path.join(absoluteDir, "dist.bak-200");
  try {
    await mkdir(olderBackup, { recursive: true });
    await mkdir(newestBackup, { recursive: true });
    await writeFile(path.join(olderBackup, "index.html"), "older");
    await writeFile(path.join(newestBackup, "index.html"), "newest");

    const recovery = await testHelpers.recoverInterruptedFrontendActivation({ dist: liveDist });
    assert.equal(recovery.recovered, true);
    assert.equal(await readFile(path.join(liveDist, "index.html"), "utf8"), "newest");
  } finally {
    await rm(absoluteDir, { recursive: true, force: true });
  }
});
