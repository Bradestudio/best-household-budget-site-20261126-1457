// Transactions page (#/transactions): the full 24-transaction list with a
// category filter, an add form, and a delete button on every row.

import { CATEGORIES } from './data.js';
import { rp, monthDay } from './format.js';
import { state, saveTransactions } from './store.js';

let filter = 'all';

function catName(id) {
  if (id === 'income') return 'Pemasukan';
  return (CATEGORIES.find((c) => c.id === id) || {}).name || id;
}

function renderRows() {
  const list = state.transactions.filter((t) => filter === 'all' || t.cat === filter);
  if (!list.length) return '<tr><td colspan="5">Tidak ada transaksi di kategori ini.</td></tr>';
  return list.map((t, i) => {
    const idx = state.transactions.indexOf(t);
    return `<tr>
      <td>${monthDay(t.day)}</td>
      <td>${t.desc}</td>
      <td class="col-cat">${catName(t.cat)}</td>
      <td class="num ${t.kind === 'income' ? 'in' : ''}">${t.kind === 'income' ? '+' : '−'}${rp(t.amount)}</td>
      <td><button class="btn small danger" data-del="${idx}">Hapus</button></td>
    </tr>`;
  }).join('');
}

function totalsLine() {
  const inSum = state.transactions.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
  const outSum = state.transactions.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  return `Total pemasukan: <strong>${rp(inSum)}</strong> · Total pengeluaran (transaksi): <strong>${rp(outSum)}</strong> · Jumlah transaksi: <strong>${state.transactions.length}</strong>`;
}

export function renderTransactions() {
  const options = ['<option value="all">Semua kategori</option>',
    '<option value="income">Pemasukan</option>',
    ...CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`)].join('');
  const catOptions = CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  return `
  <section class="page-head">
    <h1>Transaksi November 2026</h1>
    <p>Setiap rupiah yang keluar-masuk bulan ini. Saring per kategori, tambah
    transaksi baru, atau hapus yang salah catat — total ikut berubah.</p>
  </section>
  <section class="panel">
    <p class="filter-row">
      <label for="tx-filter">Tampilkan:</label>
      <select id="tx-filter">${options}</select>
    </p>
    <table class="tbl">
      <thead><tr><th>Tanggal</th><th>Deskripsi</th><th class="col-cat">Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody id="tx-rows">${renderRows()}</tbody>
    </table>
    <p class="totals-line" id="tx-totals">${totalsLine()}</p>
  </section>
  <section class="panel">
    <h2>Tambah transaksi</h2>
    <form id="tx-form" class="form-grid">
      <label>Tanggal (Nov 2026)
        <input type="number" id="tx-day" min="1" max="30" value="27" required>
      </label>
      <label>Deskripsi
        <input type="text" id="tx-desc" placeholder="cth: Belanja mingguan" required>
      </label>
      <label>Kategori
        <select id="tx-cat">${catOptions}</select>
      </label>
      <label>Jumlah (Rp)
        <input type="number" id="tx-amount" min="1000" step="1000" placeholder="cth: 150000" required>
      </label>
      <label>Jenis
        <select id="tx-kind">
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
      </label>
      <span></span>
      <span><button class="btn" type="submit">Tambah transaksi</button>
      <span id="tx-added" class="saved-note" aria-live="polite"></span></span>
    </form>
  </section>`;
}

export function bindTransactions(root) {
  const sel = root.querySelector('#tx-filter');
  sel.value = filter;
  sel.addEventListener('change', () => {
    filter = sel.value;
    root.querySelector('#tx-rows').innerHTML = renderRows();
  });
  root.querySelector('#tx-rows').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-del]');
    if (!btn) return;
    state.transactions.splice(Number(btn.dataset.del), 1);
    saveTransactions();
    root.querySelector('#tx-rows').innerHTML = renderRows();
    root.querySelector('#tx-totals').innerHTML = totalsLine();
  });
  root.querySelector('#tx-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const day = Math.min(30, Math.max(1, Number(root.querySelector('#tx-day').value) || 1));
    const desc = root.querySelector('#tx-desc').value.trim();
    const amount = Math.max(0, Math.round(Number(root.querySelector('#tx-amount').value) || 0));
    if (!desc || amount <= 0) return;
    state.transactions.push({
      day,
      desc,
      cat: root.querySelector('#tx-cat').value,
      kind: root.querySelector('#tx-kind').value,
      amount,
    });
    state.transactions.sort((a, b) => a.day - b.day);
    saveTransactions();
    root.querySelector('#tx-rows').innerHTML = renderRows();
    root.querySelector('#tx-totals').innerHTML = totalsLine();
    root.querySelector('#tx-added').textContent = 'Transaksi ditambahkan.';
    root.querySelector('#tx-desc').value = '';
    root.querySelector('#tx-amount').value = '';
  });
}
