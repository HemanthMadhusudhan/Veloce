import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import { usePlayerVersions } from "@/lib/player-versions";

export const Route = createFileRoute("/player-version")({
  head: () => ({
    meta: [
      { title: "Player Version Football & Sports Jerseys — Veloce Wear" },
      {
        name: "description",
        content:
          "Shop 1:1 authentic player edition match-day jerseys in India. Breathable mesh panels, heat-pressed club crests, and athletic athletic fit.",
      },
    ],
  }),
  component: PlayerVersionPage,
});

function PlayerVersionPage() {
  const { playerVersionIds } = usePlayerVersions();

  return (
    <SiteChrome>
      <ShopInner
        title="Player Version Kits"
        subtitle="1:1 Match-day authentic player version jerseys with heat-pressed crests."
        customProductIds={playerVersionIds}
      />
    </SiteChrome>
  );
}
