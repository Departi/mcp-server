#!/usr/bin/env node

/**
 * MCP stdio-to-HTTP proxy for Departi MCP Server.
 *
 * Bridges the MCP stdio transport (used by local clients and Glama's build
 * evaluator) to the hosted Streamable HTTP endpoint at mcp.departi.eu/v3.
 *
 * - Reads newline-delimited JSON-RPC messages from stdin
 * - Forwards each as an HTTP POST to the remote endpoint
 * - Writes the JSON-RPC response to stdout
 *
 * No dependencies beyond Node.js built-ins.
 */

import { createInterface } from "node:readline";

const REMOTE_URL = process.env.MCP_REMOTE_URL || "https://mcp.departi.eu/v3";

let sessionId = null;
let pending = 0;
let stdinDone = false;

function maybeExit() {
  if (stdinDone && pending === 0) process.exit(0);
}

/**
 * Forward a single JSON-RPC message to the remote endpoint.
 */
async function forward(message) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };

  if (sessionId) {
    headers["Mcp-Session-Id"] = sessionId;
  }

  const res = await fetch(REMOTE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(message),
  });

  const sid = res.headers.get("mcp-session-id");
  if (sid) {
    sessionId = sid;
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("text/event-stream")) {
    const text = await res.text();
    const results = [];
    for (const line of text.split("\n")) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data && data !== "[DONE]") {
          try { results.push(JSON.parse(data)); } catch {}
        }
      }
    }
    return results;
  }

  if (contentType.includes("application/json")) {
    const body = await res.json();
    return Array.isArray(body) ? body : [body];
  }

  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    process.stderr.write("Unexpected response (" + res.status + "): " + text.slice(0, 200) + "\n");
    return [];
  }
}

async function processLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  let message;
  try {
    message = JSON.parse(trimmed);
  } catch {
    process.stderr.write("Invalid JSON: " + trimmed.slice(0, 100) + "\n");
    return;
  }

  pending++;
  try {
    const responses = await forward(message);
    for (const response of responses) {
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (err) {
    if (message.id !== undefined) {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32000, message: "Remote server error: " + err.message },
      }) + "\n");
    }
    process.stderr.write("Forward error: " + err.message + "\n");
  } finally {
    pending--;
    maybeExit();
  }
}

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => processLine(line));
rl.on("close", () => {
  stdinDone = true;
  maybeExit();
});
