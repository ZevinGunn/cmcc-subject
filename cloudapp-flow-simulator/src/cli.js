#!/usr/bin/env node

import {
  CloudAppFlowSimulator,
  FixtureCloudAppAdapter,
  SimulationInputError,
  listScenarios
} from "./simulator.js";

function usage() {
  return `Usage:
  node src/cli.js --cookie fixture:wx-valid --scenario 12924-ready

Options:
  --cookie <fixture>       Required. fixture:wx-valid or fixture:wx-expired
  --scenario <name>       ${listScenarios().join(" | ")}
  --show-fixtures         Show DEMO_ONLY fixture values instead of redaction
  --json                  Print machine-readable JSON
  --help                  Show this help

Safety boundary:
  This command is offline-only and rejects real Cookie values. It never calls
  external services and cannot obtain production portal or player credentials.`;
}

function parseArgs(argv) {
  const options = {
    scenario: "12924-ready",
    showFixtures: false,
    json: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--show-fixtures") {
      options.showFixtures = true;
    } else if (argument === "--json") {
      options.json = true;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--cookie" || argument === "--scenario") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new SimulationInputError(`Missing value for ${argument}.`);
      }
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new SimulationInputError(`Unknown option: ${argument}.`);
    }
  }

  if (!options.help && !options.cookie) {
    throw new SimulationInputError("--cookie is required.");
  }
  return options;
}

function printHuman(result) {
  console.log("Cloud App Flow Simulator [OFFLINE FIXTURE MODE]");
  console.log(`Scenario: ${result.scenario}`);
  console.log("");
  for (const event of result.events) {
    const number = String(event.sequence).padStart(2, "0");
    console.log(`${number}  ${event.state.padEnd(22)} ${event.status.padEnd(9)} ${event.action}`);
    if (Object.keys(event.data).length > 0) {
      console.log(`    ${JSON.stringify(event.data)}`);
    }
  }
  console.log("");
  console.log(`Outcome: ${result.outcome}`);
  console.log(`Artifacts: ${JSON.stringify(result.artifacts, null, 2)}`);
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
      return;
    }

    const adapter = new FixtureCloudAppAdapter(options.scenario);
    const simulator = new CloudAppFlowSimulator({
      adapter,
      showFixtures: options.showFixtures
    });
    const result = await simulator.run({ cookie: options.cookie });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printHuman(result);
    }
  } catch (error) {
    if (error instanceof SimulationInputError) {
      console.error(`Input rejected [${error.code}]: ${error.message}`);
      console.error("");
      console.error(usage());
      process.exitCode = 2;
      return;
    }
    throw error;
  }
}

await main();
