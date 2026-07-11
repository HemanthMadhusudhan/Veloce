import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { i as useSiteImage } from "./site-images-DJGASOV0.mjs";
import { r as ZONES } from "./catalog-ChwsJiyw.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Gift, et as ArrowUpRight, t as X } from "../_libs/lucide-react.mjs";
import { i as SiteChrome, n as PerksStrip } from "./chrome-LNFqOEFI.mjs";
import { n as useDrops, r as useHotSelling, t as DEFAULT_DROPS } from "./hot-selling-C8FzRufR.mjs";
import { n as ProductCard, t as Picture } from "./ProductCard-ao1YtOfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-MFmdJ1GS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MARQUEE = [
	"Scuderia Ferrari",
	"Real Madrid",
	"Oracle Red Bull Racing",
	"Manchester City",
	"Mercedes-AMG Petronas",
	"Paris Saint-Germain",
	"McLaren F1",
	"Arsenal FC",
	"Aston Martin Aramco",
	"Bayern München",
	"FC Barcelona"
];
var REVIEWS = [
	{
		name: "Arjun Mehta",
		rating: 5,
		text: "Ordered a Real Madrid home jersey — the quality is insane for ₹599. Stitching is perfect, fabric feels premium. Already ordered 2 more!",
		product: "Real Madrid Home 24/25",
		date: "Jun 2026"
	},
	{
		name: "Priya Sharma",
		rating: 5,
		text: "B2G1 deal is legit! Got 3 jerseys for the price of 2. Delivery was super fast to Bangalore. Will definitely order again.",
		product: "Barcelona Away 24/25",
		date: "Jun 2026"
	},
	{
		name: "Rahul Singh",
		rating: 5,
		text: "The Ferrari F1 team polo is fire 🔥 My friends thought it was an original from the F1 store. Custom name printing was a nice touch.",
		product: "Ferrari Team Polo 2026",
		date: "May 2026"
	},
	{
		name: "Sneha Patel",
		rating: 4,
		text: "Good quality jersey, fits true to size. Packaging was really nice too. Only wish there were more retro options. Overall very happy!",
		product: "Argentina Home WC 2026",
		date: "Jul 2026"
	},
	{
		name: "Vikram Reddy",
		rating: 5,
		text: "Ordered the McLaren merch for my dad's birthday. He absolutely loved it. The quality exceeded our expectations. 10/10 recommend.",
		product: "McLaren Team Tee 2026",
		date: "Jun 2026"
	},
	{
		name: "Ananya Gupta",
		rating: 5,
		text: "Finally a store that delivers authentic jerseys without burning a hole in your pocket. The World Cup collection is amazing! 🏆",
		product: "Brazil Home WC 2026",
		date: "Jul 2026"
	}
];
function Star$1({ filled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: `h-3 w-3 sm:h-4 sm:w-4 ${filled ? "text-yellow-400" : "text-border/60"}`,
		viewBox: "0 0 20 20",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
	});
}
function useCountdown(target) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	const d = Math.max(0, target - now);
	return {
		days: Math.floor(d / 864e5),
		hours: Math.floor(d / 36e5 % 24),
		mins: Math.floor(d / 6e4 % 60),
		secs: Math.floor(d / 1e3 % 60)
	};
}
function Index() {
	const { isAdmin } = useShop();
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		if (isAdmin) nav({
			to: "/admin",
			replace: true
		});
	}, [isAdmin, nav]);
	if (isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home, {}) });
}
function isVideoUrl(url) {
	if (!url) return false;
	return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.includes("player.vimeo.com") || url.includes("youtube.com/embed") || url.startsWith("data:video/");
}
function Home() {
	const { products } = useCatalog();
	const { drops } = useDrops();
	const heroBg = useSiteImage("hero");
	const filmVideo = useSiteImage("film-video");
	const [filmOpen, setFilmOpen] = (0, import_react.useState)(false);
	const worldCupImg = useSiteImage("worldcup-banner");
	const catFootball = useSiteImage("category-football");
	const catF1 = useSiteImage("category-f1");
	const zoneMessi = useSiteImage("zone-messi");
	const zoneRonaldo = useSiteImage("zone-ronaldo");
	const zoneVerstappen = useSiteImage("zone-verstappen");
	const zoneHamilton = useSiteImage("zone-hamilton");
	const activeDrop = drops[0] ?? DEFAULT_DROPS[0];
	const c = useCountdown(activeDrop.endsAt);
	const featured = products.slice(0, 8);
	const drop = products.find((p) => p.id === activeDrop.productId) ?? products.find((p) => p.badge === "Limited") ?? products[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sm:hidden -mt-[76px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative w-full h-[300px] overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0",
							children: [
								isVideoUrl(heroBg) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: heroBg,
									autoPlay: true,
									loop: true,
									muted: true,
									playsInline: true,
									className: "absolute inset-0 h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
									src: heroBg,
									alt: "",
									sizes: "100vw",
									loading: "eager",
									fetchpriority: "high",
									className: "absolute inset-0 h-full w-full",
									imgClassName: "h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-noise opacity-40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pointer-events-none absolute inset-0 overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "streak",
											style: {
												top: "22%",
												animationDelay: "0s"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "streak",
											style: {
												top: "58%",
												animationDelay: "1.6s"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "streak",
											style: {
												top: "78%",
												animationDelay: "3.2s"
											}
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-8 pt-20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-reveal",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-brand",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-4 bg-brand" }), " Season 25 · Global Drop"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "font-display text-2xl font-bold leading-[0.95] tracking-tight text-foreground",
										children: [
											"Precision.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"Rendered ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "italic text-brand",
												children: "in fabric."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] text-brand",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-2.5 w-2.5 shrink-0" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: "BUY 2 GET 1 FREE · CODE B2G1"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex flex-wrap items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/shop",
											className: "group inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-background transition hover:bg-brand hover:text-foreground",
											children: ["Enter collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })]
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-background/40 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-4 overflow-hidden px-4 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-brand" }), " LIVE · Monza Drop"]
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative w-full h-[250px] overflow-hidden bg-surface mt-1",
					children: [
						isVideoUrl(worldCupImg) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: worldCupImg,
							autoPlay: true,
							loop: true,
							muted: true,
							playsInline: true,
							className: "absolute inset-0 h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
							src: worldCupImg,
							alt: "World Cup",
							sizes: "100vw",
							loading: "eager",
							fetchpriority: "high",
							className: "absolute inset-0 h-full w-full",
							imgClassName: "h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-end px-5 pb-6 text-center z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[1.75rem] leading-[1] font-bold tracking-tight text-white drop-shadow-md mb-4 uppercase",
								children: "FIFA World Cup 2026"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop/worldcup",
								className: "inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-background active:scale-95 transition-transform shadow-lg",
								children: "Shop World Cup"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "w-full grid grid-cols-2 gap-1 bg-background pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop/football",
						className: "relative block w-full aspect-square overflow-hidden",
						children: [
							isVideoUrl(catFootball) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: catFootball,
								autoPlay: true,
								loop: true,
								muted: true,
								playsInline: true,
								className: "absolute inset-0 h-full w-full object-cover opacity-80"
							}) : catFootball ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: catFootball,
								alt: "Football",
								className: "absolute inset-0 h-full w-full object-cover opacity-80"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center p-3 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl sm:text-3xl font-bold tracking-widest text-white drop-shadow-md",
									children: "FOOTBALL"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop/f1",
						className: "relative block w-full aspect-square overflow-hidden",
						children: [
							isVideoUrl(catF1) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: catF1,
								autoPlay: true,
								loop: true,
								muted: true,
								playsInline: true,
								className: "absolute inset-0 h-full w-full object-cover opacity-80"
							}) : catF1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: catF1,
								alt: "Formula 1",
								className: "absolute inset-0 h-full w-full object-cover opacity-80"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center p-3 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl sm:text-3xl font-bold tracking-widest text-white drop-shadow-md",
									children: "FORMULA 1"
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "w-full bg-gradient-to-b from-surface/80 to-background py-6 px-4 text-center border-b border-border/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[13px] leading-relaxed text-foreground max-w-[300px] mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Player Version Football Jerseys at just ₹599!"
						}), " Experience premium quality and comfort in The Veloce style. Never Seen Before."]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "w-full py-8 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center px-4 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold tracking-wide text-foreground",
							children: "SHOP BY ZONE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1",
							children: "Scroll Right To Explore"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 px-4 pb-4",
						children: ZONES.map((z) => {
							const img = {
								messi: zoneMessi,
								ronaldo: zoneRonaldo,
								verstappen: zoneVerstappen,
								hamilton: zoneHamilton
							}[z.slug];
							const isVid = isVideoUrl(img);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/zone/$slug",
								params: { slug: z.slug },
								className: "group relative block aspect-[4/5] overflow-hidden rounded-xl border border-border/40 shadow-sm",
								children: [
									isVid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										src: img,
										autoPlay: true,
										loop: true,
										muted: true,
										playsInline: true,
										className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									}) : img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: z.name,
										className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-x-0 bottom-0 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] font-bold tracking-widest text-white uppercase truncate",
											children: z.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block mt-0.5 text-[9px] text-white/70 uppercase tracking-widest truncate",
											children: z.category === "f1" ? "The Paddock" : "The Pitch"
										})]
									})
								]
							}, z.slug);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileKitsCarousel, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative -mt-24 hidden sm:block h-[100svh] min-h-[700px] w-full overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0",
					children: [
						isVideoUrl(heroBg) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: heroBg,
							autoPlay: true,
							loop: true,
							muted: true,
							playsInline: true,
							className: "absolute inset-0 h-full w-full object-cover animate-slow-zoom"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
							src: heroBg,
							alt: "",
							sizes: "100vw",
							loading: "eager",
							fetchpriority: "high",
							className: "absolute inset-0 h-full w-full",
							imgClassName: "h-full w-full object-cover animate-slow-zoom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-noise opacity-40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute inset-0 overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "streak",
									style: {
										top: "22%",
										animationDelay: "0s"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "streak",
									style: {
										top: "58%",
										animationDelay: "1.6s"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "streak",
									style: {
										top: "78%",
										animationDelay: "3.2s"
									}
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-44 sm:px-6 sm:pb-24 sm:pt-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-reveal",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px] sm:tracking-[0.32em]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-6 bg-brand sm:w-8" }), " Season 25 · Global Drop"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-[2rem] xs:text-[2.4rem] font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-[clamp(3rem,7vw,6rem)]",
								children: [
									"Precision.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Rendered",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "italic text-brand",
										children: "in fabric."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-lg text-[12px] leading-relaxed text-muted-foreground sm:text-base",
								children: "Elite football jerseys and Formula 1 team merchandise, delivered with the craft of a couture atelier. Every piece authenticated. Every stitch, engineered."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-brand sm:text-[10px] sm:tracking-[0.24em]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3 w-3 shrink-0" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "BUY 2 GET 1 FREE · CODE B2G1"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-wrap items-center gap-3 sm:mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/shop",
									className: "group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-brand hover:text-foreground sm:px-6 sm:text-xs sm:tracking-[0.24em]",
									children: ["Enter the collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-background/40 backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 overflow-hidden px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:gap-8 sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.28em]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-brand" }), " LIVE · Monza GP Drop"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "FREE SHIPPING OVER ₹499"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: "Lifetime authentication"
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "worlds",
			className: "mx-auto mt-12 hidden sm:block max-w-7xl px-5 sm:mt-24 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 sm:mb-10 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]",
					children: "Four worlds. One atelier."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-bold sm:text-5xl",
					children: "Choose your grid."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "hidden text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:block",
					children: "Shop all"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryCard, {
					href: "/shop/football",
					img: catFootball,
					eyebrow: "The Pitch",
					title: "Football Jerseys",
					desc: "Match-day kits from Madrid to München. Includes FIFA World Cup & Retro collections."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryCard, {
					href: "/shop/f1",
					img: catF1,
					eyebrow: "The Paddock",
					title: "Formula 1 Merch",
					desc: "Paddock-grade teamwear from every constructor — and the Legends series."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerksStrip, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative mx-auto mt-14 hidden sm:block max-w-7xl overflow-hidden rounded-3xl border border-border/40 sm:mt-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[16/10] w-full sm:aspect-[21/9]",
				children: [
					isVideoUrl(worldCupImg) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: worldCupImg,
						autoPlay: true,
						loop: true,
						muted: true,
						playsInline: true,
						className: "absolute inset-0 h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
						src: worldCupImg,
						alt: "",
						sizes: "(min-width: 1280px) 1200px, 100vw",
						className: "absolute inset-0 h-full w-full",
						imgClassName: "h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex h-full flex-col items-center justify-between px-5 pt-8 pb-2 text-center sm:pt-10 sm:pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-5xl",
								children: "FIFA World Cup 2026"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop/worldcup",
								className: "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground sm:px-6 sm:py-3 sm:text-xs",
								children: "Shop World Cup"
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-12 hidden sm:block max-w-7xl px-5 sm:mt-24 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 sm:mb-8 flex items-end justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]",
					children: "Icons · Curated capsules"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-bold sm:text-5xl",
					children: "Player Zones."
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: ZONES.map((z) => {
					const zoneImageMap = {
						messi: zoneMessi,
						ronaldo: zoneRonaldo,
						verstappen: zoneVerstappen,
						hamilton: zoneHamilton
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoneCard, {
						slug: z.slug,
						name: z.name,
						tagline: z.tagline,
						world: z.category === "f1" ? "The Paddock" : "The Pitch",
						img: zoneImageMap[z.slug]
					}, z.slug);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-14 overflow-hidden border-y border-border/50 py-5 sm:py-6 sm:mt-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-max animate-marquee gap-10 px-6 font-display text-lg font-medium text-muted-foreground sm:gap-14 sm:text-3xl",
				children: [...MARQUEE, ...MARQUEE].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-10 sm:gap-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-brand",
						children: "✕"
					})]
				}, i))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-12 max-w-7xl px-5 sm:mt-20 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 sm:mb-10 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]",
					children: "Editors' Selection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-bold sm:text-5xl",
					children: "Curated this week."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
					children: "All products →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4",
				children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			})]
		}),
		drop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto mt-14 max-w-7xl px-5 sm:mt-24 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-surface via-background to-surface p-6 sm:p-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 md:grid-cols-2 md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]",
							children: activeDrop.eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-3 font-display text-2xl font-bold leading-tight sm:text-6xl",
							children: [drop.name, "."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-xs text-muted-foreground sm:text-sm",
							children: "Numbered edition. Individually authenticated. Once it's gone, it's archived forever."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid grid-cols-4 gap-2 sm:mt-8 sm:gap-3",
							children: [
								["Days", c.days],
								["Hours", c.hours],
								["Min", c.mins],
								["Sec", c.secs]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/50 bg-background/40 p-2 text-center backdrop-blur sm:p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-lg font-bold sm:text-3xl",
									children: String(v).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[9px] uppercase tracking-[0.24em] text-muted-foreground",
									children: k
								})]
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$id",
							params: { id: drop.id },
							className: "mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground",
							children: ["ORDER NOW ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/5] max-w-[220px] sm:max-w-none mx-auto w-full overflow-hidden rounded-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
								src: drop.images[0],
								alt: drop.name,
								sizes: "(min-width: 768px) 50vw, 100vw",
								className: "absolute inset-0 h-full w-full",
								imgClassName: "h-full w-full object-cover animate-slow-zoom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" }),
							"              "
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-32 max-w-4xl px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.32em] text-brand",
					children: "The Veloce Standard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-display text-xl leading-snug tracking-tight text-balance sm:text-5xl",
					children: "\"We treat every jersey and every team suit like a museum piece. Because to the fans who wear them, that's exactly what they are.\""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-xs uppercase tracking-[0.24em] text-muted-foreground",
					children: "— Alessandro Vega · Founder"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-16 max-w-7xl px-5 sm:mt-24 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 sm:mb-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brand",
						children: "Trusted by fans"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-bold sm:text-5xl",
						children: "What our customers say."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star$1, { filled: true }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm text-muted-foreground",
								children: "4.9 / 5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground uppercase tracking-wider",
								children: "· 2,847 reviews"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6",
				children: REVIEWS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-6 space-y-3 transition hover:border-border/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-0.5",
							children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star$1, { filled: j < r.rating }, j))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
							children: [
								"\"",
								r.text,
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand/20 text-[10px] sm:text-xs font-bold text-brand",
								children: r.name.split(" ").map((n) => n[0]).join("")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] sm:text-xs font-semibold",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[9px] sm:text-[10px] text-muted-foreground",
								children: [
									r.product,
									" · ",
									r.date
								]
							})] })]
						})
					]
				}, i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-24 max-w-2xl px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.28em] text-brand",
					children: "Members' Preview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-2xl font-bold sm:text-4xl",
					children: "Drops. Delivered first."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						const form = e.currentTarget;
						if (form.elements.namedItem("newsletter_email")?.value) {
							alert("You will be notified!");
							form.reset();
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "newsletter_email",
						type: "email",
						required: true,
						placeholder: "your@email.com",
						className: "flex-1 rounded-full border border-border/70 bg-transparent px-5 py-3 text-sm outline-none focus:border-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground",
						children: "Get access"
					})]
				})
			]
		}),
		filmOpen && filmVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-background shadow-2xl animate-in zoom-in-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilmOpen(false),
					className: "absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white transition cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: filmVideo,
					autoPlay: true,
					controls: true,
					playsInline: true,
					className: "h-full w-full"
				})]
			})
		})
	] });
}
function CategoryCard({ href, img, eyebrow, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: "group relative block aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[3/2]",
		children: [
			isVideoUrl(img) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: img,
				autoPlay: true,
				loop: true,
				muted: true,
				playsInline: true,
				className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
				src: img,
				alt: title,
				sizes: "(min-width: 768px) 50vw, 100vw",
				className: "absolute inset-0 h-full w-full",
				imgClassName: "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col justify-end p-5 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-display text-2xl font-bold sm:text-5xl",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-xs text-muted-foreground sm:text-sm",
						children: desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-foreground",
						children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })]
					})
				]
			})
		]
	});
}
function ZoneCard({ slug, name, tagline, world, img }) {
	const isVid = isVideoUrl(img);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/zone/$slug",
		params: { slug },
		className: "group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/40",
		children: [
			isVid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: img,
				autoPlay: true,
				loop: true,
				muted: true,
				playsInline: true,
				className: "absolute inset-0 h-full w-full opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08] group-hover:opacity-80"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
				src: img,
				alt: name,
				sizes: "(min-width: 1024px) 25vw, 50vw",
				className: "absolute inset-0 h-full w-full opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08] group-hover:opacity-80",
				imgClassName: "h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col justify-end p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] uppercase tracking-[0.28em] text-brand",
						children: world
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-display text-2xl font-bold",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em]",
						children: ["Enter zone ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
					})
				]
			})
		]
	});
}
function MobileKitsCarousel() {
	const { products } = useCatalog();
	const { hotSellingIds, loaded } = useHotSelling();
	const defaultKits = products.filter((p) => p.category === "football" && p.name.toLowerCase().includes("home")).slice(0, 4);
	const slides = hotSellingIds.length > 0 ? hotSellingIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) : defaultKits.length > 0 ? defaultKits : products.slice(0, 4);
	const [activeIdx, setActiveIdx] = (0, import_react.useState)(0);
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!loaded || slides.length === 0) return;
		const interval = setInterval(() => {
			if (!scrollRef.current) return;
			const container = scrollRef.current;
			const nextIdx = (activeIdx + 1) % slides.length;
			const width = container.clientWidth;
			container.scrollTo({
				left: width * nextIdx,
				behavior: "smooth"
			});
		}, 3e3);
		return () => clearInterval(interval);
	}, [
		activeIdx,
		slides.length,
		loaded
	]);
	if (!loaded || slides.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "w-full bg-surface overflow-hidden border-y border-border/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center px-4 pt-10 pb-6 relative z-20 bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-[32px] sm:text-[36px] font-black leading-[1] tracking-tight text-foreground uppercase flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hot Selling" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative inline-block",
					children: ["Kits", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-[85%] left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] text-[#b5ff14] pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 240 28",
							fill: "none",
							xmlns: "http://www.w3.org/2000/svg",
							className: "w-full h-auto drop-shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M10,10 Q80,5 230,8 Q120,20 30,22 Q100,28 150,26",
								stroke: "currentColor",
								strokeWidth: "4",
								strokeLinecap: "round",
								fill: "none"
							})
						})
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full h-[420px] sm:h-[500px] overflow-hidden border-t border-white/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollRef,
				className: "flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4",
				onScroll: (e) => {
					const scrollLeft = e.currentTarget.scrollLeft;
					const width = e.currentTarget.clientWidth;
					setActiveIdx(Math.round(scrollLeft / width));
				},
				children: slides.map((p) => {
					const img = p.images[0] || "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative w-full h-full shrink-0 snap-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$id",
							params: { id: p.id },
							className: "block w-full h-full relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
									src: img,
									alt: p.name,
									className: "absolute inset-0 w-full h-full",
									imgClassName: "w-full h-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-10 left-5 right-5 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tighter leading-tight drop-shadow-lg",
										children: p.team
									})
								})
							]
						})
					}, p.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-5 left-0 right-0 flex justify-center items-center gap-3 z-20 pointer-events-none",
				children: slides.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `transition-all duration-300 ${i === activeIdx ? "h-2 w-4 rounded-full bg-foreground" : "h-1.5 w-1.5 rounded-full bg-foreground/30"}` }, i))
			})]
		})]
	});
}
//#endregion
export { Index as component };
