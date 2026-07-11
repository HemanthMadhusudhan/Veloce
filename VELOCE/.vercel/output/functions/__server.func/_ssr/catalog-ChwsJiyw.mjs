//#region node_modules/.nitro/vite/services/ssr/assets/catalog-ChwsJiyw.js
var PRODUCTS = [];
Array.from(new Set(PRODUCTS.map((p) => p.team))).sort();
Array.from(new Set(PRODUCTS.map((p) => p.driver).filter(Boolean))).sort();
var TRENDING = [
	"Ferrari 2025 Team Kit",
	"Real Madrid Home",
	"Verstappen Cap",
	"McLaren Papaya",
	"PSG Blackout"
];
var ZONES = [
	{
		slug: "messi",
		name: "Leo Messi",
		tagline: "El Capitán · #10",
		category: "football"
	},
	{
		slug: "ronaldo",
		name: "Cristiano Ronaldo",
		tagline: "Siuu · #7",
		category: "football"
	},
	{
		slug: "verstappen",
		name: "Max Verstappen",
		tagline: "Simply Lovely · #1",
		category: "f1"
	},
	{
		slug: "hamilton",
		name: "Lewis Hamilton",
		tagline: "Still We Rise · #44",
		category: "f1"
	}
];
var CATEGORY_LABEL = {
	football: "Football",
	f1: "Formula 1",
	worldcup: "World Cup",
	retro: "Retro"
};
//#endregion
export { TRENDING as n, ZONES as r, CATEGORY_LABEL as t };
