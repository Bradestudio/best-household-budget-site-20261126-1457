// State + persistence. Budgets edited on the Budget page and transactions
// added or removed on the Transactions page live here and are saved to
// localStorage (with a try/catch fallback to memory when storage is blocked).

import { CATEGORIES, TRANSACTIONS } from './data.js';

const BUDGET_KEY = 'hartono-budgets-v1';
const TX_KEY = 'hartono-transactions-v1';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode, hosting sandbox): keep memory only.
  }
}

export const state = {
  budgets: load(BUDGET_KEY, Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget]))),
  transactions: load(TX_KEY, TRANSACTIONS.map((t) => ({ ...t }))),
};

export function saveBudgets() {
  save(BUDGET_KEY, state.budgets);
}

export function saveTransactions() {
  save(TX_KEY, state.transactions);
}

export function resetAll() {
  state.budgets = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget]));
  state.transactions = TRANSACTIONS.map((t) => ({ ...t }));
  saveBudgets();
  saveTransactions();
}

// Actual spending per category, computed from the live transaction list
// (expenses only; income lines are excluded). Tabungan and Dana darurat are
// set aside at the start of the month, not spent as transactions, so their
// actual is the amount set aside in the data (Rp 2.000.000 + Rp 500.000).
export function actualByCategory() {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (t.kind === 'expense' && out[t.cat] !== undefined) out[t.cat] += t.amount;
  }
  out.savings = CATEGORIES.find((c) => c.id === 'savings').actual;
  out.emergency = CATEGORIES.find((c) => c.id === 'emergency').actual;
  return out;
}

export function totalIncomeLive() {
  return state.transactions
    .filter((t) => t.kind === 'income')
    .reduce((s, t) => s + t.amount, 0);
}
