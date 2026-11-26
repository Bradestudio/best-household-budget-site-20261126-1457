// SVG chart builders: grouped bars and a donut. Pure string output, no
// external assets, so the charts render identically in every screenshot.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function barChart(rows, opts = {}) {
  const width = opts.width || 640;
  const barH = opts.barHeight || 22;
  const gap = opts.gap || 14;
  const labelW = opts.labelWidth || 150;
  const valueW = opts.valueWidth || 90;
  const height = rows.length * (barH * 2 + gap) + 8;
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b || 0]), 1);
  const plotW = width - labelW - valueW;
  let y = 8;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Bar chart">`;
  for (const r of rows) {
    const wA = Math.max(2, (r.a / max) * plotW);
    out += `<text x="0" y="${y + 15}" font-size="13" fill="#33413a">${esc(r.label)}</text>`;
    out += `<rect x="${labelW}" y="${y}" width="${wA}" height="${barH}" rx="4" fill="#1d4d3b"/>`;
    out += `<text x="${labelW + wA + 8}" y="${y + 15}" font-size="12" fill="#1d4d3b" font-weight="600">${esc(r.aText)}</text>`;
    if (r.b !== undefined) {
      const wB = Math.max(2, (r.b / max) * plotW);
      out += `<rect x="${labelW}" y="${y + barH + 3}" width="${wB}" height="${barH}" rx="4" fill="#c05621"/>`;
      out += `<text x="${labelW + wB + 8}" y="${y + barH + 18}" font-size="12" fill="#c05621" font-weight="600">${esc(r.bText)}</text>`;
    }
    y += barH * 2 + gap;
  }
  out += '</svg>';
  return out;
}

export function donutChart(slices, opts = {}) {
  const size = opts.size || 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const colors = ['#1d4d3b', '#2e7d5b', '#c05621', '#d9a441', '#7a9e8f', '#8a5a44', '#4a6b8a'];
  let out = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart">`;
  let angle = -Math.PI / 2;
  slices.forEach((s, i) => {
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    out += `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${colors[i % colors.length]}" stroke="#f7f3ea" stroke-width="2"/>`;
    angle = a1;
  });
  const hole = r * 0.58;
  out += `<circle cx="${cx}" cy="${cy}" r="${hole}" fill="#f7f3ea"/>`;
  out += '</svg>';
  return out;
}

export function donutLegend(slices) {
  const colors = ['#1d4d3b', '#2e7d5b', '#c05621', '#d9a441', '#7a9e8f', '#8a5a44', '#4a6b8a'];
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  return slices.map((s, i) => (
    `<li><span class="dot" style="background:${colors[i % colors.length]}"></span>`
    + `<span>${esc(s.label)}</span><strong>${((s.value / total) * 100).toFixed(0)}%</strong></li>`
  )).join('');
}
