import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import { useNewKits } from "@/lib/new-kits";

export const Route = createFileRoute("/new-kits")({
  head: () => ({
    meta: [
      { title: "New 2026/27 Kits — Veloce Wear" },
      {
        name: "description",
        content: "Shop the latest 2026/27 kits.",
      },
    ],
  }),
  component: NewKitsPage,
});

function NewKitsPage() {
  const { newKitsIds } = useNewKits();

  return (
    <SiteChrome>
      <ShopInner
        title="New 2026/27 Kits"
        subtitle="The latest arrivals for the upcoming season."
        customProductIds={newKitsIds}
      />
    </SiteChrome>
  );
}
