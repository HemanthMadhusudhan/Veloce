import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

import { useSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/shop/basketball")({
  head: () => ({
    meta: [
      { title: "Basketball Jerseys — Veloce Wear" },
      {
        name: "description",
        content: "Authentic match-day basketball jerseys from the world's elite teams.",
      },
    ],
  }),
  component: () => {
    const bannerUrl = useSiteImage("category-basketball");
    return (
      <SiteChrome>
        <ShopInner
          title="Basketball"
          subtitle="Match-day jerseys from the world's elite teams."
          category="basketball"
          bannerUrl={bannerUrl}
        />
      </SiteChrome>
    );
  },
});
