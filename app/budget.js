// Budget page (#/budget): the full category table with live progress bars
// and an editor — change any budget, save, and every total updates at once.

import { CATEGORIES } from './data.js';
import { rp } from './format.js';
import { state, saveBudgets, actualByCategory, totalIncomeLive } from './store.js';

export function renderBudget() {
  const live = actualByCategory();
  const rows = CATEGORIES.map((c) => {
    const budget = state.budgets[c.id];
    const actual = live[c.id];
    const left = budget - actual;
    const used = budget > 0 ? Math.min(100, Math.round((actual / budget) * 100)) : 0;
    const over = actual > budget;
    return `<tr class="${over ? 'over' : ''}">
      <td><strong>${c.name}</strong><br><small>${c.note}</small></td>
      <td class="num"><input type="number" min="0" step="1000" value="${budget}" data-cat="${c.id}" aria-label="Anggaran ${c.name}"></td>
      <td class="num">${rp(actual)}</td>
      <td class="num ${left < 0 ? 'neg' : 'pos'}">${left < 0 ? '−' : '+'}${rp(Math.abs(left))}</td>
      <td><div class="bar"><span style="width:${used}%" class="${over ? 'over-fill' : ''}"></span></div><small>${used}% terpakai</small></td>
    </tr>`;
  }).join('');

  const totalBudget = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(live).reduce((s, v) => s + v, 0);

  return `
  <section class="page-head">
    <h1>Anggaran November 2026</h1>
    <p>Ubah angka anggaran di kolom kedua, lalu tekan <strong>Simpan anggaran</strong>.
    Total dan sisa dihitung ulang langsung — dan tersimpan di browser ini.</p>
  </section>
  <section class="panel">
    <table class="tbl budget-tbl">
      <thead><tr><th>Kategori</th><th>Anggaran</th><th>Aktual</th><th>Sisa</th><th>Progress</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${rp(totalBudget)}</strong></td>
        <td class="num"><strong>${rp(totalActual)}</strong></td>
        <td class="num"><strong>${rp(totalBudget - totalActual)}</strong></td><td></td></tr></tfoot>
    </table>
    <p class="totals-line">Pemasukan bulan ini: <strong>${rp(totalIncomeLive())}</strong> ·
    Total anggaran: <strong>${rp(totalBudget)}</strong> ·
    Sisa kas bila semua anggaran terpakai penuh: <strong>${rp(totalIncomeLive() - totalBudget)}</strong></p>
    <p class="btn-row">
      <button class="btn" id="save-budgets">Simpan anggaran</button>
      <button class="btn ghost" id="reset-budgets">Kembalikan ke awal</button>
      <span id="budget-saved" class="saved-note" aria-live="polite"></span>
    </p>
  </section>
  <section class="panel">
    <h2>Cara membaca tabel ini</h2>
    <p>Baris berwarna merah berarti kategori itu <strong>over budget</strong> bulan ini:
    Makanan over Rp 165.000 dan Hiburan over Rp 145.000. Sisa di kategori lain
    (misalnya Kesehatan Rp 180.000) bisa digeser untuk menutupnya — atau belanja
    minggu depan dikurangi.</p>
  </section>`;
}

export function bindBudget(root) {
  root.querySelector('#save-budgets').addEventListener('click', () => {
    let changed = false;
    root.querySelectorAll('input[data-cat]').forEach((input) => {
      const v = Math.max(0, Math.round(Number(input.value) || 0));
      if (state.budgets[input.dataset.cat] !== v) changed = true;
      state.budgets[input.dataset.cat] = v;
    });
    saveBudgets();
    root.querySelector('#budget-saved').textContent = changed
      ? 'Anggaran tersimpan.'
      : 'Tidak ada perubahan.';
    window.dispatchEvent(new CustomEvent('hartono:rerender'));
  });
  root.querySelector('#reset-budgets').addEventListener('click', () => {
    for (const c of CATEGORIES) state.budgets[c.id] = c.budget;
    saveBudgets();
    window.dispatchEvent(new CustomEvent('hartono:rerender'));
  });
}
