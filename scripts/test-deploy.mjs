#!/usr/bin/env node
/**
 * Smoke-test production Hosting + /api rewrite to Cloud Functions.
 */
const PROJECT_ID = "annual-report-hpl";
const HOSTING_URL = process.env.HOSTING_URL ?? `https://${PROJECT_ID}.web.app`;

const checks = [
  {
    name: "Hosting index (SPA)",
    url: `${HOSTING_URL}/`,
    expectStatus: 200,
    expectBodyIncludes: ["Horana", "html"],
  },
  {
    name: "API health (Functions via Hosting rewrite)",
    url: `${HOSTING_URL}/api/health`,
    expectStatus: 200,
    expectJson: { status: "ok", service: "horana-functions" },
  },
  {
    name: "API release-status",
    url: `${HOSTING_URL}/api/app/release-status`,
    expectStatus: 200,
    expectJsonKeys: ["released"],
  },
];

let passed = 0;
let failed = 0;

async function runCheck(check) {
  try {
    const res = await fetch(check.url, {
      headers: { Accept: "application/json, text/html" },
      redirect: "follow",
    });
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (res.status !== check.expectStatus) {
      throw new Error(`HTTP ${res.status}, expected ${check.expectStatus}`);
    }

    if (check.expectBodyIncludes) {
      const hay = typeof body === "string" ? body : JSON.stringify(body);
      for (const needle of check.expectBodyIncludes) {
        if (!hay.includes(needle)) {
          throw new Error(`Response missing "${needle}"`);
        }
      }
    }

    if (check.expectJson) {
      for (const [key, value] of Object.entries(check.expectJson)) {
        if (body[key] !== value) {
          throw new Error(`JSON ${key}: got ${JSON.stringify(body[key])}, expected ${JSON.stringify(value)}`);
        }
      }
    }

    if (check.expectJsonKeys) {
      for (const key of check.expectJsonKeys) {
        if (!(key in body)) {
          throw new Error(`JSON missing key "${key}"`);
        }
      }
    }

    console.log(`  ✓ ${check.name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${check.name}: ${err.message}`);
    console.error(`    URL: ${check.url}`);
    failed++;
  }
}

console.log(`Testing ${HOSTING_URL}\n`);

for (const check of checks) {
  await runCheck(check);
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0 && passed > 0) {
  console.log(
    "\nHosting is live but /api routes failed — deploy Functions after App Engine is enabled:",
  );
  console.log("  https://console.cloud.google.com/appengine?project=annual-report-hpl");
  console.log("  Then: npm run firebase:deploy:functions\n");
}

if (failed > 0) {
  process.exit(1);
}

console.log("\nAll smoke tests passed.");
