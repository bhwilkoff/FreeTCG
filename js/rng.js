// js/rng.js — seedable, deterministic, pure-functional PRNG.
//
// Uses Mulberry32 — small (one 32-bit state word), fast, well-distributed for
// game purposes. Not cryptographically secure (we don't need that).
//
// Pure-functional: every function takes a state and returns [value, newState].
// The state never mutates. This makes engine reproducibility free — if you
// snapshot the GameState and replay the intent log, you get the same result.

const MULBERRY32_MUL = 0x6D2B79F5;

export function rngCreate(seed) {
  // Normalize seed to a 32-bit integer.
  if (typeof seed !== 'number' || !Number.isFinite(seed)) seed = 0;
  return { state: (seed | 0) >>> 0 };
}

export function rngNext(rng) {
  // Returns [float in [0, 1), new rng state]
  let s = (rng.state + 0x6D2B79F5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, { state: s }];
}

export function rngInt(rng, maxExclusive) {
  // Returns [integer in [0, maxExclusive), new rng state]
  if (maxExclusive <= 0) return [0, rng];
  const [v, next] = rngNext(rng);
  return [Math.floor(v * maxExclusive), next];
}

export function rngShuffle(rng, array) {
  // Returns [shuffled copy, new rng state]
  // Fisher-Yates with seeded RNG.
  const result = array.slice();
  let r = rng;
  for (let i = result.length - 1; i > 0; i--) {
    const [j, nr] = rngInt(r, i + 1);
    r = nr;
    [result[i], result[j]] = [result[j], result[i]];
  }
  return [result, r];
}

export function rngPick(rng, array) {
  // Returns [picked element, new rng state]
  if (array.length === 0) return [undefined, rng];
  const [i, next] = rngInt(rng, array.length);
  return [array[i], next];
}
