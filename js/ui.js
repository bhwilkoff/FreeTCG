// js/ui.js — DOM rendering for Dad TCG.
//
// Pure-render: takes state, produces DOM. No state mutation here; the app
// dispatches intents to the engine and re-renders.

import * as Engine from './engine.js';

export function renderGame(state, root, ctx) {
  root.innerHTML = '';

  // Top bar: Year card + turn info
  root.appendChild(renderTopBar(state, ctx));

  // Opponent area (compact view)
  root.appendChild(renderOpponentBar(state, ctx));

  // Three shared zones (board)
  root.appendChild(renderBoard(state, ctx));

  // Active player area (hand + inkwell + controls)
  root.appendChild(renderActivePlayerArea(state, ctx));

  // Game log (collapsible)
  root.appendChild(renderLog(state));
}

function renderTopBar(state, ctx) {
  const div = document.createElement('div');
  div.className = 'top-bar';

  const turnEl = document.createElement('div');
  turnEl.className = 'turn-indicator';
  turnEl.innerHTML = `<span class="label">Year</span><span class="value">${state.turn} / ${Engine.TURN_COUNT}</span>`;
  div.appendChild(turnEl);

  const phaseEl = document.createElement('div');
  phaseEl.className = 'phase-indicator';
  phaseEl.textContent = `Phase: ${state.phase}`;
  div.appendChild(phaseEl);

  const yearCardEl = document.createElement('div');
  yearCardEl.className = 'year-card';
  if (state.currentYearCardId) {
    const yc = state.yearCatalog[state.currentYearCardId];
    yearCardEl.innerHTML = `
      <div class="year-card-name">${escapeHtml(yc.name)}</div>
      <div class="year-card-flavor">${escapeHtml(yc.flavor)}</div>
    `;
    yearCardEl.classList.add(`tone-${yc.tone || 'tender'}`);
  } else {
    yearCardEl.textContent = 'No Year card revealed yet.';
  }
  div.appendChild(yearCardEl);

  return div;
}

function renderOpponentBar(state, ctx) {
  const oppId = 1 - state.activePlayer;
  const opp = state.players[oppId];
  const div = document.createElement('div');
  div.className = 'opponent-bar';
  div.innerHTML = `
    <div class="opponent-label">${ctx.opponentLabel || 'Opponent'} ${state.activePlayer === 0 ? '(P2)' : '(P1)'}</div>
    <div class="opponent-stats">
      <span>Hand: ${opp.hand.length}</span>
      <span>Deck: ${opp.deck.length}</span>
      <span>Discard: ${opp.discard.length}</span>
      <span>Practiced: ${opp.legacy.practiced.length}</span>
      <span>Moments: ${opp.legacy.moments.length}</span>
    </div>
  `;
  return div;
}

function renderBoard(state, ctx) {
  const div = document.createElement('div');
  div.className = 'board';

  const zones = [
    { id: 'family',    label: 'Your Family',    sub: 'Inner circle. Household. Closest people.' },
    { id: 'craft',     label: 'Your Craft',     sub: 'Vocation, calling, working life.' },
    { id: 'community', label: 'Your Community', sub: 'Hobbies, teams, neighborhood.' },
  ];

  for (const z of zones) {
    div.appendChild(renderZone(state, z, ctx));
  }
  return div;
}

function renderZone(state, zoneSpec, ctx) {
  const div = document.createElement('div');
  div.className = `zone zone-${zoneSpec.id}`;

  const header = document.createElement('div');
  header.className = 'zone-header';
  header.innerHTML = `
    <div class="zone-title">${escapeHtml(zoneSpec.label)}</div>
    <div class="zone-sub">${escapeHtml(zoneSpec.sub)}</div>
  `;
  div.appendChild(header);

  // Opponent half (top)
  const oppId = 1 - state.activePlayer;
  const oppHalf = document.createElement('div');
  oppHalf.className = 'zone-half opp';
  for (const instId of state.players[oppId].zones[zoneSpec.id]) {
    oppHalf.appendChild(renderInstance(state, oppId, instId, ctx));
  }
  div.appendChild(oppHalf);

  // Active player half (bottom)
  const apId = state.activePlayer;
  const apHalf = document.createElement('div');
  apHalf.className = 'zone-half ap';
  for (const instId of state.players[apId].zones[zoneSpec.id]) {
    apHalf.appendChild(renderInstance(state, apId, instId, ctx));
  }
  // If a card is selected for play and this zone is a valid drop target, show button
  if (ctx.selectedCardForPlay && ctx.selectedCardForPlay.needsZone) {
    const apZone = state.players[apId].zones[zoneSpec.id];
    if (apZone.length < Engine.ZONE_SLOT_CAP) {
      const btn = document.createElement('button');
      btn.className = 'place-here-btn';
      btn.textContent = `Play here →`;
      btn.addEventListener('click', () => ctx.dispatch({ type: 'play_card', player: apId, cardId: ctx.selectedCardForPlay.cardId, zone: zoneSpec.id }));
      apHalf.appendChild(btn);
    }
  }
  div.appendChild(apHalf);

  return div;
}

function renderInstance(state, playerId, instId, ctx) {
  const inst = state.players[playerId].instances[instId];
  if (!inst) return document.createComment('missing instance');
  const card = state.cardCatalog[inst.cardId];
  const div = document.createElement('div');
  div.className = `card-instance card-${card.type}`;
  if (card.faction) div.classList.add(`faction-${card.faction.toLowerCase()}`);
  if (inst.tapped) div.classList.add('tapped');
  if (card.playTag) div.classList.add('play-tag');

  div.innerHTML = `
    <div class="card-name">${escapeHtml(card.name)}</div>
    <div class="card-tags">${(card.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
    ${card.type === 'kin' ? `<div class="kin-maturity">Maturity: ${inst.maturity || 0}</div>` : ''}
  `;
  return div;
}

function renderActivePlayerArea(state, ctx) {
  const apId = state.activePlayer;
  const ap = state.players[apId];
  const div = document.createElement('div');
  div.className = 'active-player-area';

  // Status bar: inkwell, intention, practiced
  const status = document.createElement('div');
  status.className = 'status-bar';
  status.innerHTML = `
    <div class="status-item"><span class="label">Player</span><span class="value">${apId + 1}</span></div>
    <div class="status-item"><span class="label">Attention</span><span class="value">${ap.inkwell}</span></div>
    <div class="status-item"><span class="label">Intention</span><span class="value">${ap.legacy.intention || '—'}</span></div>
    <div class="status-item"><span class="label">Practiced</span><span class="value">${ap.legacy.practiced.length}</span></div>
    <div class="status-item"><span class="label">Moments</span><span class="value">${ap.legacy.moments.length}</span></div>
    <div class="status-item"><span class="label">Hand</span><span class="value">${ap.hand.length}</span></div>
    <div class="status-item"><span class="label">Deck</span><span class="value">${ap.deck.length}</span></div>
  `;
  div.appendChild(status);

  // Phase-specific controls
  div.appendChild(renderPhaseControls(state, ctx));

  // Hand
  if (state.phase === Engine.Phase.MAIN || state.phase === Engine.Phase.PRE_GAME) {
    div.appendChild(renderHand(state, ctx));
  }

  return div;
}

function renderPhaseControls(state, ctx) {
  const div = document.createElement('div');
  div.className = 'phase-controls';

  switch (state.phase) {
    case Engine.Phase.PRE_GAME: {
      const noMul = document.createElement('button');
      noMul.textContent = 'Keep this hand';
      noMul.addEventListener('click', () => ctx.dispatch({ type: 'no_mulligan', player: state.activePlayer }));
      div.appendChild(noMul);

      const mulBtn = document.createElement('button');
      mulBtn.textContent = 'Mulligan once';
      mulBtn.addEventListener('click', () => ctx.dispatch({ type: 'mulligan', player: state.activePlayer }));
      div.appendChild(mulBtn);

      const startBtn = document.createElement('button');
      startBtn.textContent = "Start match →";
      startBtn.addEventListener('click', () => ctx.dispatch({ type: 'start_match' }));
      startBtn.classList.add('primary');
      div.appendChild(startBtn);
      break;
    }
    case Engine.Phase.REFRESH:
    case Engine.Phase.DRAW: {
      const next = document.createElement('button');
      next.textContent = state.phase === Engine.Phase.REFRESH ? 'Continue → Draw' : 'Continue → Intention';
      next.addEventListener('click', () => ctx.dispatch({ type: 'end_phase', player: state.activePlayer }));
      next.classList.add('primary');
      div.appendChild(next);
      break;
    }
    case Engine.Phase.INTENTION: {
      const label = document.createElement('div');
      label.className = 'intention-label';
      label.textContent = 'Declare your Intention this Year:';
      div.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'virtue-grid';
      for (const v of Engine.VIRTUES) {
        const btn = document.createElement('button');
        btn.textContent = v;
        btn.className = 'virtue-btn';
        btn.addEventListener('click', () => ctx.dispatch({ type: 'declare_intention', player: state.activePlayer, virtue: v }));
        grid.appendChild(btn);
      }
      div.appendChild(grid);
      break;
    }
    case Engine.Phase.MAIN: {
      const passBtn = document.createElement('button');
      passBtn.textContent = 'End Year →';
      passBtn.classList.add('primary');
      passBtn.addEventListener('click', () => ctx.dispatch({ type: 'pass_main', player: state.activePlayer }));
      div.appendChild(passBtn);
      break;
    }
    case Engine.Phase.END: {
      const next = document.createElement('button');
      next.textContent = 'Continue →';
      next.classList.add('primary');
      next.addEventListener('click', () => ctx.dispatch({ type: 'end_phase', player: state.activePlayer }));
      div.appendChild(next);
      break;
    }
  }
  return div;
}

function renderHand(state, ctx) {
  const apId = state.activePlayer;
  const ap = state.players[apId];
  const div = document.createElement('div');
  div.className = 'hand';

  const label = document.createElement('div');
  label.className = 'hand-label';
  label.textContent = `Your Hand (${ap.hand.length})`;
  div.appendChild(label);

  const cards = document.createElement('div');
  cards.className = 'hand-cards';
  ap.hand.forEach((cardId, idx) => {
    const card = state.cardCatalog[cardId];
    const c = document.createElement('div');
    c.className = `card-in-hand card-${card.type}`;
    if (card.faction) c.classList.add(`faction-${card.faction.toLowerCase()}`);
    if (card.playTag) c.classList.add('play-tag');

    const tags = (card.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    const factionLine = card.faction ? `<div class="card-faction">${escapeHtml(card.faction)}</div>` : '';
    const costLine = `<div class="card-costs"><span class="cost">${card.cost}</span><span class="pitch">↪${card.pitchValue}</span></div>`;

    c.innerHTML = `
      ${costLine}
      <div class="card-name">${escapeHtml(card.name)}</div>
      ${factionLine}
      <div class="card-tags">${tags}</div>
      <div class="card-text">${escapeHtml(card.rulesText || '')}</div>
      ${card.flavorText ? `<div class="card-flavor">${escapeHtml(card.flavorText)}</div>` : ''}
    `;

    if (state.phase === Engine.Phase.MAIN) {
      // Buttons appear under the card
      const btns = document.createElement('div');
      btns.className = 'card-actions';

      if (card.type !== 'kin') {
        const pitch = document.createElement('button');
        pitch.textContent = `Pitch (+${card.pitchValue} Att)`;
        pitch.addEventListener('click', (e) => { e.stopPropagation(); ctx.dispatch({ type: 'pitch', player: apId, cardId }); });
        btns.appendChild(pitch);
      }

      const canAfford = ap.inkwell >= (card.cost || 0);
      if (canAfford) {
        if (card.type === 'action') {
          const play = document.createElement('button');
          play.textContent = `Play (${card.cost} Att)`;
          play.classList.add('primary');
          play.addEventListener('click', (e) => { e.stopPropagation(); ctx.dispatch({ type: 'play_card', player: apId, cardId }); });
          btns.appendChild(play);
        } else if (card.type === 'dad' || card.type === 'kin') {
          const select = document.createElement('button');
          select.textContent = `Play to zone... (${card.cost} Att)`;
          select.classList.add('primary');
          select.addEventListener('click', (e) => {
            e.stopPropagation();
            ctx.setSelectedCardForPlay({ cardId, needsZone: true });
          });
          btns.appendChild(select);
        } else if (card.type === 'tool') {
          // Find an attached Dad
          const dads = Object.values(ap.instances).filter(inst => state.cardCatalog[inst.cardId].type === 'dad');
          if (dads.length > 0) {
            const attach = document.createElement('button');
            attach.textContent = `Attach to ${state.cardCatalog[dads[0].cardId].name}`;
            attach.classList.add('primary');
            attach.addEventListener('click', (e) => { e.stopPropagation(); ctx.dispatch({ type: 'play_card', player: apId, cardId, attachToInstanceId: dads[0].id }); });
            btns.appendChild(attach);
          }
        }
      }
      c.appendChild(btns);
    }

    cards.appendChild(c);
  });
  div.appendChild(cards);
  return div;
}

function renderLog(state) {
  const div = document.createElement('details');
  div.className = 'log';
  const summary = document.createElement('summary');
  summary.textContent = `Match log (${state.log.length} events)`;
  div.appendChild(summary);
  const list = document.createElement('ol');
  list.className = 'log-events';
  for (const ev of state.log.slice(-30)) {
    const li = document.createElement('li');
    li.textContent = `Y${ev.turn || 0} [${ev.phase || ''}] ${ev.type}${ev.virtue ? ` — ${ev.virtue}` : ''}${ev.cardId ? ` — ${ev.cardId}` : ''}${ev.zone ? ` — ${ev.zone}` : ''}`;
    list.appendChild(li);
  }
  div.appendChild(list);
  return div;
}

// ─────────────────────────────────────────────────────────────────────────────
// End-of-match summary
// ─────────────────────────────────────────────────────────────────────────────

export function renderMatchOver(state, root, ctx) {
  root.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'match-over';

  const winner = state.winner;
  const headline = document.createElement('h2');
  headline.className = 'match-over-headline';
  if (winner === 0) headline.textContent = 'Player 1 built more this Legacy.';
  else if (winner === 1) headline.textContent = 'Player 2 built more this Legacy.';
  else headline.textContent = 'Tied — both Legacies stand.';
  div.appendChild(headline);

  const sub = document.createElement('p');
  sub.className = 'match-over-sub';
  sub.textContent = lossFrameCopy(state);
  div.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'legacy-grid';
  grid.appendChild(renderLegacyColumn(state, 0));
  grid.appendChild(renderLegacyColumn(state, 1));
  div.appendChild(grid);

  // Highlight Reel
  const reel = document.createElement('div');
  reel.className = 'highlight-reel';
  reel.innerHTML = '<h3>The Highlight Reel</h3>';
  const allMoments = [
    ...state.players[0].legacy.moments.map(m => ({ ...m, owner: 'You (P1)' })),
    ...state.players[1].legacy.moments.map(m => ({ ...m, owner: 'You (P2)' })),
  ].sort((a, b) => a.year - b.year);
  if (allMoments.length === 0) {
    reel.innerHTML += '<p class="empty">No Moments captured this match. (Try cards that share a zone with a Kin, or Year cards that trigger Moments.)</p>';
  } else {
    const ul = document.createElement('ul');
    for (const m of allMoments) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="year">Year ${m.year}</span> <span class="moment-name">${escapeHtml(m.name)}</span> <span class="owner">— ${escapeHtml(m.owner)}</span><br><span class="moment-flavor">${escapeHtml(m.flavor || '')}</span>`;
      ul.appendChild(li);
    }
    reel.appendChild(ul);
  }
  div.appendChild(reel);

  const newGame = document.createElement('button');
  newGame.textContent = 'New match';
  newGame.classList.add('primary');
  newGame.addEventListener('click', () => ctx.newGame());
  div.appendChild(newGame);

  root.appendChild(div);
}

function renderLegacyColumn(state, playerId) {
  const p = state.players[playerId];
  const winner = state.winner;
  const div = document.createElement('div');
  div.className = 'legacy-column';
  if (winner === playerId) div.classList.add('winner');
  div.innerHTML = `
    <h3>Player ${playerId + 1}${winner === playerId ? ' ★' : ''}</h3>
    <div class="legacy-stat"><span class="label">Virtues Practiced</span><span class="value">${p.legacy.practiced.length}</span></div>
    <div class="legacy-stat"><span class="label">Moments</span><span class="value">${p.legacy.moments.length}</span></div>
    <div class="legacy-stat"><span class="label">Resonances</span><span class="value">${p.legacy.resonanceCount}</span></div>
    <div class="legacy-stat"><span class="label">Kin Matured</span><span class="value">${p.legacy.kinMatured}</span></div>
    <div class="legacy-stat"><span class="label">Missed Years</span><span class="value">${p.legacy.missedYears}</span></div>
    <div class="virtues-list">
      ${p.legacy.practiced.map(v => `<span class="virtue-chip">${escapeHtml(v)}</span>`).join('')}
    </div>
  `;
  return div;
}

function lossFrameCopy(state) {
  // Per RULES.md §12 — warm + dry-funny
  const winner = state.winner;
  if (winner === null) return "Tied. Both of you built something that lasts. Try again.";

  const w = state.players[winner];
  const l = state.players[1 - winner];
  const winnerLabel = `Player ${winner + 1}`;
  const loserLabel = `Player ${(1 - winner) + 1}`;

  if (l.legacy.moments.length > w.legacy.moments.length) {
    return `${winnerLabel} built a bigger Legacy. ${loserLabel} brought more Moments. The kid still thinks you're cool.`;
  }
  if (Math.abs(w.legacy.practiced.length - l.legacy.practiced.length) <= 1) {
    return `Good game, dad. One Virtue between you. Next year.`;
  }
  return `${winnerLabel} built more this time. What you built lasts too.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hand-off interstitial (pass-and-play)
// ─────────────────────────────────────────────────────────────────────────────

export function renderHandoff(toPlayer, root, onContinue) {
  root.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'handoff';
  div.innerHTML = `
    <h2>Pass to Player ${toPlayer + 1}</h2>
    <p>Hand the device over. Don't peek at the other Hand.</p>
  `;
  const btn = document.createElement('button');
  btn.textContent = `I'm Player ${toPlayer + 1}. Continue.`;
  btn.classList.add('primary');
  btn.addEventListener('click', onContinue);
  div.appendChild(btn);
  root.appendChild(div);
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu
// ─────────────────────────────────────────────────────────────────────────────

export function renderMenu(root, ctx) {
  root.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'menu';
  div.innerHTML = `
    <h1 class="menu-title">Dad TCG</h1>
    <p class="menu-tagline">A generation of being a good dad.</p>
  `;

  const playAI = document.createElement('button');
  playAI.textContent = 'Play vs AI (Normal)';
  playAI.classList.add('primary');
  playAI.addEventListener('click', () => ctx.startGame({ mode: 'solo-ai', difficulty: 'normal' }));
  div.appendChild(playAI);

  const playPnP = document.createElement('button');
  playPnP.textContent = 'Pass-and-play (two humans, one device)';
  playPnP.addEventListener('click', () => ctx.startGame({ mode: 'pass-and-play' }));
  div.appendChild(playPnP);

  const playEasy = document.createElement('button');
  playEasy.textContent = 'Easy (vs AI)';
  playEasy.addEventListener('click', () => ctx.startGame({ mode: 'solo-ai', difficulty: 'easy' }));
  div.appendChild(playEasy);

  const playHard = document.createElement('button');
  playHard.textContent = 'Hard (vs AI)';
  playHard.addEventListener('click', () => ctx.startGame({ mode: 'solo-ai', difficulty: 'hard' }));
  div.appendChild(playHard);

  if (ctx.hasSavedGame) {
    const resume = document.createElement('button');
    resume.textContent = 'Resume saved match';
    resume.addEventListener('click', () => ctx.resumeSaved());
    div.appendChild(resume);
  }

  root.appendChild(div);
}

// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
