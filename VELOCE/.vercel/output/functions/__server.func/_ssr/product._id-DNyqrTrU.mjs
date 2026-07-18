import { n as getLiveProduct } from "./catalog-store-DVlj9mYO.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-DNyqrTrU.js
var $$splitComponentImporter = () => import("./product._id-BmHNX2RD.mjs");
var $$splitErrorComponentImporter = () => import("./product._id-CoI6cUht.mjs");
var $$splitNotFoundComponentImporter = () => import("./product._id-DdL3XogF.mjs");
var Route = createFileRoute("/product/$id")({
	loader: ({ params }) => ({
		id: params.id,
		product: getLiveProduct(params.id) ?? null
	}),
	head: ({ loaderData }) => ({ meta: [
		{ title: loaderData?.product ? `${loaderData.product.name} — Veloce` : "Product — Veloce" },
		{
			name: "description",
			content: loaderData?.product?.description ?? "Veloce product."
		},
		{
			property: "og:title",
			content: loaderData?.product?.name ?? "Veloce"
		},
		{
			property: "og:description",
			content: loaderData?.product?.description ?? ""
		}
	] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
