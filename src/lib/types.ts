export type Align = "left" | "center" | "right";

export interface CertField {
  id: string;
  /** Data column key, e.g. "name" */
  key: string;
  label: string;
  /** Anchor position, 0..1 of template width/height */
  x: number;
  y: number;
  /** Text box width as a fraction of template width */
  boxWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  color: string;
  align: Align;
  letterSpacing: number;
  lineHeight: number;
  uppercase: boolean;
  opacity: number;
  autoShrink: boolean;
}

export interface TemplateAsset {
  name: string;
  src: string;
  width: number;
  height: number;
}

export interface RecordRow {
  __id: string;
  [key: string]: string;
}

export type ExportFormat = "pdf" | "png" | "jpeg";
export type ExportMode = "zip" | "merged-pdf";

export interface ExportSettings {
  format: ExportFormat;
  quality: number;
  scale: number;
  mode: ExportMode;
  filenamePattern: string;
}

export interface EmailSettings {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
  fromName: string;
  subject: string;
  html: string;
  emailColumn: string;
  attachFormat: ExportFormat;
}

/* ---------- Visual elements (logos, signatures, QR codes) ---------- */

export type ElementKind = "image" | "signature" | "qr";

export interface CertElement {
  id: string;
  kind: ElementKind;
  label: string;
  /** data URL for image/signature elements */
  src: string;
  /** QR payload, supports {{column}} placeholders */
  qrText: string;
  /** centre position, 0..1 of template size */
  x: number;
  y: number;
  /** width as a fraction of template width */
  width: number;
  opacity: number;
  rotation: number;
}

export interface SavedSignature {
  id: string;
  name: string;
  src: string;
}

/* ---------- Dashboard + delivery tracking ---------- */

export interface BatchRecord {
  id: string;
  createdAt: number;
  name: string;
  format: ExportFormat;
  mode: ExportMode;
  total: number;
  generated: number;
  failed: number;
  cancelled: boolean;
  sent: number;
  sendFailed: number;
  verified: number;
}

export type DeliveryStatus = "pending" | "sending" | "sent" | "failed";

export interface DeliveryEntry {
  id: string;
  rowId: string;
  to: string;
  name: string;
  status: DeliveryStatus;
  error?: string;
  at: number;
}

