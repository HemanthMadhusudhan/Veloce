import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/retro")({
  head: () => ({
    meta: [
      { title: "Retro Jerseys — Veloce Wear" },
      {
        name: "description",
        content: "Classic and retro football kits.",
      },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="Retro"
        subtitle="Classic and vintage football kits."
        category="retro"
      />
    </SiteChrome>
  ),
});
