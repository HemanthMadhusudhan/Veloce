import { r as ZONES } from "./catalog-ChwsJiyw.mjs";
import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/zone._slug-BdCV9az9.js
var $$splitComponentImporter = () => import("./zone._slug-C3GDw5je.mjs");
var $$splitNotFoundComponentImporter = () => import("./zone2._slug-Cz3ZviDB.mjs");
var VALID = [
	"messi",
	"ronaldo",
	"verstappen",
	"hamilton"
];
var Route = createFileRoute("/zone/$slug")({
	loader: ({ params }) => {
		if (!VALID.includes(params.slug)) throw notFound();
		return { zone: ZONES.find((z) => z.slug === params.slug) };
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.zone.name} · Zone — Veloce` : "Zone — Veloce" }, {
		name: "description",
		content: loaderData ? `The ${loaderData.zone.name} zone — curated pieces from Veloce.` : "Player zones on Veloce."
	}] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
