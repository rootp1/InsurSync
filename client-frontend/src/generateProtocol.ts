import * as summon from "summon-ts";
import { Protocol } from "mpc-framework";
import { EmpWasmBackend } from "emp-wasm-backend";
import getCircuitFiles from "./getCircuitFiles";

// Global singleton to ensure all instances use the same protocol
let globalProtocolPromise: Promise<any> | null = null;

export default async function generateProtocol() {
  // Return the cached protocol if it exists
  if (globalProtocolPromise) {
    console.log("Using cached protocol instance");
    return globalProtocolPromise;
  }

  console.log("Generating new protocol instance...");
  
  globalProtocolPromise = (async () => {
    await summon.init();

    const circuit = summon.compileBoolean(
      "circuit/main.ts",
      32,  // Increased bit width to 32 for better compatibility with larger numbers
      await getCircuitFiles(),
    );

    console.log("Circuit compiled");

    const mpcSettings = [
      {
        name: "alice",
        inputs: ["age", "height", "weight"],
        outputs: ["main"],
      },
      {
        name: "bob",
        inputs: [
          "min_age",
          "max_age",
          "min_height",
          "max_height",
          "min_weight",
          "max_weight",
        ],
        outputs: ["main"],
      },
    ];

    const protocol = new Protocol(circuit, mpcSettings, new EmpWasmBackend());
    console.log("Protocol created successfully");
    return protocol;
  })();

  return globalProtocolPromise;
}
