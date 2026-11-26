// Goals page (#/goals): four savings goals with progress bars and a
// simulator — add a monthly amount and see how many months remain.

import { GOALS } from './data.js';
import { rp, pct } from './format.js';

function monthsLeft(goal, extra) {
  const monthly = goal.monthly + extra;
  if (monthly <= 0) return null;
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / monthly);
}

export function renderGoals() {
  const cards = GOALS.map((g) => {
    const done = Math.round((g.saved / g.target) * 100);
    return `<article class="panel goal-card">
      <h2>${g.name}</h2>
      <p class="goal-nums"><strong>${rp(g.saved)}</strong> dari ${rp(g.target)} · ${pct(g.saved / g.target, 0)}</p>
      <div class="bar big"><span style="width:${done}%"></span></div>
      <p>${g.note}</p>
      <label>Iuran tambahan per bulan (Rp)
        <input type="number" min="0" step="50000" value="0" data-goal="${g.id}" class="goal-extra">
      </label>
      <p class="goal-result" data-result="${g.id}">Dengan iuran sekarang Rp ${g.monthly.toLocaleString('id-ID')}/bulan, tercapai dalam <strong>${monthsLeft(g, 0)} bulan</strong>.</p>
    </article>`;
  }).join('');
  return `
  <section class="page-head">
    <h1>Tujuan tabungan</h1>
    <p>Empat hal yang sedang ditabung keluarga Hartono. Isi kolom iuran tambahan
    di tiap kartu untuk melihat berapa bulan lagi tujuan itu tercapai.</p>
  </section>
  <section class="grid-2">${cards}</section>
  <section class="panel">
    <h2>Kenapa menabung duluan?</h2>
    <p>Keluarga Hartono menyisihkan Rp 2.500.000 di awal bulan — Rp 2.000.000
    tabungan dan Rp 500.000 dana darurat — sebelum belanja apa pun. Itu sebabnya
    tingkat tabungan mereka 18,9%, nyaris menyentuh patokan 20% dari aturan
    50/30/20. Menabung di awal jauh lebih berhasil daripada menabung dari sisa.</p>
  </section>`;
}

export function bindGoals(root) {
  root.querySelectorAll('.goal-extra').forEach((input) => {
    input.addEventListener('input', () => {
      const g = GOALS.find((x) => x.id === input.dataset.goal);
      const extra = Math.max(0, Math.round(Number(input.value) || 0));
      const m = monthsLeft(g, extra);
      const out = root.querySelector(`[data-result="${g.id}"]`);
      if (m === 0) {
        out.innerHTML = 'Tujuan ini sudah tercapai.';
      } else if (m === null) {
        out.innerHTML = 'Isi iuran bulanan untuk melihat perkiraan waktu.';
      } else {
        out.innerHTML = `Dengan iuran Rp ${(g.monthly + extra).toLocaleString('id-ID')}/bulan, tercapai dalam <strong>${m} bulan</strong>.`;
      }
    });
  });
}
