import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";

const NAV = [
  { to: "/services", en: "Services", id: "Layanan" },
  { to: "/data", en: "OneData", id: "Satu Data" },
  { to: "/dashboard", en: "Dashboard", id: "Dasbor" },
  { to: "/map", en: "OneMap", id: "Satu Peta" },
  { to: "/rinjaniku", en: "Rinjaniku", id: "Rinjaniku" },
  { to: "/academy", en: "Academy", id: "Akademi" },
] as const;

function active(path: string, to: string) {
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const map = path.startsWith("/map");
  const { lang, setLang } = useLang();
  const t = useT();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <div className="bg-ink text-paper">
        <div className="flex h-10 w-full items-stretch justify-between pr-3 pl-0">
          <nav className="flex items-stretch overflow-x-auto" aria-label="Rinjani-Lombok">
            <a className="flex shrink-0 items-center gap-2 bg-brand-700 px-3 text-sm font-semibold" href="https://rinjanilombok.org/">
              <span className="h-2 w-2 rounded-full bg-paper" />
              <span className="hidden sm:inline">Rinjani-Lombok MIDAS</span>
              <span className="sm:hidden">MIDAS</span>
            </a>
            <a className="flex shrink-0 items-center gap-2 px-3 text-sm font-semibold text-paper/65 hover:text-paper" href="https://geopark.rinjanilombok.org/">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <span className="hidden sm:inline">Global Geopark</span>
              <span className="sm:hidden">Geopark</span>
            </a>
            <a className="flex shrink-0 items-center gap-2 px-3 text-sm font-semibold text-paper/65 hover:text-paper" href="https://biosphere.rinjanilombok.org/">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <span className="hidden sm:inline">Biosphere Reserve</span>
              <span className="sm:hidden">Biosphere</span>
            </a>
            <span className="mx-2 my-3 hidden w-px bg-paper/20 lg:block" aria-hidden />
            <a className="hidden shrink-0 items-center gap-1.5 px-3 text-sm font-semibold text-paper/65 hover:text-paper lg:flex" href="https://bappeda.ntbprov.go.id/" target="_blank" rel="noreferrer">
              <span className="hidden xl:inline">BAPPEDA NTB</span>
              <span className="xl:hidden">BAPPEDA</span>
              <External />
            </a>
            <a className="hidden shrink-0 items-center gap-1.5 px-3 text-sm font-semibold text-paper/65 hover:text-paper lg:flex" href="https://ntbprov.go.id/" target="_blank" rel="noreferrer">
              <span className="hidden xl:inline">NTB Provincial Government</span>
              <span className="xl:hidden">NTB Government</span>
              <External />
            </a>
          </nav>
          <div className="flex shrink-0 items-center">
            <div className="flex items-center rounded-full bg-paper/10 p-0.5" role="group" aria-label={t("Language", "Bahasa")}>
              {(["en", "id"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`h-7 rounded-full px-2.5 text-xs font-bold ${lang === code ? "bg-paper text-ink" : "text-paper/75"}`}
                  aria-pressed={lang === code}
                >
                  {code === "en" ? "EN" : "ID"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="flex h-16 w-full items-center gap-4 px-4 lg:gap-8 lg:px-6">
          <Link to="/services" className="flex min-w-0 shrink-0 items-center gap-3">
            <img src="/brand/midas-emblem.png" alt="Rinjani-Lombok MIDAS" className="h-11 w-11 object-contain" />
            <span className="truncate text-sm font-extrabold sm:text-base">Rinjani Digital Service</span>
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-between lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2 py-2 text-sm font-semibold ${
                  active(path, item.to) ? "text-brand-800 underline decoration-2 underline-offset-8" : "text-ink-soft hover:text-ink"
                }`}
              >
                {lang === "id" ? item.id : item.en}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label={open ? t("Close menu", "Tutup menu") : t("Open menu", "Buka menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`mb-1 flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold ${
                  active(path, item.to) ? "bg-brand-900 text-paper" : "hover:bg-pumice"
                }`}
              >
                {lang === "id" ? item.id : item.en}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      {!map && (
        <footer className="mt-auto bg-brand-900 text-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2">
            <div>
              <img src="/brand/midas-emblem-white.png" alt="" className="h-16 w-16 object-contain" />
              <p className="mt-4 text-lg font-extrabold">Rinjani-Lombok MIDAS</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/75">
                {t(
                  "One Agency for the UNESCO Global Geopark and the UNESCO Biosphere Reserve. The Tropical Bridge Between Asia and Australia.",
                  "Satu Badan untuk UNESCO Global Geopark dan UNESCO Biosphere Reserve. Jembatan Tropis antara Asia dan Australia.",
                )}
              </p>
              <a className="mt-4 inline-block text-sm font-semibold underline" href="mailto:info@rinjanilombok.org">
                info@rinjanilombok.org
              </a>
            </div>
            <div className="text-sm">
              <p className="font-bold">{t("Services", "Layanan")}</p>
              <ul className="mt-3 space-y-2 text-paper/75">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-paper">
                      {lang === "id" ? item.id : item.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-paper/15">
            <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-paper/60">
              © 2026 Rinjani-Lombok MIDAS Management Agency, Nusa Tenggara Barat, Indonesia
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

function External() {
  return (
    <svg className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
