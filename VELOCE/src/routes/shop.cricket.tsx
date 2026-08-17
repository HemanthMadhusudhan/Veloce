import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import categorySeo from "@/lib/category-seo.json";

export const Route = createFileRoute("/shop/cricket")({
  head: () => ({
    meta: [
      { title: categorySeo.cricket.title },
      { name: "description", content: categorySeo.cricket.description },
    ],
  }),
  component: () => {
    return (
      <SiteChrome>
        <ShopInner
          title="Cricket"
          subtitle="Official team kits and fan gear for the love of the game."
          category="cricket"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-6" dangerouslySetInnerHTML={{ __html: categorySeo.cricket.content }} />
      </SiteChrome>
    );
  },
});
