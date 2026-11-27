// Page renderers for NusaStat. Each view is a function returning the HTML
// for one route; the router injects it and then calls the view's wiring
// function so every control on the page actually works.

import {
  HEADLINE,
  POPULATION_SERIES,
  AGE_GROUPS,
  GDP_GROWTH,
  SECTORS,
  TRADE,
  PROVINCES,
  ISLANDS,
  SOURCES,
  densityOf,
  shareOf,
  formatId,
} from "./data.js";
import { lineChart, barChart, hbarChart, pyramid, pairBars, esc } from "./charts.js";

// --- Shared bits -----------------------------------------------------------

function kpiCards() {
  return HEADLINE.map(
    (k) => `<article class="kpi">
      <p class="kpi-label">${esc(k.label)}</p>
      <p class="kpi-value">${esc(k.value)}</p>
      <p class="kpi-note">${esc(k.note)}</p>
      <p class="kpi-source">Sumber: ${esc(k.source)}</p>
    </article>`,
  ).join("");
}

function sourceLine(text) {
  return `<p class="source-line">Sumber: ${esc(text)}</p>`;
}

function pageHead(title, intro) {
  return `<header class="page-head"><h1>${esc(title)}</h1><p>${esc(intro)}</p></header>`;
}

// --- Home ------------------------------------------------------------------

export function renderHome() {
  const top5 = [...PROVINCES]
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 5)
    .map((p) => ({ label: p.name, value: p.pop }));
  const growth = GDP_GROWTH.map((g) => ({ label: String(g.year), value: g.growth }));

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Portal Statistik Nasional &middot; Indonesia</p>
      <h1>Indonesia dalam angka</h1>
      <p class="lede">Penduduk, ekonomi, dan provinsi — angka resmi terbaru dari BPS,
      Bank Indonesia, dan Bank Dunia, dirangkum dalam satu tempat.</p>
      <p class="hero-actions">
        <a class="btn" href="#/penduduk">Lihat penduduk</a>
        <a class="btn btn-ghost" href="#/provinsi">Jelajahi 38 provinsi</a>
      </p>
    </div>
    <div class="hero-stat">
      <p class="hero-stat-label">Penduduk 2024</p>
      <p class="hero-stat-value">281,6 juta</p>
      <p class="hero-stat-note">peringkat ke-4 terbanyak di dunia</p>
      <p class="hero-stat-label">PDB 2024</p>
      <p class="hero-stat-value">US$1,40 triliun</p>
      <p class="hero-stat-note">ekonomi terbesar di Asia Tenggara</p>
    </div>
  </section>

  <section>
    <h2>Angka utama</h2>
    <div class="kpi-grid">${kpiCards()}</div>
  </section>

  <section class="two-col">
    <article class="card">
      <h2>Pertumbuhan penduduk</h2>
      <p class="card-sub">Juta jiwa, estimasi pertengahan tahun</p>
      ${lineChart(POPULATION_SERIES.map((p) => ({ x: String(p.year), y: p.pop })), { yLabel: "Penduduk Indonesia 2010–2024, juta jiwa" })}
      ${sourceLine("BPS: Sensus Penduduk 2020 dan proyeksi penduduk.")}
    </article>
    <article class="card">
      <h2>Pertumbuhan ekonomi</h2>
      <p class="card-sub">PDB riil, persen per tahun</p>
      ${barChart(growth, { yLabel: "Pertumbuhan PDB Indonesia 2019–2024, persen" })}
      ${sourceLine("BPS, 2024. Tahun 2020 terkontraksi karena pandemi COVID-19.")}
    </article>
  </section>

  <section class="two-col">
    <article class="card">
      <h2>Provinsi terpadat</h2>
      <p class="card-sub">Juta jiwa, 2024 — Jawa menampung 56% penduduk Indonesia</p>
      ${hbarChart(top5, { yLabel: "Lima provinsi dengan penduduk terbanyak, juta jiwa" })}
      ${sourceLine("BPS, estimasi pertengahan 2024.")}
      <p><a class="text-link" href="#/provinsi">Lihat semua 38 provinsi &rarr;</a></p>
    </article>
    <article class="card">
      <h2>Struktur ekonomi</h2>
      <p class="card-sub">Pangsa PDB menurut lapangan usaha, 2024</p>
      ${hbarChart(SECTORS.slice(0, 5).map((s) => ({ label: s.name, value: s.share })), { yLabel: "Lima sektor terbesar menurut pangsa PDB 2024" })}
      ${sourceLine("BPS, 2024.")}
      <p><a class="text-link" href="#/ekonomi">Selengkapnya tentang ekonomi &rarr;</a></p>
    </article>
  </section>

  <section>
    <h2>Jelajahi datanya</h2>
    <div class="link-grid">
      <a class="link-card" href="#/penduduk"><strong>Penduduk</strong><span>Piramida usia, pertumbuhan, dan sebaran penduduk.</span></a>
      <a class="link-card" href="#/ekonomi"><strong>Ekonomi</strong><span>PDB, sektor, inflasi, dan perdagangan luar negeri.</span></a>
      <a class="link-card" href="#/provinsi"><strong>Provinsi</strong><span>Tabel 38 provinsi yang bisa dicari dan diurutkan.</span></a>
      <a class="link-card" href="#/bandingkan"><strong>Bandingkan</strong><span>Dua provinsi berdampingan, angka demi angka.</span></a>
      <a class="link-card" href="#/sumber"><strong>Sumber &amp; metodologi</strong><span>Dari mana setiap angka berasal dan cara membacanya.</span></a>
    </div>
  </section>`;
}

// --- Population ------------------------------------------------------------

export function renderPopulation() {
  const young = AGE_GROUPS.slice(0, 3).reduce((s, g) => s + g.male + g.female, 0);
  const working = AGE_GROUPS.slice(3, 13).reduce((s, g) => s + g.male + g.female, 0);
  const old = AGE_GROUPS.slice(13).reduce((s, g) => s + g.male + g.female, 0);
  const rows = POPULATION_SERIES.map((p) => {
    const prev = POPULATION_SERIES[POPULATION_SERIES.indexOf(p) - 1];
    // Annualised growth over the gap since the previous observation, so a
    // five-year census gap reads as a yearly rate, not a five-year total.
    const growth = prev
      ? ((Math.pow(p.pop / prev.pop, 1 / (p.year - prev.year)) - 1) * 100).toFixed(2)
      : "—";
    return `<tr><td>${p.year}</td><td>${p.pop.toLocaleString("id-ID", { minimumFractionDigits: 1 })} jt</td><td>${growth === "—" ? "—" : growth.replace(".", ",") + "%"}</td></tr>`;
  }).join("");

  return `
  ${pageHead("Penduduk", "281,6 juta jiwa pada 2024 — negara keempat terpadat di dunia, dengan 56% penduduk tinggal di Pulau Jawa.")}
  <section class="stat-strip">
    <div class="strip-item"><strong>${young.toFixed(1).replace(".", ",")}%</strong><span>usia 0–14 tahun</span></div>
    <div class="strip-item"><strong>${working.toFixed(1).replace(".", ",")}%</strong><span>usia produktif 15–64 tahun</span></div>
    <div class="strip-item"><strong>${old.toFixed(1).replace(".", ",")}%</strong><span>usia 65 tahun ke atas</span></div>
    <div class="strip-item"><strong>1,04%</strong><span>laju tumbuh 2023–2024</span></div>
  </section>
  <section class="two-col">
    <article class="card">
      <h2>Piramida penduduk 2024</h2>
      <p class="card-sub">Persen dari total penduduk menurut kelompok umur dan jenis kelamin</p>
      ${pyramid(AGE_GROUPS)}
      ${sourceLine("BPS, proyeksi penduduk 2024. Bentuk piramida masih melebar di usia muda: bonus demografi masih berjalan.")}
    </article>
    <article class="card">
      <h2>Jumlah penduduk 2010–2024</h2>
      <p class="card-sub">Juta jiwa, estimasi pertengahan tahun</p>
      ${lineChart(POPULATION_SERIES.map((p) => ({ x: String(p.year), y: p.pop })), { yLabel: "Penduduk Indonesia 2010–2024" })}
      <table class="data-table">
        <thead><tr><th>Tahun</th><th>Penduduk</th><th>Tumbuh/thn</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${sourceLine("BPS: Sensus Penduduk 2010 dan 2020, proyeksi penduduk.")}
    </article>
  </section>
  <section class="card">
    <h2>Membaca piramida ini</h2>
    <p>Kelompok usia 15–19 tahun adalah yang terbesar — anak-anak yang lahir pada awal 2000-an kini memasuki
    usia kerja. Kelompok 65 tahun ke atas masih kecil (7,6%), tetapi tumbuh paling cepat: pada 2045, saat
    Indonesia genap 100 tahun, satu dari lima penduduk diperkirakan berusia lanjut. Laju tumbuh penduduk
    melambat dari 1,49% per tahun (2010–2020) menjadi sekitar 1,1% pada 2024.</p>
  </section>`;
}

// --- Economy ---------------------------------------------------------------

export function renderEconomy() {
  const tradeRows = TRADE.map((t) => {
    const surplus = (t.exports - t.imports).toFixed(1);
    return `<tr><td>${t.year}</td><td>US$${t.exports.toLocaleString("id-ID", { minimumFractionDigits: 1 })} M</td><td>US$${t.imports.toLocaleString("id-ID", { minimumFractionDigits: 1 })} M</td><td>US$${surplus.replace(".", ",")} M</td></tr>`;
  }).join("");

  return `
  ${pageHead("Ekonomi", "PDB US$1,40 triliun pada 2024 — ekonomi terbesar di Asia Tenggara, tumbuh 5,03% dengan inflasi yang terjaga di 1,57%.")}
  <section class="two-col">
    <article class="card">
      <h2>Pertumbuhan PDB 2019–2024</h2>
      <p class="card-sub">Persen per tahun, harga konstan</p>
      ${barChart(GDP_GROWTH.map((g) => ({ label: String(g.year), value: g.growth })), { yLabel: "Pertumbuhan PDB 2019–2024, persen" })}
      ${sourceLine("BPS, 2024. Kontraksi 2020 adalah dampak pandemi COVID-19.")}
    </article>
    <article class="card">
      <h2>PDB nominal 2019–2024</h2>
      <p class="card-sub">Triliun dolar AS</p>
      ${lineChart(GDP_GROWTH.map((g) => ({ x: String(g.year), y: g.gdpUsd })), { yLabel: "PDB nominal Indonesia 2019–2024, triliun dolar AS" })}
      ${sourceLine("BPS dan Bank Dunia, 2024.")}
    </article>
  </section>
  <section class="two-col">
    <article class="card">
      <h2>PDB menurut sektor, 2024</h2>
      <p class="card-sub">Pangsa PDB, persen</p>
      ${hbarChart(SECTORS.map((s) => ({ label: s.name, value: s.share })), { yLabel: "Pangsa PDB menurut lapangan usaha 2024" })}
      ${sourceLine("BPS, 2024. Industri pengolahan tetap menjadi tulang punggung.")}
    </article>
    <article class="card">
      <h2>Perdagangan luar negeri</h2>
      <p class="card-sub">Ekspor dan impor barang, miliar dolar AS</p>
      <table class="data-table">
        <thead><tr><th>Tahun</th><th>Ekspor</th><th>Impor</th><th>Surplus</th></tr></thead>
        <tbody>${tradeRows}</tbody>
      </table>
      ${sourceLine("BPS, 2024. Indonesia mencatat surplus perdagangan lima tahun berturut-turut.")}
      <p>Komoditas ekspor utama: batu bara, minyak sawit (CPO), besi-baja, serta nikel olahan yang
      tumbuh pesat sejak kebijakan hilirisasi. Mitra dagang terbesar: Tiongkok, Amerika Serikat, dan Jepang.</p>
    </article>
  </section>
  <section class="card">
    <h2>Indikator lain yang perlu diketahui</h2>
    <div class="kpi-grid">
      <article class="kpi"><p class="kpi-label">Inflasi Desember 2024 (yoy)</p><p class="kpi-value">1,57%</p><p class="kpi-note">Di bawah sasaran BI 2,5% ± 1%</p><p class="kpi-source">Sumber: BPS, 2024</p></article>
      <article class="kpi"><p class="kpi-label">Pengangguran terbuka</p><p class="kpi-value">4,91%</p><p class="kpi-note">Agustus 2024; 7,47 juta orang</p><p class="kpi-source">Sumber: BPS, 2024</p></article>
      <article class="kpi"><p class="kpi-label">Kemiskinan</p><p class="kpi-value">9,03%</p><p class="kpi-note">Maret 2024; 25,22 juta orang</p><p class="kpi-source">Sumber: BPS, 2024</p></article>
      <article class="kpi"><p class="kpi-label">Cadangan devisa</p><p class="kpi-value">US$155,7 M</p><p class="kpi-note">Akhir Desember 2024</p><p class="kpi-source">Sumber: Bank Indonesia, 2024</p></article>
    </div>
  </section>`;
}

// --- Provinces -------------------------------------------------------------
// Table state lives in this module so sorting, filtering and search survive
// re-renders without a framework.

const provinceState = { query: "", island: "Semua", sortKey: "pop", sortDir: -1 };

function provinceRows() {
  const q = provinceState.query.trim().toLowerCase();
  let list = PROVINCES.filter(
    (p) =>
      (provinceState.island === "Semua" || p.island === provinceState.island) &&
      (q === "" || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q)),
  );
  const key = provinceState.sortKey;
  const dir = provinceState.sortDir;
  list = [...list].sort((a, b) => {
    const av = key === "density" ? densityOf(a) : key === "share" ? parseFloat(shareOf(a)) : a[key];
    const bv = key === "density" ? densityOf(b) : key === "share" ? parseFloat(shareOf(b)) : b[key];
    if (typeof av === "string") return dir * av.localeCompare(bv, "id");
    return dir * (av - bv);
  });
  return list
    .map(
      (p) => `<tr data-province="${esc(p.name)}" tabindex="0">
        <td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.island)}</td>
        <td class="num">${formatId(p.pop, 2)}</td>
        <td class="num">${formatId(p.area)}</td>
        <td class="num">${formatId(densityOf(p))}</td>
        <td class="num">${shareOf(p).replace(".", ",")}%</td>
      </tr>`,
    )
    .join("");
}

function provinceTableHtml() {
  const arrow = (key) =>
    provinceState.sortKey === key ? (provinceState.sortDir === 1 ? " ▲" : " ▼") : "";
  return `<table class="data-table sortable">
    <thead><tr>
      <th data-sort="name">Provinsi${arrow("name")}</th>
      <th data-sort="capital">Ibu kota${arrow("capital")}</th>
      <th data-sort="island">Kepulauan${arrow("island")}</th>
      <th data-sort="pop">Penduduk (jt)${arrow("pop")}</th>
      <th data-sort="area">Luas (km²)${arrow("area")}</th>
      <th data-sort="density">Kepadatan (/km²)${arrow("density")}</th>
      <th data-sort="share">Pangsa (%)${arrow("share")}</th>
    </tr></thead>
    <tbody id="province-rows">${provinceRows()}</tbody>
  </table>`;
}

export function renderProvinces() {
  const islandButtons = ISLANDS.map(
    (isle) => `<button type="button" class="chip${provinceState.island === isle ? " chip-active" : ""}" data-island="${esc(isle)}">${esc(isle)}</button>`,
  ).join("");
  return `
  ${pageHead("Provinsi", "38 provinsi, dari Aceh sampai Papua Pegunungan. Cari, saring menurut kepulauan, dan urutkan menurut kolom apa pun — klik sebuah baris untuk melihat rinciannya.")}
  <section class="card">
    <div class="controls">
      <label class="search-box">Cari provinsi atau ibu kota
        <input id="province-search" type="search" placeholder="mis. Jawa Barat atau Bandung" value="${esc(provinceState.query)}" />
      </label>
      <div class="chips" role="group" aria-label="Saring menurut kepulauan">${islandButtons}</div>
    </div>
    <div class="table-wrap" id="province-table">${provinceTableHtml()}</div>
    <p id="province-count" class="source-line"></p>
    ${sourceLine("BPS, estimasi penduduk pertengahan 2024; luas wilayah menurut BPS. Kepadatan dihitung dari angka-angka tersebut.")}
  </section>
  <section class="card" id="province-detail" hidden>
    <h2 id="detail-title"></h2>
    <div id="detail-body"></div>
  </section>`;
}

export function wireProvinces() {
  const search = document.getElementById("province-search");
  const tableWrap = document.getElementById("province-table");
  const count = document.getElementById("province-count");
  const detail = document.getElementById("province-detail");

  function refresh() {
    tableWrap.innerHTML = provinceTableHtml();
    const rows = document.querySelectorAll("#province-rows tr").length;
    count.textContent = `Menampilkan ${rows} dari 38 provinsi. Klik judul kolom untuk mengurutkan.`;
    wireRows();
  }
  function wireRows() {
    document.querySelectorAll("#province-rows tr").forEach((row) => {
      const show = () => showDetail(row.dataset.province);
      row.addEventListener("click", show);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
      });
    });
    document.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (provinceState.sortKey === key) provinceState.sortDir *= -1;
        else { provinceState.sortKey = key; provinceState.sortDir = key === "name" || key === "capital" || key === "island" ? 1 : -1; }
        refresh();
      });
    });
  }
  function showDetail(name) {
    const p = PROVINCES.find((x) => x.name === name);
    if (!p) return;
    document.getElementById("detail-title").textContent = p.name;
    document.getElementById("detail-body").innerHTML = `
      <dl class="detail-grid">
        <div><dt>Ibu kota</dt><dd>${esc(p.capital)}</dd></div>
        <div><dt>Kepulauan</dt><dd>${esc(p.island)}</dd></div>
        <div><dt>Penduduk (2024)</dt><dd>${formatId(p.pop, 2)} juta jiwa</dd></div>
        <div><dt>Luas wilayah</dt><dd>${formatId(p.area)} km²</dd></div>
        <div><dt>Kepadatan</dt><dd>${formatId(densityOf(p))} jiwa/km²</dd></div>
        <div><dt>Pangsa penduduk nasional</dt><dd>${shareOf(p).replace(".", ",")}%</dd></div>
      </dl>
      <p>${p.name === "DKI Jakarta"
        ? "Provinsi terpadat di Indonesia: lebih dari 15.000 jiwa per km², pusat pemerintahan dan keuangan negara."
        : p.name === "Jawa Barat"
        ? "Provinsi dengan penduduk terbanyak di Indonesia — hampir satu dari lima penduduk Indonesia tinggal di sini."
        : p.island === "Maluku & Papua" && p.area > 100000
        ? "Salah satu provinsi terluas di Indonesia dengan kepadatan penduduk yang sangat rendah."
        : "Sumber: BPS, estimasi pertengahan 2024."}</p>`;
    detail.hidden = false;
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  search.addEventListener("input", () => {
    provinceState.query = search.value;
    refresh();
  });
  document.querySelectorAll("[data-island]").forEach((btn) => {
    btn.addEventListener("click", () => {
      provinceState.island = btn.dataset.island;
      document.querySelectorAll("[data-island]").forEach((b) =>
        b.classList.toggle("chip-active", b === btn));
      refresh();
    });
  });
  refresh();
}

// --- Compare ---------------------------------------------------------------

export function renderCompare() {
  const options = PROVINCES.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("");
  return `
  ${pageHead("Bandingkan provinsi", "Pilih dua provinsi dan lihat penduduk, luas, kepadatan, dan pangsa nasionalnya berdampingan.")}
  <section class="card">
    <div class="controls compare-controls">
      <label>Provinsi pertama
        <select id="compare-a">${options}</select>
      </label>
      <label>Provinsi kedua
        <select id="compare-b">${options}</select>
      </label>
      <button type="button" class="btn" id="compare-swap">Tukar</button>
    </div>
    <div id="compare-result"></div>
  </section>`;
}

export function wireCompare() {
  const selA = document.getElementById("compare-a");
  const selB = document.getElementById("compare-b");
  const result = document.getElementById("compare-result");
  selA.value = "Jawa Barat";
  selB.value = "DKI Jakarta";

  function render() {
    const a = PROVINCES.find((p) => p.name === selA.value);
    const b = PROVINCES.find((p) => p.name === selB.value);
    if (!a || !b) return;
    const row = (label, va, vb, unit) => `<tr><td>${esc(label)}</td><td class="num">${va}</td><td class="num">${vb}</td></tr>`;
    result.innerHTML = `
      <h2>${esc(a.name)} vs ${esc(b.name)}</h2>
      <div class="compare-charts">
        <div><h3>Penduduk (juta jiwa)</h3>${pairBars(a.name, a.pop, b.name, b.pop, "jt")}</div>
        <div><h3>Luas wilayah (km²)</h3>${pairBars(a.name, a.area, b.name, b.area, "km²")}</div>
        <div><h3>Kepadatan (jiwa/km²)</h3>${pairBars(a.name, densityOf(a), b.name, densityOf(b), "/km²")}</div>
      </div>
      <table class="data-table">
        <thead><tr><th>Ukuran</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead>
        <tbody>
          ${row("Ibu kota", esc(a.capital), esc(b.capital))}
          ${row("Kepulauan", esc(a.island), esc(b.island))}
          ${row("Penduduk (2024)", formatId(a.pop, 2) + " jt", formatId(b.pop, 2) + " jt")}
          ${row("Luas wilayah", formatId(a.area) + " km²", formatId(b.area) + " km²")}
          ${row("Kepadatan", formatId(densityOf(a)) + " /km²", formatId(densityOf(b)) + " /km²")}
          ${row("Pangsa nasional", shareOf(a).replace(".", ",") + "%", shareOf(b).replace(".", ",") + "%")}
        </tbody>
      </table>
      ${sourceLine("BPS, estimasi pertengahan 2024. Kepadatan dihitung dari penduduk dibagi luas wilayah.")}`;
  }
  selA.addEventListener("change", render);
  selB.addEventListener("change", render);
  document.getElementById("compare-swap").addEventListener("click", () => {
    const tmp = selA.value;
    selA.value = selB.value;
    selB.value = tmp;
    render();
  });
  render();
}

// --- Sources ---------------------------------------------------------------

export function renderSources() {
  const list = SOURCES.map(
    (s) => `<article class="source-card">
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.detail)}</p>
      <p class="source-url">${esc(s.url)}</p>
    </article>`,
  ).join("");
  return `
  ${pageHead("Sumber & metodologi", "Setiap angka di situs ini berasal dari publikasi resmi. Berikut sumbernya dan cara kami menyajikannya.")}
  <section class="source-list">${list}</section>
  <section class="card">
    <h2>Cara kami menyajikan angka</h2>
    <ul class="notes">
      <li>Angka penduduk adalah estimasi pertengahan tahun BPS, dibulatkan ke 0,1 juta jiwa; jumlah provinsi dapat berbeda dari total nasional karena pembulatan.</li>
      <li>Kepadatan penduduk dihitung sendiri dari penduduk dibagi luas wilayah, keduanya dari BPS.</li>
      <li>PDB dalam dolar AS memakai kurs rata-rata tahun berjalan; PDB per kapita memakai penduduk pertengahan tahun.</li>
      <li>Angka 2024 adalah angka resmi terbaru yang diterbitkan BPS dan Bank Indonesia pada saat situs ini dibuat.</li>
      <li>Situs ini tidak berafiliasi dengan BPS, Bank Indonesia, Bank Dunia, atau Kementerian Keuangan.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Tentang NusaStat</h2>
    <p>NusaStat adalah portal statistik independen tentang Indonesia, dibuat untuk
    menunjukkan bahwa data negara bisa disajikan dengan jelas: angka utama di depan,
    grafik yang bisa dibaca, dan sumber yang tercantum di setiap angka. Situs ini
    berjalan sepenuhnya dari berkas statis — tanpa pelacak, tanpa iklan, tanpa
    permintaan jaringan.</p>
  </section>`;
}
