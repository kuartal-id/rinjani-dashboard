import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { agencies, loadReports, reportKinds, saveReports, type Report } from "@/lib/desk";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_app/rinjaniku")({
  component: RinjanikuPage,
});

const empty = {
  kind: reportKinds[0],
  agency: agencies[0],
  summary: "",
  detail: "",
  place: "",
  anonymous: true,
  name: "",
  contact: "",
};

function RinjanikuPage() {
  const t = useT();
  const kindId = ["Bahaya", "Kerusakan lingkungan", "Pelanggaran", "Pengaduan", "Masukan", "Lainnya"];
  const agencyId = ["Pusat Komando Digital", "Geopark Rinjani-Lombok", "Taman Nasional Gunung Rinjani", "Pemerintah Provinsi NTB"];
  const [tab, setTab] = useState<"send" | "desk">("send");
  const [form, setForm] = useState(empty);
  const [reports, setReports] = useState<Report[]>([]);
  const [ticket, setTicket] = useState("");

  useEffect(() => {
    setReports(loadReports());
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.summary.trim().length < 8 || form.detail.trim().length < 12) return;
    const report: Report = {
      ...form,
      id: `RDS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      created: new Date().toISOString(),
      summary: form.summary.trim(),
      detail: form.detail.trim(),
      place: form.place.trim(),
      name: form.anonymous ? "" : form.name.trim(),
      contact: form.anonymous ? "" : form.contact.trim(),
      status: "New",
      reply: "",
    };
    const next = [report, ...reports];
    setReports(next);
    saveReports(next);
    setTicket(report.id);
    setForm(empty);
  }

  function patch(id: string, patch: Partial<Report>) {
    const next = reports.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setReports(next);
    saveReports(next);
  }

  return (
    <div className="grid gap-3 p-3 lg:grid-cols-2 lg:p-4">
      <div className="relative min-h-80 overflow-hidden rounded-3xl bg-ink text-paper lg:min-h-full">
        <img
          src="https://rinjanilombok.org/images/photos/ngayu-ngayu-ceremony.webp"
          alt={t("A ceremony in the Rinjani landscape", "Sebuah upacara di bentang Rinjani")}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative flex min-h-80 flex-col justify-end p-8 pb-12 lg:sticky lg:top-16 lg:min-h-[calc(100dvh-6.5rem)]">
          <p className="text-xs font-bold tracking-wide text-paper/80">RINJANIKU</p>
          <h1 className="mt-3 max-w-md text-4xl font-extrabold tracking-tight">{t("Tell the command center", "Sampaikan ke pusat komando")}</h1>
          <p className="mt-4 max-w-md leading-relaxed text-paper/85">
            {t(
              "Hazards, damage, misconduct, complaints and ordinary feedback. Anonymous is the default. Reports stay in this browser until a real intake is connected. Do not use this for an emergency on the mountain.",
              "Bahaya, kerusakan, pelanggaran, pengaduan, dan masukan biasa. Tanpa nama adalah pilihan awal. Laporan tersimpan di peramban ini sampai saluran resmi tersambung. Jangan dipakai untuk keadaan darurat di gunung.",
            )}
          </p>
        </div>
      </div>
      <div className="px-4 py-8 sm:px-8">

      <div className="flex gap-2">
        <button type="button" onClick={() => setTab("send")} className={`h-11 rounded-full px-4 text-sm font-semibold ${tab === "send" ? "bg-brand-900 text-paper" : "bg-pumice"}`}>
          {t("Send a report", "Kirim laporan")}
        </button>
        <button type="button" onClick={() => setTab("desk")} className={`h-11 rounded-full px-4 text-sm font-semibold ${tab === "desk" ? "bg-brand-900 text-paper" : "bg-pumice"}`}>
          {t("Command desk", "Meja komando")} ({reports.length})
        </button>
      </div>

      {tab === "send" ? (
        <form onSubmit={submit} className="mt-8 max-w-2xl space-y-4">
          {ticket && (
            <p className="rounded-xl bg-safe-soft p-4 text-sm font-semibold text-safe">
              Received as {ticket}. {t("It is on the command desk in this browser.", "Ada di meja komando pada peramban ini.")}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              {t("Kind", "Jenis")}
              <select className="mt-2 h-12 w-full rounded-xl border border-line px-3 font-normal" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                {reportKinds.map((k, i) => (
                  <option key={k} value={k}>
                    {t(k, kindId[i] ?? k)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              {t("Send to", "Kirim ke")}
              <select className="mt-2 h-12 w-full rounded-xl border border-line px-3 font-normal" value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })}>
                {agencies.map((k, i) => (
                  <option key={k} value={k}>
                    {t(k, agencyId[i] ?? k)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold">
            {t("Place", "Tempat")}
            <input className="mt-2 h-12 w-full rounded-xl border border-line px-3 font-normal" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder={t("Trail, village, or geosite", "Jalur, desa, atau geosite")} />
          </label>
          <label className="block text-sm font-semibold">
            {t("Summary", "Ringkasan")}
            <input className="mt-2 h-12 w-full rounded-xl border border-line px-3 font-normal" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required minLength={8} />
          </label>
          <label className="block text-sm font-semibold">
            {t("What happened", "Apa yang terjadi")}
            <textarea className="mt-2 min-h-32 w-full rounded-xl border border-line px-3 py-3 font-normal" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required minLength={12} />
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
            {t("Send without my name", "Kirim tanpa nama")}
          </label>
          {!form.anonymous && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 rounded-xl border border-line px-3" placeholder={t("Name", "Nama")} aria-label={t("Name", "Nama")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="h-12 rounded-xl border border-line px-3" placeholder={t("Phone or email", "Telepon atau surel")} aria-label={t("Contact", "Kontak")} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
          )}
          <button type="submit" className="h-12 rounded-full bg-brand-900 px-6 text-sm font-semibold text-paper">
            {t("Submit to the command center", "Kirim ke pusat komando")}
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-4">
          {reports.length === 0 && <p className="text-ink-soft">{t("No reports in this browser yet.", "Belum ada laporan di peramban ini.")}</p>}
          {reports.map((report) => (
            <article key={report.id} className="rounded-xl p-5 ring-1 ring-line">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-extrabold">{report.summary}</p>
                <span className="rounded-full bg-pumice px-2 py-1 text-xs font-semibold">
                  {t(
                    report.status,
                    report.status === "New" ? "Baru" : report.status === "Seen" ? "Dilihat" : "Dijawab",
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-brand-700">
                {report.id} · {t(report.kind, kindId[reportKinds.indexOf(report.kind)] ?? report.kind)} ·{" "}
                {t(report.agency, agencyId[agencies.indexOf(report.agency)] ?? report.agency)}
                {report.place ? ` · ${report.place}` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{report.detail}</p>
              <p className="mt-2 text-xs text-ink-soft">{report.anonymous ? t("Anonymous", "Tanpa nama") : report.name || t("Named", "Dengan nama")}</p>
              <label className="mt-4 block text-sm font-semibold">
                {t("Reply from the agency", "Balasan instansi")}
                <textarea
                  className="mt-2 min-h-20 w-full rounded-xl border border-line px-3 py-3 font-normal"
                  value={report.reply}
                  onChange={(e) => patch(report.id, { reply: e.target.value, status: e.target.value ? "Answered" : "Seen" })}
                />
              </label>
            </article>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
