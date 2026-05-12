// js/data-loader.js — loads card and Year-card data in browser via fetch.
//
// In Node (for tests/sim), engine.test.js loads JSON directly via fs.

export async function loadAllData(basePath = '.') {
  const [cards, archetypes, yearCards] = await Promise.all([
    fetch(`${basePath}/data/cards.json`).then(r => r.json()),
    fetch(`${basePath}/data/archetypes.json`).then(r => r.json()),
    fetch(`${basePath}/data/year-cards.json`).then(r => r.json()),
  ]);

  const cardCatalog = {};
  for (const c of cards.cards) cardCatalog[c.id] = c;

  const yearCatalog = {};
  for (const y of yearCards.yearCards) yearCatalog[y.id] = y;

  const archetypeCatalog = {};
  for (const a of archetypes.archetypes) archetypeCatalog[a.id] = a;

  return { cardCatalog, yearCatalog, archetypeCatalog };
}

export function buildDeckFromCatalog(cardCatalog, options = {}) {
  // Build a 40-card deck with up to 4 copies of each non-Kin card and 2 Kin
  // (per RULES.md deck construction proposals).
  const includeKin = options.includeKin !== false;
  const nonKin = Object.keys(cardCatalog).filter(id => cardCatalog[id].type !== 'kin');
  const kin = Object.keys(cardCatalog).filter(id => cardCatalog[id].type === 'kin');

  const deck = [];
  while (deck.length < 38) {
    for (const id of nonKin) {
      if (deck.length >= 38) break;
      const count = deck.filter(x => x === id).length;
      if (count < 4) deck.push(id);
    }
  }
  if (includeKin && kin.length > 0) {
    deck.push(kin[0]);
    deck.push(kin[0]);
  }
  return deck;
}

export function yearDeckIds(yearCatalog) {
  return Object.keys(yearCatalog);
}
