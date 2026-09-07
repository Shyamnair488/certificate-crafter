import { makeField, makeRow } from "./store";
import type { CertField, RecordRow, TemplateAsset } from "./types";

const W = 1600;
const H = 1130;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F4F0E5"/>
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="#B23A1E" stroke-width="3"/>
  <rect x="66" y="66" width="${W - 132}" height="${H - 132}" fill="none" stroke="#1B1814" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="46" cy="46" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="${W - 46}" cy="46" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="46" cy="${H - 46}" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <circle cx="${W - 46}" cy="${H - 46}" r="12" fill="none" stroke="#1B1814" stroke-opacity="0.3"/>
  <text x="${W / 2}" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="9" fill="#B23A1E">PLATEPRESS EVENTS</text>
  <text x="${W / 2}" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="12" fill="#6B655C">CERTIFICATE OF</text>
  <text x="${W / 2}" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#1B1814">ACHIEVEMENT</text>
  <text x="${W / 2}" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="#6B655C">THIS IS PRESENTED TO</text>
  <line x1="${W / 2 - 320}" y1="640" x2="${W / 2 + 320}" y2="640" stroke="#1B1814" stroke-opacity="0.25" stroke-width="2"/>
  <line x1="300" y1="930" x2="620" y2="930" stroke="#1B1814" stroke-opacity="0.35" stroke-width="2"/>
  <text x="460" y="968" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#6B655C">Programme Director</text>
  <line x1="980" y1="930" x2="1300" y2="930" stroke="#1B1814" stroke-opacity="0.35" stroke-width="2"/>
  <text x="1140" y="968" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#6B655C">Date</text>
  <circle cx="${W / 2}" cy="920" r="62" fill="none" stroke="#B23A1E" stroke-width="2"/>
  <text x="${W / 2}" y="928" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="4" fill="#B23A1E">SEAL</text>
</svg>`;

export const SAMPLE_TEMPLATE: TemplateAsset = {
  name: "Sample — Certificate of Achievement",
  src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  width: W,
  height: H,
};

export function sampleFields(): CertField[] {
  return [
    makeField({
      key: "name",
      label: "Recipient name",
      x: 0.5,
      y: 0.53,
      boxWidth: 0.62,
      fontFamily: "Playfair Display",
      fontSize: 84,
      fontWeight: 600,
      color: "#1B1814",
      align: "center",
    }),
    makeField({
      key: "award",
      label: "Award line",
      x: 0.5,
      y: 0.64,
      boxWidth: 0.55,
      fontFamily: "Spectral",
      fontSize: 30,
      fontWeight: 400,
      italic: true,
      color: "#6B655C",
      align: "center",
      autoShrink: false,
      lineHeight: 1.35,
    }),
    makeField({
      key: "date",
      label: "Date",
      x: 0.7125,
      y: 0.795,
      boxWidth: 0.2,
      fontFamily: "Spectral",
      fontSize: 30,
      fontWeight: 400,
      color: "#1B1814",
      align: "center",
    }),
  ];
}

export function sampleRows(): RecordRow[] {
  return [
    makeRow({
      name: "Amara Okonkwo",
      award: "for exceptional craftsmanship throughout the Autumn Gala programme",
      date: "14 October 2026",
      email: "amara@example.com",
    }),
    makeRow({
      name: "Elias Vance",
      award: "for outstanding stage production and technical direction",
      date: "14 October 2026",
      email: "elias@example.com",
    }),
    makeRow({
      name: "Sofia Marchetti",
      award: "for dedicated volunteer service across all three festival days",
      date: "14 October 2026",
      email: "sofia@example.com",
    }),
    makeRow({
      name: "Ravi Deshmukh",
      award: "for leading the guest hospitality team with distinction",
      date: "14 October 2026",
      email: "ravi@example.com",
    }),
  ];
}

export function sampleCsv(keys: string[]) {
  const cols = keys.length ? keys : ["name", "award", "date", "email"];
  const rows = sampleRows().map((r) => cols.map((c) => `"${(r[c] ?? "").replace(/"/g, '""')}"`).join(","));
  return [cols.join(","), ...rows].join("\n");
}
