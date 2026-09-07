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
