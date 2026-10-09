import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { agencyPinIds, getPin, pinHtml } from "@/lib/pins";
import { parseTableFile, publishUpload, type ParsedFile } from "@/lib/uploads";
import { useT } from "@/lib/i18n";

const ERRORS: Record<string, [string, string]> = {
  empty: ["The file is empty.", "Berkasnya kosong."],
  header: ["Need a header row and at least one data row.", "Perlu baris judul kolom dan sedikitnya satu baris data."],
  json: ["That JSON could not be read.", "JSON itu tidak terbaca."],
  geo: ["GeoJSON needs a FeatureCollection of Points, with name in properties.", "GeoJSON perlu FeatureCollection berisi Point, dengan name di properties."],
  coords: ["Latitude and longitude columns were found, but no row had a usable pair of numbers.", "Kolom lintang dan bujur ada, tetapi tidak ada baris dengan pasangan angka yang sah."],
  values: ["Label and value columns were found, but no row had a number.", "Kolom label dan nilai ada, tetapi tidak ada baris yang berisi angka."],
};

export function PublishDesk({ onPublished }: { onPublished?: () => void }) {
  const t = useT();
  const navigate = useNavigate();
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [summary, setSummary] = useState("");
  const [pin, setPin] = useState("star");

  function takeFile(file: File | undefined) {
    setError("");
    setParsed(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = parseTableFile(String(reader.result ?? ""), file.name);
        setParsed(next);
        if (!title) setTitle(file.name.replace(/\.(csv|json|geojson)$/i, ""));
        if (next.kind === "points") setPin("star");
      } catch (reason) {
        const key = reason instanceof Error ? reason.message : "empty";
        const pair = ERRORS[key] ?? ERRORS.empty;
        setError(t(pair[0], pair[1]));
      }
    };
    reader.readAsText(file);
  }

  function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!parsed || title.trim().length < 3) return;
    const saved = publishUpload({ title, org, summary, pin: parsed.kind === "points" ? pin : "book", parsed });
    onPublished?.();
    navigate({ to: "/data/$slug", params: { slug: saved.id } });
  }

  return (
    <section id="publish" className="scroll-mt-24 rounded-3xl bg-pumice p-5 sm:p-8">
      <p className="text-xs font-bold tracking-wide text-brand-700">{t("AGENCY DESK", "MEJA INSTANSI")}</p>
      <h2 className="mt-2 text-3xl font-extrabold">{t("Publish a dataset", "Terbitkan data")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {t(
          "The file stays in this browser until an agency server is connected. The columns decide what we can draw. Anything else is kept as a table and is not charted.",
          "Berkas tersimpan di peramban ini sampai server instansi tersambung. Kolom yang menentukan apa yang bisa digambar. Selain itu disimpan sebagai tabel dan tidak dibuat grafik.",
        )}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-paper p-5 ring-1 ring-line">
          <h3 className="font-extrabold">{t("To draw a map", "Untuk menggambar peta")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t("CSV or GeoJSON. Each place needs a name and coordinates. A note is optional.", "CSV atau GeoJSON. Setiap tempat perlu nama dan koordinat. Catatan boleh kosong.")}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><span className="font-semibold">name</span> <span className="text-ink-soft">{t("or nama", "atau nama")}</span></li>
            <li><span className="font-semibold">latitude</span> <span className="text-ink-soft">{t("or lat, lintang", "atau lat, lintang")}</span></li>
            <li><span className="font-semibold">longitude</span> <span className="text-ink-soft">{t("or lng, lon, bujur", "atau lng, lon, bujur")}</span></li>
            <li><span className="font-semibold">note</span> <span className="text-ink-soft">{t("optional, or catatan", "opsional, atau catatan")}</span></li>
          </ul>
          <a className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-800" href="/templates/points.csv">
            {t("Download a point template", "Unduh contoh titik")}
          </a>
        </article>
        <article className="rounded-2xl bg-paper p-5 ring-1 ring-line">
          <h3 className="font-extrabold">{t("To draw a chart", "Untuk menggambar grafik")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t("CSV with one label column and one numeric column. Up to 500 rows.", "CSV dengan satu kolom label dan satu kolom angka. Paling banyak 500 baris.")}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><span className="font-semibold">label</span> <span className="text-ink-soft">{t("or kategori, nama", "atau kategori, nama")}</span></li>
            <li><span className="font-semibold">value</span> <span className="text-ink-soft">{t("or nilai, jumlah", "atau nilai, jumlah")}</span></li>
          </ul>
          <a className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-800" href="/templates/chart.csv">
            {t("Download a chart template", "Unduh contoh grafik")}
          </a>
        </article>
      </div>

      <form onSubmit={publish} className="mt-6 space-y-4">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 text-center">
          <span className="text-sm font-semibold">{t("Choose a CSV, JSON, or GeoJSON file", "Pilih berkas CSV, JSON, atau GeoJSON")}</span>
          <span className="mt-1 text-xs text-ink-soft">{t("Comma or semicolon. A header row is required for CSV.", "Koma atau titik koma. CSV wajib punya baris judul.")}</span>
          <input
            type="file"
            accept=".csv,.json,.geojson,text/csv,application/json"
            className="sr-only"
            onChange={(event) => takeFile(event.target.files?.[0])}
          />
        </label>
        {error && <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>}
        {parsed && (
          <>
            <p className="text-sm font-semibold">
              {parsed.kind === "points"
                ? t(`${parsed.points.length} places, ready for the map.`, `${parsed.points.length} tempat, siap untuk peta.`)
                : parsed.kind === "chart"
                  ? t(`${parsed.series.length} rows, ready as a chart.`, `${parsed.series.length} baris, siap sebagai grafik.`)
                  : t("No coordinates and no numeric column. This will stay a table.", "Tidak ada koordinat dan tidak ada kolom angka. Ini tetap tabel.")}
              {parsed.warning === "capped" ? t(" Only the first 500 rows are kept.", " Hanya 500 baris pertama yang disimpan.") : ""}
            </p>
            <div className="overflow-x-auto rounded-2xl bg-paper ring-1 ring-line">
              <table className="w-full min-w-[20rem] text-left text-sm">
                <thead className="bg-pumice-deep text-ink-soft">
                  <tr>
                    {parsed.headers.map((header) => (
                      <th key={header} className="px-3 py-2 font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 4).map((row, index) => (
                    <tr key={index} className="border-t border-line">
                      {parsed.headers.map((header, cell) => (
                        <td key={header} className="px-3 py-2">{row[cell]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {t("Title", "Judul")}
                <input required minLength={3} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-3 font-normal" />
              </label>
              <label className="text-sm font-semibold">
                {t("Office", "Instansi")}
                <input value={org} onChange={(event) => setOrg(event.target.value)} placeholder={t("Who publishes this", "Siapa yang menerbitkan")} className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-3 font-normal" />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              {t("What it is", "Apa isinya")}
              <input value={summary} onChange={(event) => setSummary(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-3 font-normal" />
            </label>
            {parsed.kind === "points" && (
              <fieldset>
                <legend className="text-sm font-semibold">{t("Pin for this dataset", "Pin untuk data ini")}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agencyPinIds.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPin(id)}
                      className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl ring-1 ${pin === id ? "bg-brand-900 text-paper ring-brand-900" : "bg-paper ring-line"}`}
                      aria-pressed={pin === id}
                    >
                      <span className="scale-75" dangerouslySetInnerHTML={{ __html: pinHtml(id) }} />
                      <span className="sr-only">{t(getPin(id).en, getPin(id).idn)}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <button type="submit" className="h-12 rounded-full bg-brand-900 px-6 text-sm font-semibold text-paper">
              {t("Publish to this desk", "Terbitkan di meja ini")}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
