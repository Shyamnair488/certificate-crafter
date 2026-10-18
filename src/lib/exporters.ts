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
  elements,
  rows,
  settings,
  onProgress,
  signal,
}: RunOptions): Promise<RunResult> {
  const list: (RecordRow | null)[] = rows.length ? rows : [null];
  const total = list.length;
  const at = (i: number): RecordRow | null => list[i] ?? null;
  const failed: { index: number; error: string }[] = [];
  const note = (i: number, err: unknown) =>
    failed.push({ index: i, error: err instanceof Error ? err.message : "Render failed" });
  const checkCancelled = () => { if (signal?.cancelled) throw new Error("cancelled"); };
  checkCancelled();

  if (total === 1) {
    const blob = await renderToBlob(template, fields, elements, at(0), settings);
    checkCancelled();
    onProgress?.(1, 0, 1);
    return {
      blob,
      filename: `${fileNameFor(settings.filenamePattern, at(0), 0)}.${extFor(settings.format)}`,
      count: 1,
      failed,
    };
  }

  if (settings.format === "pdf" && settings.mode === "merged-pdf") {
    let doc: jsPDF | null = null;
    let made = 0;
    for (let i = 0; i < total; i += 1) {
      if (signal?.cancelled) throw new Error("cancelled");
      try {
        const canvas = await renderCertificate(template, fields, elements, at(i), settings.scale);
        if (!doc) {
          doc = pdfWithPage(canvas, settings.quality);
        } else {
          doc.addPage(
            [canvas.width, canvas.height],
            canvas.width >= canvas.height ? "landscape" : "portrait",
          );
          doc.addImage(
            canvas.toDataURL("image/jpeg", settings.quality),
            "JPEG",
            0,
            0,
            canvas.width,
            canvas.height,
          );
        }
        made += 1;
      } catch (err) {
        note(i, err);
      }
      onProgress?.(i + 1 - failed.length, failed.length, total);
      await breathe();
    }
    checkCancelled();
    if (!doc) throw new Error("Every certificate failed to render.");
    return { blob: doc.output("blob"), filename: "certificates.pdf", count: made, failed };
  }

  const zip = new JSZip();
  const used = new Set<string>();
  let made = 0;
  for (let i = 0; i < total; i += 1) {
    if (signal?.cancelled) throw new Error("cancelled");
    try {
      const blob = await renderToBlob(template, fields, elements, at(i), settings);
      let name = `${fileNameFor(settings.filenamePattern, at(i), i)}.${extFor(settings.format)}`;
      const base = name;
      let suffix = 2;
      while (used.has(name)) name = base.replace(/(\.\w+)$/, `-${suffix++}$1`);
      used.add(name);
      zip.file(name, blob);
      made += 1;
    } catch (err) {
      note(i, err);
    }
    onProgress?.(made, failed.length, total);
    await breathe();
  }
  if (!made) throw new Error("Every certificate failed to render.");
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  checkCancelled();
  return { blob, filename: "certificates.zip", count: made, failed };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not encode the certificate."));
    reader.readAsDataURL(blob);
  });
}
