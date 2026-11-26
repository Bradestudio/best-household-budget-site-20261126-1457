// Dashboard (#/): summary cards, budget-vs-actual bars, spending donut,
// latest transactions, over-budget warnings and one saving tip.

import { CATEGORIES, FAMILY, SAVING_TIPS, totalIncome, totalActual, cashLeft, savingsRate } from './data.js';
import { rp, pct } from './format.js';
import { barChart, donutChart, donutLegend } from './charts.js';
import { actualByCategory, state } from './store.js';

export function renderDashboard() {
  const income = totalIncome();
  const spent = totalActual();
  const left = cashLeft();
  const rate = savingsRate();
  const live = actualByCategory();

  const spendCats = CATEGORIES.filter((c) => c.id !== 'savings' && c.id !== 'emergency');
  const bars = spendCats.map((c) => ({
    label: c.name,
    a: c.budget,
    aText: rp(c.budget),
    b: live[c.id],
    bText: rp(live[c.id]),
  }));
  const donut = spendCats.map((c) => ({ label: c.name, value: live[c.id] }));

  const over = CATEGORIES.filter((c) => live[c.id] > state.budgets[c.id]);
  const latest = [...state.transactions].slice(-5).reverse();
  const catName = (id) => (id === 'income' ? 'Pemasukan' : (CATEGORIES.find((c) => c.id === id) || {}).name || id);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${FAMILY.name} · ${FAMILY.city} · ${FAMILY.month}</p>
      <h1>Uang keluarga, tercatat rapi.</h1>
      <p class="lede">Budi, Sari, Raka dan Nia mencatat setiap rupiah bulan ini — gaji masuk,
      belanja pasar, SPP anak, sampai dana darurat. Semua angka di bawah ini nyata
      dan bisa dicek di halaman Transaksi.</p>
      <p class="cta-row">
        <a class="btn" href="#/budget">Lihat anggaran</a>
        <a class="btn ghost" href="#/tools">Buka kalkulator</a>
      </p>
    </div>
    <div class="hero-card">
      <p class="card-label">Sisa kas bulan ini</p>
      <p class="big-number">${rp(left)}</p>
      <p class="card-note">dari pemasukan ${rp(income)} setelah pengeluaran ${rp(spent)}</p>
      <p class="card-note">Tingkat tabungan <strong>${pct(rate)}</strong> (target 20%)</p>
    </div>
  </section>

  <section class="cards">
    <div class="stat"><span>Pemasukan</span><strong>${rp(income)}</strong><em>Gaji Budi + Gaji Sari + jualan kue</em></div>
    <div class="stat"><span>Pengeluaran</span><strong>${rp(spent)}</strong><em>Termasuk tabungan &amp; dana darurat</em></div>
    <div class="stat"><span>Sisa kas</span><strong>${rp(left)}</strong><em>Belum dialokasikan</em></div>
    <div class="stat"><span>Tingkat tabungan</span><strong>${pct(rate)}</strong><em>Rp 2.500.000 dari Rp 13.250.000</em></div>
  </section>

  ${over.length ? `<section class="alerts">
    <h2>Perlu perhatian</h2>
    ${over.map((c) => `<p class="alert"><strong>${c.name} over budget ${rp(live[c.id] - state.budgets[c.id])}.</strong>
      Anggaran ${rp(state.budgets[c.id])}, aktual ${rp(live[c.id])}. Kurangi belanja minggu depan atau geser dari kategori yang masih sisa.</p>`).join('')}
  </section>` : ''}

  <section class="grid-2">
    <div class="panel">
      <h2>Anggaran vs aktual</h2>
      <p class="legend"><span class="sw green"></span> Anggaran &nbsp; <span class="sw orange"></span> Aktual</p>
      ${barChart(bars)}
    </div>
    <div class="panel">
      <h2>Ke mana uang pergi</h2>
      <div class="donut-wrap">${donutChart(donut)}<ul class="legend-list">${donutLegend(donut)}</ul></div>
    </div>
  </section>

  <section class="grid-2">
    <div class="panel">
      <h2>Transaksi terbaru</h2>
      <table class="tbl">
        <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
        <tbody>
        ${latest.map((t) => `<tr><td>${t.day} Nov</td><td>${t.desc}</td><td>${catName(t.cat)}</td>
          <td class="num ${t.kind === 'income' ? 'in' : ''}">${t.kind === 'income' ? '+' : '−'}${rp(t.amount)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p><a href="#/transactions">Lihat semua 24 transaksi →</a></p>
    </div>
    <div class="panel tip">
      <h2>Tips hemat bulan ini</h2>
      <p><strong>${SAVING_TIPS[0].title}.</strong> ${SAVING_TIPS[0].body}</p>
      <p><a href="#/report">Baca 3 tips hemat dari data →</a></p>
    </div>
  </section>`;
}
