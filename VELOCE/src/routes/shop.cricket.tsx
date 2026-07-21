import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

import { useSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/shop/cricket")({
  head: () => ({
    meta: [
      { title: "Cricket Jerseys — Veloce Wear" },
      {
        name: "description",
        content: "Authentic match-day cricket jerseys from the world's elite teams.",
      },
    ],
  }),
  component: () => {
    const bannerUrl = useSiteImage("category-cricket");
    return (
      <SiteChrome>
        <ShopInner
          title="Cricket"
          subtitle="Match-day jerseys from the world's elite teams."
          category="cricket"
          bannerUrl={bannerUrl}
        />
      </SiteChrome>
    );
  },
});
