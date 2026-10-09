export type Service = {
  id: string;
  name: string;
  english: string;
  summary: string;
  status: "Live" | "Priority";
  href: string;
  external?: boolean;
  host: string;
};

export const priorityServices: Service[] = [
  {
    id: "one-data",
    name: "Rinjani OneData",
    english: "Satu Data",
    summary:
      "The open-data portal for the UNESCO Global Geopark and Biosphere Reserve. Indicators, tables and charts, ready to take extracts from Satu Data NTB.",
    status: "Priority",
    href: "/data",
    host: "data.rinjanilombok.org",
  },
  {
    id: "dashboard",
    name: "Dashboard Rinjani",
    english: "Situational picture",
    summary:
      "News, warnings, the event calendar and the figures residents, visitors, businesses and investors actually need — one desk for the designated area.",
    status: "Priority",
    href: "/dashboard",
    host: "dashboard.rinjanilombok.org",
  },
  {
    id: "one-map",
    name: "Rinjani OneMap",
    english: "Satu Peta",
    summary:
      "The published MIDAS Map locations, the geopark boundary, trails and Geosafe hazards on one map. Layers stack. The live map at map.rinjanilombok.org is not replaced.",
    status: "Priority",
    href: "/map",
    host: "map.rinjanilombok.org",
  },
  {
    id: "rinjaniku",
    name: "Rinjaniku",
    english: "Report and respond",
    summary:
      "Whistleblowing, complaints and feedback into the Rinjani Digital Command Center, so the Geopark, the National Park and the Province can answer.",
    status: "Priority",
    href: "/rinjaniku",
    host: "rinjaniku.rinjanilombok.org",
  },
  {
    id: "academy",
    name: "Rinjani Academy",
    english: "Learn here",
    summary:
      "Local schools, Unram pathways, short courses, field schools, certificates and apprenticeships for people who live and work in the Rinjani landscape.",
    status: "Priority",
    href: "/academy",
    host: "academy.rinjanilombok.org",
  },
];

export const liveServices: Service[] = [
  {
    id: "midas-map",
    name: "MIDAS Map",
    english: "Already published",
    summary:
      "The map that is live today: geosites, trails and visitor information across the Geopark, the Biosphere Reserve and the National Park. OneMap extends it; it does not replace it.",
    status: "Live",
    href: "https://map.rinjanilombok.org",
    external: true,
    host: "map.rinjanilombok.org",
  },
  {
    id: "lontar",
    name: "Lontar Digital Archive",
    english: "Already published",
    summary:
      "Palm-leaf manuscripts of Lombok, photographed leaf by leaf, with transcriptions, translations and audio readings.",
    status: "Live",
    href: "https://lontar.rinjanilombok.org",
    external: true,
    host: "lontar.rinjanilombok.org",
  },
  {
    id: "geosafe",
    name: "Geosafe",
    english: "Lives inside OneMap",
    summary:
      "Geohazard points, assembly points and safe points from the Aik Berik pilot stay on the map as their own layers, next to the wider geosite catalogue.",
    status: "Live",
    href: "/map?layers=hazards,safe,assembly,trails",
    host: "map.rinjanilombok.org",
  },
];
