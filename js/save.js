// js/save.js — localStorage persistence for in-progress games.
//
// Per RULES.md and Decision D012 footnotes; per
// /research/claude-skills/web-tcg-architecture.md save/load section.

const SAVE_KEY = 'dadtcg.savedGame';
const CURRENT_SCHEMA = 1;

export function save(state) {
  const serializable = serializeState(state);
  localStorage.setItem(SAVE_KEY, JSON.stringify({ schemaVersion: CURRENT_SCHEMA, state: serializable }));
}

export function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return migrate(parsed.state, parsed.schemaVersion, CURRENT_SCHEMA);
  } catch (e) {
    console.warn('Save corrupted, ignoring:', e);
    return null;
  }
}

export function clear() {
  localStorage.removeItem(SAVE_KEY);
}

function serializeState(state) {
  // Most of the engine state is JSON-safe; only Sets need conversion.
  const players = state.players.map(p => ({
    ...p,
    protectedInstanceIds: Array.from(p.protectedInstanceIds || []),
  }));
  return { ...state, players, cardCatalog: undefined, yearCatalog: undefined };
}

function migrate(state, fromVer, toVer) {
  if (fromVer === toVer) return rehydrate(state);
  // No migrations yet (first schema)
  console.warn(`Unknown save schema ${fromVer}; ignoring.`);
  return null;
}

function rehydrate(state) {
  // Restore Sets
  for (const p of state.players) {
    p.protectedInstanceIds = new Set(p.protectedInstanceIds || []);
  }
  return state;
}
