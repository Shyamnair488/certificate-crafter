import type { CertField } from "./types";

export function measureField(ctx: CanvasRenderingContext2D, field: CertField, text: string, width: number, scale = 1) {
  const boxWidth = field.boxWidth * width * scale;
  let size = field.fontSize * scale;
  const setFont = () => { ctx.font = `${field.italic ? "italic " : ""}${field.fontWeight} ${size}px "${field.fontFamily}", serif`; };
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${field.letterSpacing * scale}px`;
  setFont();
  if (field.autoShrink) {
    let guard = 0;
    while (ctx.measureText(text).width > boxWidth && size > 6 * scale && guard < 200) {
      size = Math.max(6 * scale, size - Math.max(0.5 * scale, size * 0.03));
      setFont();
      guard += 1;
    }
  }
  const lines: string[] = [];
  if (field.autoShrink) lines.push(text);
  else {
    let current = "";
    for (const word of text.split(/\s+/)) {
      const next = current ? `${current} ${word}` : word;
      if (ctx.measureText(next).width > boxWidth && current) { lines.push(current); current = word; }
      else current = next;
    }
    lines.push(current);
  }
  return { size, lines, overflow: lines.some((line) => ctx.measureText(line).width > boxWidth + 0.5) };
}