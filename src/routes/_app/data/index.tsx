import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PhotoHero } from "@/components/landscape";
import { PublishDesk } from "@/components/publish-desk";
import { DATA_NOTE, DATA_NOTE_ID, categories, datasets, orgs, seriesLabel, shownSummary, shownTitle } from "@/lib/datasets";
import { useLang, useT } from "@/lib/i18n";
import { midasSites } from "@/lib/midas-sites";
import { loadUploads, type AgencyDataset } from "@/lib/uploads";

const TOPIC: Record<string, string> = {
  Geopark: "Geopark",
  Pariwisata: "Pariwisata",
  Kebencanaan: "Kebencanaan",
  "Lingkungan Hidup": "Lingkungan Hidup",
};

const TOPIC_EN: Record<string, string> = {
  Geopark: "Geopark",
  Pariwisata: "Tourism",
  Kebencanaan: "Disaster",
  "Lingkungan Hidup": "Environment",
};

export const Route = createFileRoute("/_app/data/")({
  component: DataHome,
});

function DataHome() {
  const t = useT();
  const { lang } = useLang();
  const [uploads, setUploads] = useState<AgencyDataset[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setUploads(loadUploads());
  }, []);
  const [org, setOrg] = useState("All organisations");
  const [category, setCategory] = useState("All");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return datasets.filter((dataset) => {
      if (org !== "All organisations" && dataset.org !== org) return false;
      if (category !== "All" && dataset.category !== category) return false;
      if (!needle) return true;
      return `${shownTitle(dataset, "en")} ${shownTitle(dataset, "id")} ${shownSummary(dataset, "en")} ${shownSummary(dataset, "id")} ${dataset.tags.join(" ")} ${dataset.org}`
        .toLowerCase()
        .includes(needle);
    });
  }, [q, org, category]);

  const drawn = rows.filter((dataset) => dataset.series);
  const linked = rows.filter((dataset) => !dataset.series);

  return (
    <div>
      <PhotoHero
        compact
        image="https://rinjanilombok.org/images/photos/caldera-segara-anak.webp"
        alt={t("Segara Anak inside the Samalas caldera", "Segara Anak di dalam kaldera Samalas")}
        kicker="RINJANI ONEDATA"
        title={t("Data for this landscape", "Data untuk bentang ini")}
        lede={t(
          "Province tables stay on Satu Data NTB. Charts here count the published map. An office can add its own file if the columns match the desk below.",
          "Tabel provinsi tetap di Satu Data NTB. Grafik di sini menghitung peta yang sudah terbit. Instansi dapat menambah berkasnya sendiri bila kolomnya sesuai meja di bawah.",
        )}
        caption={t("Segara Anak, the Samalas caldera", "Segara Anak, kaldera Samalas")}
      />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <dl className="grid gap-8 sm:grid-cols-3">
          {[
            [String(datasets.length + uploads.length), t("Datasets on this shelf", "Data di rak ini")],
            [String(midasSites.length), t("Places in the map database", "Lokasi di basis data peta")],
            [String(orgs.length), t("Publishing offices", "Instansi penerbit")],
          ].map(([value, label]) => (
            <div key={label} className="border-t-4 border-brand-500 pt-4">
              <dd className="text-4xl font-extrabold tracking-tight tabular-nums">{value}</dd>
              <dt className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{label}</dt>
            </div>
          ))}
        </dl>

        <label className="mt-12 block border-b-2 border-ink">
          <span className="sr-only">{t("Search datasets", "Cari data")}</span>
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("Search rainfall, tourism, geosites", "Cari hujan, pariwisata, geosite")}
            className="h-14 w-full bg-transparent text-lg outline-none placeholder:text-ink-soft"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          <Topic name={t("All", "Semua")} active={category === "All"} onClick={() => setCategory("All")} />
          {categories.map((name) => (
            <Topic
              key={name}
              name={t(TOPIC_EN[name] ?? name, TOPIC[name] ?? name)}
              active={category === name}
              onClick={() => setCategory(name)}
            />
          ))}
        </div>

        <label className="mt-6 block max-w-sm">
          <span className="text-xs font-bold tracking-wide text-ink-soft">{t("Organisation", "Organisasi")}</span>
          <select
            className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-3"
            value={org}
            onChange={(event) => setOrg(event.target.value)}
            aria-label={t("Organisation", "Organisasi")}
          >
            <option value="All organisations">{t("All organisations", "Semua organisasi")}</option>
            {orgs.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">{t(DATA_NOTE, DATA_NOTE_ID)}</p>

        {drawn.length > 0 && (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {drawn.map((dataset) => (
              <Link key={dataset.slug} to="/data/$slug" params={{ slug: dataset.slug }} className="rounded-2xl bg-pumice p-6 hover:bg-brand-50">
                <p className="text-xs font-bold tracking-wide text-brand-700">
                  {t(TOPIC_EN[dataset.category] ?? dataset.category, TOPIC[dataset.category] ?? dataset.category)} · {dataset.org}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">{shownTitle(dataset, lang)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{shownSummary(dataset, lang)}</p>
                <Bars series={dataset.series ?? []} lang={lang} />
              </Link>
            ))}
          </div>
        )}

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {linked.map((dataset) => (
            <li key={dataset.slug}>
              <Link to="/data/$slug" params={{ slug: dataset.slug }} className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <p className="text-xs font-bold tracking-wide text-brand-700">
                  {t(TOPIC_EN[dataset.category] ?? dataset.category, TOPIC[dataset.category] ?? dataset.category)}
                </p>
                <span>
                  <h2 className="text-xl font-extrabold">{shownTitle(dataset, lang)}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{shownSummary(dataset, lang)}</p>
                  <p className="mt-2 text-xs font-semibold text-ink-soft">{dataset.org} · Satu Data NTB</p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="mt-8 text-ink-soft">{t("Nothing matched.", "Tidak ada yang cocok.")}</p>}
        {uploads.length > 0 && (
          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line">
            {uploads.map((upload) => (
              <li key={upload.id}>
                <Link to="/data/$slug" params={{ slug: upload.id }} className="block px-4 py-5 hover:bg-brand-50">
                  <p className="text-xs font-bold tracking-wide text-brand-700">
                    {upload.org} · {upload.kind === "points" ? t("Map", "Peta") : upload.kind === "chart" ? t("Chart", "Grafik") : t("Table", "Tabel")}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold">{upload.title}</h2>
                  <p className="mt-2 text-sm text-ink-soft">{upload.summary || t("Published from this browser.", "Terbit dari peramban ini.")}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <PublishDesk onPublished={() => setUploads(loadUploads())} />
        </div>
      </section>
    </div>
  );
}

function Bars({ series, lang }: { series: { label: string; value: number }[]; lang: "en" | "id" }) {
  const max = Math.max(...series.map((row) => row.value), 1);
  return (
    <ul className="mt-6 space-y-2">
      {series.slice(0, 6).map((row) => (
        <li key={row.label} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3 text-xs">
          <span className="truncate font-semibold">{seriesLabel(row.label, lang)}</span>
          <span className="h-2 rounded-full bg-paper">
            <span className="block h-2 rounded-full bg-brand-700" style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
          </span>
          <span className="text-right font-bold tabular-nums">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Topic({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-full px-4 text-sm font-semibold ${active ? "bg-brand-900 text-paper" : "bg-pumice text-ink"}`}
    >
      {name}
    </button>
  );
}
