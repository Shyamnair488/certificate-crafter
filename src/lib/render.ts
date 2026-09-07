import { ensureFontsReady } from "./fonts";
import type { CertField, RecordRow, TemplateAsset } from "./types";

const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached?.complete) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Could not read that template image."));
    img.src = src;
  });
}

export function fieldValue(field: CertField, row?: RecordRow | null): string {
  const raw = row?.[field.key];
  const value = (raw ?? "").toString().trim();
  const text = value.length ? value : `{${field.key}}`;
  return field.uppercase ? text.toUpperCase() : text;
}

function fontString(field: CertField, size: number) {
  return `${field.italic ? "italic " : ""}${field.fontWeight} ${size}px "${field.fontFamily}", serif`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function drawFields(
  ctx: CanvasRenderingContext2D,
  template: TemplateAsset,
  fields: CertField[],
  row: RecordRow | null,
  scale: number,
) {
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
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        `${field.letterSpacing * scale}px`;
    }

    ctx.font = fontString(field, size);
    if (field.autoShrink) {
      let guard = 0;
      while (ctx.measureText(text).width > boxW && size > 6 && guard < 200) {
        size -= Math.max(0.5, size * 0.03);
        ctx.font = fontString(field, size);
        guard += 1;
      }
    }

    const lines = field.autoShrink ? [text] : wrap(ctx, text, boxW);
    const lineHeight = size * field.lineHeight;
    const anchorX =
      field.align === "left"
        ? field.x * template.width * scale
        : field.align === "right"
          ? field.x * template.width * scale
          : field.x * template.width * scale;
    const startY =
      field.y * template.height * scale - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, anchorX, startY + i * lineHeight);
    });
    ctx.restore();
  }
}

export async function renderCertificate(
  template: TemplateAsset,
  fields: CertField[],
  row: RecordRow | null,
  scale = 2,
): Promise<HTMLCanvasElement> {
  const img = await loadImage(template.src);
  await ensureFontsReady(
    fields.map((f) => ({
      family: f.fontFamily,
      weight: f.fontWeight,
      italic: f.italic,
      size: f.fontSize * scale,
    })),
  );

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
