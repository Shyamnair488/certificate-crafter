import { z } from "zod";

const unit = z.number().finite().min(0).max(1);
const positive = z.number().finite().positive();
const field = z.object({
  id: z.string().min(1), key: z.string().min(1), label: z.string(), x: unit, y: unit,
  boxWidth: positive.max(1), fontFamily: z.string().min(1), fontSize: positive.max(1000),
  fontWeight: positive.max(1000), italic: z.boolean(), color: z.string(),
  align: z.enum(["left", "center", "right"]), letterSpacing: z.number().finite(),
  lineHeight: positive.max(10), uppercase: z.boolean(), opacity: unit, autoShrink: z.boolean(),
});
const element = z.object({
  id: z.string().min(1), kind: z.enum(["image", "signature", "qr"]), label: z.string(),
  src: z.string(), qrText: z.string(), x: unit, y: unit, width: positive.max(1),
  opacity: unit, rotation: z.number().finite(),
});
const schema = z.object({
  app: z.literal("platepress"), v: z.literal(1),
  template: z.object({ name: z.string(), src: z.string().min(1), width: positive.max(20000), height: positive.max(20000) }).nullable(),
  fields: z.array(field), elements: z.array(element),
  rows: z.array(z.object({ __id: z.string().min(1) }).catchall(z.string())),
  exportSettings: z.object({ format: z.enum(["pdf", "png", "jpeg"]), quality: unit,
    scale: positive.max(4), mode: z.enum(["zip", "merged-pdf"]), filenamePattern: z.string() }),
});

export function parseProject(input: unknown) {
  return schema.parse(input);
}