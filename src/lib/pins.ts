export type PinDef = {
  id: string;
  en: string;
  idn: string;
  img?: string;
  mark?: string;
  color: string;
  gradStart: string;
  gradEnd: string;
  glow: string;
};

const mark = (path: string) =>
  `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="#fff" d="${path}"/></svg>`;

export const pins: PinDef[] = [
  {
    id: "geological",
    en: "Geological",
    idn: "Geologi",
    img: "/pins/geological.png",
    color: "#692a00",
    gradStart: "#873600",
    gradEnd: "#542200",
    glow: "rgba(105, 42, 0, 0.55)",
  },
  {
    id: "natural",
    en: "Natural",
    idn: "Alam",
    img: "/pins/natural.png",
    color: "#059669",
    gradStart: "#34d399",
    gradEnd: "#059669",
    glow: "rgba(16, 185, 129, 0.55)",
  },
  {
    id: "cultural",
    en: "Cultural",
    idn: "Budaya",
    img: "/pins/cultural.png",
    color: "#2563eb",
    gradStart: "#60a5fa",
    gradEnd: "#2563eb",
    glow: "rgba(59, 130, 246, 0.55)",
  },
  {
    id: "hazard",
    en: "Hazard",
    idn: "Bahaya",
    mark: mark("M8 1.2 15 14H1L8 1.2zm0 4.2-.7 4.2h1.4L8 5.4zM8 12.2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"),
    color: "#99282d",
    gradStart: "#c0454a",
    gradEnd: "#99282d",
    glow: "rgba(153, 40, 45, 0.45)",
  },
  {
    id: "safe",
    en: "Safe",
    idn: "Aman",
    mark: mark("M6.2 11.2 2.8 7.8l1.2-1.2 2.2 2.2 5-5 1.2 1.2-6.2 6.2z"),
    color: "#2c6449",
    gradStart: "#3d8a64",
    gradEnd: "#2c6449",
    glow: "rgba(44, 100, 73, 0.45)",
  },
  {
    id: "assembly",
    en: "Assembly",
    idn: "Titik kumpul",
    mark: mark("M3 2h2v12H3zm2 1.2 8 2.2v2.2L5 5.4V3.2z"),
    color: "#2f5583",
    gradStart: "#4c7fb4",
    gradEnd: "#2f5583",
    glow: "rgba(47, 85, 131, 0.45)",
  },
  {
    id: "water",
    en: "Water",
    idn: "Air",
    mark: mark("M8 1.4s4.2 4.4 4.2 7.2a4.2 4.2 0 0 1-8.4 0C3.8 5.8 8 1.4 8 1.4z"),
    color: "#2f5583",
    gradStart: "#6a98c7",
    gradEnd: "#2f5583",
    glow: "rgba(47, 85, 131, 0.45)",
  },
  {
    id: "leaf",
    en: "Forest",
    idn: "Hutan",
    mark: mark("M13.5 2.2S8.2 2 5 5.2C2.4 7.8 2 12.8 2 12.8s5 .4 7.6-2.2c3.2-3.2 3.9-8.4 3.9-8.4zM6.2 9.8l4.2-4.2"),
    color: "#2c6449",
    gradStart: "#3d8a64",
    gradEnd: "#1f4533",
    glow: "rgba(44, 100, 73, 0.45)",
  },
  {
    id: "house",
    en: "Village",
    idn: "Desa",
    mark: mark("M8 2 1.5 7.2V14h4.2v-3.4h4.6V14h4.2V7.2L8 2z"),
    color: "#8d5a1a",
    gradStart: "#c4893a",
    gradEnd: "#8d5a1a",
    glow: "rgba(141, 90, 26, 0.45)",
  },
  {
    id: "book",
    en: "Record",
    idn: "Catatan",
    mark: mark("M3 2.5h6.2c1.2 0 2.3.6 2.3 2V13c-1.2-.6-2.4-.8-3.6-.8H3V2.5zm10 0h.2v9.7h-3.4c-1.2 0-2.4.2-3.6.8V4.5c0-1.4 1.1-2 2.3-2H13z"),
    color: "#27466b",
    gradStart: "#4c7fb4",
    gradEnd: "#27466b",
    glow: "rgba(39, 70, 107, 0.45)",
  },
  {
    id: "flag",
    en: "Desk pin",
    idn: "Titik meja",
    mark: mark("M3.2 1.8h1.4V14H3.2zm1.4.2 8.2 2.4-8.2 2.6V2z"),
    color: "#8d5a1a",
    gradStart: "#c4893a",
    gradEnd: "#8d5a1a",
    glow: "rgba(141, 90, 26, 0.45)",
  },
  {
    id: "star",
    en: "Marked",
    idn: "Tanda",
    mark: mark("M8 1.4 9.8 5.6l4.6.5-3.4 3.1.9 4.5L8 11.6 4.1 13.7l.9-4.5L1.6 6.1l4.6-.5L8 1.4z"),
    color: "#3c6a9d",
    gradStart: "#6a98c7",
    gradEnd: "#3c6a9d",
    glow: "rgba(60, 106, 157, 0.45)",
  },
];

export const agencyPinIds = ["water", "leaf", "house", "book", "flag", "star", "hazard", "safe", "assembly"];

export function getPin(id: string) {
  return pins.find((pin) => pin.id === id) ?? pins[0];
}

export function pinHtml(id: string) {
  const pin = getPin(id);
  const inner = pin.img
    ? `<img src="${pin.img}" alt="" class="geo-pin-img">`
    : `<span class="geo-pin-icon">${pin.mark ?? ""}</span>`;
  return `<div class="geo-pin-marker" style="--pin-color:${pin.color};--pin-grad-start:${pin.gradStart};--pin-grad-end:${pin.gradEnd};--pin-glow:${pin.glow}"><div class="geo-pin-body">${inner}</div><div class="geo-pin-tip"></div><div class="geo-pin-ground-pulse"></div></div>`;
}

export function pinIcon(L: { divIcon: (options: object) => unknown }, id: string) {
  return L.divIcon({
    html: pinHtml(id),
    className: "leaflet-div-icon modern-leaflet-marker-wrap",
    iconSize: [32, 42],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
  });
}
