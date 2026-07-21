import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/f1")({
  head: () => ({
    meta: [
      { title: "Formula 1 — Veloce Wear" },
      {
        name: "description",
        content: "Official Formula 1 team merchandise. Paddock-grade kit, on your terms.",
      },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="Formula 1"
        subtitle="Paddock-grade kit from every constructor on the grid."
        category="f1"
      />
    </SiteChrome>
  ),
});
