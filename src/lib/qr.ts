import QRCode from "qrcode";

const cache = new Map<string, string>();

/** Render a QR payload to a PNG data URL, cached per payload. */
export async function qrDataUrl(text: string): Promise<string> {
  const payload = text.trim() || "platepress";
  const hit = cache.get(payload);
  if (hit) return hit;
  const url = await QRCode.toDataURL(payload, {
    margin: 1,
    width: 512,
    errorCorrectionLevel: "M",
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
  cache.set(payload, url);
  return url;
}
