import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";
import categorySeo from "@/lib/category-seo.json";

export const Route = createFileRoute("/shop/f1")({
  head: () => ({
    meta: [
      { title: categorySeo.f1.title },
      { name: "description", content: categorySeo.f1.description },
    ],
  }),
  component: () => (
    <SiteChrome>
      <ShopInner
        title="Formula 1"
        subtitle="Official merchandise from the paddock."
        category="f1"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-6" dangerouslySetInnerHTML={{ __html: categorySeo.f1.content }} />
    </SiteChrome>
  ),
});
