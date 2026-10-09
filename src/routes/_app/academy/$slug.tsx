import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getOffering, offeringId } from "@/lib/academy";
import { loadLearning, saveLearning } from "@/lib/desk";
import { useLang, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_app/academy/$slug")({
  component: OfferingPage,
});

const KIND_ID: Record<string, string> = {
  Course: "Kursus",
  Certificate: "Sertifikat",
  Apprenticeship: "Magang",
  "Field school": "Sekolah lapangan",
  Campus: "Kampus",
};

function OfferingPage() {
  const { slug } = Route.useParams();
  const offering = getOffering(slug);
  const [saved, setSaved] = useState(false);
  const t = useT();
  const { lang } = useLang();
  const id = offering ? offeringId[offering.slug] : undefined;

  useEffect(() => {
    setSaved(loadLearning().includes(slug));
  }, [slug]);

  if (!offering) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">{t("That course is not listed", "Kursus itu tidak ada di daftar")}</h1>
        <Link to="/academy" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand-700">
          {t("Back to Academy", "Kembali ke Akademi")}
        </Link>
      </div>
    );
  }

  const title = lang === "id" ? (id?.title ?? offering.title) : offering.title;
  const summary = lang === "id" ? (id?.summary ?? offering.summary) : offering.summary;
  const modules = lang === "id" ? (id?.modules ?? offering.modules) : offering.modules;
  const facts = [
    [t("Who", "Siapa"), lang === "id" ? (id?.audience ?? offering.audience) : offering.audience],
    [t("Where", "Di mana"), lang === "id" ? (id?.place ?? offering.place) : offering.place],
    [t("Length", "Lama"), lang === "id" ? (id?.length ?? offering.length) : offering.length],
  ];

  function enroll() {
    const current = loadLearning();
    const next = current.includes(offering!.slug) ? current : [...current, offering!.slug];
    saveLearning(next);
    setSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link to="/academy" className="text-sm font-semibold text-brand-700">
        {t("Academy", "Akademi")}
      </Link>
      <p className="mt-4 text-xs font-bold tracking-wide text-brand-700">{t(offering.kind, KIND_ID[offering.kind] ?? offering.kind)}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">{summary}</p>
      <dl className="mt-6 grid gap-px bg-line sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label} className="bg-pumice p-4">
            <dt className="text-xs font-semibold text-ink-soft">{label}</dt>
            <dd className="mt-1 text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-10 text-2xl font-extrabold">{t("What you do", "Yang dikerjakan")}</h2>
      <ol className="mt-4 divide-y divide-line border-y border-line">
        {modules.map((step, index) => (
          <li key={step} className="flex gap-4 py-4">
            <span className="text-sm font-extrabold tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
            <span className="font-semibold">{step}</span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={enroll} className="mt-8 h-12 rounded-full bg-brand-900 px-6 text-sm font-semibold text-paper">
        {saved ? t("Saved to your learning list", "Tersimpan di daftar belajar") : t("Save to my learning list", "Simpan ke daftar belajar")}
      </button>
      <p className="mt-3 text-sm text-ink-soft">
        {t(
          "Saved in this browser. Enrolment with a school or Unram still happens with them.",
          "Tersimpan di peramban ini. Pendaftaran ke sekolah atau Unram tetap lewat mereka.",
        )}
      </p>
    </div>
  );
}
