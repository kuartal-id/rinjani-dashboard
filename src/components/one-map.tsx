import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { defaultLayerIds, layerIds, mapLayers } from "@/lib/map-layers";
import { getPin, pinHtml, pinIcon } from "@/lib/pins";
import { loadUploads, type AgencyDataset } from "@/lib/uploads";
import { useLang, useT } from "@/lib/i18n";

type Pin = { id: string; name: string; lat: number; lng: number; note: string };

const CUSTOM_KEY = "rinjani-custom-pins";

const BASES = [
  {
    id: "streets",
    en: "Streets",
    idn: "Jalan",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
  },
  {
    id: "satellite",
    en: "Satellite",
    idn: "Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  {
    id: "topo",
    en: "Topography",
    idn: "Topografi",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap",
  },
] as const;

function loadPins(): Pin[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as Pin[]) : [];
  } catch {
    return [];
  }
}

export function OneMap({ initial }: { initial: string }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const libRef = useRef<any>(null);
  const tileRef = useRef<any>(null);
  const drawn = useRef<any[]>([]);
  const boundaryRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [catalogQuery, setCatalogQuery] = useState("");
  const opacity = 0.85;
  const [panel, setPanel] = useState(true);
  const [catalog, setCatalog] = useState(false);
  const [base, setBase] = useState<(typeof BASES)[number]["id"]>("streets");
  const [uploads, setUploads] = useState<AgencyDataset[]>([]);
  const [on, setOn] = useState<Record<string, boolean>>(() => {
    const asked = initial
      .split(",")
      .map((s) => s.trim())
      .filter((id) => layerIds.includes(id));
    const active = new Set(asked.length ? asked : defaultLayerIds);
    return Object.fromEntries(layerIds.map((id) => [id, active.has(id)]));
  });
  const [atlas] = useState(true);
  const [pins, setPins] = useState<Pin[]>([]);
  const [draft, setDraft] = useState({ name: "", lat: "-8.411", lng: "116.458", note: "" });
  const t = useT();
  const { lang } = useLang();

  useEffect(() => {
    setPins(loadPins());
    const rows = loadUploads();
    setUploads(rows);
    const asked = new Set(
      initial
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    );
    setOn((prev) => {
      const next = { ...prev };
      for (const row of rows) if (asked.has(row.id)) next[row.id] = true;
      return next;
    });
  }, [initial]);

  useEffect(() => {
    if (!atlas) return;
    let dead = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (dead || !el.current || mapRef.current) return;
      const map = L.map(el.current, { zoomControl: true }).setView([-8.45, 116.42], 9);
      mapRef.current = map;
      libRef.current = L;
      setReady(true);
      requestAnimationFrame(() => map.invalidateSize());
    })();
    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [atlas]);

  useEffect(() => {
    const map = mapRef.current;
    const L = libRef.current;
    if (!map || !L || !ready) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const spec = BASES.find((item) => item.id === base) ?? BASES[0];
    const layer = L.tileLayer(spec.url, { attribution: spec.attribution, maxZoom: spec.id === "topo" ? 17 : 18 });
    layer.addTo(map);
    layer.bringToBack();
    tileRef.current = layer;
  }, [base, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = libRef.current;
    if (!map || !L) return;
    drawn.current.forEach((layer) => map.removeLayer(layer));
    drawn.current = [];
    const marker = (id: string) => pinIcon(L, id);

    for (const layer of mapLayers) {
      if (!on[layer.id] || layer.kind === "geojson") continue;
      const group = L.layerGroup();
      const needle = query.trim().toLowerCase();
      const layerHit = needle && `${layer.name} ${layer.group} ${layer.summary}`.toLowerCase().includes(needle);
      layer.points?.forEach((point) => {
        const hit = `${point.name} ${point.note}`.toLowerCase().includes(needle);
        if (needle && !layerHit && !hit) return;
        const name = lang === "id" && point.nameId ? point.nameId : point.name;
        const note = lang === "id" && point.noteId ? point.noteId : point.note;
        L.marker([point.lat, point.lng], { icon: marker(layer.pin || "star") })
          .bindPopup(`<strong>${escapeHtml(name)}</strong><br/>${escapeHtml(note)}`)
          .addTo(group);
      });
      layer.lines?.forEach((line) => {
        const name = lang === "id" && line.nameId ? line.nameId : line.name;
        const note = lang === "id" && line.noteId ? line.noteId : line.note;
        L.polyline(line.path, { color: layer.color, weight: 4, opacity })
          .bindPopup(`<strong>${escapeHtml(name)}</strong><br/>${escapeHtml(note)}`)
          .addTo(group);
      });
      layer.polygons?.forEach((poly) => {
        L.polygon(poly.ring, { color: layer.color, weight: 2, fillOpacity: 0.12 * opacity })
          .bindPopup(`<strong>${escapeHtml(poly.name)}</strong><br/>${escapeHtml(poly.note)}`)
          .addTo(group);
      });
      group.addTo(map);
      drawn.current.push(group);
    }

    for (const upload of uploads) {
      if (!on[upload.id] || !upload.points.length) continue;
      const group = L.layerGroup();
      upload.points.forEach((point) => {
        L.marker([point.lat, point.lng], { icon: marker(upload.pin) })
          .bindPopup(`<strong>${escapeHtml(point.name)}</strong><br/>${escapeHtml(point.note)}<br/><em>${escapeHtml(upload.title)}</em>`)
          .addTo(group);
      });
      group.addTo(map);
      drawn.current.push(group);
    }

    if (pins.length) {
      const group = L.layerGroup();
      pins.forEach((pin) => {
        L.marker([pin.lat, pin.lng], { icon: marker("flag") })
          .bindPopup(`<strong>${escapeHtml(pin.name)}</strong><br/>${escapeHtml(pin.note)}<br/><em>${lang === "id" ? "Ditambah di meja ini" : "Added on this desk"}</em>`)
          .addTo(group);
      });
      group.addTo(map);
      drawn.current.push(group);
    }
  }, [on, pins, ready, query, lang, uploads]);

  useEffect(() => {
    const map = mapRef.current;
    const L = libRef.current;
    if (!map || !L || !ready) return;
    if (!on.boundary) {
      if (boundaryRef.current) {
        map.removeLayer(boundaryRef.current);
        boundaryRef.current = null;
      }
      return;
    }
    let dead = false;
    const url = mapLayers.find((layer) => layer.id === "boundary")?.geojson;
    if (!url) return;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (dead) return;
        if (boundaryRef.current) map.removeLayer(boundaryRef.current);
        const layer = L.geoJSON(data, {
          style: { color: "#27466b", weight: 2, fillColor: "#4c7fb4", fillOpacity: 0.08 },
          onEachFeature: (feature: { properties?: { Kab?: string } }, shape: { bindPopup: (html: string) => void }) => {
            const name = feature.properties?.Kab || (lang === "id" ? "Batas kawasan" : "Geopark area");
            shape.bindPopup(`<strong>${lang === "id" ? "Batas geopark" : "Geopark boundary"}</strong><br/>${escapeHtml(String(name))}`);
          },
        });
        layer.addTo(map);
        boundaryRef.current = layer;
      })
      .catch(() => undefined);
    return () => {
      dead = true;
    };
  }, [on.boundary, ready, lang]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    const published = mapLayers
      .flatMap((layer) => (layer.points ?? []).map((point) => ({ ...point, layerId: layer.id })))
      .filter((point) => `${point.name} ${point.note}`.toLowerCase().includes(needle));
    const added = uploads
      .flatMap((upload) => upload.points.map((point) => ({ ...point, id: `${upload.id}-${point.name}`, layerId: upload.id, nameId: undefined, noteId: undefined })))
      .filter((point) => `${point.name} ${point.note}`.toLowerCase().includes(needle));
    return [...published, ...added].slice(0, 8);
  }, [query, uploads]);

  function showHit(hit: { layerId: string; lat: number; lng: number }) {
    setOn((prev) => ({ ...prev, [hit.layerId]: true }));
    mapRef.current?.setView([hit.lat, hit.lng], 12);
  }

  function toggle(id: string) {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addPin(e: React.FormEvent) {
    e.preventDefault();
    const lat = Number(draft.lat);
    const lng = Number(draft.lng);
    if (!draft.name.trim() || Number.isNaN(lat) || Number.isNaN(lng)) return;
    const next = [...pins, { id: crypto.randomUUID(), name: draft.name.trim(), lat, lng, note: draft.note.trim() }];
    setPins(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    setDraft({ name: "", lat: draft.lat, lng: draft.lng, note: "" });
    mapRef.current?.setView([lat, lng], 12);
  }

  const groups = [...new Set(mapLayers.map((layer) => layer.group))];

  return (
    <div className="relative h-[calc(100dvh-6.5rem)] min-h-[28rem] flex-1">
      <div ref={el} className="absolute inset-0" />
      <div className={`${panel ? "flex" : "hidden"} absolute top-3 left-3 z-[500] max-h-[calc(100%-1.5rem)] w-[min(100%-1.5rem,22rem)] flex-col overflow-hidden rounded-2xl bg-paper shadow-lg ring-1 ring-line lg:flex`}>
        <div className="space-y-3 overflow-y-auto p-4">
          <div>
            <p className="text-xs font-bold tracking-wide text-brand-700">{t("ONE MAP", "SATU PETA")}</p>
            <p className="text-lg font-extrabold">Rinjani OneMap</p>
          <button
            type="button"
            onClick={() => setCatalog(true)}
            className="h-11 w-full rounded-full bg-brand-900 text-sm font-semibold text-paper"
          >
            {t("Open the map catalogue", "Buka katalog peta")}
          </button>
          </div>
          <label className="flex h-11 items-center border-b border-ink">
            <span className="sr-only">{t("Find a place", "Cari lokasi")}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Find a place", "Cari lokasi")}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          {hits.length > 0 && (
            <ul className="max-h-32 space-y-1 overflow-y-auto">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button type="button" className="flex min-h-11 w-full items-center rounded-lg px-1 text-left text-sm hover:bg-pumice" onClick={() => showHit(hit)}>
                    {hit.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-bold tracking-wide text-ink-soft">{t(group, mapLayers.find((layer) => layer.group === group)?.groupId ?? group)}</p>
              <ul className="mt-1">
                {mapLayers
                  .filter((layer) => layer.group === group)
                  .map((layer) => (
                    <li key={layer.id}>
                      <label className="flex min-h-11 items-center gap-3 text-sm">
                        <input type="checkbox" className="h-4 w-4" checked={!!on[layer.id]} onChange={() => toggle(layer.id)} />
                        {getPin(layer.pin || "star").img ? (
                          <img src={getPin(layer.pin || "star").img} alt="" className="h-6 w-6 object-contain" />
                        ) : (
                          <span className="h-3 w-3 rounded-full" style={{ background: getPin(layer.pin || "star").gradEnd }} />
                        )}
                        <span className="font-semibold">{t(layer.name, layer.nameId ?? layer.name)}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          {uploads.some((upload) => upload.points.length) && (
            <div>
              <p className="text-xs font-bold tracking-wide text-ink-soft">{t("Agency data", "Data instansi")}</p>
              <ul className="mt-1">
                {uploads
                  .filter((upload) => upload.points.length)
                  .map((upload) => (
                    <li key={upload.id}>
                      <label className="flex min-h-11 items-center gap-3 text-sm">
                        <input type="checkbox" className="h-4 w-4" checked={!!on[upload.id]} onChange={() => toggle(upload.id)} />
                        <PinMark id={upload.pin} />
                        <span className="font-semibold">{upload.title}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <form onSubmit={addPin} className="space-y-2 border-t border-line pt-3">
            <p className="text-sm font-extrabold">{t("Add a pin", "Tambah titik")}</p>
            <input className="h-11 w-full rounded-lg border border-line px-3" placeholder={t("Name", "Nama")} aria-label={t("Pin name", "Nama titik")} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-11 rounded-lg border border-line px-3" aria-label={t("Latitude", "Lintang")} value={draft.lat} onChange={(e) => setDraft({ ...draft, lat: e.target.value })} />
              <input className="h-11 rounded-lg border border-line px-3" aria-label={t("Longitude", "Bujur")} value={draft.lng} onChange={(e) => setDraft({ ...draft, lng: e.target.value })} />
            </div>
            <button type="submit" className="h-11 w-full rounded-full bg-brand-900 text-sm font-semibold text-paper">
              {t("Save on this map", "Simpan di peta ini")}
            </button>
          </form>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-[500] flex gap-2">
        <button
          type="button"
          onClick={() => setCatalog(true)}
          className="h-11 rounded-full bg-brand-900 px-4 text-sm font-semibold text-paper shadow"
        >
          {t("Catalogue", "Katalog")}
        </button>
        <button
          type="button"
          className="h-11 rounded-full bg-paper px-4 text-sm font-semibold shadow ring-1 ring-line lg:hidden"
          onClick={() => setPanel((value) => !value)}
        >
          {panel ? t("Hide", "Tutup") : t("Layers", "Lapisan")}
        </button>
      </div>
      {catalog && (
        <MapCatalogue
          base={base}
          onBase={setBase}
          on={on}
          toggle={toggle}
          uploads={uploads}
          query={catalogQuery}
          setQuery={setCatalogQuery}
          onClose={() => setCatalog(false)}
          t={t}
        />
      )}
    </div>
  );
}
function PinMark({ id }: { id: string }) {
  const pin = getPin(id);
  if (pin.img) return <img src={pin.img} alt="" className="h-6 w-6 object-contain" />;
  return <span className="inline-block h-3 w-3 rounded-full" style={{ background: pin.gradEnd }} />;
}

function MapCatalogue({
  base,
  onBase,
  on,
  toggle,
  uploads,
  query,
  setQuery,
  onClose,
  t,
}: {
  base: (typeof BASES)[number]["id"];
  onBase: (id: (typeof BASES)[number]["id"]) => void;
  on: Record<string, boolean>;
  toggle: (id: string) => void;
  uploads: AgencyDataset[];
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
  t: (en: string, id: string) => string;
}) {
  const needle = query.trim().toLowerCase();
  const layers = mapLayers.filter((layer) => !needle || `${layer.name} ${layer.nameId ?? ""} ${layer.summary} ${layer.group}`.toLowerCase().includes(needle));
  const agency = uploads.filter((upload) => upload.points.length && (!needle || `${upload.title} ${upload.org} ${upload.summary}`.toLowerCase().includes(needle)));

  return (
    <div className="absolute inset-0 z-[800] flex items-end justify-center bg-ink/50 p-3 sm:items-center">
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-paper shadow-lg" role="dialog" aria-modal="true" aria-label={t("Map catalogue", "Katalog peta")}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-bold tracking-wide text-brand-700">{t("MAP CATALOGUE", "KATALOG PETA")}</p>
            <h2 className="text-2xl font-extrabold">{t("Choose what sits on the map", "Pilih yang menempel di peta")}</h2>
          </div>
          <button type="button" onClick={onClose} className="h-11 shrink-0 rounded-full px-4 text-sm font-semibold ring-1 ring-line">
            {t("Close", "Tutup")}
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <label className="block border-b border-ink">
            <span className="sr-only">{t("Search the catalogue", "Cari di katalog")}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search layers and agency datasets", "Cari lapisan dan data instansi")}
              className="h-12 w-full bg-transparent outline-none"
            />
          </label>

          <p className="mt-6 text-xs font-bold tracking-wide text-ink-soft">{t("BASE MAP", "PETA DASAR")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {BASES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onBase(item.id)}
                className={`min-h-24 rounded-2xl p-4 text-left ring-1 ${base === item.id ? "bg-brand-900 text-paper ring-brand-900" : "ring-line hover:bg-pumice"}`}
              >
                <span className="block text-lg font-extrabold">{t(item.en, item.idn)}</span>
                <span className={`mt-1 block text-xs ${base === item.id ? "text-paper/70" : "text-ink-soft"}`}>{item.attribution.replace("&copy;", "©")}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs font-bold tracking-wide text-ink-soft">{t("PUBLISHED LAYERS", "LAPISAN TERBIT")}</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {layers.map((layer) => (
              <li key={layer.id} className="flex items-center gap-3 py-3">
                <PinMark id={layer.pin || (layer.kind === "lines" ? "leaf" : "star")} />
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">{t(layer.name, layer.nameId ?? layer.name)}</p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {layer.group} · {layer.points?.length ?? layer.lines?.length ?? (layer.kind === "geojson" ? t("boundary file", "berkas batas") : "")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(layer.id)}
                  className={`h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${on[layer.id] ? "bg-brand-900 text-paper" : "bg-pumice"}`}
                >
                  {on[layer.id] ? t("On the map", "Di peta") : t("Add", "Tambah")}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs font-bold tracking-wide text-ink-soft">{t("AGENCY DATASETS", "DATA INSTANSI")}</p>
          {agency.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {t(
                "A point file published from OneData appears here with its own pin. Charts stay in the data catalogue.",
                "Berkas titik yang terbit dari Satu Data muncul di sini dengan pinnya sendiri. Grafik tetap di katalog data.",
              )}{" "}
              <a className="font-semibold text-brand-800" href="/data#publish">
                {t("Publish a dataset", "Terbitkan data")}
              </a>
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {agency.map((upload) => (
                <li key={upload.id} className="flex items-center gap-3 py-3">
                  <span className="origin-center scale-90" dangerouslySetInnerHTML={{ __html: pinHtml(upload.pin) }} />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold">{upload.title}</p>
                    <p className="text-sm text-ink-soft">
                      {upload.org} · {upload.points.length} {t("places", "lokasi")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(upload.id)}
                    className={`h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${on[upload.id] ? "bg-brand-900 text-paper" : "bg-pumice"}`}
                  >
                    {on[upload.id] ? t("On the map", "Di peta") : t("Add", "Tambah")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const gt = "&" + "gt;";
  const quot = "&" + "quot;";
  const apos = "&" + "#39;";
  return value
    .replaceAll("&", amp)
    .replaceAll("<", lt)
    .replaceAll(">", gt)
    .replaceAll(String.fromCharCode(34), quot)
    .replaceAll(String.fromCharCode(39), apos);
}
