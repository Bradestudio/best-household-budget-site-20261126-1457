// Report page (#/report): the November summary, a six-month income-vs-
// expense bar chart, and three saving tips drawn from the family's own data.

import { HISTORY, SAVING_TIPS, totalIncome, totalActual, cashLeft } from './data.js';
import { rp } from './format.js';
import { barChart } from './charts.js';

export function renderReport() {
  const rows = HISTORY.map((h) => ({
    label: h.month,
    a: h.income,
    aText: rp(h.income),
    b: h.expense,
    bText: rp(h.expense),
  }));
  const best = HISTORY.reduce((a, b) => (a.income - a.expense) > (b.income - b.expense) ? a : b);
  const worst = HISTORY.reduce((a, b) => (a.income - a.expense) < (b.income - b.expense) ? a : b);
  return `
  <section class="page-head">
    <h1>Laporan November 2026</h1>
    <p>Enam bulan terakhir keluarga Hartono, diringkas dari catatan harian mereka.</p>
  </section>
  <section class="cards">
    <div class="stat"><span>Pemasukan Nov</span><strong>${rp(totalIncome())}</strong><em>Turun Rp 150.000 dari Okt (Rp 13.400.000)</em></div>
    <div class="stat"><span>Pengeluaran Nov</span><strong>${rp(totalActual())}</strong><em>Turun Rp 333.000 dari Okt</em></div>
    <div class="stat"><span>Sisa kas Nov</span><strong>${rp(cashLeft())}</strong><em>Bulan terbaik: ${best.month} (+${rp(best.income - best.expense)})</em></div>
    <div class="stat"><span>Bulan tersulit</span><strong>${worst.month}</strong><em>Defisit ${rp(worst.expense - worst.income)} — servis motor + biaya sekolah</em></div>
  </section>
  <section class="panel">
    <h2>Pemasukan vs pengeluaran, 6 bulan</h2>
    <p class="legend"><span class="sw green"></span> Pemasukan &nbsp; <span class="sw orange"></span> Pengeluaran</p>
    ${barChart(rows)}
    <p>September 2026 satu-satunya bulan defisit: pengeluaran Rp 12.950.000
    melewati pemasukan Rp 12.800.000 karena servis motor dan biaya sekolah.
    Dana darurat menutup selisih Rp 150.000 itu — persis gunanya dana darurat.</p>
  </section>
  <section class="panel">
    <h2>3 tips hemat dari data bulan ini</h2>
    <ol class="tips">
      ${SAVING_TIPS.map((t) => `<li><strong>${t.title}.</strong> ${t.body}</li>`).join('')}
    </ol>
    <p>Total potensi hemat dari tiga tips ini: sekitar <strong>Rp 136.000/bulan</strong>,
    atau Rp 1.632.000 setahun — cukup untuk menambah iuran dana pendidikan anak.</p>
  </section>`;
}
