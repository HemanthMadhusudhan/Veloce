import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
import { Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  const { products } = useCatalog();
  const search = useSearch({ strict: false }) as { q?: string };
  const query = search.q || "";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const s = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.team.toLowerCase().includes(s) ||
        (p.driver ?? "").toLowerCase().includes(s) ||
        p.tag.toLowerCase().includes(s)
    );
  }, [query, products]);

  return (
    <SiteChrome>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Search Results
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} for <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-muted/50 p-6">
              <Search className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">No matches found</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't find anything matching your search. Try adjusting your keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {results.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
