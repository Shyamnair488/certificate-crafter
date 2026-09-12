import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { renderCertificate } from "./render";
import type {
  CertElement,
  CertField,
  ExportFormat,
  ExportSettings,
  RecordRow,
  TemplateAsset,
} from "./types";

export function mimeFor(format: ExportFormat) {
  return format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "application/pdf";
}

export function extFor(format: ExportFormat) {
  return format === "jpeg" ? "jpg" : format;
}

export function safeName(input: string) {
  return (
    input
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "certificate"
  );
}

export function fileNameFor(pattern: string, row: RecordRow | null, index: number) {
  const resolved = pattern.replace(/\{(\w+)\}/g, (_m, key: string) => {
    if (key === "index") return String(index + 1);
    return (row?.[key] ?? "").toString() || `record-${index + 1}`;
  });
  return safeName(resolved || `certificate-${index + 1}`);
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: Exclude<ExportFormat, "pdf">,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Rendering failed."))),
      mimeFor(format),
      quality,
    );
  });
}

export function canvasToPdfBlob(canvas: HTMLCanvasElement, quality: number): Blob {
  const doc = pdfWithPage(canvas, quality);
  return doc.output("blob");
}

function pdfWithPage(canvas: HTMLCanvasElement, quality: number) {
  const w = canvas.width;
  const h = canvas.height;
  const doc = new jsPDF({
    orientation: w >= h ? "landscape" : "portrait",
    unit: "px",
    format: [w, h],
    compress: true,
  });
  doc.addImage(canvas.toDataURL("image/jpeg", quality), "JPEG", 0, 0, w, h);
  return doc;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function renderToBlob(
  template: TemplateAsset,
  fields: CertField[],
  elements: CertElement[],
  row: RecordRow | null,
  settings: ExportSettings,
): Promise<Blob> {
  const canvas = await renderCertificate(template, fields, elements, row, settings.scale);
  if (settings.format === "pdf") return canvasToPdfBlob(canvas, settings.quality);
  return canvasToBlob(canvas, settings.format, settings.quality);
}

export interface RunOptions {
  template: TemplateAsset;
  fields: CertField[];
  elements: CertElement[];
  rows: RecordRow[];
  settings: ExportSettings;
  onProgress?: (done: number, failed: number, total: number) => void;
  signal?: { cancelled: boolean };
}

export interface RunResult {
  blob: Blob;
  filename: string;
  count: number;
  failed: { index: number; error: string }[];
}

/** Yield to the browser so the progress animation keeps running smoothly. */
const breathe = () => new Promise((r) => setTimeout(r, 0));

export async function runExport({
  template,
  fields,
  rows,
  settings,
  onProgress,
  signal,
}: RunOptions): Promise<{ blob: Blob; filename: string; count: number }> {
  const list: (RecordRow | null)[] = rows.length ? rows : [null];
  const total = list.length;
  const at = (i: number): RecordRow | null => list[i] ?? null;

  if (total === 1) {
    const blob = await renderToBlob(template, fields, at(0), settings);
    onProgress?.(1, 1);
    return {
      blob,
      filename: `${fileNameFor(settings.filenamePattern, at(0), 0)}.${extFor(settings.format)}`,
      count: 1,
    };
  }

  if (settings.format === "pdf" && settings.mode === "merged-pdf") {
    let doc: jsPDF | null = null;
    for (let i = 0; i < total; i += 1) {
      if (signal?.cancelled) throw new Error("cancelled");
      const canvas = await renderCertificate(template, fields, at(i), settings.scale);
      if (!doc) {
        doc = pdfWithPage(canvas, settings.quality);
      } else {
        doc.addPage([canvas.width, canvas.height], canvas.width >= canvas.height ? "landscape" : "portrait");
        doc.addImage(canvas.toDataURL("image/jpeg", settings.quality), "JPEG", 0, 0, canvas.width, canvas.height);
      }
      onProgress?.(i + 1, total);
      await breathe();
    }
    return { blob: doc!.output("blob"), filename: "certificates.pdf", count: total };
  }

  const zip = new JSZip();
  const used = new Set<string>();
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
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  return { blob, filename: "certificates.zip", count: total };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not encode the certificate."));
    reader.readAsDataURL(blob);
  });
}
