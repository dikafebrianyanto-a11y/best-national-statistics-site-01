// Hand-drawn SVG charts for NusaStat. No chart library is used: every chart
// is built from the data as plain SVG so the first load stays small and the
// site works with no network at all.

const INK = "#10263f";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const GRID = "#dbe3ea";
const MUTED = "#5b6b7c";

// Escape text that goes into an SVG label.
export function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Format a number the Indonesian way (decimal comma).
function idNum(n, decimals = 1) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Nice axis steps: round the data range up to a tidy step.
function niceStep(max, target = 4) {
  const raw = max / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}

// --- Line chart ------------------------------------------------------------
// points: [{ x: label, y: number }]. Renders axes, gridlines, a filled area
// under the line and a dot + value label on every point.

export function lineChart(points, { width = 640, height = 300, yLabel = "", color = TEAL } = {}) {
  const padL = 56;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const maxY = Math.max(...points.map((p) => p.y));
  const minY = Math.min(0, ...points.map((p) => p.y));
  const span = maxY - minY || 1;
  const xAt = (i) => padL + (i / (points.length - 1)) * innerW;
  const yAt = (v) => padT + innerH - ((v - minY) / span) * innerH;

  const step = niceStep(maxY - minY);
  let grid = "";
  for (let v = Math.ceil(minY / step) * step; v <= maxY; v += step) {
    const y = yAt(v);
    grid += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${idNum(v, 0)}</text>`;
  }

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)}`).join(" ");
  const area = `${line} L${xAt(points.length - 1).toFixed(1)},${yAt(minY).toFixed(1)} L${xAt(0).toFixed(1)},${yAt(minY).toFixed(1)} Z`;

  let dots = "";
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    dots += `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(p.y).toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2"/>` +
      `<text x="${xAt(i).toFixed(1)}" y="${yAt(p.y).toFixed(1) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${idNum(p.y)}</text>`;
  }

  let labels = "";
  for (let i = 0; i < points.length; i++) {
    labels += `<text x="${xAt(i).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(points[i].x)}</text>`;
  }

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)}" class="chart-svg">` +
    grid +
    `<path d="${area}" fill="${color}" opacity="0.10"/>` +
    `<path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>` +
    dots + labels +
    `</svg>`;
}

// --- Vertical bar chart ----------------------------------------------------
// items: [{ label, value }]. Bars grow from the baseline; the value sits on
// top of each bar. Negative values (e.g. GDP contraction in 2020) draw
// downward from the zero line.

export function barChart(items, { width = 640, height = 300, yLabel = "", color = TEAL, negativeColor = "#b3402e" } = {}) {
  const padL = 52;
  const padR = 12;
  const padT = 24;
  const padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const maxY = Math.max(0, ...items.map((d) => d.value));
  const minY = Math.min(0, ...items.map((d) => d.value));
  const span = maxY - minY || 1;
  const slot = innerW / items.length;
  const barW = Math.min(52, slot * 0.62);
  const yAt = (v) => padT + innerH - ((v - minY) / span) * innerH;

  const step = niceStep(maxY - minY);
  let grid = "";
  for (let v = Math.ceil(minY / step) * step; v <= maxY; v += step) {
    const y = yAt(v);
    grid += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${idNum(v, 0)}</text>`;
  }

  let bars = "";
  items.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const y0 = yAt(0);
    const y1 = yAt(d.value);
    const top = Math.min(y0, y1);
    const h = Math.max(1.5, Math.abs(y1 - y0));
    const fill = d.value < 0 ? negativeColor : color;
    const labelY = d.value < 0 ? y1 + 16 : y1 - 7;
    bars += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>` +
      `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${idNum(d.value, 2).replace(",00", "")}</text>` +
      `<text x="${cx.toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(d.label)}</text>`;
  });

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)}" class="chart-svg">` +
    grid +
    `<line x1="${padL}" y1="${yAt(0).toFixed(1)}" x2="${width - padR}" y2="${yAt(0).toFixed(1)}" stroke="${INK}" stroke-width="1.2"/>` +
    bars +
    `</svg>`;
}

// --- Horizontal bar chart --------------------------------------------------
// items: [{ label, value }], sorted by the caller. The label sits left of
// each bar and the value at its end. Used for sector shares and province
// rankings where the labels are long.

export function hbarChart(items, { width = 640, rowH = 34, yLabel = "", color = TEAL } = {}) {
  const padL = 210;
  const padR = 64;
  const padT = 8;
  const height = padT + items.length * rowH + 12;
  const maxV = Math.max(...items.map((d) => d.value));
  const innerW = width - padL - padR;

  let rows = "";
  items.forEach((d, i) => {
    const y = padT + i * rowH;
    const w = Math.max(2, (d.value / maxV) * innerW);
    rows += `<text x="${padL - 10}" y="${y + 20}" text-anchor="end" font-size="12" fill="${INK}">${esc(d.label)}</text>` +
      `<rect x="${padL}" y="${y + 6}" width="${w.toFixed(1)}" height="18" rx="3" fill="${color}"/>` +
      `<text x="${padL + w + 8}" y="${y + 20}" font-size="12" font-weight="600" fill="${INK}">${idNum(d.value, 1)}%</text>`;
  });

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)}" class="chart-svg">${rows}</svg>`;
}

// --- Population pyramid ----------------------------------------------------
// groups: [{ group, male, female }] in percent of the total population.
// Male bars extend left, female bars right, from a centre axis.

export function pyramid(groups, { width = 640, rowH = 24 } = {}) {
  const padT = 26;
  const height = padT + groups.length * rowH + 26;
  const mid = width / 2;
  const gap = 30; // centre column where the age-group label sits
  const maxV = Math.max(...groups.flatMap((g) => [g.male, g.female]));
  const half = mid - gap - 64; // bar area, leaving room for the value labels

  let rows = "";
  groups.forEach((g, i) => {
    const y = padT + i * rowH;
    const mw = (g.male / maxV) * half;
    const fw = (g.female / maxV) * half;
    rows += `<rect x="${(mid - gap - mw).toFixed(1)}" y="${y}" width="${mw.toFixed(1)}" height="${rowH - 4}" rx="2" fill="${TEAL}"/>` +
      `<rect x="${mid + gap}" y="${y}" width="${fw.toFixed(1)}" height="${rowH - 4}" rx="2" fill="${AMBER}"/>` +
      `<text x="${mid}" y="${y + rowH / 2 + 3}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${esc(g.group)}</text>` +
      `<text x="${(mid - gap - mw - 6).toFixed(1)}" y="${y + rowH / 2 + 3}" text-anchor="end" font-size="10" fill="${MUTED}">${idNum(g.male)}</text>` +
      `<text x="${(mid + gap + fw + 6).toFixed(1)}" y="${y + rowH / 2 + 3}" font-size="10" fill="${MUTED}">${idNum(g.female)}</text>`;
  });

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Piramida penduduk Indonesia 2024" class="chart-svg">` +
    `<text x="8" y="16" font-size="12" font-weight="700" fill="${TEAL}">Laki-laki</text>` +
    `<text x="${width - 8}" y="16" text-anchor="end" font-size="12" font-weight="700" fill="${AMBER}">Perempuan</text>` +
    rows +
    `<text x="${mid}" y="${height - 6}" text-anchor="middle" font-size="11" fill="${MUTED}">Persen dari total penduduk, 2024</text>` +
    `</svg>`;
}

// --- Paired comparison bars ------------------------------------------------
// Two values side by side for one metric, used on the compare page.

export function pairBars(aLabel, aValue, bLabel, bValue, unit) {
  const maxV = Math.max(aValue, bValue) || 1;
  const row = (label, value, color, y) =>
    `<text x="8" y="${y + 4}" font-size="12" font-weight="600" fill="${INK}">${esc(label)}</text>` +
    `<rect x="8" y="${y + 10}" width="${((value / maxV) * 420).toFixed(1)}" height="16" rx="3" fill="${color}"/>` +
    `<text x="${((value / maxV) * 420 + 16).toFixed(1)}" y="${y + 23}" font-size="12" font-weight="700" fill="${INK}">${idNum(value, 2)} ${esc(unit)}</text>`;
  return `<svg viewBox="0 0 460 92" role="img" class="chart-svg">` +
    row(aLabel, aValue, TEAL, 6) +
    row(bLabel, bValue, AMBER, 52) +
    `</svg>`;
}
