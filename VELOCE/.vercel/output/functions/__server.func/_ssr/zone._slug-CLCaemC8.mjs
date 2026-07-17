import { r as ZONES } from "./catalog-ChwsJiyw.mjs";
import { N as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/zone._slug-CLCaemC8.js
var $$splitComponentImporter = () => import("./zone._slug-VRXNq3Hh.mjs");
var $$splitNotFoundComponentImporter = () => import("./zone2._slug-2mu5yD9f.mjs");
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
