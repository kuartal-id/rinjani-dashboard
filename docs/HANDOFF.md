# Handoff

## 2026-10-09 — Digital Service portal on the empty product repos

Agent: Grok

The preview app (OneData, Dashboard, OneMap, Rinjaniku, Academy) is the source in this repository. GitHub Actions builds a static site with `NITRO_PRESET=github_pages`. `VITE_SITE` is the repository name, so `/` opens that desk.

Not touched: `kuartal-id/rinjanilombok` (`main`) and `kuartal-id/rinjani-map` (`master`). The live map stays at map.rinjanilombok.org. OneMap here is an extra catalogue, not a replacement.

Agency datasets are browser-only (`localStorage`). Do not treat them as a shared database.
