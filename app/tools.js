// Tools page (#/tools): three live calculators — 50/30/20, emergency fund,
// and loan instalments (annuity formula). Every result updates as you type.

import { rp, pct } from './format.js';
import { totalSpending, totalIncome } from './data.js';

function annuity(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (months <= 0) return { monthly: 0, totalInterest: 0 };
  if (r === 0) return { monthly: principal / months, totalInterest: 0 };
  const monthly = (principal * r) / (1 - Math.pow(1 + r, -months));
  return { monthly, totalInterest: monthly * months - principal };
}

export function renderTools() {
  return `
  <section class="page-head">
    <h1>Kalkulator keuangan keluarga</h1>
    <p>Tiga alat hitung yang dipakai keluarga Hartono setiap bulan. Semua hasil
    dihitung langsung di browser saat angkanya diubah.</p>
  </section>

  <section class="panel">
    <h2>1. Aturan 50/30/20</h2>
    <p>Bagi penghasilan bulanan: 50% kebutuhan, 30% keinginan, 20% tabungan.</p>
    <label class="inline-label">Penghasilan bulanan (Rp)
      <input type="number" id="t5030-income" min="0" step="100000" value="12500000">
    </label>
    <div class="calc-results" id="t5030-out"></div>
    <p class="compare">Keluarga Hartono (penghasilan Rp 13.250.000): kebutuhan Rp 6.625.000 ·
    keinginan Rp 3.975.000 · tabungan Rp 2.650.000. Nyatanya mereka menabung
    Rp 2.500.000 — hanya Rp 150.000 di bawah patokan.</p>
  </section>

  <section class="panel">
    <h2>2. Dana darurat</h2>
    <p>Berapa dana darurat yang ideal? Kalikan pengeluaran bulanan dengan jumlah
    bulan yang ingin ditutup.</p>
    <label class="inline-label">Pengeluaran bulanan (Rp)
      <input type="number" id="t-emg-spend" min="0" step="100000" value="${totalSpending()}">
    </label>
    <label class="inline-label">Jangka perlindungan
      <select id="t-emg-months">
        <option value="3">3 bulan</option>
        <option value="6" selected>6 bulan</option>
        <option value="12">12 bulan</option>
      </select>
    </label>
    <div class="calc-results" id="t-emg-out"></div>
    <p class="compare">Dana darurat Hartono sekarang Rp 9.200.000 dari target Rp 15.000.000
    (61%). Dengan iuran Rp 500.000/bulan, target tercapai sekitar 12 bulan lagi.</p>
  </section>

  <section class="panel">
    <h2>3. Cicilan pinjaman (anuitas)</h2>
    <p>Hitung cicilan bulanan pinjaman dengan bunga menurun (anuitas).</p>
    <div class="form-grid">
      <label>Jumlah pinjaman (Rp)
        <input type="number" id="t-loan-principal" min="0" step="100000" value="10000000">
      </label>
      <label>Bunga (% per tahun)
        <input type="number" id="t-loan-rate" min="0" step="0.5" value="12">
      </label>
      <label>Tenor (bulan)
        <input type="number" id="t-loan-months" min="1" step="1" value="12">
      </label>
    </div>
    <div class="calc-results" id="t-loan-out"></div>
    <p class="compare">Contoh: pinjam Rp 10.000.000, bunga 12%/tahun, 12 bulan →
    cicilan sekitar Rp 888.000/bulan. Selalu bandingkan total bunga sebelum tanda tangan.</p>
  </section>`;
}

function update5030(root) {
  const income = Math.max(0, Number(root.querySelector('#t5030-income').value) || 0);
  root.querySelector('#t5030-out').innerHTML = `
    <div class="calc-row"><span>Kebutuhan (50%)</span><strong>${rp(income * 0.5)}</strong></div>
    <div class="calc-row"><span>Keinginan (30%)</span><strong>${rp(income * 0.3)}</strong></div>
    <div class="calc-row"><span>Tabungan (20%)</span><strong>${rp(income * 0.2)}</strong></div>`;
}

function updateEmergency(root) {
  const spend = Math.max(0, Number(root.querySelector('#t-emg-spend').value) || 0);
  const months = Number(root.querySelector('#t-emg-months').value) || 6;
  const target = spend * months;
  const saved = 9200000;
  const done = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  root.querySelector('#t-emg-out').innerHTML = `
    <div class="calc-row"><span>Target dana darurat (${months} bulan)</span><strong>${rp(target)}</strong></div>
    <div class="calc-row"><span>Dana Hartono sekarang</span><strong>${rp(saved)} (${pct(saved / (target || 1), 0)})</strong></div>
    <div class="bar big"><span style="width:${done}%"></span></div>`;
}

function updateLoan(root) {
  const p = Math.max(0, Number(root.querySelector('#t-loan-principal').value) || 0);
  const rate = Math.max(0, Number(root.querySelector('#t-loan-rate').value) || 0);
  const months = Math.max(1, Math.round(Number(root.querySelector('#t-loan-months').value) || 1));
  const { monthly, totalInterest } = annuity(p, rate, months);
  root.querySelector('#t-loan-out').innerHTML = `
    <div class="calc-row"><span>Cicilan per bulan</span><strong>${rp(monthly)}</strong></div>
    <div class="calc-row"><span>Total yang dibayar (${months} bulan)</span><strong>${rp(monthly * months)}</strong></div>
    <div class="calc-row"><span>Total bunga</span><strong>${rp(totalInterest)}</strong></div>`;
}

export function bindTools(root) {
  const live = (fn) => () => fn(root);
  root.querySelector('#t5030-income').addEventListener('input', live(update5030));
  root.querySelector('#t-emg-spend').addEventListener('input', live(updateEmergency));
  root.querySelector('#t-emg-months').addEventListener('change', live(updateEmergency));
  for (const id of ['#t-loan-principal', '#t-loan-rate', '#t-loan-months']) {
    root.querySelector(id).addEventListener('input', live(updateLoan));
  }
  update5030(root);
  updateEmergency(root);
  updateLoan(root);
}
