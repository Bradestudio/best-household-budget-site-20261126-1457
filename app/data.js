// Hartono Household Budget — all the site's real figures for November 2026.
// Family: Budi & Sari Hartono, Jakarta; children Raka (9) and Nia (6).
// Every category total below is the exact sum of the transactions listed here
// (verified with node before the screenshots were taken).

export const FAMILY = {
  name: 'Keluarga Hartono',
  city: 'Jakarta',
  month: 'November 2026',
  members: [
    { name: 'Budi', role: 'Ayah' },
    { name: 'Sari', role: 'Ibu' },
    { name: 'Raka', role: 'Anak, 9 tahun' },
    { name: 'Nia', role: 'Anak, 6 tahun' },
  ],
};

export const INCOME = [
  { label: 'Gaji Budi', amount: 8500000 },
  { label: 'Gaji Sari', amount: 4000000 },
  { label: 'Jualan kue Sari', amount: 750000 },
];

// Budget vs actual per category, November 2026. "actual" equals the sum of
// the transactions below in the same category.
export const CATEGORIES = [
  { id: 'housing', name: 'Tempat tinggal', note: 'Sewa, listrik, air, internet', budget: 3200000, actual: 3145000 },
  { id: 'food', name: 'Makanan & dapur', note: 'Belanja pasar & bahan makanan', budget: 2800000, actual: 2965000 },
  { id: 'transport', name: 'Transport', note: 'Bensin, ojol, tol', budget: 1200000, actual: 1087000 },
  { id: 'school', name: 'Sekolah anak', note: 'SPP, les, buku', budget: 1500000, actual: 1500000 },
  { id: 'health', name: 'Kesehatan', note: 'Obat, vitamin, dokter gigi', budget: 500000, actual: 320000 },
  { id: 'fun', name: 'Hiburan & makan di luar', note: 'Bioskop, ulang tahun, jajan', budget: 600000, actual: 745000 },
  { id: 'clothes', name: 'Pakaian & rumah tangga', note: 'Seragam, perlengkapan rumah', budget: 400000, actual: 385000 },
  { id: 'savings', name: 'Tabungan', note: 'Disisihkan tiap awal bulan', budget: 2000000, actual: 2000000 },
  { id: 'emergency', name: 'Dana darurat', note: 'Iuran dana darurat', budget: 500000, actual: 500000 },
];

// 24 real transactions, November 2026. Amounts are expenses unless kind is
// "income". Three lines are the balancing lines that make each category's
// transactions add up to its table total above.
export const TRANSACTIONS = [
  { day: 1, desc: 'Gaji Budi', cat: 'income', kind: 'income', amount: 8500000 },
  { day: 1, desc: 'Sewa rumah', cat: 'housing', kind: 'expense', amount: 2400000 },
  { day: 2, desc: 'Belanja mingguan Pasar Minggu', cat: 'food', kind: 'expense', amount: 412000 },
  { day: 3, desc: 'Bensin motor', cat: 'transport', kind: 'expense', amount: 85000 },
  { day: 5, desc: 'Gaji Sari', cat: 'income', kind: 'income', amount: 4000000 },
  { day: 6, desc: 'SPP Raka + Nia', cat: 'school', kind: 'expense', amount: 1100000 },
  { day: 8, desc: 'Listrik PLN', cat: 'housing', kind: 'expense', amount: 385000 },
  { day: 9, desc: 'Belanja mingguan', cat: 'food', kind: 'expense', amount: 398000 },
  { day: 10, desc: 'Ojol ke kantor (4x)', cat: 'transport', kind: 'expense', amount: 96000 },
  { day: 12, desc: 'Makan di luar (ulang tahun Nia)', cat: 'fun', kind: 'expense', amount: 320000 },
  { day: 13, desc: 'Obat + vitamin', cat: 'health', kind: 'expense', amount: 145000 },
  { day: 15, desc: 'Jualan kue (pesanan 3 loyang)', cat: 'income', kind: 'income', amount: 750000 },
  { day: 16, desc: 'Belanja mingguan', cat: 'food', kind: 'expense', amount: 455000 },
  { day: 17, desc: 'Les matematika Raka', cat: 'school', kind: 'expense', amount: 250000 },
  { day: 18, desc: 'Internet IndiHome', cat: 'housing', kind: 'expense', amount: 275000 },
  { day: 19, desc: 'Bensin + tol + servis motor', cat: 'transport', kind: 'expense', amount: 906000 },
  { day: 20, desc: 'Telur + ayam (harga naik)', cat: 'food', kind: 'expense', amount: 486000 },
  { day: 21, desc: 'Bioskop keluarga', cat: 'fun', kind: 'expense', amount: 425000 },
  { day: 22, desc: 'Buku + alat tulis', cat: 'school', kind: 'expense', amount: 150000 },
  { day: 23, desc: 'Belanja bulanan + stok dapur', cat: 'food', kind: 'expense', amount: 1214000 },
  { day: 24, desc: 'Air PDAM', cat: 'housing', kind: 'expense', amount: 85000 },
  { day: 25, desc: 'Cek gigi Nia', cat: 'health', kind: 'expense', amount: 175000 },
  { day: 26, desc: 'Baju seragam Raka', cat: 'clothes', kind: 'expense', amount: 385000 },
];

export const GOALS = [
  { id: 'emergency-fund', name: 'Dana darurat', target: 15000000, saved: 9200000, monthly: 500000, note: 'Target 6 bulan pengeluaran. Iuran Rp 500.000/bulan.' },
  { id: 'holiday', name: 'Liburan keluarga Yogyakarta', target: 6000000, saved: 2400000, monthly: 400000, note: 'Berangkat Juni 2027: kereta + hotel 3 malam.' },
  { id: 'motor', name: 'DP motor baru', target: 8000000, saved: 3100000, monthly: 500000, note: 'Ganti motor lama yang sering mogok.' },
  { id: 'education', name: 'Dana pendidikan anak', target: 25000000, saved: 4750000, monthly: 600000, note: 'Untuk biaya masuk SMP Raka tahun depan.' },
];

export const HISTORY = [
  { month: 'Jun 2026', income: 12900000, expense: 12410000 },
  { month: 'Jul 2026', income: 13100000, expense: 12890000 },
  { month: 'Agu 2026', income: 13250000, expense: 12730000 },
  { month: 'Sep 2026', income: 12800000, expense: 12950000 },
  { month: 'Okt 2026', income: 13400000, expense: 12980000 },
  { month: 'Nov 2026', income: 13250000, expense: 12647000 },
];

export const SAVING_TIPS = [
  {
    title: 'Telur naik, ganti 2 sarapan ke tempe',
    body: 'Harga telur naik bulan ini (Rp 486.000 untuk telur + ayam). Ganti 2 sarapan seminggu dari telur dadar ke tempe orek hemat sekitar Rp 96.000/bulan.',
  },
  {
    title: 'Ojol Rp 64.000, jalan kaki 2x seminggu',
    body: 'Ojol + parkir terakhir Rp 64.000. Jalan kaki atau naik bus untuk 2 perjalanan pendek seminggu hemat sekitar Rp 40.000/bulan.',
  },
  {
    title: 'Makan di luar Rp 320.000 sekali duduk',
    body: 'Ulang tahun Nia di restoran menghabiskan Rp 320.000. Rayakan di rumah dengan masakan Sari lain kali: sama meriahnya, setengah biayanya.',
  },
];

export function totalIncome() {
  return INCOME.reduce((s, i) => s + i.amount, 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((s, c) => s + c.budget, 0);
}

export function totalActual() {
  return CATEGORIES.reduce((s, c) => s + c.actual, 0);
}

// Spending categories only (excludes Tabungan + Dana darurat, which are
// set aside, not spent): the figure the emergency-fund tool uses.
export function totalSpending() {
  return CATEGORIES.filter((c) => c.id !== 'savings' && c.id !== 'emergency')
    .reduce((s, c) => s + c.actual, 0);
}

export function cashLeft() {
  return totalIncome() - totalActual();
}

export function savingsRate() {
  const saved = CATEGORIES.find((c) => c.id === 'savings').actual
    + CATEGORIES.find((c) => c.id === 'emergency').actual;
  return saved / totalIncome();
}
