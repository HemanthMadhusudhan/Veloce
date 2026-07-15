import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { ZONES, type Zone } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";

const VALID: Zone[] = ["messi", "ronaldo", "verstappen", "hamilton"];

export const Route = createFileRoute("/zone/$slug")({
  loader: ({ params }) => {
    if (!VALID.includes(params.slug as Zone)) throw notFound();
    const zone = ZONES.find((z) => z.slug === params.slug)!;
    return { zone };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.zone.name} · Zone — Veloce` : "Zone — Veloce" },
      {
        name: "description",
        content: loaderData
          ? `The ${loaderData.zone.name} zone — curated pieces from Veloce.`
          : "Player zones on Veloce.",
      },
    ],
  }),
  notFoundComponent: () => (
    <SiteChrome>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Zone not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-brand">
          Home
        </Link>
      </div>
    </SiteChrome>
  ),
  component: ZonePage,
});

function ZonePage() {
  const { zone } = Route.useLoaderData();
  const { products } = useCatalog();
  const items = products.filter((p) => p.zone === zone.slug);
  const worldLabel = zone.category === "f1" ? "The Paddock" : "The Pitch";

  return (
    <SiteChrome>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">
          Zone · {worldLabel}
        </div>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight sm:text-7xl">
          {zone.name}.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {zone.tagline} — a curated capsule of {zone.name}'s most collected pieces on Veloce.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ZONES.filter((z) => z.slug !== zone.slug).map((z) => (
            <Link
              key={z.slug}
              to="/zone/$slug"
              params={{ slug: z.slug }}
              className="rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:border-foreground hover:text-foreground"
            >
              {z.name}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            No pieces in this zone yet.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
