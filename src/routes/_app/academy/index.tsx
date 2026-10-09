import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PhotoHero } from "@/components/landscape";
import { offeringId, offerings } from "@/lib/academy";
import { useLang, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_app/academy/")({
  component: AcademyHome,
});

const KIND_ID: Record<string, string> = {
  All: "Semua",
  Course: "Kursus",
  Certificate: "Sertifikat",
  Apprenticeship: "Magang",
  "Field school": "Sekolah lapangan",
  Campus: "Kampus",
};

function AcademyHome() {
  const t = useT();
  const { lang } = useLang();
  const [kind, setKind] = useState("All");
  const kinds = ["All", ...new Set(offerings.map((o) => o.kind))];
  const rows = useMemo(() => offerings.filter((o) => kind === "All" || o.kind === kind), [kind]);

  return (
    <div>
      <PhotoHero
        compact
        image="https://rinjanilombok.org/images/photos/senaru-village.webp"
        alt={t("Senaru village", "Desa Senaru")}
        kicker="RINJANI ACADEMY"
        title={t("Learn in the Rinjani landscape", "Belajar di bentang Rinjani")}
        lede={t(
          "Schools that already serve the buffer villages, a path into Universitas Mataram, and the courses the Agency can run itself.",
          "Sekolah yang sudah melayani desa penyangga, jalur ke Universitas Mataram, dan kursus yang dapat dijalankan Badan sendiri.",
        )}
        caption={t("Senaru, North Lombok", "Senaru, Lombok Utara")}
      />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[18rem_1fr]">
        <aside>
          <img
            src="https://rinjanilombok.org/images/photos/sembalun-traditional-houses.webp"
            alt={t("Traditional houses in Sembalun", "Rumah adat di Sembalun")}
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {t("A field school still happens in a village, not only in a browser.", "Sekolah lapangan tetap terjadi di desa, bukan hanya di peramban.")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {kinds.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setKind(item)}
                className={`h-11 rounded-full px-4 text-sm font-semibold ${kind === item ? "bg-brand-900 text-paper" : "bg-pumice"}`}
              >
                {t(item, KIND_ID[item] ?? item)}
              </button>
            ))}
          </div>
        </aside>

        <ol className="divide-y divide-line border-y border-line">
          {rows.map((item, index) => {
            const id = offeringId[item.slug];
            return (
              <li key={item.slug}>
                <Link to="/academy/$slug" params={{ slug: item.slug }} className="grid gap-2 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-4">
                  <span className="text-sm font-extrabold tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <p className="text-xs font-bold tracking-wide text-brand-700">{t(item.kind, KIND_ID[item.kind] ?? item.kind)}</p>
                    <h2 className="mt-1 text-2xl font-extrabold">{lang === "id" ? (id?.title ?? item.title) : item.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{lang === "id" ? (id?.summary ?? item.summary) : item.summary}</p>
                    <p className="mt-3 text-xs font-semibold text-ink-soft">
                      {lang === "id" ? (id?.place ?? item.place) : item.place} · {lang === "id" ? (id?.length ?? item.length) : item.length}
                    </p>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
