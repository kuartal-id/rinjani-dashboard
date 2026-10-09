import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { LocaleProvider } from "@/lib/i18n";

export const Route = createFileRoute("/_app")({
  component: () => (
    <LocaleProvider>
      <Shell>
        <Outlet />
      </Shell>
    </LocaleProvider>
  ),
});
