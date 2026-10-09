# Rinjani Digital Service

The public front door for the Rinjani-Lombok MIDAS: **OneData**, **Dashboard**, **OneMap**, **Rinjaniku**, and **Academy**. English and Bahasa Indonesia. The look follows [rinjanilombok.org](https://rinjanilombok.org) — ink bar, MIDAS emblem, Plus Jakarta Sans — not a copy of the Jabar portals.

The same app is published from four repositories so each desk can have its own site. Every site still contains the whole portal. The home page opens the desk that matches the repository name.

| Repository | Opens on | Intended site |
|---|---|---|
| [rinjani-data](https://github.com/kuartal-id/rinjani-data) | OneData | data.rinjanilombok.org |
| [rinjani-dashboard](https://github.com/kuartal-id/rinjani-dashboard) | Dashboard | dashboard.rinjanilombok.org |
| [rinjaniku](https://github.com/kuartal-id/rinjaniku) | Rinjaniku | rinjaniku.rinjanilombok.org |
| [rinjani-academy](https://github.com/kuartal-id/rinjani-academy) | Academy | academy.rinjanilombok.org |

OneMap is inside this portal at `/map`. It does **not** replace the live visitor map at [map.rinjanilombok.org](https://map.rinjanilombok.org). The MIDAS website itself stays on the Laravel project.

## Publish on GitHub Pages

The site is built for the **root of a domain** (a custom domain), not for `https://kuartal-id.github.io/rinjani-data/`.

1. In the repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Re-run the **Deploy to GitHub Pages** workflow if the first run failed before Pages was switched on.
4. Add the custom domain from the table above, and point DNS at GitHub Pages.

Agency uploads stay in the visitor's browser until a real server is connected. They are not stored in these repositories.

## What the numbers are

Charts on OneData count the **53 locations in the published map database** (26 geological, 9 natural, 18 cultural). That is not the published list of 47 geosites. Tables that belong to Satu Data NTB stay linked at [data.ntbprov.go.id](https://data.ntbprov.go.id). The dashboard calendar is a sample, not a published programme. Volcano status is [MAGMA](https://magma.esdm.go.id/v1/gunung-api/rinjani), not this desk.
