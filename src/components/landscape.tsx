const RIDGE =
  "M0 110V94C27 93 107 91.3 160 88C213 84.7 273 79 320 74C367 69 407 63.7 440 58C473 52.3 501 44.7 520 40C539 35.3 544 30.7 556 30C568 29.3 578 32.7 590 36C602 39.3 613 47 625 50C637 53 650 54.5 660 54C670 53.5 681 49.3 688 47C695 44.7 697 40.2 702 40C707 39.8 709 44.3 716 46C723 47.7 733 51 745 50C757 49 776 44.7 790 40C804 35.3 819 27 830 22C841 17 851 13 858 10C865 7 867 4 872 4C877 4 881 6.7 888 10C895 13.3 903 19 915 24C927 29 939 34.7 960 40C981 45.3 1007 51 1040 56C1073 61 1117 65.7 1160 70C1203 74.3 1253 78.7 1300 82C1347 85.3 1417 88.7 1440 90V110Z";

export function RidgeCut({ className = "text-paper" }: { className?: string }) {
  return (
    <svg className={`ridge-cut pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`} viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden>
      <path fill="currentColor" d={RIDGE} />
    </svg>
  );
}

export function PhotoHero({
  image,
  alt,
  kicker,
  title,
  lede,
  caption,
  compact,
}: {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  lede: string;
  caption?: string;
  compact?: boolean;
}) {
  return (
    <section className="bg-paper px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink text-paper">
      <img src={image} alt={alt} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <div className={`mx-auto flex max-w-6xl flex-col justify-end px-4 pt-16 ${compact ? "hero-mid" : "hero-tall"}`}>
        <p className="text-sm font-semibold text-paper/80">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85">{lede}</p>
      </div>
      {caption && <p className="absolute right-6 bottom-28 hidden max-w-xs text-right text-sm text-paper/70 md:block">{caption}</p>}
      <RidgeCut />
      </div>
    </section>
  );
}

export function PhotoTile({
  href,
  image,
  kicker,
  title,
  body,
  meta,
  className = "",
}: {
  href: string;
  image: string;
  kicker: string;
  title: string;
  body: string;
  meta?: string;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl bg-ink ${className}`}
    >
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="card-shade absolute inset-0 -z-10" />
      <div className="p-6 text-paper">
        <p className="text-xs font-bold tracking-wide text-paper/75">{kicker}</p>
        <p className="mt-2 text-2xl font-extrabold leading-tight">{title}</p>
        <p className="mt-2 line-clamp-3 max-w-md text-sm leading-relaxed text-paper/85">{body}</p>
        {meta && <p className="mt-3 text-xs font-semibold text-paper/70">{meta}</p>}
      </div>
    </a>
  );
}
