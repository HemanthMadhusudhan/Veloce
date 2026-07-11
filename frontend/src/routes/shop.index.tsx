import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/")({
  head: () => ({ meta: [{ title: "Shop — Veloce" }, { name: "description", content: "Shop every football jersey and Formula 1 piece in the Veloce collection." }] }),
  component: () => <SiteChrome><ShopInner title="Shop All" subtitle="The full Veloce collection." /></SiteChrome>,
});