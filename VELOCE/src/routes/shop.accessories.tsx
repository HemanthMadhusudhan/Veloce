import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/accessories")({
  head: () => ({
    meta: [
      { title: "Accessories — Veloce Wear" },
      {
        name: "description",
        content: "High-quality accessories from the sports world.",
      },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="Accessories"
        subtitle="Exclusive caps, bags, and more from your favorite teams."
        category="accessories"
      />
    </SiteChrome>
  ),
});
