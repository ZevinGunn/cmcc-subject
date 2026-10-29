import { createHash } from "node:crypto";

export const STATES = Object.freeze({
  INIT: "INIT",
  ENTRY_VALIDATING: "ENTRY_VALIDATING",
  ENTRY_ISSUED: "ENTRY_ISSUED",
  SESSION_EXCHANGING: "SESSION_EXCHANGING",
  SESSION_READY: "SESSION_READY",
  PREPARING: "PREPARING",
  CAPABILITY_DENIED: "CAPABILITY_DENIED",
  LAUNCHING: "LAUNCHING",
  POLLING: "POLLING",
  READY: "READY",
  SIGNALING_CONNECTING: "SIGNALING_CONNECTING",
  PLAYING: "PLAYING",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  LAUNCH_TIMEOUT: "LAUNCH_TIMEOUT"
});

const FIXTURE_COOKIES = new Set([
  "fixture:wx-valid",
  "fixture:wx-expired"
]);

const SCENARIOS = Object.freeze({
  "12924-ready": {
    appId: "12924",
    expectedCookie: "fixture:wx-valid",
    canPlay: 1,
    capabilityCode: "200",
    pollCodes: ["15003", "1"]
  },
  "10607-denied": {
    appId: "10607",
    expectedCookie: "fixture:wx-valid",
    canPlay: 0,
    capabilityCode: "6000608",
    pollCodes: []
  },
  "sso-expired": {
    appId: "10607",
    expectedCookie: "fixture:wx-expired",
    canPlay: 0,
    capabilityCode: "6000608",
    pollCodes: []
  },
  "launch-timeout": {
    appId: "12924",
    expectedCookie: "fixture:wx-valid",
    canPlay: 1,
    capabilityCode: "200",
    pollCodes: ["15003", "15003", "15003"]
  }
});

export class SimulationInputError extends Error {
  constructor(message, code = "INVALID_INPUT") {
    super(message);
    this.name = "SimulationInputError";
    this.code = code;
  }
}

function fixtureValue(kind, scenarioName) {
  const suffix = createHash("sha256")
    .update(`${kind}:${scenarioName}`)
    .digest("hex")
    .slice(0, 12);
  return `DEMO_ONLY_${kind.toUpperCase()}_${suffix}`;
}

function assertFixtureCookie(cookie) {
  if (!FIXTURE_COOKIES.has(cookie)) {
    throw new SimulationInputError(
      "Only fixture cookies are accepted. Use fixture:wx-valid or fixture:wx-expired; real Cookie values are intentionally rejected.",
      "REAL_CREDENTIAL_REJECTED"
    );
  }
}

function assertScenario(scenarioName) {
  const scenario = SCENARIOS[scenarioName];
  if (!scenario) {
    throw new SimulationInputError(
      `Unknown scenario: ${scenarioName}. Available scenarios: ${Object.keys(SCENARIOS).join(", ")}.`,
      "UNKNOWN_SCENARIO"
    );
  }
  return scenario;
}

function visibleValue(value, showFixtures) {
  return showFixtures ? value : "[REDACTED_FIXTURE]";
}

export class FixtureCloudAppAdapter {
  constructor(scenarioName) {
    this.kind = "fixture";
    this.scenarioName = scenarioName;
    this.scenario = assertScenario(scenarioName);
    this.pollIndex = 0;
  }

  async validateWxSession(cookie) {
    assertFixtureCookie(cookie);
    if (cookie !== this.scenario.expectedCookie || cookie === "fixture:wx-expired") {
      return { valid: false, reason: "FIXTURE_SESSION_EXPIRED" };
    }
    return { valid: true, subjectRef: fixtureValue("subject_ref", this.scenarioName) };
  }

  async issueEntry() {
    return {
      appId: this.scenario.appId,
      encryptedAppId: fixtureValue("encrypted_app_id", this.scenarioName),
      entryToken: fixtureValue("entry_token", this.scenarioName)
    };
  }

  async exchangePortalSession() {
    return {
      portalToken: fixtureValue("portal_token", this.scenarioName),
      hwToken: fixtureValue("hw_token", this.scenarioName),
      refreshToken: fixtureValue("refresh_token", this.scenarioName)
    };
  }

  async prepareApplication() {
    return {
      appConfig: {
        appId: this.scenario.appId,
        canPlay: this.scenario.canPlay
      },
      capability: this.scenario.capabilityCode === "200"
        ? {
            code: "200",
            accessToken: fixtureValue("capability_token", this.scenarioName),
            secretKey: fixtureValue("signing_key", this.scenarioName),
            capabilityGrantRef: fixtureValue("grant_ref", this.scenarioName)
          }
        : {
            code: this.scenario.capabilityCode,
            reason: "FIXTURE_CAPABILITY_DENIED"
          }
    };
  }

  async createLaunch() {
    return {
      code: "1",
      launchId: fixtureValue("launch_ref", this.scenarioName),
      vendorTaskRef: fixtureValue("vendor_task_ref", this.scenarioName)
    };
  }

  async pollLaunch() {
    const code = this.scenario.pollCodes[this.pollIndex] ?? "15003";
    this.pollIndex += 1;
    if (code !== "1") {
      return { code, status: "PENDING" };
    }
    return {
      code: "1",
      status: "READY",
      deviceRef: fixtureValue("device_ref", this.scenarioName),
      playerToken: fixtureValue("player_token", this.scenarioName),
      playerSessionRef: fixtureValue("player_session_ref", this.scenarioName),
      signalingRef: fixtureValue("signaling_ref", this.scenarioName)
    };
  }

  async connectSignaling() {
    return {
      authorized: true,
      connectionTicket: fixtureValue("connection_ticket", this.scenarioName)
    };
  }
}

export class CloudAppFlowSimulator {
  constructor({ adapter, showFixtures = false, maxPolls = 3 }) {
    if (!(adapter instanceof FixtureCloudAppAdapter)) {
      throw new SimulationInputError(
        "This sample only permits the offline fixture adapter.",
        "NON_FIXTURE_ADAPTER_REJECTED"
      );
    }
    this.adapter = adapter;
    this.showFixtures = showFixtures;
    this.maxPolls = maxPolls;
    this.events = [];
    this.artifacts = {};
  }

  record(state, action, status, data = {}) {
    this.events.push({
      sequence: this.events.length + 1,
      state,
      action,
      status,
      data
    });
  }

  saveArtifact(name, value) {
    this.artifacts[name] = visibleValue(value, this.showFixtures);
  }

  result(outcome, ok) {
    return {
      mode: "OFFLINE_FIXTURE_ONLY",
      scenario: this.adapter.scenarioName,
      ok,
      outcome,
      finalState: this.events.at(-1)?.state ?? STATES.INIT,
      events: this.events,
      artifacts: this.artifacts
    };
  }

  async run({ cookie }) {
    assertFixtureCookie(cookie);

    this.record(STATES.ENTRY_VALIDATING, "validate wx session fixture", "STARTED");
    const wxSession = await this.adapter.validateWxSession(cookie);
    if (!wxSession.valid) {
      this.record(STATES.SESSION_EXPIRED, "validate wx session fixture", "FAILED", {
        reason: wxSession.reason
      });
      return this.result("SESSION_EXPIRED", false);
    }
    this.record(STATES.ENTRY_VALIDATING, "validate wx session fixture", "SUCCEEDED");

    const entry = await this.adapter.issueEntry();
    this.saveArtifact("entryToken", entry.entryToken);
    this.record(STATES.ENTRY_ISSUED, "issue one-time entry fixture", "SUCCEEDED", {
      appId: entry.appId,
      entryToken: visibleValue(entry.entryToken, this.showFixtures)
    });

    this.record(STATES.SESSION_EXCHANGING, "exchange entry fixture for portal session", "STARTED");
    const portalSession = await this.adapter.exchangePortalSession(entry);
    this.saveArtifact("portalToken", portalSession.portalToken);
    this.saveArtifact("hwToken", portalSession.hwToken);
    this.record(STATES.SESSION_READY, "exchange entry fixture for portal session", "SUCCEEDED", {
      portalToken: visibleValue(portalSession.portalToken, this.showFixtures),
      hwToken: visibleValue(portalSession.hwToken, this.showFixtures)
    });

    const prepared = await this.adapter.prepareApplication(portalSession, entry);
    this.record(STATES.PREPARING, "load config and capability fixtures", "SUCCEEDED", {
      appId: prepared.appConfig.appId,
      canPlay: prepared.appConfig.canPlay,
      capabilityCode: prepared.capability.code
    });

    if (prepared.appConfig.canPlay !== 1 || prepared.capability.code !== "200") {
      this.record(STATES.CAPABILITY_DENIED, "evaluate runtime policy", "DENIED", {
        canPlay: prepared.appConfig.canPlay,
        capabilityCode: prepared.capability.code,
        reason: prepared.capability.reason ?? "FIXTURE_APP_UNAVAILABLE"
      });
      return this.result("CAPABILITY_DENIED", false);
    }

    this.saveArtifact("capabilityToken", prepared.capability.accessToken);
    this.saveArtifact("capabilityGrantRef", prepared.capability.capabilityGrantRef);
    this.record(STATES.LAUNCHING, "create cloud instance fixture", "STARTED", {
      capabilityGrantRef: visibleValue(prepared.capability.capabilityGrantRef, this.showFixtures)
    });
    const launch = await this.adapter.createLaunch(prepared);
    this.saveArtifact("launchRef", launch.launchId);
    this.record(STATES.LAUNCHING, "create cloud instance fixture", "ACCEPTED", {
      code: launch.code,
      launchRef: visibleValue(launch.launchId, this.showFixtures)
    });

    let ready;
    for (let attempt = 1; attempt <= this.maxPolls; attempt += 1) {
      const poll = await this.adapter.pollLaunch(launch);
      this.record(STATES.POLLING, "poll launch fixture", poll.status, {
        attempt,
        code: poll.code
      });
      if (poll.status === "READY") {
        ready = poll;
        break;
      }
    }

    if (!ready) {
      this.record(STATES.LAUNCH_TIMEOUT, "poll launch fixture", "FAILED", {
        maxPolls: this.maxPolls
      });
      return this.result("LAUNCH_TIMEOUT", false);
    }

    this.saveArtifact("playerToken", ready.playerToken);
    this.saveArtifact("playerSessionRef", ready.playerSessionRef);
    this.record(STATES.READY, "receive player bootstrap fixture", "SUCCEEDED", {
      playerToken: visibleValue(ready.playerToken, this.showFixtures),
      playerSessionRef: visibleValue(ready.playerSessionRef, this.showFixtures)
    });

    this.record(STATES.SIGNALING_CONNECTING, "consume signaling fixture ticket", "STARTED");
    const signaling = await this.adapter.connectSignaling(ready);
    this.saveArtifact("connectionTicket", signaling.connectionTicket);
    this.record(STATES.PLAYING, "authorize signaling and attach media fixture", "SUCCEEDED", {
      authorized: signaling.authorized,
      connectionTicket: visibleValue(signaling.connectionTicket, this.showFixtures)
    });

    return this.result("PLAYING", true);
  }
}

export function listScenarios() {
  return Object.keys(SCENARIOS);
}
