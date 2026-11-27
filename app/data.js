// Data for NusaStat, the national statistics site for Indonesia.
//
// Every figure below is a real published figure, rounded for display. Each
// figure carries its source and reference year where the site shows it:
// Badan Pusat Statistik (BPS), Bank Indonesia, and the World Bank. Province
// populations are BPS mid-year 2024 estimates rounded to 0.01 million, so a
// column may differ from the national total by rounding.

// --- Headline indicators -------------------------------------------------

export const HEADLINE = [
  { label: "Penduduk", value: "281,6 jt", note: "Estimasi pertengahan 2024", source: "BPS, 2024" },
  { label: "PDB nominal", value: "Rp22.139 T", note: "US$1,40 triliun", source: "BPS, 2024" },
  { label: "PDB per kapita", value: "US$4.957", note: "Naik dari US$4.919 (2023)", source: "BPS / Bank Dunia, 2024" },
  { label: "Pertumbuhan ekonomi", value: "5,03%", note: "Tumbuh 5,05% pada 2023", source: "BPS, 2024" },
  { label: "Inflasi (Des, yoy)", value: "1,57%", note: "Target BI 2,5% ± 1%", source: "BPS, Des 2024" },
  { label: "Tingkat pengangguran", value: "4,91%", note: "Agustus 2024", source: "BPS, 2024" },
  { label: "Tingkat kemiskinan", value: "9,03%", note: "Maret 2024", source: "BPS, 2024" },
  { label: "Indeks Pembangunan Manusia", value: "75,02", note: "Harapan hidup 74,2 tahun", source: "BPS, 2024" },
];

// --- Population over time (millions, mid-year estimates) ------------------

export const POPULATION_SERIES = [
  { year: 2010, pop: 237.6 },
  { year: 2015, pop: 255.5 },
  { year: 2020, pop: 270.2 },
  { year: 2021, pop: 272.2 },
  { year: 2022, pop: 275.8 },
  { year: 2023, pop: 278.7 },
  { year: 2024, pop: 281.6 },
];

// --- Age structure 2024 (percent of total population, both sexes) ---------
// Five-year groups; the male/female split is the BPS 2024 estimate rounded
// to one decimal. Groups sum to 100%.

export const AGE_GROUPS = [
  { group: "0–4", male: 4.0, female: 3.8 },
  { group: "5–9", male: 4.2, female: 4.0 },
  { group: "10–14", male: 4.2, female: 4.0 },
  { group: "15–19", male: 4.3, female: 4.1 },
  { group: "20–24", male: 4.2, female: 4.1 },
  { group: "25–29", male: 4.1, female: 4.0 },
  { group: "30–34", male: 3.9, female: 3.8 },
  { group: "35–39", male: 3.8, female: 3.7 },
  { group: "40–44", male: 3.6, female: 3.5 },
  { group: "45–49", male: 3.3, female: 3.2 },
  { group: "50–54", male: 2.9, female: 2.8 },
  { group: "55–59", male: 2.5, female: 2.4 },
  { group: "60–64", male: 2.0, female: 2.0 },
  { group: "65–69", male: 1.5, female: 1.5 },
  { group: "70–74", male: 1.0, female: 1.1 },
  { group: "75+", male: 1.0, female: 1.3 },
];

// --- Economy ---------------------------------------------------------------

export const GDP_GROWTH = [
  { year: 2019, growth: 5.02, gdpUsd: 1.12 },
  { year: 2020, growth: -2.07, gdpUsd: 1.06 },
  { year: 2021, growth: 3.7, gdpUsd: 1.19 },
  { year: 2022, growth: 5.31, gdpUsd: 1.32 },
  { year: 2023, growth: 5.05, gdpUsd: 1.37 },
  { year: 2024, growth: 5.03, gdpUsd: 1.4 },
];

// Share of GDP by sector, 2024, percent. Source: BPS.
export const SECTORS = [
  { name: "Industri pengolahan", share: 18.7 },
  { name: "Perdagangan", share: 13.0 },
  { name: "Pertanian, kehutanan, perikanan", share: 12.5 },
  { name: "Konstruksi", share: 10.1 },
  { name: "Pertambangan dan penggalian", share: 9.3 },
  { name: "Transportasi dan pergudangan", share: 5.9 },
  { name: "Informasi dan komunikasi", share: 5.8 },
  { name: "Jasa keuangan dan asuransi", share: 4.4 },
  { name: "Penyediaan akomodasi dan makan minum", share: 2.7 },
  { name: "Sektor lainnya", share: 17.6 },
];

// Foreign trade, US$ billion. Source: BPS / Bank Indonesia.
export const TRADE = [
  { year: 2020, exports: 163.2, imports: 141.6 },
  { year: 2021, exports: 231.6, imports: 196.2 },
  { year: 2022, exports: 291.9, imports: 237.4 },
  { year: 2023, exports: 258.8, imports: 221.9 },
  { year: 2024, exports: 264.7, imports: 233.7 },
];

// --- Provinces -------------------------------------------------------------
// pop: millions, BPS mid-year 2024 estimate. area: km2 of land, BPS.
// island: island group used by the province filter.

export const PROVINCES = [
  { name: "Aceh", capital: "Banda Aceh", island: "Sumatera", pop: 5.55, area: 57956 },
  { name: "Sumatera Utara", capital: "Medan", island: "Sumatera", pop: 15.59, area: 72981 },
  { name: "Sumatera Barat", capital: "Padang", island: "Sumatera", pop: 5.76, area: 42013 },
  { name: "Riau", capital: "Pekanbaru", island: "Sumatera", pop: 6.64, area: 87024 },
  { name: "Kepulauan Riau", capital: "Tanjungpinang", island: "Sumatera", pop: 2.19, area: 8202 },
  { name: "Jambi", capital: "Jambi", island: "Sumatera", pop: 3.63, area: 50058 },
  { name: "Sumatera Selatan", capital: "Palembang", island: "Sumatera", pop: 9.02, area: 91592 },
  { name: "Kepulauan Bangka Belitung", capital: "Pangkalpinang", island: "Sumatera", pop: 1.49, area: 16424 },
  { name: "Bengkulu", capital: "Bengkulu", island: "Sumatera", pop: 2.09, area: 19919 },
  { name: "Lampung", capital: "Bandar Lampung", island: "Sumatera", pop: 9.24, area: 34624 },
  { name: "DKI Jakarta", capital: "Jakarta", island: "Jawa", pop: 10.56, area: 664 },
  { name: "Jawa Barat", capital: "Bandung", island: "Jawa", pop: 49.94, area: 35378 },
  { name: "Jawa Tengah", capital: "Semarang", island: "Jawa", pop: 37.89, area: 32801 },
  { name: "DI Yogyakarta", capital: "Yogyakarta", island: "Jawa", pop: 3.71, area: 3133 },
  { name: "Jawa Timur", capital: "Surabaya", island: "Jawa", pop: 41.81, area: 47803 },
  { name: "Banten", capital: "Serang", island: "Jawa", pop: 12.43, area: 9663 },
  { name: "Bali", capital: "Denpasar", island: "Bali & Nusa Tenggara", pop: 4.41, area: 5780 },
  { name: "Nusa Tenggara Barat", capital: "Mataram", island: "Bali & Nusa Tenggara", pop: 5.6, area: 18572 },
  { name: "Nusa Tenggara Timur", capital: "Kupang", island: "Bali & Nusa Tenggara", pop: 5.69, area: 48718 },
  { name: "Kalimantan Barat", capital: "Pontianak", island: "Kalimantan", pop: 5.8, area: 147307 },
  { name: "Kalimantan Tengah", capital: "Palangka Raya", island: "Kalimantan", pop: 2.81, area: 153564 },
  { name: "Kalimantan Selatan", capital: "Banjarmasin", island: "Kalimantan", pop: 4.31, area: 38744 },
  { name: "Kalimantan Timur", capital: "Samarinda", island: "Kalimantan", pop: 4.03, area: 129066 },
  { name: "Kalimantan Utara", capital: "Tanjung Selor", island: "Kalimantan", pop: 0.73, area: 75467 },
  { name: "Sulawesi Utara", capital: "Manado", island: "Sulawesi", pop: 2.7, area: 13892 },
  { name: "Sulawesi Tengah", capital: "Palu", island: "Sulawesi", pop: 3.09, area: 61841 },
  { name: "Sulawesi Selatan", capital: "Makassar", island: "Sulawesi", pop: 9.46, area: 46717 },
  { name: "Sulawesi Tenggara", capital: "Kendari", island: "Sulawesi", pop: 2.8, area: 38140 },
  { name: "Gorontalo", capital: "Gorontalo", island: "Sulawesi", pop: 1.27, area: 11257 },
  { name: "Sulawesi Barat", capital: "Mamuju", island: "Sulawesi", pop: 1.59, area: 16787 },
  { name: "Maluku", capital: "Ambon", island: "Maluku & Papua", pop: 2.0, area: 46158 },
  { name: "Maluku Utara", capital: "Sofifi", island: "Maluku & Papua", pop: 1.42, area: 31982 },
  { name: "Papua", capital: "Jayapura", island: "Maluku & Papua", pop: 1.1, area: 319036 },
  { name: "Papua Barat", capital: "Manokwari", island: "Maluku & Papua", pop: 0.61, area: 102995 },
  { name: "Papua Selatan", capital: "Merauke", island: "Maluku & Papua", pop: 0.54, area: 127280 },
  { name: "Papua Tengah", capital: "Nabire", island: "Maluku & Papua", pop: 1.35, area: 61073 },
  { name: "Papua Pegunungan", capital: "Wamena", island: "Maluku & Papua", pop: 1.46, area: 51213 },
  { name: "Papua Barat Daya", capital: "Sorong", island: "Maluku & Papua", pop: 0.61, area: 39167 },
];

// --- Helpers ---------------------------------------------------------------

// People per km2, rounded to the nearest whole person.
export function densityOf(province) {
  return Math.round((province.pop * 1_000_000) / province.area);
}

// Share of the national population, percent, one decimal.
export function shareOf(province) {
  const total = PROVINCES.reduce((sum, p) => sum + p.pop, 0);
  return ((province.pop / total) * 100).toFixed(1);
}

// Indonesian number formatting: 1.234.567,89 style.
export function formatId(n, decimals = 0) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export const ISLANDS = [
  "Semua",
  "Jawa",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  "Bali & Nusa Tenggara",
  "Maluku & Papua",
];

export const SOURCES = [
  {
    name: "Badan Pusat Statistik (BPS)",
    detail: "Sensus Penduduk 2020, proyeksi penduduk pertengahan tahun, PDB, inflasi, pengangguran, kemiskinan, dan IPM.",
    url: "bps.go.id",
  },
  {
    name: "Bank Indonesia",
    detail: "Neraca perdagangan, cadangan devisa, dan sasaran inflasi 2,5% ± 1%.",
    url: "bi.go.id",
  },
  {
    name: "Bank Dunia (World Bank)",
    detail: "PDB dalam dolar AS, PDB per kapita, dan indikator pembangunan.",
    url: "worldbank.org",
  },
  {
    name: "Kementerian Keuangan RI",
    detail: "APBN dan realisasi belanja negara.",
    url: "kemenkeu.go.id",
  },
];
