import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DATA_NOTE, DATA_NOTE_ID, getDataset, seriesLabel, shownSummary, shownTitle } from "@/lib/datasets";
import { SeriesChart } from "@/components/series-chart";
import { useLang, useT } from "@/lib/i18n";
import { pinHtml } from "@/lib/pins";
import { getUpload, removeUpload, type AgencyDataset } from "@/lib/uploads";

export const Route = createFileRoute("/_app/data/$slug")({
  component: DatasetPage,
});

const TOPIC: Record<string, [string, string]> = {
  Geopark: ["Geopark", "Geopark"],
  Pariwisata: ["Tourism", "Pariwisata"],
  Kebencanaan: ["Disaster", "Kebencanaan"],
  "Lingkungan Hidup": ["Environment", "Lingkungan Hidup"],
};

function DatasetPage() {
  const { slug } = Route.useParams();
  const dataset = getDataset(slug);
  const t = useT();
  const { lang } = useLang();
  const [upload, setUpload] = useState<AgencyDataset | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUpload(getUpload(slug) ?? null);
    setReady(true);
  }, [slug]);

  if (!dataset && slug.startsWith("up-") && !ready) {
    return <div className="min-h-40" />;
  }

  if (!dataset && upload) return <AgencyPage upload={upload} />;
  if (!dataset) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">
          {slug.startsWith("up-")
            ? t("That file is not in this browser", "Berkas itu tidak ada di peramban ini")
            : t("Dataset not in the catalogue", "Data tidak ada di katalog")}
        </h1>
        <Link to="/data" className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand-700">
          {t("Back to OneData", "Kembali ke Satu Data")}
        </Link>
      </div>
    );
  }

  const title = shownTitle(dataset, lang);
  const summary = shownSummary(dataset, lang);
  const topic = TOPIC[dataset.category] ?? [dataset.category, dataset.category];
  const unit = t(dataset.unit ?? "See source table", dataset.unit === "locations" ? "lokasi" : "Lihat tabel sumber");
  const updated = t(dataset.updated, dataset.updated === "Map extract" ? "Ekstrak peta" : dataset.updated);
  const series = dataset.series?.map((row) => ({ ...row, label: seriesLabel(row.label, lang) }));

  function download() {
    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${dataset!.slug}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link to="/data" className="text-sm font-semibold text-brand-700">
        {t("OneData", "Satu Data")}
      </Link>
      <p className="mt-4 text-xs font-bold tracking-wide text-brand-700">
        {t(topic[0], topic[1])} · {dataset.org}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight">{title}</h1>
        {dataset.series ? (
          <button type="button" onClick={download} className="inline-flex h-11 items-center rounded-full bg-brand-900 px-5 text-sm font-semibold text-paper">
            {t("Download JSON", "Unduh JSON")}
          </button>
        ) : (
          <a href={dataset.href} className="inline-flex h-11 items-center rounded-full bg-brand-900 px-5 text-sm font-semibold text-paper">
            {t("Open on Satu Data NTB", "Buka di Satu Data NTB")}
          </a>
        )}
      </div>
      <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{summary}</p>
      {dataset.series && <p className="mt-3 text-sm text-ink-soft">{t(DATA_NOTE, DATA_NOTE_ID)}</p>}

      <div className="mt-8 grid gap-px bg-line sm:grid-cols-3">
        <Meta label={t("Updated", "Diperbarui")} value={updated} />
        <Meta label={t("Unit", "Satuan")} value={unit} />
        <Meta label={t("Source", "Sumber")} value={dataset.source} />
      </div>

      {series ? (
        <>
          <div className="mt-8 bg-paper p-4 ring-1 ring-line">
            <SeriesChart data={series} unit={unit} />
          </div>
          <div className="mt-6 overflow-x-auto ring-1 ring-line">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <thead className="bg-pumice text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("Label", "Label")}</th>
                  <th className="px-4 py-3 font-semibold">{t("Value", "Nilai")}</th>
                </tr>
              </thead>
              <tbody>
                {series.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">
                      {row.value} {dataset.unit === "locations" ? unit : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-8 bg-pumice p-6">
          <p className="font-extrabold">{t("The table is not copied here", "Tabelnya tidak disalin ke sini")}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {t(
              "Satu Data NTB remains the publisher. This card is the Rinjani shelf for that dataset, so the portal can be searched without inventing a second set of numbers.",
              "Satu Data NTB tetap penerbitnya. Kartu ini adalah rak Rinjani untuk data itu, agar portal bisa dicari tanpa mengarang angka kedua.",
            )}
          </p>
          <a href={dataset.href} className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand-800">
            {dataset.href}
          </a>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-pumice p-4">
      <p className="text-xs font-semibold text-ink-soft">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function AgencyPage({ upload }: { upload: AgencyDataset }) {
  const t = useT();
  const navigate = useNavigate();

  function remove() {
    removeUpload(upload.id);
    navigate({ to: "/data" });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link to="/data" className="text-sm font-semibold text-brand-700">
        {t("OneData", "Satu Data")}
      </Link>
      <p className="mt-4 text-xs font-bold tracking-wide text-brand-700">
        {upload.org} · {upload.kind === "points" ? t("Map", "Peta") : upload.kind === "chart" ? t("Chart", "Grafik") : t("Table", "Tabel")}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight">{upload.title}</h1>
        {upload.kind === "points" ? (
          <a href={`/map?layers=${upload.id}`} className="inline-flex h-11 items-center rounded-full bg-brand-900 px-5 text-sm font-semibold text-paper">
            {t("Open on the map", "Buka di peta")}
          </a>
        ) : null}
      </div>
      {upload.summary && <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{upload.summary}</p>}
      <p className="mt-3 text-sm text-ink-soft">
        {t("Saved in this browser, not on an agency server.", "Tersimpan di peramban ini, bukan di server instansi.")}
      </p>
      {upload.kind === "points" && (
        <p className="mt-4 flex items-center gap-3 text-sm font-semibold">
          <span className="inline-block" dangerouslySetInnerHTML={{ __html: pinHtml(upload.pin) }} />
          {t("This dataset uses its own pin.", "Data ini memakai pinnya sendiri.")}
        </p>
      )}
      {upload.kind === "chart" && (
        <div className="mt-8 rounded-2xl bg-paper p-4 ring-1 ring-line">
          <SeriesChart data={upload.series} unit="" />
        </div>
      )}
      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-line">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <thead className="bg-pumice text-ink-soft">
            <tr>
              {upload.headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(upload.kind === "points" ? upload.points.map((point) => [point.name, String(point.lat), String(point.lng), point.note]) : upload.kind === "chart" ? upload.series.map((row) => [row.label, String(row.value)]) : upload.rows).map((row, index) => (
              <tr key={index} className="border-t border-line">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={remove} className="mt-6 h-11 rounded-full px-5 text-sm font-semibold text-danger ring-1 ring-danger">
        {t("Remove from this browser", "Hapus dari peramban ini")}
      </button>
    </div>
  );
}
