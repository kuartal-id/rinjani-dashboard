import { midasSites, type MidasSite } from "@/lib/midas-sites";

export type MapPoint = {
  id: string;
  name: string;
  nameId?: string;
  lat: number;
  lng: number;
  note: string;
  noteId?: string;
};

export type MapLine = {
  id: string;
  name: string;
  nameId?: string;
  note: string;
  noteId?: string;
  path: [number, number][];
};

export type MapPolygon = {
  id: string;
  name: string;
  note: string;
  ring: [number, number][];
};

export type LayerKind = "points" | "lines" | "polygons" | "geojson";

export type MapLayer = {
  id: string;
  group: string;
  groupId?: string;
  name: string;
  nameId?: string;
  kind: LayerKind;
  color: string;
  pin?: string;
  summary: string;
  points?: MapPoint[];
  lines?: MapLine[];
  polygons?: MapPolygon[];
  geojson?: string;
};

function asPoints(sites: MidasSite[]): MapPoint[] {
  return sites.map((site) => ({
    id: String(site.id),
    name: site.name,
    lat: site.lat,
    lng: site.lng,
    note: [site.code, site.nameEn !== site.name ? site.nameEn : "", site.place].filter(Boolean).join(" · "),
  }));
}

function siteLayer(id: string, category: MidasSite["category"], color: string, nameId: string, pin: string): MapLayer {
  const points = asPoints(midasSites.filter((site) => site.category === category));
  return {
    id,
    group: "MIDAS Map",
    groupId: "Peta MIDAS",
    name: category,
    nameId,
    kind: "points",
    color,
    pin,
    summary: `${points.length} locations from the published map database.`,
    points,
  };
}

export const mapLayers: MapLayer[] = [
  siteLayer("geological", "Geological Site", "#692a00", "Situs geologi", "geological"),
  siteLayer("natural", "Natural Site", "#059669", "Situs alam", "natural"),
  siteLayer("cultural", "Cultural Site", "#2563eb", "Situs budaya", "cultural"),
  {
    id: "trails",
    group: "MIDAS Map",
    groupId: "Peta MIDAS",
    name: "Trails",
    nameId: "Jalur",
    kind: "lines",
    color: "#1f4533",
    summary: "The walking lines already used on the visitor map. Kept, not replaced.",
    lines: [
      {
        id: "tr-sembalun",
        name: "Sembalun — rim — summit",
        nameId: "Sembalun — bibir — puncak",
        note: "Eastern approach.",
        noteId: "Pendakian dari timur.",
        path: [
          [-8.365, 116.533],
          [-8.38, 116.51],
          [-8.394, 116.478],
          [-8.411, 116.458],
        ],
      },
      {
        id: "tr-senaru",
        name: "Senaru — rim — lake",
        nameId: "Senaru — bibir — danau",
        note: "Northern approach.",
        noteId: "Pendakian dari utara.",
        path: [
          [-8.301, 116.408],
          [-8.34, 116.41],
          [-8.399, 116.42],
          [-8.408, 116.396],
        ],
      },
      {
        id: "tr-torean",
        name: "Torean",
        note: "Forest approach toward the lake.",
        noteId: "Pendakian hutan menuju danau.",
        path: [
          [-8.341, 116.432],
          [-8.37, 116.42],
          [-8.408, 116.396],
        ],
      },
      {
        id: "tr-timbanuh",
        name: "Timbanuh",
        note: "Southern approach.",
        noteId: "Pendakian dari selatan.",
        path: [
          [-8.49, 116.425],
          [-8.46, 116.43],
          [-8.42, 116.44],
          [-8.408, 116.396],
        ],
      },
      {
        id: "tr-aik",
        name: "Aik Berik approach",
        nameId: "Pendakian Aik Berik",
        note: "Short visitor path used by the Geosafe pilot.",
        noteId: "Jalur pengunjung pendek yang dipakai uji coba Geosafe.",
        path: [
          [-8.55, 116.405],
          [-8.545, 116.41],
          [-8.538, 116.414],
        ],
      },
    ],
  },
  {
    id: "boundary",
    group: "Boundary",
    groupId: "Batas",
    name: "Geopark boundary",
    nameId: "Batas geopark",
    kind: "geojson",
    color: "#27466b",
    geojson: "/data/batas-geopark.geojson",
    summary: "Batas kawasan file already shipped with the MIDAS Map. The schematic box is gone.",
  },
  {
    id: "hazards",
    group: "Geosafe",
    groupId: "Geosafe",
    name: "Hazard points",
    nameId: "Titik bahaya",
    kind: "points",
    color: "#99282d",
    pin: "hazard",
    summary: "Pilot hazards from the Aik Berik safety map. Not removed — they are a layer.",
    points: [
      { id: "h1", name: "River crossing", nameId: "Penyeberangan sungai", lat: -8.543, lng: 116.409, note: "High. Slippery rock after rain.", noteId: "Tinggi. Batu licin setelah hujan." },
      { id: "h2", name: "Steep stair", nameId: "Tangga curam", lat: -8.546, lng: 116.412, note: "Medium. Uneven steps.", noteId: "Sedang. Anak tangga tidak rata." },
      { id: "h3", name: "Flash-flood reach", nameId: "Jangkauan banjir bandang", lat: -8.541, lng: 116.407, note: "High. Do not enter when the stream is coloured.", noteId: "Tinggi. Jangan masuk bila air sungai berwarna." },
      { id: "h4", name: "Loose shoulder", nameId: "Bahu longsor", lat: -8.548, lng: 116.413, note: "Low. Stay on the inside of the path.", noteId: "Rendah. Tetap di sisi dalam jalur." },
    ],
  },
  {
    id: "safe",
    group: "Geosafe",
    name: "Safe points",
    nameId: "Titik aman",
    kind: "points",
    color: "#2c6449",
    pin: "safe",
    summary: "Places the pilot treats as relatively safer ground.",
    points: [
      { id: "s1", name: "Aik Berik shelter", nameId: "Pondok Aik Berik", lat: -8.55, lng: 116.405, note: "Staffed in season.", noteId: "Ada petugas pada musimnya." },
      { id: "s2", name: "Upper viewpoint", nameId: "Pandangan atas", lat: -8.537, lng: 116.415, note: "Clear of the stream.", noteId: "Jauh dari aliran sungai." },
    ],
  },
  {
    id: "assembly",
    group: "Geosafe",
    name: "Assembly points",
    nameId: "Titik kumpul",
    kind: "points",
    color: "#3c6a9d",
    pin: "assembly",
    summary: "Where a group should gather if a hazard notice is raised.",
    points: [
      { id: "a1", name: "Car park assembly", nameId: "Titik kumpul parkir", lat: -8.552, lng: 116.403, note: "Default muster for Aik Berik.", noteId: "Titik kumpul utama Aik Berik." },
      { id: "a2", name: "Senaru gate", nameId: "Gerbang Senaru", lat: -8.303, lng: 116.407, note: "Northern gate muster.", noteId: "Titik kumpul gerbang utara." },
      { id: "a3", name: "Sembalun office", nameId: "Kantor Sembalun", lat: -8.367, lng: 116.53, note: "Eastern office muster.", noteId: "Titik kumpul kantor timur." },
    ],
  },
];

export const layerIds = mapLayers.map((layer) => layer.id);

export const defaultLayerIds = ["geological", "natural", "cultural", "boundary"];
