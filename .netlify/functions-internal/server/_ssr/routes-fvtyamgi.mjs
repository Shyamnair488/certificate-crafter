import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { n as utils, t as readSync } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-fvtyamgi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var import_jspdf_node_min = require_jspdf_node_min();
var platepress_mark_default = "/assets/platepress-mark-CNdRN4zi.png";
var DEFAULT_EMAIL_HTML = `<div style="font-family:Georgia,serif;background:#E9E4D6;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#F4F0E5;border:1px solid #D5CFBE;padding:32px">
    <p style="letter-spacing:.25em;text-transform:uppercase;font-size:11px;color:#B23A1E;margin:0">
      Certificate enclosed
    </p>
    <h1 style="font-size:26px;margin:12px 0 0;color:#1B1814">Congratulations, {{name}}</h1>
    <p style="font-size:15px;line-height:1.6;color:#4a453e">
      Thank you for being part of our event. Your certificate is attached to this message —
      print it or keep it, it is yours.
    </p>
    <p style="font-size:13px;color:#6B655C;margin-top:28px">Warm regards,<br/>The events team</p>
  </div>
</div>`;
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function makeField(partial = {}) {
	const key = partial.key ?? "name";
	return {
		id: uid(),
		key,
		label: partial.label ?? key.replace(/(^|\s)\w/g, (m) => m.toUpperCase()),
		x: .5,
		y: .5,
		boxWidth: .7,
		fontFamily: "Spectral",
		fontSize: 48,
		fontWeight: 600,
		italic: false,
		color: "#1B1814",
		align: "center",
		letterSpacing: 0,
		lineHeight: 1.2,
		uppercase: false,
		opacity: 1,
		autoShrink: true,
		...partial
	};
}
function makeRow(values = {}) {
	return {
		__id: uid(),
		...values
	};
}
var initialExport = {
	format: "pdf",
	quality: .92,
	scale: 2,
	mode: "zip",
	filenamePattern: "{name}-certificate"
};
var initialEmail = {
	serviceId: "",
	templateId: "",
	publicKey: "",
	privateKey: "",
	fromName: "Events Team",
	subject: "Your certificate, {{name}}",
	html: DEFAULT_EMAIL_HTML,
	emailColumn: "email",
	attachFormat: "pdf"
};
var useStudio = create((set, get) => ({
	step: 0,
	template: null,
	fields: [],
	selectedId: null,
	rows: [],
	previewIndex: 0,
	exportSettings: initialExport,
	email: initialEmail,
	customFonts: [],
	setStep: (step) => set({ step }),
	setTemplate: (template) => set({ template }),
	addField: (f) => set((s) => {
		const field = makeField({
			key: f?.key ?? `field_${s.fields.length + 1}`,
			...f
		});
		return {
			fields: [...s.fields, field],
			selectedId: field.id
		};
	}),
	updateField: (id, patch) => set((s) => ({ fields: s.fields.map((f) => f.id === id ? {
		...f,
		...patch
	} : f) })),
	removeField: (id) => set((s) => ({
		fields: s.fields.filter((f) => f.id !== id),
		selectedId: s.selectedId === id ? null : s.selectedId
	})),
	duplicateField: (id) => set((s) => {
		const src = s.fields.find((f) => f.id === id);
		if (!src) return s;
		const copy = makeField({
			...src,
			key: `${src.key}_copy`,
			label: `${src.label} copy`,
			y: Math.min(.96, src.y + .08)
		});
		return {
			fields: [...s.fields, copy],
			selectedId: copy.id
		};
	}),
	select: (selectedId) => set({ selectedId }),
	setRows: (rows) => set({
		rows,
		previewIndex: 0
	}),
	addRow: (values) => set((s) => ({ rows: [...s.rows, makeRow(values)] })),
	updateCell: (id, key, value) => set((s) => ({ rows: s.rows.map((r) => r.__id === id ? {
		...r,
		[key]: value
	} : r) })),
	removeRow: (id) => set((s) => {
		const rows = s.rows.filter((r) => r.__id !== id);
		return {
			rows,
			previewIndex: Math.min(get().previewIndex, Math.max(0, rows.length - 1))
		};
	}),
	setPreviewIndex: (previewIndex) => set({ previewIndex }),
	setExportSettings: (patch) => set((s) => ({ exportSettings: {
		...s.exportSettings,
		...patch
	} })),
	setEmail: (patch) => set((s) => ({ email: {
		...s.email,
		...patch
	} })),
	addCustomFont: (family) => set((s) => ({ customFonts: s.customFonts.includes(family) ? s.customFonts : [...s.customFonts, family] })),
	reset: () => set({
		step: 0,
		template: null,
		fields: [],
		selectedId: null,
		rows: [],
		previewIndex: 0,
		exportSettings: initialExport,
		email: initialEmail
	})
}));
var BUILT_IN_FONTS = [
	{
		family: "Spectral",
		category: "Serif"
	},
	{
		family: "Playfair Display",
		category: "Serif"
	},
	{
		family: "Cormorant Garamond",
		category: "Serif"
	},
	{
		family: "EB Garamond",
		category: "Serif"
	},
	{
		family: "Marcellus",
		category: "Serif"
	},
	{
		family: "Cinzel",
		category: "Serif"
	},
	{
		family: "Lora",
		category: "Serif"
	},
	{
		family: "Space Grotesk",
		category: "Sans"
	},
	{
		family: "Montserrat",
		category: "Sans"
	},
	{
		family: "Great Vibes",
		category: "Script"
	},
	{
		family: "Dancing Script",
		category: "Script"
	},
	{
		family: "Tangerine",
		category: "Script"
	},
	{
		family: "IBM Plex Mono",
		category: "Mono"
	}
];
/** Fonts the user pulled in at runtime (uploaded file or Google Fonts name). */
var runtimeFonts = /* @__PURE__ */ new Set();
function registerRuntimeFont(family) {
	runtimeFonts.add(family);
}
function loadGoogleFont(family) {
	if (typeof document === "undefined") return;
	const id = `gf-${family.replace(/\s+/g, "-").toLowerCase()}`;
	if (document.getElementById(id)) return;
	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
	document.head.appendChild(link);
}
async function loadFontFile(file) {
	const family = file.name.replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, "").trim();
	const buffer = await file.arrayBuffer();
	const face = new FontFace(family, buffer);
	await face.load();
	document.fonts.add(face);
	registerRuntimeFont(family);
	return family;
}
/** Make sure every font used by the fields is actually rasterisable before drawing. */
async function ensureFontsReady(specs) {
	if (typeof document === "undefined" || !document.fonts) return;
	await Promise.all(specs.map((s) => document.fonts.load(`${s.italic ? "italic " : ""}${s.weight} ${Math.max(12, s.size)}px "${s.family}"`).catch(() => void 0)));
	await document.fonts.ready;
}
var imageCache = /* @__PURE__ */ new Map();
function loadImage(src) {
	const cached = imageCache.get(src);
	if (cached?.complete) return Promise.resolve(cached);
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			imageCache.set(src, img);
			resolve(img);
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that template image."));
		img.src = src;
	});
}
function fieldValue(field, row) {
	const value = (row?.[field.key] ?? "").toString().trim();
	const text = value.length ? value : `{${field.key}}`;
	return field.uppercase ? text.toUpperCase() : text;
}
function fontString(field, size) {
	return `${field.italic ? "italic " : ""}${field.fontWeight} ${size}px "${field.fontFamily}", serif`;
}
function wrap(ctx, text, maxWidth) {
	const words = text.split(/\s+/);
	const lines = [];
	let current = "";
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (ctx.measureText(next).width > maxWidth && current) {
			lines.push(current);
			current = word;
		} else current = next;
	}
	if (current) lines.push(current);
	return lines.length ? lines : [""];
}
function drawFields(ctx, template, fields, row, scale) {
	for (const field of fields) {
		const text = fieldValue(field, row);
		if (!text) continue;
		const boxW = field.boxWidth * template.width * scale;
		let size = field.fontSize * scale;
		ctx.save();
		ctx.globalAlpha = field.opacity;
		ctx.fillStyle = field.color;
		ctx.textBaseline = "middle";
		ctx.textAlign = field.align;
		if ("letterSpacing" in ctx) ctx.letterSpacing = `${field.letterSpacing * scale}px`;
		ctx.font = fontString(field, size);
		if (field.autoShrink) {
			let guard = 0;
			while (ctx.measureText(text).width > boxW && size > 6 && guard < 200) {
				size -= Math.max(.5, size * .03);
				ctx.font = fontString(field, size);
				guard += 1;
			}
		}
		const lines = field.autoShrink ? [text] : wrap(ctx, text, boxW);
		const lineHeight = size * field.lineHeight;
		const anchorX = field.align === "left" ? field.x * template.width * scale : field.align === "right" ? field.x * template.width * scale : field.x * template.width * scale;
		const startY = field.y * template.height * scale - (lines.length - 1) * lineHeight / 2;
		lines.forEach((line, i) => {
			ctx.fillText(line, anchorX, startY + i * lineHeight);
		});
		ctx.restore();
	}
}
async function renderCertificate(template, fields, row, scale = 2) {
	const img = await loadImage(template.src);
	await ensureFontsReady(fields.map((f) => ({
		family: f.fontFamily,
		weight: f.fontWeight,
		italic: f.italic,
		size: f.fontSize * scale
	})));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(template.width * scale);
	canvas.height = Math.round(template.height * scale);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas is unavailable in this browser.");
	ctx.imageSmoothingQuality = "high";
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	drawFields(ctx, template, fields, row, scale);
	return canvas;
}
function mimeFor(format) {
	return format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "application/pdf";
}
function extFor(format) {
	return format === "jpeg" ? "jpg" : format;
}
function safeName(input) {
	return input.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim().slice(0, 80) || "certificate";
}
function fileNameFor(pattern, row, index) {
	return safeName(pattern.replace(/\{(\w+)\}/g, (_m, key) => {
		if (key === "index") return String(index + 1);
		return (row?.[key] ?? "").toString() || `record-${index + 1}`;
	}) || `certificate-${index + 1}`);
}
function canvasToBlob(canvas, format, quality) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("Rendering failed.")), mimeFor(format), quality);
	});
}
function canvasToPdfBlob(canvas, quality) {
	return pdfWithPage(canvas, quality).output("blob");
}
function pdfWithPage(canvas, quality) {
	const w = canvas.width;
	const h = canvas.height;
	const doc = new import_jspdf_node_min.jsPDF({
		orientation: w >= h ? "landscape" : "portrait",
		unit: "px",
		format: [w, h],
		compress: true
	});
	doc.addImage(canvas.toDataURL("image/jpeg", quality), "JPEG", 0, 0, w, h);
	return doc;
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
async function renderToBlob(template, fields, row, settings) {
	const canvas = await renderCertificate(template, fields, row, settings.scale);
	if (settings.format === "pdf") return canvasToPdfBlob(canvas, settings.quality);
	return canvasToBlob(canvas, settings.format, settings.quality);
}
/** Yield to the browser so the progress animation keeps running smoothly. */
var breathe = () => new Promise((r) => setTimeout(r, 0));
async function runExport({ template, fields, rows, settings, onProgress, signal }) {
	const list = rows.length ? rows : [null];
	const total = list.length;
	const at = (i) => list[i] ?? null;
	if (total === 1) {
		const blob = await renderToBlob(template, fields, at(0), settings);
		onProgress?.(1, 1);
		return {
			blob,
			filename: `${fileNameFor(settings.filenamePattern, at(0), 0)}.${extFor(settings.format)}`,
			count: 1
		};
	}
	if (settings.format === "pdf" && settings.mode === "merged-pdf") {
		let doc = null;
		for (let i = 0; i < total; i += 1) {
			if (signal?.cancelled) throw new Error("cancelled");
			const canvas = await renderCertificate(template, fields, at(i), settings.scale);
			if (!doc) doc = pdfWithPage(canvas, settings.quality);
			else {
				doc.addPage([canvas.width, canvas.height], canvas.width >= canvas.height ? "landscape" : "portrait");
				doc.addImage(canvas.toDataURL("image/jpeg", settings.quality), "JPEG", 0, 0, canvas.width, canvas.height);
			}
			onProgress?.(i + 1, total);
			await breathe();
		}
		return {
			blob: doc.output("blob"),
			filename: "certificates.pdf",
			count: total
		};
	}
	const zip = new import_lib.default();
	const used = /* @__PURE__ */ new Set();
	for (let i = 0; i < total; i += 1) {
		if (signal?.cancelled) throw new Error("cancelled");
		const blob = await renderToBlob(template, fields, at(i), settings);
		let name = `${fileNameFor(settings.filenamePattern, at(i), i)}.${extFor(settings.format)}`;
		if (used.has(name)) name = name.replace(/(\.\w+)$/, `-${i + 1}$1`);
		used.add(name);
		zip.file(name, blob);
		onProgress?.(i + 1, total);
		await breathe();
	}
	return {
		blob: await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE"
		}),
		filename: "certificates.zip",
		count: total
	};
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not encode the certificate."));
		reader.readAsDataURL(blob);
	});
}
var useRun = create((set, get) => ({
	running: false,
	done: 0,
	total: 0,
	label: "",
	cancelled: false,
	cancel: () => set({ cancelled: true }),
	start: async () => {
		if (get().running) return;
		const { template, fields, rows, exportSettings } = useStudio.getState();
		if (!template) {
			toast.error("Add a certificate template first.");
			return;
		}
		if (!fields.length) {
			toast.error("Place at least one field on the template.");
			return;
		}
		const signal = { cancelled: false };
		const unsub = useRun.subscribe((s) => {
			if (s.cancelled) signal.cancelled = true;
		});
		set({
			running: true,
			cancelled: false,
			done: 0,
			total: Math.max(1, rows.length),
			label: "Warming the press"
		});
		try {
			const result = await runExport({
				template,
				fields,
				rows,
				settings: exportSettings,
				signal,
				onProgress: (done, total) => set({
					done,
					total,
					label: `Pressing plate ${done} of ${total}`
				})
			});
			set({ label: "Packaging" });
			downloadBlob(result.blob, result.filename);
			toast.success(result.count === 1 ? "Certificate downloaded." : `${result.count} certificates packaged and downloaded.`);
		} catch (err) {
			if (err instanceof Error && err.message === "cancelled") toast("Run cancelled.");
			else toast.error(err instanceof Error ? err.message : "The run failed.");
		} finally {
			unsub();
			set({
				running: false,
				cancelled: false,
				label: ""
			});
		}
	}
}));
function anchorTransform(align) {
	if (align === "left") return "translate(0, -50%)";
	if (align === "right") return "translate(-100%, -50%)";
	return "translate(-50%, -50%)";
}
function CanvasStage({ template, fields, row, interactive = true }) {
	const wrapRef = (0, import_react.useRef)(null);
	const [width, setWidth] = (0, import_react.useState)(0);
	const selectedId = useStudio((s) => s.selectedId);
	const select = useStudio((s) => s.select);
	const updateField = useStudio((s) => s.updateField);
	const dragRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => setWidth(el.clientWidth));
		ro.observe(el);
		setWidth(el.clientWidth);
		return () => ro.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!interactive) return;
		function move(e) {
			const drag = dragRef.current;
			const el = wrapRef.current;
			if (!drag || !el) return;
			const rect = el.getBoundingClientRect();
			const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
			const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
			updateField(drag.id, {
				x: Number(x.toFixed(4)),
				y: Number(y.toFixed(4))
			});
		}
		function up() {
			dragRef.current = null;
		}
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
	}, [interactive, updateField]);
	const scale = width ? width / template.width : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative w-full select-none overflow-hidden rounded-lg border border-border bg-card shadow-sm",
		style: { aspectRatio: `${template.width} / ${template.height}` },
		onPointerDown: () => interactive && select(null),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: template.src,
			alt: `Preview of ${template.name}`,
			className: "pointer-events-none absolute inset-0 h-full w-full object-fill",
			draggable: false
		}), scale > 0 && fields.map((field) => {
			const active = interactive && field.id === selectedId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: interactive ? "button" : void 0,
				tabIndex: interactive ? 0 : -1,
				"aria-label": interactive ? `Move ${field.label}` : void 0,
				onPointerDown: (e) => {
					if (!interactive) return;
					e.stopPropagation();
					select(field.id);
					dragRef.current = { id: field.id };
					e.target.setPointerCapture?.(e.pointerId);
				},
				onKeyDown: (e) => {
					if (!interactive) return;
					const step = e.shiftKey ? .02 : .004;
					const delta = {
						ArrowLeft: [-step, 0],
						ArrowRight: [step, 0],
						ArrowUp: [0, -step],
						ArrowDown: [0, step]
					}[e.key];
					if (!delta) return;
					e.preventDefault();
					updateField(field.id, {
						x: Math.min(1, Math.max(0, field.x + delta[0])),
						y: Math.min(1, Math.max(0, field.y + delta[1]))
					});
				},
				className: `absolute ${interactive ? "cursor-move" : ""} ${active ? "outline outline-2 outline-primary" : "outline outline-1 outline-transparent"} ${interactive ? "hover:outline-primary/50" : ""}`,
				style: {
					left: `${field.x * 100}%`,
					top: `${field.y * 100}%`,
					transform: anchorTransform(field.align),
					width: `${field.boxWidth * 100}%`,
					textAlign: field.align,
					opacity: field.opacity,
					color: field.color,
					fontFamily: `"${field.fontFamily}", serif`,
					fontWeight: field.fontWeight,
					fontStyle: field.italic ? "italic" : "normal",
					fontSize: field.fontSize * scale,
					lineHeight: field.lineHeight,
					letterSpacing: field.letterSpacing * scale,
					textTransform: field.uppercase ? "uppercase" : "none",
					whiteSpace: field.autoShrink ? "nowrap" : "normal",
					touchAction: "none"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: field.autoShrink ? {
						display: "inline-block",
						maxWidth: "100%",
						transformOrigin: field.align
					} : void 0,
					children: fieldValue(field, row)
				})
			}, field.id);
		})]
	});
}
var W = 1600;
var H = 1130;
var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F4F0E5"/>
  <rect x="46" y="46" width="1508" height="1038" fill="none" stroke="#B23A1E" stroke-width="3"/>
  <rect x="66" y="66" width="1468" height="998" fill="none" stroke="#1B1814" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="46" cy="46" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="1554" cy="46" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="46" cy="1084" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="1554" cy="1084" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <text x="${W / 2}" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="9" fill="#B23A1E">PLATEPRESS EVENTS</text>
  <text x="${W / 2}" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="12" fill="#6B655C">CERTIFICATE OF</text>
  <text x="${W / 2}" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#1B1814">ACHIEVEMENT</text>
  <text x="${W / 2}" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="#6B655C">THIS IS PRESENTED TO</text>
  <line x1="${W / 2 - 320}" y1="640" x2="1120" y2="640" stroke="#1B1814" stroke-opacity="0.25" stroke-width="2"/>
  <line x1="300" y1="930" x2="620" y2="930" stroke="#1B1814" stroke-opacity="0.35" stroke-width="2"/>
  <text x="460" y="968" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#6B655C">Programme Director</text>
  <line x1="980" y1="930" x2="1300" y2="930" stroke="#1B1814" stroke-opacity="0.35" stroke-width="2"/>
  <text x="1140" y="968" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#6B655C">Date</text>
  <circle cx="${W / 2}" cy="920" r="62" fill="none" stroke="#B23A1E" stroke-width="2"/>
  <text x="${W / 2}" y="928" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="4" fill="#B23A1E">SEAL</text>
</svg>`;
var SAMPLE_TEMPLATE = {
	name: "Sample — Certificate of Achievement",
	src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
	width: W,
	height: H
};
function sampleFields() {
	return [
		makeField({
			key: "name",
			label: "Recipient name",
			x: .5,
			y: .53,
			boxWidth: .62,
			fontFamily: "Playfair Display",
			fontSize: 84,
			fontWeight: 600,
			color: "#1B1814",
			align: "center"
		}),
		makeField({
			key: "award",
			label: "Award line",
			x: .5,
			y: .64,
			boxWidth: .55,
			fontFamily: "Spectral",
			fontSize: 30,
			fontWeight: 400,
			italic: true,
			color: "#6B655C",
			align: "center",
			autoShrink: false,
			lineHeight: 1.35
		}),
		makeField({
			key: "date",
			label: "Date",
			x: .7125,
			y: .795,
			boxWidth: .2,
			fontFamily: "Spectral",
			fontSize: 30,
			fontWeight: 400,
			color: "#1B1814",
			align: "center"
		})
	];
}
function sampleRows() {
	return [
		makeRow({
			name: "Amara Okonkwo",
			award: "for exceptional craftsmanship throughout the Autumn Gala programme",
			date: "14 October 2026",
			email: "amara@example.com"
		}),
		makeRow({
			name: "Elias Vance",
			award: "for outstanding stage production and technical direction",
			date: "14 October 2026",
			email: "elias@example.com"
		}),
		makeRow({
			name: "Sofia Marchetti",
			award: "for dedicated volunteer service across all three festival days",
			date: "14 October 2026",
			email: "sofia@example.com"
		}),
		makeRow({
			name: "Ravi Deshmukh",
			award: "for leading the guest hospitality team with distinction",
			date: "14 October 2026",
			email: "ravi@example.com"
		})
	];
}
function sampleCsv(keys) {
	const cols = keys.length ? keys : [
		"name",
		"award",
		"date",
		"email"
	];
	const rows = sampleRows().map((r) => cols.map((c) => `"${(r[c] ?? "").replace(/"/g, "\"\"")}"`).join(","));
	return [cols.join(","), ...rows].join("\n");
}
function readTemplate(file) {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith("image/")) {
			reject(/* @__PURE__ */ new Error("Please choose a PNG, JPEG, WebP or SVG image."));
			return;
		}
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("That file could not be read."));
		reader.onload = () => {
			const src = String(reader.result);
			const img = new Image();
			img.onload = () => resolve({
				name: file.name.replace(/\.[^.]+$/, ""),
				src,
				width: img.naturalWidth || 1600,
				height: img.naturalHeight || 1130
			});
			img.onerror = () => reject(/* @__PURE__ */ new Error("That image could not be opened."));
			img.src = src;
		};
		reader.readAsDataURL(file);
	});
}
function TemplatePanel() {
	const template = useStudio((s) => s.template);
	const setTemplate = useStudio((s) => s.setTemplate);
	const fields = useStudio((s) => s.fields);
	const setRows = useStudio((s) => s.setRows);
	const inputRef = (0, import_react.useRef)(null);
	const [over, setOver] = (0, import_react.useState)(false);
	async function handleFiles(files) {
		const file = files?.[0];
		if (!file) return;
		try {
			const asset = await readTemplate(file);
			setTemplate(asset);
			toast.success(`${asset.name} loaded — ${asset.width}×${asset.height}px.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed.");
		}
	}
	function loadSample() {
		setTemplate(SAMPLE_TEMPLATE);
		useStudio.setState({
			fields: sampleFields(),
			selectedId: null
		});
		setRows(sampleRows());
		toast.success("Sample certificate, fields and roster loaded.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (e) => {
				e.preventDefault();
				setOver(true);
			},
			onDragLeave: () => setOver(false),
			onDrop: (e) => {
				e.preventDefault();
				setOver(false);
				handleFiles(e.dataTransfer.files);
			},
			className: `rounded-lg border-2 border-dashed p-6 text-center transition-colors ${over ? "border-primary bg-brand-soft/10" : "border-border bg-paper"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: "Step 1 — Template"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Drop a certificate image here, or choose a file. PNG, JPEG, WebP or SVG."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/*",
					className: "sr-only",
					onChange: (e) => void handleFiles(e.target.files)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => inputRef.current?.click(),
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90",
						children: "Choose template"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: loadSample,
						className: "rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
						children: "Load sample"
					})]
				})
			]
		}), template && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: "Loaded plate"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 truncate text-sm font-medium",
					children: template.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						template.width,
						" × ",
						template.height,
						" px · ",
						fields.length,
						" field",
						fields.length === 1 ? "" : "s",
						" placed"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTemplate(null),
					className: "mt-3 text-xs font-medium text-primary underline-offset-2 hover:underline",
					children: "Remove template"
				})
			]
		})]
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-mono",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
function FieldsPanel() {
	const fields = useStudio((s) => s.fields);
	const selectedId = useStudio((s) => s.selectedId);
	const select = useStudio((s) => s.select);
	const addField = useStudio((s) => s.addField);
	const updateField = useStudio((s) => s.updateField);
	const removeField = useStudio((s) => s.removeField);
	const duplicateField = useStudio((s) => s.duplicateField);
	const customFonts = useStudio((s) => s.customFonts);
	const addCustomFont = useStudio((s) => s.addCustomFont);
	const fontFileRef = (0, import_react.useRef)(null);
	const googleRef = (0, import_react.useRef)(null);
	const selected = (0, import_react.useMemo)(() => fields.find((f) => f.id === selectedId) ?? null, [fields, selectedId]);
	function set(patch) {
		if (selected) updateField(selected.id, patch);
	}
	async function onFontFile(file) {
		if (!file) return;
		try {
			const family = await loadFontFile(file);
			addCustomFont(family);
			set({ fontFamily: family });
			toast.success(`${family} is ready to use.`);
		} catch {
			toast.error("That font file could not be loaded.");
		}
	}
	function addGoogleFont() {
		const family = googleRef.current?.value.trim();
		if (!family) return;
		loadGoogleFont(family);
		addCustomFont(family);
		set({ fontFamily: family });
		if (googleRef.current) googleRef.current.value = "";
		toast.success(`${family} added from Google Fonts.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: "Step 2 — Fields"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => addField(),
					className: "rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90",
					children: "Add field"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [fields.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground",
					children: [
						"No fields yet. Add one, then drag it onto the certificate. Field names must match your spreadsheet column names (for example ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono",
							children: "name"
						}),
						")."
					]
				}), fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => select(f.id),
					className: `flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${f.id === selectedId ? "border-primary bg-brand-soft/10" : "border-border bg-paper hover:bg-secondary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: f.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] text-muted-foreground",
						children: `{${f.key}}`
					})]
				}, f.id))]
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-lg border border-border bg-card p-4 animate-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Data key (matches your column)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input font-mono",
							value: selected.key,
							onChange: (e) => set({ key: e.target.value.trim() })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input",
							value: selected.label,
							onChange: (e) => set({ label: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Font",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field-input",
							value: selected.fontFamily,
							onChange: (e) => {
								loadGoogleFont(e.target.value);
								set({ fontFamily: e.target.value });
							},
							children: [BUILT_IN_FONTS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: f.family,
								children: [
									f.family,
									" — ",
									f.category
								]
							}, f.family)), customFonts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: f,
								children: [f, " — Custom"]
							}, f))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Size (px)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 6,
									max: 400,
									className: "field-input",
									value: selected.fontSize,
									onChange: (e) => set({ fontSize: Number(e.target.value) || 12 })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Weight",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "field-input",
									value: selected.fontWeight,
									onChange: (e) => set({ fontWeight: Number(e.target.value) }),
									children: [
										300,
										400,
										500,
										600,
										700
									].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: w,
										children: w
									}, w))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Colour",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									className: "h-9 w-full rounded-md border border-border bg-paper",
									value: selected.color,
									onChange: (e) => set({ color: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Alignment",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "field-input",
									value: selected.align,
									onChange: (e) => set({ align: e.target.value }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "left",
											children: "Left"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "center",
											children: "Centre"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "right",
											children: "Right"
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: `Box width — ${Math.round(selected.boxWidth * 100)}%`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 5,
							max: 100,
							value: Math.round(selected.boxWidth * 100),
							onChange: (e) => set({ boxWidth: Number(e.target.value) / 100 }),
							className: "w-full accent-[var(--brand)]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `Letter spacing — ${selected.letterSpacing}px`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: -5,
								max: 30,
								value: selected.letterSpacing,
								onChange: (e) => set({ letterSpacing: Number(e.target.value) }),
								className: "w-full accent-[var(--brand)]"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `Opacity — ${Math.round(selected.opacity * 100)}%`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 10,
								max: 100,
								value: Math.round(selected.opacity * 100),
								onChange: (e) => set({ opacity: Number(e.target.value) / 100 }),
								className: "w-full accent-[var(--brand)]"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.italic,
									onChange: (e) => set({ italic: e.target.checked })
								}), "Italic"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.uppercase,
									onChange: (e) => set({ uppercase: e.target.checked })
								}), "Uppercase"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.autoShrink,
									onChange: (e) => set({ autoShrink: e.target.checked })
								}), "Shrink long text to fit"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-paper p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "label-mono",
								children: "Bring your own font"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: googleRef,
									placeholder: "Google font name",
									className: "field-input",
									onKeyDown: (e) => e.key === "Enter" && addGoogleFont()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: addGoogleFont,
									className: "shrink-0 rounded-md border border-border bg-card px-3 text-xs font-medium hover:bg-secondary",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fontFileRef,
								type: "file",
								accept: ".ttf,.otf,.woff,.woff2",
								className: "sr-only",
								onChange: (e) => void onFontFile(e.target.files?.[0])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => fontFileRef.current?.click(),
								className: "mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary",
								children: "Upload a font file (.ttf, .otf, .woff)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => duplicateField(selected.id),
							className: "flex-1 rounded-md border border-border bg-paper px-3 py-2 text-xs font-medium hover:bg-secondary",
							children: "Duplicate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => removeField(selected.id),
							className: "flex-1 rounded-md border border-destructive px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground",
							children: "Delete"
						})]
					})
				]
			})
		]
	});
}
function DataPanel() {
	const fields = useStudio((s) => s.fields);
	const rows = useStudio((s) => s.rows);
	const setRows = useStudio((s) => s.setRows);
	const addRow = useStudio((s) => s.addRow);
	const updateCell = useStudio((s) => s.updateCell);
	const removeRow = useStudio((s) => s.removeRow);
	const email = useStudio((s) => s.email);
	const fileRef = (0, import_react.useRef)(null);
	const [over, setOver] = (0, import_react.useState)(false);
	const columns = (0, import_react.useMemo)(() => {
		const keys = fields.map((f) => f.key);
		for (const r of rows) for (const k of Object.keys(r)) if (k !== "__id" && !keys.includes(k)) keys.push(k);
		if (!keys.includes(email.emailColumn)) keys.push(email.emailColumn);
		return keys;
	}, [
		fields,
		rows,
		email.emailColumn
	]);
	async function importFile(file) {
		if (!file) return;
		try {
			const buffer = await file.arrayBuffer();
			const book = readSync(buffer, { type: "array" });
			const first = book.SheetNames[0];
			const sheet = first ? book.Sheets[first] : void 0;
			if (!sheet) throw new Error("That file has no sheets.");
			const json = utils.sheet_to_json(sheet, { defval: "" });
			if (!json.length) throw new Error("No rows found in that file.");
			const parsed = json.map((r) => {
				const values = {};
				for (const [k, v] of Object.entries(r)) values[String(k).trim()] = v == null ? "" : String(v).trim();
				return makeRow(values);
			});
			setRows(parsed);
			toast.success(`${parsed.length} records imported.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Import failed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: "Step 3 — Recipients"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						rows.length,
						" record",
						rows.length === 1 ? "" : "s"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setOver(true);
				},
				onDragLeave: () => setOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setOver(false);
					importFile(e.dataTransfer.files?.[0]);
				},
				className: `rounded-lg border-2 border-dashed p-4 text-center text-xs transition-colors ${over ? "border-primary bg-brand-soft/10" : "border-border bg-paper"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Drop an Excel or CSV file, with column headings that match your field names."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".xlsx,.xls,.csv,text/csv",
						className: "sr-only",
						onChange: (e) => void importFile(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fileRef.current?.click(),
							className: "rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90",
							children: "Import spreadsheet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => downloadBlob(new Blob([sampleCsv(columns)], { type: "text/csv" }), "platepress-sample.csv"),
							className: "rounded-md border border-border bg-card px-3 py-1.5 font-medium hover:bg-secondary",
							children: "Download example sheet"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border press-scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-max text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest",
							children: c
						}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-10" })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-40 rounded-sm bg-transparent px-2 py-1 text-sm outline-none focus:bg-paper",
								value: r[c] ?? "",
								"aria-label": `${c} value`,
								onChange: (e) => updateCell(r.__id, c, e.target.value)
							})
						}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Remove record",
								onClick: () => removeRow(r.__id),
								className: "text-xs text-muted-foreground hover:text-destructive",
								children: "✕"
							})
						})]
					}, r.__id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: columns.length + 1,
						className: "px-3 py-6 text-center text-xs text-muted-foreground",
						children: "No recipients yet. Add one by hand, or import a spreadsheet."
					}) })] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => addRow(Object.fromEntries(columns.map((c) => [c, ""]))),
					className: "flex-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary",
					children: "Add recipient"
				}), rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setRows([]),
					className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary",
					children: "Clear all"
				})]
			})
		]
	});
}
function ExportPanel() {
	const settings = useStudio((s) => s.exportSettings);
	const setExportSettings = useStudio((s) => s.setExportSettings);
	const rows = useStudio((s) => s.rows);
	const start = useRun((s) => s.start);
	const running = useRun((s) => s.running);
	const count = Math.max(1, rows.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono",
				children: "Step 4 — Export"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "Format"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-3 gap-2",
				children: [
					"pdf",
					"png",
					"jpeg"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setExportSettings({ format: f }),
					className: `rounded-md border px-3 py-2 text-xs font-medium uppercase transition-colors ${settings.format === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-paper hover:bg-secondary"}`,
					children: f
				}, f))
			})] }),
			count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "Delivery"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-2 gap-2",
				children: [["zip", "ZIP of files"], ["merged-pdf", "One merged PDF"]].map(([mode, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: mode === "merged-pdf" && settings.format !== "pdf",
					onClick: () => setExportSettings({ mode }),
					className: `rounded-md border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${settings.mode === mode ? "border-primary bg-primary text-primary-foreground" : "border-border bg-paper hover:bg-secondary"}`,
					children: label
				}, mode))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "label-mono",
					children: [
						"Resolution — ",
						settings.scale,
						"× print scale"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 1,
					max: 4,
					step: .5,
					value: settings.scale,
					onChange: (e) => setExportSettings({ scale: Number(e.target.value) }),
					className: "mt-1 w-full accent-[var(--brand)]"
				})]
			}),
			settings.format !== "png" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "label-mono",
					children: [
						"Quality — ",
						Math.round(settings.quality * 100),
						"%"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 50,
					max: 100,
					value: Math.round(settings.quality * 100),
					onChange: (e) => setExportSettings({ quality: Number(e.target.value) / 100 }),
					className: "mt-1 w-full accent-[var(--brand)]"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "File name pattern"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field-input mt-1 font-mono",
						value: settings.filenamePattern,
						onChange: (e) => setExportSettings({ filenamePattern: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-[11px] text-muted-foreground",
						children: [
							"Use ",
							"{",
							"name",
							"}",
							" or any field key, plus ",
							"{",
							"index",
							"}",
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => void start(),
				disabled: running,
				className: "w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
				children: running ? "Pressing…" : count === 1 ? "Generate & download" : `Generate ${count} certificates`
			})
		]
	});
}
var ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
function fillTemplate(text, row) {
	return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key) => (row?.[key] ?? "").toString());
}
async function sendCertificateEmail(settings, row, attachmentBase64, attachmentName) {
	const to = (row[settings.emailColumn] ?? "").toString().trim();
	if (!to) return {
		to: "—",
		ok: false,
		error: "No email address on this row."
	};
	const payload = {
		service_id: settings.serviceId,
		template_id: settings.templateId,
		user_id: settings.publicKey,
		...settings.privateKey ? { accessToken: settings.privateKey } : {},
		template_params: {
			...row,
			to_email: to,
			email: to,
			from_name: settings.fromName,
			subject: fillTemplate(settings.subject, row),
			message_html: fillTemplate(settings.html, row),
			certificate_name: attachmentName,
			certificate_base64: attachmentBase64
		}
	};
	try {
		const res = await fetch(ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (!res.ok) return {
			to,
			ok: false,
			error: await res.text() || `Request failed (${res.status})`
		};
		return {
			to,
			ok: true
		};
	} catch (err) {
		return {
			to,
			ok: false,
			error: err instanceof Error ? err.message : "Network error"
		};
	}
}
function EmailPanel() {
	const email = useStudio((s) => s.email);
	const setEmail = useStudio((s) => s.setEmail);
	const rows = useStudio((s) => s.rows);
	const fields = useStudio((s) => s.fields);
	const template = useStudio((s) => s.template);
	const settings = useStudio((s) => s.exportSettings);
	const previewIndex = useStudio((s) => s.previewIndex);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [log, setLog] = (0, import_react.useState)([]);
	const [showPreview, setShowPreview] = (0, import_react.useState)(false);
	const previewRow = rows[previewIndex] ?? rows[0] ?? null;
	const configured = Boolean(email.serviceId && email.templateId && email.publicKey);
	async function send(all) {
		if (!template) {
			toast.error("Add a certificate template first.");
			return;
		}
		if (!fields.length) {
			toast.error("Place at least one field on the template.");
			return;
		}
		if (!configured) {
			toast.error("Add your service ID, template ID and public key.");
			return;
		}
		const targets = all ? rows : previewRow ? [previewRow] : [];
		if (!targets.length) {
			toast.error("Add at least one recipient row.");
			return;
		}
		setSending(true);
		setLog([]);
		const results = [];
		try {
			for (let i = 0; i < targets.length; i += 1) {
				const row = targets[i];
				const base64 = await blobToBase64(await renderToBlob(template, fields, row, {
					...settings,
					format: email.attachFormat
				}));
				const name = `${fileNameFor(settings.filenamePattern, row, i)}.${extFor(email.attachFormat)}`;
				const res = await sendCertificateEmail(email, row, base64, name);
				results.push(res);
				setLog([...results]);
			}
			const ok = results.filter((r) => r.ok).length;
			if (ok === results.length) toast.success(`${ok} email${ok === 1 ? "" : "s"} sent.`);
			else toast.error(`${ok} of ${results.length} sent — see the delivery log.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sending failed.");
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono",
				children: "Step 5 — Email delivery (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[12px] leading-relaxed text-muted-foreground",
				children: "Everything is sent straight from your browser using your own EmailJS account. Your keys are never stored or uploaded anywhere."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Service ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input mt-1 font-mono",
							value: email.serviceId,
							onChange: (e) => setEmail({ serviceId: e.target.value }),
							placeholder: "service_xxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Template ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input mt-1 font-mono",
							value: email.templateId,
							onChange: (e) => setEmail({ templateId: e.target.value }),
							placeholder: "template_xxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Public key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input mt-1 font-mono",
							value: email.publicKey,
							onChange: (e) => setEmail({ publicKey: e.target.value }),
							placeholder: "Your public key"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Private key (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field-input mt-1 font-mono",
							type: "password",
							value: email.privateKey,
							onChange: (e) => setEmail({ privateKey: e.target.value }),
							placeholder: "Only if strict mode is on"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "From name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field-input mt-1",
						value: email.fromName,
						onChange: (e) => setEmail({ fromName: e.target.value })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "Email column"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field-input mt-1 font-mono",
						value: email.emailColumn,
						onChange: (e) => setEmail({ emailColumn: e.target.value })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "Subject"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field-input mt-1",
					value: email.subject,
					onChange: (e) => setEmail({ subject: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "Attachment format"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-3 gap-2",
				children: [
					"pdf",
					"png",
					"jpeg"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setEmail({ attachFormat: f }),
					className: `rounded-md border px-3 py-2 text-xs font-medium uppercase transition-colors ${email.attachFormat === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-paper hover:bg-secondary"}`,
					children: f
				}, f))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Message HTML"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowPreview((v) => !v),
							className: "text-[11px] font-medium text-primary hover:underline",
							children: showPreview ? "Edit HTML" : "Preview"
						})]
					}),
					showPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 max-h-64 overflow-auto rounded-md border border-border bg-paper p-2",
						dangerouslySetInnerHTML: { __html: fillTemplate(email.html, previewRow) }
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field-input mt-1 h-40 font-mono text-[11px]",
						value: email.html,
						onChange: (e) => setEmail({ html: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-[11px] text-muted-foreground",
						children: [
							"Use ",
							"{{",
							"name",
							"}}",
							" or any column key to personalise the message."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: sending,
					onClick: () => void send(false),
					className: "rounded-md border border-border bg-paper px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50",
					children: "Send test to current row"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: sending,
					onClick: () => void send(true),
					className: "rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
					children: sending ? "Sending…" : `Send all (${rows.length})`
				})]
			}),
			log.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border bg-paper p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: "Delivery log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 space-y-1 text-[11px]",
					children: log.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: r.to
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: r.ok ? "text-accent" : "text-destructive",
							children: r.ok ? "sent" : r.error
						})]
					}, `${r.to}-${i}`))
				})]
			})
		]
	});
}
function ProgressOverlay({ open, label, done, total, onCancel }) {
	if (!open) return null;
	const pct = total ? Math.round(done / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-cardfill",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono",
					children: label || "Working"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-serif text-4xl font-semibold text-foreground",
						children: [pct, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							done,
							" of ",
							total
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-2 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-[width] duration-200 ease-out",
						style: { width: `${pct}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-3 w-3 rounded-[2px] bg-primary animate-press",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Everything is rendered on your device — nothing is uploaded."
					})]
				}),
				onCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onCancel,
					className: "mt-5 w-full rounded-md border border-border bg-paper px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
					children: "Cancel run"
				})
			]
		})
	});
}
var TABS = [
	{
		id: "template",
		label: "Template"
	},
	{
		id: "fields",
		label: "Fields"
	},
	{
		id: "data",
		label: "Recipients"
	},
	{
		id: "export",
		label: "Export"
	},
	{
		id: "email",
		label: "Email"
	}
];
function Studio() {
	const [tab, setTab] = (0, import_react.useState)("template");
	const template = useStudio((s) => s.template);
	const fields = useStudio((s) => s.fields);
	const rows = useStudio((s) => s.rows);
	const previewIndex = useStudio((s) => s.previewIndex);
	const setPreviewIndex = useStudio((s) => s.setPreviewIndex);
	const run = useRun();
	const total = Math.max(1, rows.length);
	const row = rows[previewIndex] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: platepress_mark_default,
							alt: "Platepress",
							className: "h-8 w-8 rounded-[4px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate font-serif text-lg font-semibold leading-none text-foreground",
								children: "Platepress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 hidden text-[11px] text-muted-foreground sm:block",
								children: "Bulk certificate studio — free, no sign-up, nothing leaves your device"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground md:inline",
								children: [
									fields.length,
									" field",
									fields.length === 1 ? "" : "s",
									" · ",
									rows.length,
									" recipient",
									rows.length === 1 ? "" : "s"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/guide",
								className: "rounded-md border border-border bg-paper px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary",
								children: "Guide"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "order-2 lg:order-1",
					children: template ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasStage, {
							template,
							fields,
							row
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Proof"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPreviewIndex(Math.max(0, previewIndex - 1)),
									disabled: previewIndex <= 0,
									className: "rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40",
									children: "Previous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: rows.length ? `${previewIndex + 1} of ${rows.length}` : "Sample values"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPreviewIndex(Math.min(rows.length - 1, previewIndex + 1)),
									disabled: previewIndex >= rows.length - 1,
									className: "rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40",
									children: "Next"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-[11px] text-muted-foreground",
									children: "Drag a field on the proof to reposition it — arrow keys nudge."
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-h-[50vh] items-center justify-center rounded-lg border border-dashed border-border bg-card p-10 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-sm animate-rise",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "label-mono",
									children: "No plate mounted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-serif text-2xl font-semibold text-foreground",
									children: "Upload a certificate template to begin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Use your own artwork (PNG, JPEG or SVG) or load the sample certificate from the Template panel to explore every feature."
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "order-1 lg:order-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1 border-b border-border p-2",
							children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTab(t.id),
								className: `rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`,
								children: t.label
							}, t.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-[calc(100vh-9rem)] overflow-auto p-4 lg:sticky lg:top-20",
							children: [
								tab === "template" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatePanel, {}),
								tab === "fields" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldsPanel, {}),
								tab === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataPanel, {}),
								tab === "export" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPanel, {}),
								tab === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailPanel, {})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressOverlay, {
				open: run.running,
				label: run.label,
				done: run.done,
				total: run.total || total,
				onCancel: run.cancel
			})
		]
	});
}
//#endregion
export { Studio as component };
