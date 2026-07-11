import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/football")({
  head: () => ({ meta: [{ title: "Football Jerseys — Veloce" }, { name: "description", content: "Authentic match-day football kits from the world's elite clubs." }] }),
  component: () => <SiteChrome><ShopInner title="Football" subtitle="Match-day kits from the world's elite clubs." category="football" /></SiteChrome>,
});
