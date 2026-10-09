import { createFileRoute } from "@tanstack/react-router";
import { PhotoHero, PhotoTile } from "@/components/landscape";
import { liveServices, priorityServices } from "@/lib/services";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_app/services")({
  component: ServicesPage,
});

const PHOTO = "https://rinjanilombok.org/images/photos";

const ID: Record<string, { kicker: string; summary: string }> = {
  "one-data": {
    kicker: "Satu Data",
    summary:
      "Portal data terbuka untuk UNESCO Global Geopark dan Cagar Biosfer. Tabel provinsi tetap di Satu Data NTB. Grafik di sini hanya hitungan dari peta MIDAS.",
  },
  dashboard: {
    kicker: "Gambaran situasi",
    summary: "Kabar, peringatan, kalender, dan langkah berikutnya bagi warga, pengunjung, usaha, dan calon mitra.",
  },
  "one-map": {
    kicker: "Satu Peta",
    summary:
      "Lokasi peta MIDAS, batas geopark, jalur, dan bahaya Geosafe dalam satu peta. Lapisan bisa ditumpuk. Peta yang sudah tayang tidak diganti.",
  },
  rinjaniku: {
    kicker: "Lapor dan ditanggapi",
    summary: "Pengaduan, laporan, dan masukan ke Pusat Komando Digital, agar Geopark, Taman Nasional, dan Provinsi dapat menjawab.",
  },
  academy: {
    kicker: "Belajar di sini",
    summary: "Sekolah setempat, jalur Unram, kursus singkat, sekolah lapangan, sertifikat, dan magang di bentang Rinjani.",
  },
  "midas-map": {
    kicker: "Sudah tayang",
    summary: "Peta yang hidup hari ini: geosite, jalur, dan informasi pengunjung. Satu Peta memperluasnya, bukan menggantikannya.",
  },
  lontar: {
    kicker: "Sudah tayang",
    summary: "Naskah lontar Lombok, dipotret lembar demi lembar, dengan alih aksara, terjemahan, dan pembacaan.",
  },
  geosafe: {
    kicker: "Ada di dalam Satu Peta",
    summary: "Titik bahaya, titik aman, dan titik kumpul dari uji coba Aik Berik tetap menjadi lapisan sendiri.",
  },
};

const IMAGE: Record<string, string> = {
  "one-data": `${PHOTO}/caldera-segara-anak.webp`,
  dashboard: `${PHOTO}/segara-anak-barujari.webp`,
  "one-map": `${PHOTO}/sembalun-ridges.webp`,
  rinjaniku: `${PHOTO}/ngayu-ngayu-ceremony.webp`,
  academy: `${PHOTO}/senaru-village.webp`,
  "midas-map": `${PHOTO}/malimbu-coast.webp`,
  lontar: `${PHOTO}/sembalun-traditional-houses.webp`,
  geosafe: `${PHOTO}/bayan-waterfall.webp`,
};

const SPAN: Record<string, string> = {
  "one-map": "md:col-span-4 md:row-span-2 md:min-h-full",
  "one-data": "md:col-span-2",
  dashboard: "md:col-span-2",
  rinjaniku: "md:col-span-3",
  academy: "md:col-span-3",
};

function ServicesPage() {
  const t = useT();

  return (
    <div>
      <PhotoHero
        image={`${PHOTO}/sembalun-valley.webp`}
        alt={t("The Sembalun valley under the ridges of Rinjani", "Lembah Sembalun di bawah punggungan Rinjani")}
        kicker="RINJANI-LOMBOK MIDAS"
        title={t("Digital Service", "Layanan Digital")}
        lede={t(
          "The front door of the Management Agency. Five desks for one landscape, beside the map and the lontar archive that are already open.",
          "Pintu depan Badan Pengelola. Lima meja untuk satu bentang, di samping peta dan arsip lontar yang sudah dibuka.",
        )}
        caption={t("Sembalun valley, East Lombok", "Lembah Sembalun, Lombok Timur")}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="max-w-4xl text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          {t(
            "One Agency holds the UNESCO Global Geopark and the UNESCO Biosphere Reserve. These services are how that work shows up on a screen.",
            "Satu Badan memegang UNESCO Global Geopark dan UNESCO Biosphere Reserve. Layanan ini adalah wujud kerja itu di layar.",
          )}
        </p>
        <div className="mt-10 grid gap-3 md:grid-cols-6">
          {priorityServices.map((service) => (
            <PhotoTile
              key={service.id}
              href={service.href}
              image={IMAGE[service.id]}
              kicker={t(service.english, ID[service.id]?.kicker ?? service.english)}
              title={service.name}
              body={t(service.summary, ID[service.id]?.summary ?? service.summary)}
              meta={service.host}
              className={SPAN[service.id] ?? ""}
            />
          ))}
        </div>
      </section>

      <section className="bg-pumice">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-bold tracking-wide text-brand-700">{t("ALREADY OPEN", "SUDAH TAYANG")}</p>
          <h2 className="mt-2 max-w-xl text-3xl font-extrabold">{t("Nothing here is retired", "Tidak ada yang ditutup")}</h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            {t("Geosafe stays as layers on OneMap. The public map and the lontar reader keep their own addresses.", "Geosafe tetap menjadi lapisan di Satu Peta. Peta publik dan pembaca lontar mempertahankan alamatnya sendiri.")}
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {liveServices.map((service) => (
              <PhotoTile
                key={service.id}
                href={service.href}
                image={IMAGE[service.id]}
                kicker={t(service.english, ID[service.id]?.kicker ?? service.english)}
                title={service.name}
                body={t(service.summary, ID[service.id]?.summary ?? service.summary)}
                meta={service.host}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
