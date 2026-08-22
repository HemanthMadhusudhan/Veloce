import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

import appCss from "../styles.css?url";
import { ShopProvider } from "@/lib/store";
import { CatalogProvider } from "@/lib/catalog-store";
import { SiteImagesProvider } from "@/lib/site-images";
import { TeamsProvider } from "@/lib/teams";

import { SupportBot } from "@/components/SupportBot";
import { Toaster } from "@/components/ui/sonner";
import { NotFoundPage } from "@/components/NotFoundPage";

function NotFoundComponent() {
  return <NotFoundPage />;
}

function isChunkLoadError(error: any): boolean {
  if (!error) return false;
  const msg = (error?.message || error?.toString() || "").toLowerCase();
  const name = (error?.name || "").toLowerCase();
  return (
    msg.includes("mime type") ||
    msg.includes("text/html") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to fetch") ||
    msg.includes("importing a module script failed") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    name.includes("chunkloaderror")
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", () => {
    const lastReload = sessionStorage.getItem("veloce_chunk_reload");
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem("veloce_chunk_reload", String(now));
      window.location.reload();
    }
  });
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const isChunkError = isChunkLoadError(error);

  useEffect(() => {
    if (typeof window !== "undefined" && isChunkError) {
      const lastReload = sessionStorage.getItem("veloce_chunk_reload");
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem("veloce_chunk_reload", String(now));
        window.location.reload();
      }
    }
  }, [isChunkError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isChunkError ? "Updating to latest version..." : "This page didn't load"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isChunkError
            ? "A new version of Veloce Wear was deployed. Refreshing your page..."
            : "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        {!isChunkError && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-left overflow-auto max-h-48 text-xs text-red-600 font-mono">
            <div className="font-bold">{error.name}: {error.message}</div>
            <div className="mt-2 whitespace-pre-wrap opacity-80">{error.stack}</div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              if (isChunkError) {
                window.location.reload();
              } else {
                router.invalidate();
                reset();
              }
            }}
            className="inline-flex items-center justify-center rounded-none bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
          >
            {isChunkError ? "Refresh Now" : "Try again"}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-none border border-neutral-300 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100 transition"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Veloce Wear — Buy Authentic Football, F1 & Cricket Jerseys Online India" },
      {
        name: "description",
        content:
          "Shop 1:1 authentic football jerseys, official Formula 1 team t-shirts, cricket gear, and retro kits online in India. Real Madrid, Barcelona, Arsenal, Man City, player version kits. Free express shipping PAN India & COD available.",
      },
      {
        name: "keywords",
        content:
          "football jerseys, buy football jersey india, real madrid jersey, barcelona jersey, arsenal jersey, new football kits, retro jerseys india, f1 t shirts india, cricket jerseys, player version jersey, fan version jersey, custom jersey printing india",
      },
      { name: "author", content: "Veloce Wear" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:title", content: "Veloce Wear — Buy Authentic Football, F1 & Cricket Jerseys Online India" },
      {
        property: "og:description",
        content:
          "Shop 1:1 authentic football jerseys, official Formula 1 team t-shirts, cricket gear, and retro kits online in India. Real Madrid, Barcelona, Arsenal, Man City, player version kits. Free express shipping PAN India & COD available.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/logo.png" },
      { name: "twitter:title", content: "Veloce Wear — Buy Authentic Football, F1 & Cricket Jerseys Online India" },
      {
        name: "twitter:description",
        content:
          "Shop 1:1 authentic football jerseys, official Formula 1 team t-shirts, cricket gear, and retro kits online in India. Free express shipping PAN India & COD available.",
      },
      { name: "google-site-verification", content: "oPzpm4BDpj02pakSqCyZa4EDEF5TlkRyLNyesRTQUI4" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { rel: "icon", href: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/favicon-192x192.png", sizes: "192x192" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const rawPath = location.pathname || "/";
  const canonicalPath = rawPath === "/" ? "" : rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
  const currentUrl = `https://velocewear.shop${canonicalPath || "/"}`;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "www.velocewear.shop") {
      window.location.replace(`https://velocewear.shop${window.location.pathname}${window.location.search}`);
    }
  }, []);
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ClothingStore", "OnlineStore"],
    "name": "Veloce Wear",
    "url": "https://velocewear.shop",
    "logo": "https://velocewear.shop/logo.png",
    "image": "https://velocewear.shop/logo.png",
    "description": "India's premier online sportswear store for 1:1 authentic football jerseys, Formula 1 teamwear, cricket gear and retro kits.",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash on Delivery, Credit Card, Debit Card, UPI, Net Banking",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "sameAs": [
      "https://t.me/Velocewear",
      "https://instagram.com/velocewear"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Veloce Wear",
    "url": "https://velocewear.shop",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://velocewear.shop/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://velocewear.shop"
      }
    ]
  };

  if (location.pathname.startsWith('/shop')) {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Shop",
      "item": "https://velocewear.shop/shop"
    });
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);
  return null;
}

function AnimatedRouteContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex-1"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogProvider>
        <ShopProvider>
          <SiteImagesProvider>
            <TeamsProvider>
              <ScrollToTop />
              <AnimatedRouteContent />
              <SupportBot />
              <Toaster duration={1500} />
            </TeamsProvider>
          </SiteImagesProvider>
        </ShopProvider>
      </CatalogProvider>
    </QueryClientProvider>
  );
}
