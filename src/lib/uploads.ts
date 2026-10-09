import { agencyPinIds } from "@/lib/pins";

export type AgencyPoint = { name: string; lat: number; lng: number; note: string };
export type AgencySeries = { label: string; value: number };

export type AgencyDataset = {
  id: string;
  title: string;
  org: string;
  summary: string;
  pin: string;
  kind: "points" | "chart" | "table";
  headers: string[];
  rows: string[][];
  points: AgencyPoint[];
  series: AgencySeries[];
  created: string;
};

const KEY = "rinjani-agency-datasets";
const MAX_ROWS = 500;

const ALIAS: Record<string, string[]> = {
  name: ["name", "nama", "title", "judul", "site", "lokasi"],
  lat: ["latitude", "lat", "lintang", "y"],
  lng: ["longitude", "lng", "lon", "long", "bujur", "x"],
  note: ["note", "notes", "catatan", "keterangan", "deskripsi", "description"],
  label: ["label", "kategori", "category", "kelompok", "name", "nama"],
  value: ["value", "nilai", "jumlah", "count", "total", "angka"],
};

export function loadUploads(): AgencyDataset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AgencyDataset[]) : [];
  } catch {
    return [];
  }
}

export function saveUploads(rows: AgencyDataset[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function getUpload(id: string) {
  return loadUploads().find((row) => row.id === id);
}

export type ParsedFile = {
  headers: string[];
  rows: string[][];
  points: AgencyPoint[];
  series: AgencySeries[];
  kind: AgencyDataset["kind"];
  warning?: string;
};

export function parseTableFile(text: string, filename: string): ParsedFile {
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  if (!trimmed) throw new Error("empty");
  if (trimmed.startsWith("{") || filename.toLowerCase().endsWith(".geojson") || filename.toLowerCase().endsWith(".json")) {
    return parseGeoJson(trimmed);
  }
  return parseCsv(trimmed);
}

function parseCsv(text: string): ParsedFile {
  const first = text.split(/\r?\n/, 1)[0] ?? "";
  const delim = first.split(";").length > first.split(",").length ? ";" : ",";
  const table = parseDelimited(text, delim).filter((row) => row.some((cell) => cell.trim()));
  if (table.length < 2) throw new Error("header");
  const headers = table[0].map((cell) => cell.trim());
  const body = table.slice(1, MAX_ROWS + 1);
  return shape(headers, body, table.length - 1 > MAX_ROWS);
}

function parseGeoJson(text: string): ParsedFile {
  let data: { features?: { geometry?: { type?: string; coordinates?: number[] }; properties?: Record<string, unknown> }[] };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("json");
  }
  const features = data.features ?? [];
  const points: AgencyPoint[] = [];
  for (const feature of features) {
    if (feature.geometry?.type !== "Point" || !feature.geometry.coordinates) continue;
    const [lng, lat] = feature.geometry.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    const props = feature.properties ?? {};
    const name = String(props.name ?? props.nama ?? props.title ?? "Untitled");
    const note = String(props.note ?? props.catatan ?? props.description ?? "");
    points.push({ name, lat, lng, note });
    if (points.length >= MAX_ROWS) break;
  }
  if (!points.length) throw new Error("geo");
  return {
    headers: ["name", "latitude", "longitude", "note"],
    rows: points.map((point) => [point.name, String(point.lat), String(point.lng), point.note]),
    points,
    series: [],
    kind: "points",
    warning: features.length > MAX_ROWS ? "capped" : undefined,
  };
}

function shape(headers: string[], body: string[][], capped: boolean): ParsedFile {
  const index = (key: keyof typeof ALIAS) => headers.findIndex((header) => ALIAS[key].includes(header.trim().toLowerCase()));
  const nameI = index("name");
  const latI = index("lat");
  const lngI = index("lng");
  const noteI = index("note");
  const labelI = index("label");
  const valueI = index("value");
  const rows = body.map((row) => headers.map((_, i) => (row[i] ?? "").trim()));

  if (latI >= 0 && lngI >= 0) {
    const points: AgencyPoint[] = [];
    for (const row of rows) {
      const lat = numberOf(row[latI]);
      const lng = numberOf(row[lngI]);
      if (lat == null || lng == null) continue;
      points.push({
        name: nameI >= 0 ? row[nameI] || "Untitled" : "Untitled",
        lat,
        lng,
        note: noteI >= 0 ? row[noteI] : "",
      });
    }
    if (!points.length) throw new Error("coords");
    return { headers, rows, points, series: [], kind: "points", warning: capped ? "capped" : undefined };
  }

  if (labelI >= 0 && valueI >= 0 && labelI !== valueI) {
    const series: AgencySeries[] = [];
    for (const row of rows) {
      const value = numberOf(row[valueI]);
      if (value == null || !row[labelI]) continue;
      series.push({ label: row[labelI], value });
    }
    if (!series.length) throw new Error("values");
    return { headers, rows, points: [], series, kind: "chart", warning: capped ? "capped" : undefined };
  }

  if (!headers.length) throw new Error("header");
  return { headers, rows, points: [], series: [], kind: "table", warning: capped ? "capped" : undefined };
}

function numberOf(value: string | undefined) {
  if (!value) return null;
  const normalised = value.replace(/\s/g, "").replace(",", ".");
  const number = Number(normalised);
  return Number.isFinite(number) ? number : null;
}

function parseDelimited(text: string, delim: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += char;
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === delim) {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (char !== "\r") cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export function publishUpload(input: {
  title: string;
  org: string;
  summary: string;
  pin: string;
  parsed: ParsedFile;
}) {
  const current = loadUploads();
  const dataset: AgencyDataset = {
    id: `up-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title.trim(),
    org: input.org.trim() || "Agency desk",
    summary: input.summary.trim(),
    pin: agencyPinIds.includes(input.pin) ? input.pin : "star",
    kind: input.parsed.kind,
    headers: input.parsed.headers,
    rows: input.parsed.rows,
    points: input.parsed.points,
    series: input.parsed.series,
    created: new Date().toISOString(),
  };
  saveUploads([dataset, ...current]);
  return dataset;
}

export function removeUpload(id: string) {
  saveUploads(loadUploads().filter((row) => row.id !== id));
}
