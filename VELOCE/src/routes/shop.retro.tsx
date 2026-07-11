import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { ShopInner } from "./shop";

export const Route = createFileRoute("/shop/retro")({
  head: () => ({ meta: [{ title: "Retro Collection — Veloce" }, { name: "description", content: "Vintage football jerseys and heritage F1 pieces, reissued." }] }),
  component: () => <SiteChrome><ShopInner title="Retro" subtitle="Vintage football and heritage F1 — the classics, faithfully reissued." category="retro" /></SiteChrome>,
});