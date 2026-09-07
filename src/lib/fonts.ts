export interface FontOption {
  family: string;
  category: "Serif" | "Sans" | "Script" | "Mono" | "Custom";
}

export const BUILT_IN_FONTS: FontOption[] = [
  { family: "Spectral", category: "Serif" },
  { family: "Playfair Display", category: "Serif" },
  { family: "Cormorant Garamond", category: "Serif" },
  { family: "EB Garamond", category: "Serif" },
  { family: "Marcellus", category: "Serif" },
  { family: "Cinzel", category: "Serif" },
  { family: "Lora", category: "Serif" },
  { family: "Space Grotesk", category: "Sans" },
  { family: "Montserrat", category: "Sans" },
  { family: "Great Vibes", category: "Script" },
  { family: "Dancing Script", category: "Script" },
  { family: "Tangerine", category: "Script" },
  { family: "IBM Plex Mono", category: "Mono" },
];

/** Fonts the user pulled in at runtime (uploaded file or Google Fonts name). */
const runtimeFonts = new Set<string>();

export function registerRuntimeFont(family: string) {
  runtimeFonts.add(family);
}

export function getRuntimeFonts(): string[] {
  return [...runtimeFonts];
}

export function loadGoogleFont(family: string) {
  if (typeof document === "undefined") return;
  const id = `gf-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  ).replace(/%20/g, "+")}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

export async function loadFontFile(file: File): Promise<string> {
  const family = file.name.replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, "").trim();
  const buffer = await file.arrayBuffer();
  const face = new FontFace(family, buffer);
  await face.load();
  (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
  registerRuntimeFont(family);
  return family;
}

/** Make sure every font used by the fields is actually rasterisable before drawing. */
export async function ensureFontsReady(
  specs: { family: string; weight: number; italic: boolean; size: number }[],
) {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(
    specs.map((s) =>
      document.fonts
        .load(`${s.italic ? "italic " : ""}${s.weight} ${Math.max(12, s.size)}px "${s.family}"`)
        .catch(() => undefined),
    ),
  );
  await document.fonts.ready;
}
