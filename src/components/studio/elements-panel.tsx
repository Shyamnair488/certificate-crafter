import { useRef, useState } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import type { ElementKind } from "@/lib/types";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

export function ElementsPanel() {
  const elements = useStudio((s) => s.elements);
  const addElement = useStudio((s) => s.addElement);
  const updateElement = useStudio((s) => s.updateElement);
  const removeElement = useStudio((s) => s.removeElement);
  const selectedElementId = useStudio((s) => s.selectedElementId);
  const selectElement = useStudio((s) => s.selectElement);
  const signatures = useStudio((s) => s.signatures);
  const addSignature = useStudio((s) => s.addSignature);
  const removeSignature = useStudio((s) => s.removeSignature);
  const placeSignature = useStudio((s) => s.placeSignature);

  const logoRef = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);
  const [sigName, setSigName] = useState("");
  const [over, setOver] = useState(false);

  const selected = elements.find((e) => e.id === selectedElementId) ?? null;

  async function addImage(file: File | undefined, kind: ElementKind) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG works best).");
      return;
    }
    try {
      const src = await readAsDataUrl(file);
      if (kind === "signature") {
        const name = sigName.trim() || file.name.replace(/\.[^.]+$/, "");
        addSignature(name, src);
        setSigName("");
        toast.success(`Signature “${name}” saved to your library.`);
      } else {
        addElement("image", { src, label: file.name.replace(/\.[^.]+$/, "") });
        toast.success("Logo added — drag it on the proof to position it.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that image.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="label-mono">Step 3 — Logos, signatures &amp; QR</div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Drop artwork straight onto the certificate. Everything is placed by dragging on the proof.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void addImage(e.dataTransfer.files?.[0], "image");
        }}
        className={`rounded-lg border-2 border-dashed p-4 text-center text-xs transition-colors ${
          over ? "border-primary bg-brand-soft/10" : "border-border bg-paper"
        }`}
      >
        <p className="text-muted-foreground">Drop a logo or badge here (PNG with transparency).</p>
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => void addImage(e.target.files?.[0], "image")}
        />
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => logoRef.current?.click()}
            className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add logo
          </button>
          <button
            onClick={() => addElement("qr")}
            className="rounded-md border border-border bg-card px-3 py-1.5 font-medium hover:bg-secondary"
          >
            Add QR code
          </button>
        </div>
      </div>

      {/* Signature library */}
      <div className="rounded-lg border border-border bg-paper p-3">
        <div className="label-mono">Signature library</div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Saved signatures stay on this device and can be reused on any batch.
        </p>
        <div className="mt-2 flex gap-2">
          <input
            className="field-input flex-1"
            placeholder="Signatory name"
            value={sigName}
            onChange={(e) => setSigName(e.target.value)}
          />
          <input
            ref={sigRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void addImage(e.target.files?.[0], "signature")}
          />
          <button
            onClick={() => sigRef.current?.click()}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary"
          >
            Upload signature
          </button>
        </div>

        {signatures.length > 0 && (
          <ul className="mt-3 space-y-2">
            {signatures.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-2 rounded-md border border-border bg-card p-2"
              >
                <img src={s.src} alt={s.name} className="h-8 w-16 object-contain" />
                <span className="min-w-0 flex-1 truncate text-xs">{s.name}</span>
                <button
                  onClick={() => placeSignature(s.id)}
                  className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground"
                >
                  Place
                </button>
                <button
                  onClick={() => removeSignature(s.id)}
                  aria-label={`Delete ${s.name}`}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Placed elements */}
      <div>
        <div className="label-mono">On the certificate ({elements.length})</div>
        <ul className="mt-2 space-y-1">
          {elements.map((el) => (
            <li key={el.id}>
              <button
                onClick={() => selectElement(el.id)}
                className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors ${
                  el.id === selectedElementId
                    ? "border-primary bg-secondary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {el.kind}
                </span>
                <span className="min-w-0 flex-1 truncate">{el.label}</span>
              </button>
            </li>
          ))}
          {!elements.length && (
            <li className="rounded-md border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
              Nothing placed yet.
            </li>
          )}
        </ul>
      </div>

      {selected && (
        <div className="space-y-3 rounded-lg border border-border bg-paper p-3">
          <div className="flex items-center justify-between">
            <span className="label-mono">Selected element</span>
            <button
              onClick={() => removeElement(selected.id)}
              className="text-[11px] text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>

          <label className="block">
            <span className="label-mono">Label</span>
            <input
              className="field-input mt-1"
              value={selected.label}
              onChange={(e) => updateElement(selected.id, { label: e.target.value })}
            />
          </label>

          {selected.kind === "qr" && (
            <label className="block">
              <span className="label-mono">QR content</span>
              <input
                className="field-input mt-1 font-mono text-[11px]"
                value={selected.qrText}
                onChange={(e) => updateElement(selected.id, { qrText: e.target.value })}
              />
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Use {"{{"}name{"}}"} or any column to make each QR unique.
              </span>
            </label>
          )}

          <label className="block">
            <span className="label-mono">Size — {Math.round(selected.width * 100)}% of width</span>
            <input
              type="range"
              min={2}
              max={60}
              value={Math.round(selected.width * 100)}
              onChange={(e) => updateElement(selected.id, { width: Number(e.target.value) / 100 })}
              className="mt-1 w-full accent-[var(--brand)]"
            />
          </label>

          <label className="block">
            <span className="label-mono">Opacity — {Math.round(selected.opacity * 100)}%</span>
            <input
              type="range"
              min={10}
              max={100}
              value={Math.round(selected.opacity * 100)}
              onChange={(e) => updateElement(selected.id, { opacity: Number(e.target.value) / 100 })}
              className="mt-1 w-full accent-[var(--brand)]"
            />
          </label>

          <label className="block">
            <span className="label-mono">Rotation — {selected.rotation}°</span>
            <input
              type="range"
              min={-45}
              max={45}
              value={selected.rotation}
              onChange={(e) => updateElement(selected.id, { rotation: Number(e.target.value) })}
              className="mt-1 w-full accent-[var(--brand)]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
