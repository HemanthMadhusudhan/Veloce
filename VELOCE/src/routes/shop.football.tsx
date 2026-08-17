import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import categorySeo from "@/lib/category-seo.json";

export const Route = createFileRoute("/shop/football")({
  head: () => ({
    meta: [
      { title: categorySeo.football.title },
      { name: "description", content: categorySeo.football.description },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="Football"
        subtitle="Match-day kits from the world's elite clubs."
        category="football"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-6" dangerouslySetInnerHTML={{ __html: categorySeo.football.content }} />
    </SiteChrome>
  ),
});
