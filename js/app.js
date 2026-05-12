// js/app.js — Dad TCG main app shell.
//
// Loads card data, manages a single GameState, dispatches intents, re-renders.
// Wired via ES modules; all rendering lives in js/ui.js. State mutations go
// through Engine.applyIntent (pure-functional reducer) and the resulting state
// flows back here.

import * as Engine from './engine.js';
import * as AI from './ai.js';
import * as UI from './ui.js';
import { loadAllData, buildDeckFromCatalog, yearDeckIds } from './data-loader.js';
import * as Save from './save.js';

const SCREEN_ID = 'main-content';

let state = null;
let mode = 'menu';        // 'menu' | 'solo-ai' | 'pass-and-play'
let aiDifficulty = AI.Difficulty.NORMAL;
let cardCatalog = null;
let yearCatalog = null;
let archetypeCatalog = null;
let selectedCardForPlay = null;

const ctx = {
  dispatch,
  setSelectedCardForPlay: (sel) => { selectedCardForPlay = sel; renderCurrent(); },
  newGame: () => { state = null; mode = 'menu'; selectedCardForPlay = null; render(); },
  resumeSaved: () => {
    const s = Save.load();
    if (s) { rehydrateCatalogs(s); state = s; mode = 'solo-ai'; render(); }
  },
  hasSavedGame: false,
  startGame: (opts) => {
    mode = opts.mode;
    aiDifficulty = opts.difficulty || AI.Difficulty.NORMAL;
    state = createInitialState();
    selectedCardForPlay = null;
    render();
    scheduleAITurnIfNeeded();
  },
};

function createInitialState() {
  const deckP1 = buildDeckFromCatalog(cardCatalog);
  const deckP2 = buildDeckFromCatalog(cardCatalog);
  const yearDeck = yearDeckIds(yearCatalog);
  return Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1, deckP2,
    yearDeck,
    seed: Math.floor(Math.random() * 1000000),
  });
}

function rehydrateCatalogs(s) {
  s.cardCatalog = cardCatalog;
  s.yearCatalog = yearCatalog;
}

function dispatch(intent) {
  if (!state) return;
  state = Engine.applyIntent(state, intent);
  if (state.lastError) {
    console.warn('Invalid intent:', state.lastError, intent);
  }
  selectedCardForPlay = null;
  if (state.phase !== Engine.Phase.MATCH_OVER) {
    try { Save.save(state); } catch (e) { console.warn('Save failed:', e); }
  } else {
    Save.clear();
  }
  renderCurrent();
  scheduleAITurnIfNeeded();
}

function scheduleAITurnIfNeeded() {
  if (mode !== 'solo-ai') return;
  if (!state) return;
  if (state.phase === Engine.Phase.MATCH_OVER) return;
  if (state.activePlayer !== 1) return;

  setTimeout(() => {
    if (!state) return;
    if (state.activePlayer !== 1 || state.phase === Engine.Phase.MATCH_OVER) return;
    const intent = AI.chooseIntent(state, aiDifficulty);
    if (!intent) return;
    dispatch(intent);
  }, 200);
}

function render() {
  const root = document.getElementById(SCREEN_ID);
  if (!root) return;

  if (!state || mode === 'menu') {
    UI.renderMenu(root, ctx);
    return;
  }

  if (state.phase === Engine.Phase.MATCH_OVER) {
    UI.renderMatchOver(state, root, ctx);
    return;
  }

  // Pass-and-play hand-off interstitial at start of each player's Refresh
  if (mode === 'pass-and-play' && shouldShowHandoff()) {
    UI.renderHandoff(state.activePlayer, root, () => {
      _handoffShown[state.activePlayer + ':' + state.turn] = true;
      renderCurrent();
    });
    return;
  }

  UI.renderGame(state, root, { ...ctx, selectedCardForPlay, opponentLabel: mode === 'solo-ai' ? 'AI' : 'Other Player' });
}

const _handoffShown = {};
function shouldShowHandoff() {
  if (!state) return false;
  const key = state.activePlayer + ':' + state.turn;
  if (_handoffShown[key]) return false;
  return state.phase === Engine.Phase.REFRESH;
}

function renderCurrent() { render(); }

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────

async function boot() {
  try {
    const data = await loadAllData('.');
    cardCatalog = data.cardCatalog;
    yearCatalog = data.yearCatalog;
    archetypeCatalog = data.archetypeCatalog;
    const saved = Save.load();
    ctx.hasSavedGame = !!saved;
    render();
  } catch (e) {
    const root = document.getElementById(SCREEN_ID);
    if (root) {
      root.innerHTML = `<div class="boot-error"><h2>Could not load card data</h2><p>${e.message}</p><p>Are you running from a static server? Try: <code>python3 -m http.server 8080</code></p></div>`;
    }
    console.error('Boot failed:', e);
  }
}

boot();
