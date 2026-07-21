import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/worldcup")({
  head: () => ({
    meta: [
      { title: "FIFA World Cup — Veloce Wear" },
      {
        name: "description",
        content: "Iconic FIFA World Cup jerseys. Champions editions and tournament kits, curated.",
      },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="FIFA World Cup"
        subtitle="Champions editions and tournament kits from football's greatest stage."
        category="worldcup"
      />
    </SiteChrome>
  ),
});
