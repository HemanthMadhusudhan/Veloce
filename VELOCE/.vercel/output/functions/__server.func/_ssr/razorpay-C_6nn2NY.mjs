import { o as __toESM } from "../_runtime.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as require_razorpay } from "../_libs/razorpay.mjs";
import crypto from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/razorpay-C_6nn2NY.js
var import_razorpay = /* @__PURE__ */ __toESM(require_razorpay());
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createRazorpayOrder_createServerFn_handler = createServerRpc({
	id: "e7461c44f7a960556129109463606ff603140d91822a72eff9cadfe0f0efd76e",
	name: "createRazorpayOrder",
	filename: "src/lib/razorpay.ts"
}, (opts) => createRazorpayOrder.__executeServer(opts));
var createRazorpayOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createRazorpayOrder_createServerFn_handler, async ({ data }) => {
	const { amount, currency, receipt } = data;
	if (!amount || amount < 100) throw new Error("Invalid amount");
	const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;
	if (!keyId || !keySecret) throw new Error("Razorpay keys missing");
	const razorpay = new import_razorpay.default({
		key_id: keyId,
		key_secret: keySecret
	});
	try {
		const order = await razorpay.orders.create({
			amount,
			currency: currency || "INR",
			receipt: receipt || `receipt_${Date.now()}`
		});
		return {
			order_id: order.id,
			amount: order.amount,
			currency: order.currency
		};
	} catch (err) {
		console.error("Error creating order with Razorpay API:", err);
		throw new Error("Failed to create order on server");
	}
});
var verifyRazorpayPayment_createServerFn_handler = createServerRpc({
	id: "06cdb36750bf1040ffabb92e8bcad45ba1e26e48a938a24692d2011303b37d08",
	name: "verifyRazorpayPayment",
	filename: "src/lib/razorpay.ts"
}, (opts) => verifyRazorpayPayment.__executeServer(opts));
var verifyRazorpayPayment = createServerFn({ method: "POST" }).validator((data) => data).handler(verifyRazorpayPayment_createServerFn_handler, async ({ data }) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;
	if (!keySecret) throw new Error("Razorpay secret missing");
	const body = razorpay_order_id + "|" + razorpay_payment_id;
	if (crypto.createHmac("sha256", keySecret).update(body.toString()).digest("hex") === razorpay_signature) return { success: true };
	else throw new Error("Signature mismatch");
});
//#endregion
export { createRazorpayOrder_createServerFn_handler, verifyRazorpayPayment_createServerFn_handler };
