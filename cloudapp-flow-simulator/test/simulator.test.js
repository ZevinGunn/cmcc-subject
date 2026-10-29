import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CloudAppFlowSimulator,
  FixtureCloudAppAdapter,
  SimulationInputError,
  STATES
} from "../src/simulator.js";

async function runScenario(scenario, cookie, options = {}) {
  const adapter = new FixtureCloudAppAdapter(scenario);
  const simulator = new CloudAppFlowSimulator({ adapter, ...options });
  return simulator.run({ cookie });
}

test("12924 fixture reaches PLAYING and returns only redacted artifacts by default", async () => {
  const result = await runScenario("12924-ready", "fixture:wx-valid");

  assert.equal(result.ok, true);
  assert.equal(result.finalState, STATES.PLAYING);
  assert.equal(result.outcome, "PLAYING");
  assert.ok(result.events.some((event) => event.state === STATES.READY));
  assert.ok(Object.values(result.artifacts).every((value) => value === "[REDACTED_FIXTURE]"));
});

test("fixture values can be displayed only when explicitly requested", async () => {
  const result = await runScenario("12924-ready", "fixture:wx-valid", {
    showFixtures: true
  });

  assert.match(result.artifacts.playerToken, /^DEMO_ONLY_PLAYER_TOKEN_/);
  assert.match(result.artifacts.connectionTicket, /^DEMO_ONLY_CONNECTION_TICKET_/);
});

test("10607 fixture stops at capability denial without creating a launch", async () => {
  const result = await runScenario("10607-denied", "fixture:wx-valid");

  assert.equal(result.ok, false);
  assert.equal(result.finalState, STATES.CAPABILITY_DENIED);
  assert.equal(result.outcome, "CAPABILITY_DENIED");
  assert.equal("launchRef" in result.artifacts, false);
  assert.equal(result.events.at(-1).data.capabilityCode, "6000608");
});

test("expired fixture stops before entry token issuance", async () => {
  const result = await runScenario("sso-expired", "fixture:wx-expired");

  assert.equal(result.ok, false);
  assert.equal(result.finalState, STATES.SESSION_EXPIRED);
  assert.deepEqual(result.artifacts, {});
});

test("launch timeout fixture obeys the bounded polling budget", async () => {
  const result = await runScenario("launch-timeout", "fixture:wx-valid");

  assert.equal(result.ok, false);
  assert.equal(result.finalState, STATES.LAUNCH_TIMEOUT);
  assert.equal(
    result.events.filter((event) => event.state === STATES.POLLING).length,
    3
  );
});

test("real-looking Cookie input is rejected", async () => {
  await assert.rejects(
    () => runScenario("12924-ready", "SESSION=abc123; token=real-looking-value"),
    (error) => error instanceof SimulationInputError && error.code === "REAL_CREDENTIAL_REJECTED"
  );
});

test("an adapter cannot opt into fixture mode by spoofing its kind", () => {
  assert.throws(
    () => new CloudAppFlowSimulator({ adapter: { kind: "fixture" } }),
    (error) => error instanceof SimulationInputError && error.code === "NON_FIXTURE_ADAPTER_REJECTED"
  );
});

test("runtime source contains no network URL or fetch call", async () => {
  const source = await readFile(new URL("../src/simulator.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /https?:\/\//i);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
});
