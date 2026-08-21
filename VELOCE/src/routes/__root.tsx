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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-left overflow-auto max-h-48 text-xs text-red-600 font-mono">
          <div className="font-bold">{error.name}: {error.message}</div>
          <div className="mt-2 whitespace-pre-wrap opacity-80">{error.stack}</div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
      { title: "Veloce Wear — Football, F1, Basketball & Cricket Jerseys/Merch" },
      {
        name: "description",
        content:
          "Veloce Wear curates authentic match-day football kits, official Formula 1 team merchandise, basketball jerseys, and cricket gear. Engineered precision. Delivered worldwide.",
      },
      { name: "author", content: "Veloce Wear" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:title", content: "Veloce Wear — Football, F1, Basketball & Cricket Jerseys/Merch" },
      {
        property: "og:description",
        content:
          "Veloce Wear curates authentic match-day football kits, official Formula 1 team merchandise, basketball jerseys, and cricket gear. Engineered precision. Delivered worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/logo.png" },
      { name: "twitter:title", content: "Veloce Wear — Football, F1, Basketball & Cricket Jerseys/Merch" },
      {
        name: "twitter:description",
        content:
          "Veloce Wear curates authentic match-day football kits, official Formula 1 team merchandise, basketball jerseys, and cricket gear. Engineered precision. Delivered worldwide.",
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
  const currentUrl = `https://velocewear.shop${location.pathname}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Veloce Wear",
    "url": "https://velocewear.shop",
    "logo": "https://velocewear.shop/logo.png"
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

function AnimatedRouteContent() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, filter: "blur(8px)", y: 4 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-1"
    >
      <Outlet />
    </motion.div>
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
