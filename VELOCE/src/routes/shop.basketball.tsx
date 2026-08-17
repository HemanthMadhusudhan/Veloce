import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import categorySeo from "@/lib/category-seo.json";

export const Route = createFileRoute("/shop/basketball")({
  head: () => ({
    meta: [
      { title: categorySeo.basketball.title },
      { name: "description", content: categorySeo.basketball.description },
    ],
  }),
  component: () => {
    return (
      <SiteChrome>
        <ShopInner
          title="Basketball"
          subtitle="Premium hardwood classics and game-day jerseys."
          category="basketball"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-6" dangerouslySetInnerHTML={{ __html: categorySeo.basketball.content }} />
      </SiteChrome>
    );
  },
});
