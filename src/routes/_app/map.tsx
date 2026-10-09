import { createFileRoute } from "@tanstack/react-router";
import { OneMap } from "@/components/one-map";

type Search = { layers: string };

export const Route = createFileRoute("/_app/map")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    layers: typeof search.layers === "string" ? search.layers : "",
  }),
  component: MapRoute,
});

function MapRoute() {
  const { layers } = Route.useSearch();
  return <OneMap initial={layers} />;
}
