// Guide page (#/guide): an original, plain-language guide to the 50/30/20
// rule, building a household budget, and using this site.

export function renderGuide() {
  return `
  <section class="page-head">
    <h1>Panduan menyusun anggaran rumah tangga</h1>
    <p>Ditulis dari cara keluarga Hartono mengatur uangnya — bukan teori dari
    buku, tapi langkah yang mereka jalani tiap bulan.</p>
  </section>
  <section class="panel guide">
    <h2>1. Aturan 50/30/20</h2>
    <p>Bagilah penghasilan bulanan menjadi tiga kantong. <strong>50% untuk
    kebutuhan</strong> — sewa, listrik, air, internet, makanan, transport,
    SPP. <strong>30% untuk keinginan</strong> — makan di luar, bioskop, jajan.
    <strong>20% untuk tabungan dan dana darurat</strong>. Kalau kebutuhanmu
    lebih dari 50% — wajar di kota besar — jangan paksa angkanya; geser dulu
    keinginan, dan naikkan tabungan sedikit demi sedikit.</p>
    <h2>2. Lima langkah menyusun anggaran</h2>
    <ol>
      <li><strong>Catat semua pemasukan.</strong> Gaji, usaha sampingan, apa
      pun yang masuk. Keluarga Hartono: Rp 13.250.000 di November.</li>
      <li><strong>Catat semua pengeluaran satu bulan penuh.</strong> Jangan
      tebak — lihat catatan dan struk. Mereka menemukan ojol sudah Rp 96.000
      hanya dalam 10 hari pertama.</li>
      <li><strong>Kelompokkan ke kategori.</strong> Tempat tinggal, makanan,
      transport, sekolah, kesehatan, hiburan, pakaian, tabungan, dana darurat.
      Sembilan kategori cukup; lebih banyak hanya bikin malas mencatat.</li>
      <li><strong>Beri tiap kategori batas.</strong> Total batas harus lebih
      kecil dari pemasukan. Anggaran Hartono Rp 12.700.000 — di bawah pemasukan
      Rp 13.250.000, jadi ada sisa Rp 550.000.</li>
      <li><strong>Cek tiap minggu, bukan tiap akhir bulan.</strong> Akhir bulan
      sudah terlambat untuk memperbaiki. Cek hari Minggu malam, 10 menit.</li>
    </ol>
    <h2>3. Cara memakai situs ini</h2>
    <ul>
      <li><strong>Dashboard</strong> — gambaran bulan ini sekilas: sisa kas,
      kategori yang over budget, dan transaksi terbaru.</li>
      <li><strong>Anggaran</strong> — ubah batas tiap kategori dan simpan;
      tersimpan di browser, jadi tetap ada saat dibuka lagi.</li>
      <li><strong>Transaksi</strong> — tambah setiap belanja, saring per
      kategori, hapus yang salah catat.</li>
      <li><strong>Tujuan</strong> — lihat progres tabungan dan simulasikan
      iuran tambahan per bulan.</li>
      <li><strong>Kalkulator</strong> — hitung pembagian 50/30/20, target dana
      darurat, dan cicilan pinjaman sebelum meminjam.</li>
      <li><strong>Laporan</strong> — bandingkan enam bulan terakhir dan baca
      tips hemat yang diambil dari data sendiri.</li>
    </ul>
    <h2>4. Kalau anggaran jebol, apa yang dilakukan?</h2>
    <p>Pertama, jangan panik dan jangan berhenti mencatat — catatan yang jebol
    tetap lebih berguna daripada tidak ada catatan. Kedua, cari penyebabnya:
    Hartono menemukan makanan over Rp 165.000 karena harga telur naik, bukan
    karena boros. Ketiga, geser dari kategori yang masih sisa, atau potong satu
    keinginan minggu depan. Keempat, kalau jebol tiga bulan berturut-turut,
    batasnya yang salah — naikkan anggaran kategori itu dan potong di tempat lain.</p>
  </section>`;
}
