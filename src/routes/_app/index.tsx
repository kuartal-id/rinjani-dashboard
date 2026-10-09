import { createFileRoute, redirect } from "@tanstack/react-router";

const HOMES = {
  data: "/data",
  "rinjani-data": "/data",
  dashboard: "/dashboard",
  "rinjani-dashboard": "/dashboard",
  rinjaniku: "/rinjaniku",
  academy: "/academy",
  "rinjani-academy": "/academy",
} as const;

/** Which desk `/` opens. Unset in the preview, so the portal stays on Services. */
function homeTo() {
  const site = String(import.meta.env.VITE_SITE ?? "").toLowerCase();
  return HOMES[site as keyof typeof HOMES] ?? "/services";
}

export const Route = createFileRoute("/_app/")({
  beforeLoad: () => {
    throw redirect({ to: homeTo() });
  },
});
