import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhotoHero } from "@/components/landscape";
import { audiences, events, news, support, warnings, type Audience } from "@/lib/desk";
import { useT } from "@/lib/i18n";
import { midasSites } from "@/lib/midas-sites";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const WHO_PHOTO: Record<Audience, string> = {
  residents: "https://rinjanilombok.org/images/photos/senaru-village.webp",
  visitors: "https://rinjanilombok.org/images/photos/sembalun-ridges.webp",
  businesses: "https://rinjanilombok.org/images/photos/sembalun-traditional-houses.webp",
  investors: "https://rinjanilombok.org/images/photos/malimbu-coast.webp",
};

function DashboardPage() {
  const t = useT();
  const [who, setWho] = useState<Audience>("residents");
  const whoId: Record<Audience, { label: string; line: string }> = {
    residents: { label: "Warga", line: "Layanan, peringatan, dan tahun ajaran di tempat tinggal Anda." },
    visitors: { label: "Pengunjung", line: "Status jalur, yang dibuka, dan cara melapor." },
    businesses: { label: "Usaha", line: "Kamar, aturan sampah, dan kursus bagi tuan rumah." },
    investors: { label: "Calon mitra", line: "Apa yang sudah ada di bentang ini, dan kepada siapa menulis." },
  };

  return (
    <div>
      <PhotoHero
        image="https://rinjanilombok.org/images/photos/segara-anak-barujari.webp"
        alt={t("Barujari cone in Segara Anak", "Kerucut Barujari di Segara Anak")}
        kicker="DASHBOARD RINJANI"
        title={t("What is happening on the mountain", "Apa yang terjadi di gunung")}
        lede={t(
          "News, warnings, and the next useful step. Counts below are the published map catalogue, not a new official statistic.",
          "Kabar, peringatan, dan langkah berikutnya. Angka di bawah adalah katalog peta yang sudah terbit, bukan statistik resmi baru.",
        )}
        caption={t("Barujari, inside the caldera", "Barujari, di dalam kaldera")}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [String(midasSites.length), t("Places", "Lokasi"), t("In the MIDAS Map database.", "Di basis data peta MIDAS.")],
            [String(midasSites.filter((site) => site.category === "Geological Site").length), t("Geological", "Geologi"), t("Geological sites.", "Situs geologi.")],
            [String(midasSites.filter((site) => site.category === "Natural Site").length), t("Natural", "Alam"), t("Forest, park, water.", "Hutan, taman, air.")],
            [String(midasSites.filter((site) => site.category === "Cultural Site").length), t("Cultural", "Budaya"), t("Village and heritage.", "Desa dan warisan.")],
          ].map(([value, label, note]) => (
            <div key={label} className="border-t-4 border-brand-500 pt-4">
              <dt className="text-sm text-ink-soft">{label}</dt>
              <dd className="mt-2 text-5xl font-extrabold tracking-tight tabular-nums">{value}</dd>
              <p className="mt-2 text-sm text-ink-soft">{note}</p>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <a href="/map" className="rounded-2xl bg-brand-900 p-5 text-paper">
            <p className="text-lg font-extrabold">{t("Map catalogue", "Katalog peta")}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper/80">
              {t("Streets, satellite, topography, and every layer you choose to stack.", "Jalan, satelit, topografi, dan setiap lapisan yang Anda tumpuk.")}
            </p>
          </a>
          <a href="/data#publish" className="rounded-2xl bg-pumice p-5">
            <p className="text-lg font-extrabold">{t("Publish a dataset", "Terbitkan data")}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {t("Points become a map with their own pin. A label and a number become a chart.", "Titik menjadi peta dengan pin sendiri. Label dan angka menjadi grafik.")}
            </p>
          </a>
          <a href="https://magma.esdm.go.id/v1/gunung-api/rinjani" className="rounded-2xl bg-warn-soft p-5">
            <p className="text-lg font-extrabold text-warn">{t("Volcano status", "Status gunung api")}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {t("This desk is not the warning. Confirm Gunung Rinjani on MAGMA.", "Meja ini bukan peringatan. Pastikan Gunung Rinjani di MAGMA.")}
            </p>
          </a>
        </div>

        <h2 className="mt-16 text-xs font-bold tracking-wide text-brand-700">{t("WHO IS READING", "SIAPA YANG MEMBACA")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setWho(item.id)}
              className={`relative isolate flex min-h-44 flex-col justify-end overflow-hidden rounded-2xl p-4 text-left ${who === item.id ? "ring-2 ring-brand-700" : ""}`}
            >
              <img src={WHO_PHOTO[item.id]} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
              <span className="card-shade absolute inset-0 -z-10" />
              <span className="text-lg font-extrabold text-paper">{t(item.label, whoId[item.id].label)}</span>
              <span className="mt-1 text-sm leading-snug text-paper/85">{t(item.line, whoId[item.id].line)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {support[who].map((card) => (
            <a key={card.title} href={card.href} className="border-t-4 border-brand-700 bg-pumice p-5 hover:bg-brand-50">
              <p className="text-lg font-extrabold">{t(card.title, card.titleId)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(card.body, card.bodyId)}</p>
            </a>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-extrabold">{t("Warnings", "Peringatan")}</h2>
            <ul className="mt-4 space-y-3">
              {warnings.map((item) => (
                <li key={item.title} className="border border-warn bg-warn-soft p-5">
                  <p className="text-xs font-bold tracking-wide text-warn">{t(item.level, item.levelId)}</p>
                  <p className="mt-1 text-lg font-extrabold">{t(item.title, item.titleId)}</p>
                  <p className="mt-2 text-sm leading-relaxed">{t(item.body, item.bodyId)}</p>
                  {item.href && (
                    <a className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline" href={item.href}>
                      {t("Open MAGMA Indonesia", "Buka MAGMA Indonesia")}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-extrabold">{t("News", "Kabar")}</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {news.map((item) => (
                <li key={item.title} className="py-4">
                  <p className="text-xs font-semibold text-brand-700">{item.date}</p>
                  <p className="mt-1 font-extrabold">{t(item.title, item.titleId)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(item.body, item.bodyId)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">{t("Calendar", "Kalender")}</h2>
          <p className="mt-2 text-sm text-ink-soft">{t("A sample desk, not the published programme.", "Contoh meja kerja, bukan jadwal yang sudah diumumkan.")}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {events.map((item) => (
              <li key={item.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-extrabold">{t(item.title, item.titleId)}</p>
                  <p className="text-sm text-ink-soft">{t(item.who, item.whoId)}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-brand-800">{item.date}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
