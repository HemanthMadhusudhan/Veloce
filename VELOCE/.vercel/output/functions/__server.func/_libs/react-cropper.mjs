import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "./react+tanstack__react-query.mjs";
import { t as Cropper } from "./cropperjs.mjs";
//#region node_modules/react-cropper/dist/react-cropper.es.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var n = function() {
	return n = Object.assign || function(e) {
		for (var r, o = 1, t = arguments.length; o < t; o++) for (var n in r = arguments[o]) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
		return e;
	}, n.apply(this, arguments);
};
function a(e, r) {
	var o = {};
	for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && r.indexOf(t) < 0 && (o[t] = e[t]);
	if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
		var n = 0;
		for (t = Object.getOwnPropertySymbols(e); n < t.length; n++) r.indexOf(t[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, t[n]) && (o[t[n]] = e[t[n]]);
	}
	return o;
}
var c = [
	"aspectRatio",
	"autoCrop",
	"autoCropArea",
	"background",
	"center",
	"checkCrossOrigin",
	"checkOrientation",
	"cropBoxMovable",
	"cropBoxResizable",
	"data",
	"dragMode",
	"guides",
	"highlight",
	"initialAspectRatio",
	"minCanvasHeight",
	"minCanvasWidth",
	"minContainerHeight",
	"minContainerWidth",
	"minCropBoxHeight",
	"minCropBoxWidth",
	"modal",
	"movable",
	"preview",
	"responsive",
	"restore",
	"rotatable",
	"scalable",
	"toggleDragModeOnDblclick",
	"viewMode",
	"wheelZoomRatio",
	"zoomOnTouch",
	"zoomOnWheel",
	"zoomable",
	"cropstart",
	"cropmove",
	"cropend",
	"crop",
	"zoom",
	"ready"
], i = {
	opacity: 0,
	maxWidth: "100%"
}, l = import_react.forwardRef((function(l, s) {
	var u = a(l, []), p = u.dragMode, d = void 0 === p ? "crop" : p, v = u.src, f = u.style, m = u.className, g = u.crossOrigin, y = u.scaleX, b = u.scaleY, h = u.enable, O = u.zoomTo, T = u.rotateTo, z = u.alt, C = void 0 === z ? "picture" : z, w = u.ready, x = u.onInitialized, j = a(u, [
		"dragMode",
		"src",
		"style",
		"className",
		"crossOrigin",
		"scaleX",
		"scaleY",
		"enable",
		"zoomTo",
		"rotateTo",
		"alt",
		"ready",
		"onInitialized"
	]), M = {
		scaleY: b,
		scaleX: y,
		enable: h,
		zoomTo: O,
		rotateTo: T
	}, E = function() {
		for (var o = [], t = 0; t < arguments.length; t++) o[t] = arguments[t];
		var n = (0, import_react.useRef)(null);
		return import_react.useEffect((function() {
			o.forEach((function(e) {
				e && ("function" == typeof e ? e(n.current) : e.current = n.current);
			}));
		}), [o]), n;
	}(s, (0, import_react.useRef)(null));
	(0, import_react.useEffect)((function() {
		var e;
		!(null === (e = E.current) || void 0 === e) && e.cropper && "number" == typeof O && E.current.cropper.zoomTo(O);
	}), [u.zoomTo]), (0, import_react.useEffect)((function() {
		var e;
		!(null === (e = E.current) || void 0 === e) && e.cropper && void 0 !== v && E.current.cropper.reset().clear().replace(v);
	}), [v]), (0, import_react.useEffect)((function() {
		if (null !== E.current) {
			var e = new Cropper(E.current, n(n({ dragMode: d }, j), { ready: function(e) {
				null !== e.currentTarget && function(e, r) {
					void 0 === r && (r = {});
					var o = r.enable, t = void 0 === o || o, n = r.scaleX, a = void 0 === n ? 1 : n, c = r.scaleY, i = void 0 === c ? 1 : c, l = r.zoomTo, s = void 0 === l ? 0 : l, u = r.rotateTo;
					t ? e.enable() : e.disable(), e.scaleX(a), e.scaleY(i), void 0 !== u && e.rotateTo(u), s > 0 && e.zoomTo(s);
				}(e.currentTarget.cropper, M), w && w(e);
			} }));
			x && x(e);
		}
		return function() {
			var e, r;
			null === (r = null === (e = E.current) || void 0 === e ? void 0 : e.cropper) || void 0 === r || r.destroy();
		};
	}), [E]);
	var R = function(e) {
		return c.reduce((function(e, r) {
			var o = e, t = r;
			return o[t], a(o, ["symbol" == typeof t ? t : t + ""]);
		}), e);
	}(n(n({}, j), {
		crossOrigin: g,
		src: v,
		alt: C
	}));
	return import_react.createElement("div", {
		style: f,
		className: m
	}, import_react.createElement("img", n({}, R, {
		style: i,
		ref: E
	})));
}));
//#endregion
export { l as t };
