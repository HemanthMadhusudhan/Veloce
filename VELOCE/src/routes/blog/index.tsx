import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Veloce Wear Blog — Jersey Guides & Sports Culture" },
      { name: "description", content: "Read our expert buying guides, sports culture articles, and deep dives into the best football, F1, basketball, and cricket merchandise in India." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  // In a real CMS, this would fetch from a database or markdown files
  // For the Blog Engine scaffolding, we show a placeholder grid
  return (
    <SiteChrome>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <h1 className="text-4xl font-display font-bold mb-4">Veloce Wear Blog</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Deep dives into the world of sports apparel, buying guides, and culture.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Link to={"/blog/how-to-choose-football-jersey" as any} className="group block">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img src="/assets/product-1.jpg" alt="Blog post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors">How to Choose the Perfect Football Jersey Size</h2>
            <p className="text-sm text-muted-foreground mt-2">A complete guide to player issue vs fan editions, and how to find your perfect fit.</p>
          </Link>
          <Link to={"/blog/top-f1-merchandise-2026" as any} className="group block">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img src="/assets/product-2.jpg" alt="Blog post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors">Top 10 Formula 1 Merch Pieces for 2026</h2>
            <p className="text-sm text-muted-foreground mt-2">Gear up for the season with the best paddock-ready apparel from Ferrari, Mercedes, and Red Bull.</p>
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}
