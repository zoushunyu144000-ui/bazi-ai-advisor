import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const suite = process.argv[2];
const root = process.cwd();

const suites = {
  birth: {
    directory: "tests/birth",
    mode: "strip-types",
    extensions: [".test.mjs", ".test.ts"],
  },
  interpretation: {
    directory: "tests/interpretation",
    mode: "strip-types",
    extensions: [".test.ts", ".test.mjs"],
  },
  ai: {
    directory: "tests/ai",
    mode: "strip-types",
    extensions: [".test.ts", ".test.mjs"],
  },
  backend: {
    directory: "tests/backend",
    mode: "strip-types",
    extensions: [".test.mjs", ".test.ts"],
  },
  bazi: {
    directory: "tests/bazi",
    mode: "compiled-typescript",
  },
};

if (!(suite in suites)) {
  console.error(`Unknown test suite: ${suite ?? "<missing>"}`);
  process.exit(2);
}

const config = suites[suite];
const suiteDirectory = resolve(root, config.directory);

// Feature branches are intentionally merged one at a time. A suite whose
// feature directory is not present yet is skipped; once the directory exists,
// an empty or broken suite is a hard failure.
if (!existsSync(suiteDirectory)) {
  console.log(`[test:${suite}] skipped: ${config.directory} is not present on this branch.`);
  process.exit(0);
}

if (config.mode === "compiled-typescript") {
  runCompiledBaziSuite(suiteDirectory);
} else {
  const testFiles = findFiles(suiteDirectory, config.extensions);
  if (testFiles.length === 0) {
    console.error(`[test:${suite}] ${config.directory} exists but contains no supported test files.`);
    process.exit(1);
  }

  run(process.execPath, ["--experimental-strip-types", "--test", ...testFiles]);
}

function runCompiledBaziSuite(directory) {
  const tsconfig = join(directory, "tsconfig.json");
  if (!existsSync(tsconfig)) {
    console.error("[test:bazi] tests/bazi exists but tsconfig.json is missing.");
    process.exit(1);
  }

  const outputRoot = resolve(root, ".tmp/bazi-tests");
  rmSync(outputRoot, { recursive: true, force: true });

  const tscBin = resolve(root, "node_modules/typescript/bin/tsc");
  if (!existsSync(tscBin)) {
    console.error("[test:bazi] TypeScript compiler is not installed. Run npm ci first.");
    process.exit(1);
  }

  run(process.execPath, [tscBin, "-p", tsconfig]);

  const compiledDirectory = resolve(outputRoot, "tests/bazi");
  const compiledTests = existsSync(compiledDirectory)
    ? findFiles(compiledDirectory, [".test.js"])
    : [];

  if (compiledTests.length === 0) {
    console.error("[test:bazi] compilation succeeded but produced no .test.js files.");
    process.exit(1);
  }

  run(process.execPath, ["--test", ...compiledTests]);
}

function findFiles(directory, suffixes) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(path, suffixes));
      continue;
    }
    if (suffixes.some((suffix) => entry.name.endsWith(suffix))) {
      files.push(path);
    }
  }

  return files.sort();
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
