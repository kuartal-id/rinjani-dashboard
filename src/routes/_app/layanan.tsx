import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/layanan")({
  beforeLoad: () => {
    throw redirect({ to: "/services" });
  },
});
