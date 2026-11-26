// Rupiah, percent and date formatting (Indonesian format, no dependencies).

export function rp(n) {
  const v = Math.round(n);
  const sign = v < 0 ? '-' : '';
  const digits = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp ${digits}`;
}

export function rpShort(n) {
  if (Math.abs(n) >= 1000000) {
    const jt = n / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1).replace('.', ',')} jt`;
  }
  if (Math.abs(n) >= 1000) return `Rp ${Math.round(n / 1000)} rb`;
  return rp(n);
}

export function pct(x, digits = 1) {
  return `${(x * 100).toFixed(digits).replace('.', ',')}%`;
}

export function monthDay(day) {
  return `${day} Nov 2026`;
}
