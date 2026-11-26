// Hartono Household Budget — hash router + renderer.
// Routes: #/ dashboard, #/budget, #/transactions, #/goals, #/tools,
// #/report, #/guide. Renders synchronously, then flips window.__shotReady
// so the screenshot shooter knows the page is settled.

import { renderDashboard } from './views.js';
import { renderBudget, bindBudget } from './budget.js';
import { renderTransactions, bindTransactions } from './transactions.js';
import { renderGoals, bindGoals } from './goals.js';
import { renderTools, bindTools } from './tools.js';
import { renderReport } from './report.js';
import { renderGuide } from './guide.js';

const app = document.getElementById('app');
const NAV = [
  ['#/', 'Dashboard'],
  ['#/budget', 'Anggaran'],
  ['#/transactions', 'Transaksi'],
  ['#/goals', 'Tujuan'],
  ['#/tools', 'Kalkulator'],
  ['#/report', 'Laporan'],
  ['#/guide', 'Panduan'],
];

const PAGES = {
  '/': { render: renderDashboard },
  '/budget': { render: renderBudget, bind: bindBudget },
  '/transactions': { render: renderTransactions, bind: bindTransactions },
  '/goals': { render: renderGoals, bind: bindGoals },
  '/tools': { render: renderTools, bind: bindTools },
  '/report': { render: renderReport },
  '/guide': { render: renderGuide },
};

let flash = '';

function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return PAGES[hash] ? hash : '/';
}

export function render() {
  window.__shotReady = false;
  const path = route();
  const page = PAGES[path];
  app.innerHTML = page.render();
  if (page.bind) page.bind(app);
  document.querySelectorAll('header nav a').forEach((a) => {
    const target = a.getAttribute('href');
    a.classList.toggle('active', target === `#${path}`);
    if (target === `#${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (flash) {
    const note = document.querySelector('#budget-saved');
    if (note) note.textContent = flash;
    flash = '';
  }
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
window.addEventListener('hartono:rerender', (ev) => {
  flash = (ev && ev.detail && ev.detail.flash) || 'Anggaran tersimpan.';
  render();
});

render();
