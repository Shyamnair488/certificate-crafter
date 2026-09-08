import { useRef, useState } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import { SAMPLE_TEMPLATE, sampleFields, sampleRows } from "@/lib/sample";
import type { TemplateAsset } from "@/lib/types";

function readTemplate(file: File): Promise<TemplateAsset> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose a PNG, JPEG, WebP or SVG image."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onload = () =>
        resolve({
          name: file.name.replace(/\.[^.]+$/, ""),
          src,
          width: img.naturalWidth || 1600,
          height: img.naturalHeight || 1130,
        });
      img.onerror = () => reject(new Error("That image could not be opened."));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function TemplatePanel() {
  const template = useStudio((s) => s.template);
  const setTemplate = useStudio((s) => s.setTemplate);
  const fields = useStudio((s) => s.fields);
  const setRows = useStudio((s) => s.setRows);
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      const asset = await readTemplate(file);
      setTemplate(asset);
      toast.success(`${asset.name} loaded — ${asset.width}×${asset.height}px.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function loadSample() {
    setTemplate(SAMPLE_TEMPLATE);
    useStudio.setState({ fields: sampleFields(), selectedId: null });
    setRows(sampleRows());
    toast.success("Sample certificate, fields and roster loaded.");
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          over ? "border-primary bg-brand-soft/10" : "border-border bg-paper"
        }`}
      >
        <div className="label-mono">Step 1 — Template</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Drop a certificate image here, or choose a file. PNG, JPEG, WebP or SVG.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Choose template
          </button>
          <button
            onClick={loadSample}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Load sample
          </button>
        </div>
      </div>

      {template && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="label-mono">Loaded plate</div>
          <p className="mt-1 truncate text-sm font-medium">{template.name}</p>
          <p className="text-xs text-muted-foreground">
            {template.width} × {template.height} px · {fields.length} field
            {fields.length === 1 ? "" : "s"} placed
          </p>
          <button
            onClick={() => setTemplate(null)}
            className="mt-3 text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Remove template
          </button>
        </div>
      )}
    </div>
  );
}
