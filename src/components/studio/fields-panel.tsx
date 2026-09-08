import { useMemo, useRef } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import { BUILT_IN_FONTS, loadFontFile, loadGoogleFont } from "@/lib/fonts";
import type { CertField } from "@/lib/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function FieldsPanel() {
  const fields = useStudio((s) => s.fields);
  const selectedId = useStudio((s) => s.selectedId);
  const select = useStudio((s) => s.select);
  const addField = useStudio((s) => s.addField);
  const updateField = useStudio((s) => s.updateField);
  const removeField = useStudio((s) => s.removeField);
  const duplicateField = useStudio((s) => s.duplicateField);
  const customFonts = useStudio((s) => s.customFonts);
  const addCustomFont = useStudio((s) => s.addCustomFont);
  const fontFileRef = useRef<HTMLInputElement>(null);
  const googleRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => fields.find((f) => f.id === selectedId) ?? null,
    [fields, selectedId],
  );

  function set(patch: Partial<CertField>) {
    if (selected) updateField(selected.id, patch);
  }

  async function onFontFile(file?: File) {
    if (!file) return;
    try {
      const family = await loadFontFile(file);
      addCustomFont(family);
      set({ fontFamily: family });
      toast.success(`${family} is ready to use.`);
    } catch {
      toast.error("That font file could not be loaded.");
    }
  }

  function addGoogleFont() {
    const family = googleRef.current?.value.trim();
    if (!family) return;
    loadGoogleFont(family);
    addCustomFont(family);
    set({ fontFamily: family });
    if (googleRef.current) googleRef.current.value = "";
    toast.success(`${family} added from Google Fonts.`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="label-mono">Step 2 — Fields</div>
        <button
          onClick={() => addField()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add field
        </button>
      </div>

      <div className="space-y-1">
        {fields.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
            No fields yet. Add one, then drag it onto the certificate. Field names must match your
            spreadsheet column names (for example <code className="font-mono">name</code>).
          </p>
        )}
        {fields.map((f) => (
          <button
            key={f.id}
            onClick={() => select(f.id)}
            className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
              f.id === selectedId
                ? "border-primary bg-brand-soft/10"
                : "border-border bg-paper hover:bg-secondary"
            }`}
          >
            <span className="truncate">{f.label}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{`{${f.key}}`}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3 rounded-lg border border-border bg-card p-4 animate-rise">
          <Row label="Data key (matches your column)">
            <input
              className="field-input font-mono"
              value={selected.key}
              onChange={(e) => set({ key: e.target.value.trim() })}
            />
          </Row>
          <Row label="Label">
            <input
              className="field-input"
              value={selected.label}
              onChange={(e) => set({ label: e.target.value })}
            />
          </Row>
          <Row label="Font">
            <select
              className="field-input"
              value={selected.fontFamily}
              onChange={(e) => {
                loadGoogleFont(e.target.value);
                set({ fontFamily: e.target.value });
              }}
            >
              {BUILT_IN_FONTS.map((f) => (
                <option key={f.family} value={f.family}>
                  {f.family} — {f.category}
                </option>
              ))}
              {customFonts.map((f) => (
                <option key={f} value={f}>
                  {f} — Custom
                </option>
              ))}
            </select>
          </Row>

          <div className="grid grid-cols-2 gap-2">
            <Row label="Size (px)">
              <input
                type="number"
                min={6}
                max={400}
                className="field-input"
                value={selected.fontSize}
                onChange={(e) => set({ fontSize: Number(e.target.value) || 12 })}
              />
            </Row>
            <Row label="Weight">
              <select
                className="field-input"
                value={selected.fontWeight}
                onChange={(e) => set({ fontWeight: Number(e.target.value) })}
              >
                {[300, 400, 500, 600, 700].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Row>
            <Row label="Colour">
              <input
                type="color"
                className="h-9 w-full rounded-md border border-border bg-paper"
                value={selected.color}
                onChange={(e) => set({ color: e.target.value })}
              />
            </Row>
            <Row label="Alignment">
              <select
                className="field-input"
                value={selected.align}
                onChange={(e) => set({ align: e.target.value as CertField["align"] })}
              >
                <option value="left">Left</option>
                <option value="center">Centre</option>
                <option value="right">Right</option>
              </select>
            </Row>
          </div>

          <Row label={`Box width — ${Math.round(selected.boxWidth * 100)}%`}>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(selected.boxWidth * 100)}
              onChange={(e) => set({ boxWidth: Number(e.target.value) / 100 })}
              className="w-full accent-[var(--brand)]"
            />
          </Row>
          <div className="grid grid-cols-2 gap-2">
            <Row label={`Letter spacing — ${selected.letterSpacing}px`}>
              <input
                type="range"
                min={-5}
                max={30}
                value={selected.letterSpacing}
                onChange={(e) => set({ letterSpacing: Number(e.target.value) })}
                className="w-full accent-[var(--brand)]"
              />
            </Row>
            <Row label={`Opacity — ${Math.round(selected.opacity * 100)}%`}>
              <input
                type="range"
                min={10}
                max={100}
                value={Math.round(selected.opacity * 100)}
                onChange={(e) => set({ opacity: Number(e.target.value) / 100 })}
                className="w-full accent-[var(--brand)]"
              />
            </Row>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.italic}
                onChange={(e) => set({ italic: e.target.checked })}
              />
              Italic
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.uppercase}
                onChange={(e) => set({ uppercase: e.target.checked })}
              />
              Uppercase
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.autoShrink}
                onChange={(e) => set({ autoShrink: e.target.checked })}
              />
              Shrink long text to fit
            </label>
          </div>

          <div className="rounded-md border border-border bg-paper p-3">
            <div className="label-mono">Bring your own font</div>
            <div className="mt-2 flex gap-2">
              <input
                ref={googleRef}
                placeholder="Google font name"
                className="field-input"
                onKeyDown={(e) => e.key === "Enter" && addGoogleFont()}
              />
              <button
                onClick={addGoogleFont}
                className="shrink-0 rounded-md border border-border bg-card px-3 text-xs font-medium hover:bg-secondary"
              >
                Add
              </button>
            </div>
            <input
              ref={fontFileRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              className="sr-only"
              onChange={(e) => void onFontFile(e.target.files?.[0])}
            />
            <button
              onClick={() => fontFileRef.current?.click()}
              className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary"
            >
              Upload a font file (.ttf, .otf, .woff)
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => duplicateField(selected.id)}
              className="flex-1 rounded-md border border-border bg-paper px-3 py-2 text-xs font-medium hover:bg-secondary"
            >
              Duplicate
            </button>
            <button
              onClick={() => removeField(selected.id)}
              className="flex-1 rounded-md border border-destructive px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
