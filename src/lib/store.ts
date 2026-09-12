import { create } from "zustand";
import type {
  BatchRecord,
  CertElement,
  CertField,
  DeliveryEntry,
  DeliveryStatus,
  ElementKind,
  EmailSettings,
  ExportSettings,
  RecordRow,
  SavedSignature,
  TemplateAsset,
} from "./types";

export const DEFAULT_EMAIL_HTML = `<div style="font-family:Georgia,serif;background:#E9E4D6;padding:32px">
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

export function makeField(partial: Partial<CertField> = {}): CertField {
  const key = partial.key ?? "name";
  return {
    id: uid(),
    key,
    label: partial.label ?? key.replace(/(^|\s)\w/g, (m) => m.toUpperCase()),
    x: 0.5,
    y: 0.5,
    boxWidth: 0.7,
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
    ...partial,
  };
}

export function makeElement(kind: ElementKind, partial: Partial<CertElement> = {}): CertElement {
  return {
    id: uid(),
    kind,
    label: kind === "qr" ? "QR code" : kind === "signature" ? "Signature" : "Logo",
    src: "",
    qrText: "https://example.com/verify/{{name}}",
    x: kind === "signature" ? 0.3 : 0.82,
    y: kind === "qr" ? 0.85 : 0.78,
    width: kind === "qr" ? 0.1 : 0.18,
    opacity: 1,
    rotation: 0,
    ...partial,
  };
}

export function makeRow(values: Record<string, string> = {}): RecordRow {
  return { __id: uid(), ...values };
}

/* ---------- local persistence (no server, no database) ---------- */

const STORE_KEY = "platepress.library.v1";

interface Persisted {
  signatures: SavedSignature[];
  batches: BatchRecord[];
}

function loadPersisted(): Persisted {
  if (typeof localStorage === "undefined") return { signatures: [], batches: [] };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { signatures: [], batches: [] };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      signatures: Array.isArray(parsed.signatures) ? parsed.signatures : [],
      batches: Array.isArray(parsed.batches) ? parsed.batches : [],
    };
  } catch {
    return { signatures: [], batches: [] };
  }
}

function persist(data: Persisted) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    /* quota or private mode — the app still works for this session */
  }
}

interface StudioState {
  step: number;
  template: TemplateAsset | null;
  fields: CertField[];
  elements: CertElement[];
  selectedId: string | null;
  selectedElementId: string | null;
  rows: RecordRow[];
  previewIndex: number;
  exportSettings: ExportSettings;
  email: EmailSettings;
  customFonts: string[];
  signatures: SavedSignature[];
  batches: BatchRecord[];
  delivery: DeliveryEntry[];
  hydrated: boolean;

  setStep: (s: number) => void;
  setTemplate: (t: TemplateAsset | null) => void;
  addField: (f?: Partial<CertField>) => void;
  updateField: (id: string, patch: Partial<CertField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  select: (id: string | null) => void;

  addElement: (kind: ElementKind, patch?: Partial<CertElement>) => void;
  updateElement: (id: string, patch: Partial<CertElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;

  addSignature: (name: string, src: string) => void;
  removeSignature: (id: string) => void;
  placeSignature: (id: string) => void;

  setRows: (rows: RecordRow[]) => void;
  addRow: (values?: Record<string, string>) => void;
  updateCell: (id: string, key: string, value: string) => void;
  removeRow: (id: string) => void;
  removeRows: (ids: string[]) => void;
  dedupeRows: () => number;
  setPreviewIndex: (i: number) => void;
  setExportSettings: (patch: Partial<ExportSettings>) => void;
  setEmail: (patch: Partial<EmailSettings>) => void;
  addCustomFont: (family: string) => void;

  addBatch: (batch: BatchRecord) => void;
  updateBatch: (id: string, patch: Partial<BatchRecord>) => void;
  removeBatch: (id: string) => void;
  clearBatches: () => void;

  setDelivery: (entries: DeliveryEntry[]) => void;
  updateDelivery: (id: string, patch: Partial<DeliveryEntry> & { status?: DeliveryStatus }) => void;
  clearDelivery: () => void;

  hydrate: () => void;
  reset: () => void;
}

const initialExport: ExportSettings = {
  format: "pdf",
  quality: 0.92,
  scale: 2,
  mode: "zip",
  filenamePattern: "{name}-certificate",
};

const initialEmail: EmailSettings = {
  serviceId: "",
  templateId: "",
  publicKey: "",
  privateKey: "",
  fromName: "Events Team",
  subject: "Your certificate, {{name}}",
  html: DEFAULT_EMAIL_HTML,
  emailColumn: "email",
  attachFormat: "pdf",
};

export const useStudio = create<StudioState>((set, get) => ({
  step: 0,
  template: null,
  fields: [],
  elements: [],
  selectedId: null,
  selectedElementId: null,
  rows: [],
  previewIndex: 0,
  exportSettings: initialExport,
  email: initialEmail,
  customFonts: [],
  signatures: [],
  batches: [],
  delivery: [],
  hydrated: false,

  setStep: (step) => set({ step }),
  setTemplate: (template) => set({ template }),
  addField: (f) =>
    set((s) => {
      const field = makeField({
        key: f?.key ?? `field_${s.fields.length + 1}`,
        ...f,
      });
      return { fields: [...s.fields, field], selectedId: field.id, selectedElementId: null };
    }),
  updateField: (id, patch) =>
    set((s) => ({
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),
  removeField: (id) =>
    set((s) => ({
      fields: s.fields.filter((f) => f.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  duplicateField: (id) =>
    set((s) => {
      const src = s.fields.find((f) => f.id === id);
      if (!src) return s;
      const copy = makeField({
        ...src,
        key: `${src.key}_copy`,
        label: `${src.label} copy`,
        y: Math.min(0.96, src.y + 0.08),
      });
      return { fields: [...s.fields, copy], selectedId: copy.id };
    }),
  select: (selectedId) => set({ selectedId, selectedElementId: null }),

  addElement: (kind, patch) =>
    set((s) => {
      const el = makeElement(kind, patch);
      return { elements: [...s.elements, el], selectedElementId: el.id, selectedId: null };
    }),
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
    })),
  selectElement: (selectedElementId) => set({ selectedElementId, selectedId: null }),

  addSignature: (name, src) =>
    set((s) => {
      const signatures = [...s.signatures, { id: uid(), name, src }];
      persist({ signatures, batches: s.batches });
      return { signatures };
    }),
  removeSignature: (id) =>
    set((s) => {
      const signatures = s.signatures.filter((x) => x.id !== id);
      persist({ signatures, batches: s.batches });
      return { signatures };
    }),
  placeSignature: (id) =>
    set((s) => {
      const sig = s.signatures.find((x) => x.id === id);
      if (!sig) return s;
      const el = makeElement("signature", { src: sig.src, label: sig.name });
      return { elements: [...s.elements, el], selectedElementId: el.id, selectedId: null };
    }),

  setRows: (rows) => set({ rows, previewIndex: 0 }),
  addRow: (values) => set((s) => ({ rows: [...s.rows, makeRow(values)] })),
  updateCell: (id, key, value) =>
    set((s) => ({
      rows: s.rows.map((r) => (r.__id === id ? { ...r, [key]: value } : r)),
    })),
  removeRow: (id) =>
    set((s) => {
      const rows = s.rows.filter((r) => r.__id !== id);
      return { rows, previewIndex: Math.min(get().previewIndex, Math.max(0, rows.length - 1)) };
    }),
  removeRows: (ids) =>
    set((s) => {
      const drop = new Set(ids);
      const rows = s.rows.filter((r) => !drop.has(r.__id));
      return { rows, previewIndex: Math.min(s.previewIndex, Math.max(0, rows.length - 1)) };
    }),
  dedupeRows: () => {
    const s = get();
    const keys = s.fields.map((f) => f.key);
    const seen = new Set<string>();
    const rows: RecordRow[] = [];
    for (const r of s.rows) {
      const sig = (keys.length ? keys : Object.keys(r).filter((k) => k !== "__id"))
        .map((k) => (r[k] ?? "").toString().trim().toLowerCase())
        .join("|");
      if (seen.has(sig)) continue;
      seen.add(sig);
      rows.push(r);
    }
    const removed = s.rows.length - rows.length;
    if (removed) set({ rows, previewIndex: 0 });
    return removed;
  },
  setPreviewIndex: (previewIndex) => set({ previewIndex }),
  setExportSettings: (patch) =>
    set((s) => ({ exportSettings: { ...s.exportSettings, ...patch } })),
  setEmail: (patch) => set((s) => ({ email: { ...s.email, ...patch } })),
  addCustomFont: (family) =>
    set((s) => ({
      customFonts: s.customFonts.includes(family) ? s.customFonts : [...s.customFonts, family],
    })),

  addBatch: (batch) =>
    set((s) => {
      const batches = [batch, ...s.batches].slice(0, 50);
      persist({ signatures: s.signatures, batches });
      return { batches };
    }),
  updateBatch: (id, patch) =>
    set((s) => {
      const batches = s.batches.map((b) => (b.id === id ? { ...b, ...patch } : b));
      persist({ signatures: s.signatures, batches });
      return { batches };
    }),
  removeBatch: (id) =>
    set((s) => {
      const batches = s.batches.filter((b) => b.id !== id);
      persist({ signatures: s.signatures, batches });
      return { batches };
    }),
  clearBatches: () =>
    set((s) => {
      persist({ signatures: s.signatures, batches: [] });
      return { batches: [] };
    }),

  setDelivery: (delivery) => set({ delivery }),
  updateDelivery: (id, patch) =>
    set((s) => ({ delivery: s.delivery.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  clearDelivery: () => set({ delivery: [] }),

  hydrate: () => {
    if (get().hydrated) return;
    const data = loadPersisted();
    set({ ...data, hydrated: true });
  },

  reset: () =>
    set({
      step: 0,
      template: null,
      fields: [],
      elements: [],
      selectedId: null,
      selectedElementId: null,
      rows: [],
      previewIndex: 0,
      exportSettings: initialExport,
      email: initialEmail,
      delivery: [],
    }),
}));
