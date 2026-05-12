// js/test-runner.js — minimal vanilla test framework for the engine.
//
// Usage:
//   import { test, assert, assertEqual, assertGt, run } from './test-runner.js';
//   test('name', () => { assert(true); });
//   await run();
//
// Run with: node js/engine.test.js

const tests = [];
let passed = 0, failed = 0;
const failures = [];

export function test(name, fn) {
  tests.push({ name, fn });
}

export function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

export function assertEqual(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg || 'not equal'}\n  expected: ${e}\n  actual:   ${a}`);
  }
}

export function assertGt(a, b, msg) {
  if (!(a > b)) throw new Error(`${msg || 'expected greater'}: ${a} not > ${b}`);
}

export function assertGte(a, b, msg) {
  if (!(a >= b)) throw new Error(`${msg || 'expected gte'}: ${a} not >= ${b}`);
}

export function assertIncludes(haystack, needle, msg) {
  if (!haystack.includes(needle)) throw new Error(`${msg || 'expected to include'}: ${JSON.stringify(haystack)} missing ${JSON.stringify(needle)}`);
}

export async function run() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
      passed++;
    } catch (e) {
      console.error(`  \x1b[31m✗\x1b[0m ${name}`);
      console.error(`    ${e.message}`);
      failed++;
      failures.push({ name, error: e });
    }
  }
  console.log(`\n${passed} passed, ${failed} failed (${tests.length} total)`);
  if (typeof process !== 'undefined' && process.exit) {
    process.exit(failed > 0 ? 1 : 0);
  }
}
