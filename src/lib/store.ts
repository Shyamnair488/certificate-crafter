import { create } from "zustand";
import type {
  CertField,
  EmailSettings,
  ExportSettings,
  RecordRow,
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

export function makeRow(values: Record<string, string> = {}): RecordRow {
  return { __id: uid(), ...values };
}

interface StudioState {
  step: number;
  template: TemplateAsset | null;
  fields: CertField[];
  selectedId: string | null;
  rows: RecordRow[];
  previewIndex: number;
  exportSettings: ExportSettings;
  email: EmailSettings;
  customFonts: string[];

  setStep: (s: number) => void;
  setTemplate: (t: TemplateAsset | null) => void;
  addField: (f?: Partial<CertField>) => void;
  updateField: (id: string, patch: Partial<CertField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  select: (id: string | null) => void;
  setRows: (rows: RecordRow[]) => void;
  addRow: (values?: Record<string, string>) => void;
  updateCell: (id: string, key: string, value: string) => void;
  removeRow: (id: string) => void;
  setPreviewIndex: (i: number) => void;
  setExportSettings: (patch: Partial<ExportSettings>) => void;
  setEmail: (patch: Partial<EmailSettings>) => void;
  addCustomFont: (family: string) => void;
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
  selectedId: null,
  rows: [],
  previewIndex: 0,
  exportSettings: initialExport,
  email: initialEmail,
  customFonts: [],

  setStep: (step) => set({ step }),
  setTemplate: (template) => set({ template }),
  addField: (f) =>
    set((s) => {
      const field = makeField({
        key: f?.key ?? `field_${s.fields.length + 1}`,
        ...f,
      });
      return { fields: [...s.fields, field], selectedId: field.id };
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
  select: (selectedId) => set({ selectedId }),
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
  setPreviewIndex: (previewIndex) => set({ previewIndex }),
  setExportSettings: (patch) =>
    set((s) => ({ exportSettings: { ...s.exportSettings, ...patch } })),
  setEmail: (patch) => set((s) => ({ email: { ...s.email, ...patch } })),
  addCustomFont: (family) =>
    set((s) => ({
      customFonts: s.customFonts.includes(family) ? s.customFonts : [...s.customFonts, family],
    })),
  reset: () =>
    set({
      step: 0,
      template: null,
      fields: [],
      selectedId: null,
      rows: [],
      previewIndex: 0,
      exportSettings: initialExport,
      email: initialEmail,
    }),
}));
