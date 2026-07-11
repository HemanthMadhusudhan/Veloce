import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Veloce" }] }),
  component: () => <SiteChrome><WishlistPage /></SiteChrome>,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const { products } = useCatalog();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-6 pt-8">
      <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Saved</div>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-6xl">Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your saved pieces. Synced across sessions on this device.</p>
      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
          <Link to="/shop" className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-background">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
