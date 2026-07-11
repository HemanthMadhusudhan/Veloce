## Scope

Big expansion across catalog, pricing, promos, navigation, and a new admin panel. Breaking into focused workstreams.

### 1. Currency → INR everywhere
- Add `formatINR(n)` helper in `src/lib/utils.ts` (₹, en-IN grouping).
- Replace all `$` price rendering across: `ProductCard`, `product.$id`, `shop*`, `cart drawer` (in `chrome.tsx`), `checkout`, `compare`, `wishlist`, `index.tsx`, admin.
- Convert catalog `price`/`compareAt` USD → INR (×83, rounded to nearest 100 for premium feel). Shipping/tax constants updated (Free ship ≥ ₹4,999, GST 18%).

### 2. Catalog expansion
Extend `src/lib/catalog.ts`:
- Add `Category` union: `"football" | "f1" | "worldcup" | "retro"`.
- Add subcategory / series field (`series?: "legends"`), `zone?: "messi" | "ronaldo" | "verstappen" | "hamilton"`.
- Add F1 teams: Mercedes, Red Bull, Ferrari, McLaren, Aston Martin, Alpine, Williams, RB, Kick Sauber, Haas — one representative product each.
- Add F1 Legends series: Senna, Schumacher, Prost, Lauda, Fangio.
- Add FIFA World Cup category: Argentina '22, France, Brazil, Germany '14, Spain '10.
- Add Retro category: Milan '90, Man Utd '99, Ajax '95, Ferrari '79, McLaren '88.
- Add zone products: Messi (PSG/Argentina/Barça), Ronaldo (Al-Nassr/Portugal/Man Utd), Verstappen (Red Bull kit set), Hamilton (Mercedes + legacy McLaren).
- All use existing 4 product images cycled — no new imagegen this pass to keep scope contained.

### 3. Navigation restructure
`SiteNav` in `chrome.tsx`:
- Menu: Football · Formula 1 · World Cup · Retro · Zones ▾ (Messi / Ronaldo / Verstappen / Hamilton) · Drops · Admin.
- Keep separate `/shop/football` and `/shop/f1` — do NOT merge.
- New routes: `/shop/worldcup`, `/shop/retro`, `/zone/$slug` (single dynamic route for 4 zones).

### 4. Buy-2-Get-1 promo
- Site-wide banner strip (top of every page, dismissible per session): "BUY 2 GET 1 FREE · Auto-applied at 3 jerseys · Code B2G1".
- Cart logic in `store.tsx`:
  - When total jersey qty ≥ 3, auto-apply coupon `B2G1`.
  - Discount = price of the single cheapest unit among the 3 (only 3 jerseys eligible per trigger — enforced as "one free per 3 items", so `freeUnits = floor(totalQty / 3)`, discount sums the cheapest `freeUnits` unit prices).
  - Expand cart lines into a flat unit array by price DESC, take last `freeUnits` as free.
- Show discount line in `CartDrawer` and `checkout` with "1 FREE (B2G1)" tag on cheapest item.
- Cap: "Max 3 jerseys per B2G1 trigger" copy — implementation naturally scales but we cap `freeUnits = min(freeUnits, floor(qty/3))` which is already the rule; add explicit banner note.

### 5. Limited drops countdown data
- Move drop config to `src/lib/drops.ts` with `{id, name, startsAt, endsAt, hero, productIds}`.
- Homepage countdown reads from active drop.
- Admin edits drops.

### 6. Admin panel
Route: `/admin` (no auth — local demo; note in UI: "Local demo · localStorage").
Tabs (custom, not shadcn Tabs to keep bundle light):
- **Products**: table with search, category filter, edit price/stock/badge inline, add new (id/name/team/category/price/stock/tag), delete. Backed by `usePersistedState('veloce.admin.products', PRODUCTS)` merged over seed catalog via a new `useCatalog()` hook.
- **Inventory**: quick stock adjuster grid (± buttons, low-stock highlight <10).
- **Categories**: read-only list of the 4 categories + counts + toggle "featured on home".
- **Drops**: edit name, start/end datetime-local, choose products (checkbox list), preview countdown.

Refactor: replace direct `PRODUCTS` imports in shop/PDP/home with `useCatalog()` from `src/lib/catalog-store.tsx` so admin edits reflect live. Keep `PRODUCTS` export as seed.

### 7. Homepage additions
- Add "World Cup" and "Retro" cards to category section (2×2 grid now, or 4-across on desktop).
- Add "Player Zones" strip with 4 portraits linking to `/zone/$slug`.
- Keep dual-world hero.

### 8. B2G1 banner component
`src/components/PromoBanner.tsx` — thin animated marquee bar above nav; dismiss stored in sessionStorage.

## Technical notes

- Catalog store: `CatalogProvider` wraps app in `__root.tsx` alongside `ShopProvider`. Products persisted; drops persisted; category order persisted.
- INR formatting: `new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0})`.
- B2G1 math in a pure `computeCart(cart, products)` returning `{lines, subtotal, discount, freeUnitIds, shipping, tax, total}` — used by cart drawer, checkout, and any promo copy.
- No new deps. No backend. All state client-side (localStorage) per existing pattern.

## Files

Create:
- `src/lib/catalog-store.tsx`, `src/lib/drops.ts`, `src/lib/pricing.ts`, `src/lib/format.ts`
- `src/components/PromoBanner.tsx`
- `src/routes/admin.tsx`, `src/routes/shop.worldcup.tsx`, `src/routes/shop.retro.tsx`, `src/routes/zone.$slug.tsx`

Edit:
- `src/lib/catalog.ts` (expand products, categories, series, zone tags)
- `src/lib/store.tsx` (auto B2G1, INR-aware totals)
- `src/lib/utils.ts` (INR helper) — or new `format.ts`
- `src/components/chrome.tsx` (nav, cart drawer INR + B2G1 line, banner mount)
- `src/components/ProductCard.tsx` (INR)
- `src/routes/__root.tsx` (mount CatalogProvider + PromoBanner)
- `src/routes/index.tsx` (categories 2×2, player zones strip, INR, drops from `drops.ts`)
- `src/routes/product.$id.tsx`, `shop.tsx`, `checkout.tsx`, `compare.tsx`, `wishlist.tsx` (INR + useCatalog)

Verification: type check via automatic build; spot-check `/admin`, `/shop/worldcup`, `/zone/messi`, cart with 3 items via preview.
