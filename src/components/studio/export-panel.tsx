import { useStudio } from "@/lib/store";
import { useRun } from "@/lib/run-store";
import type { ExportFormat, ExportMode } from "@/lib/types";

export function ExportPanel() {
  const settings = useStudio((s) => s.exportSettings);
  const setExportSettings = useStudio((s) => s.setExportSettings);
  const rows = useStudio((s) => s.rows);
  const start = useRun((s) => s.start);
  const running = useRun((s) => s.running);

  const count = Math.max(1, rows.length);

  return (
    <div className="space-y-4">
      <div className="label-mono">Step 4 — Export</div>

      <div>
        <span className="label-mono">Format</span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(["pdf", "png", "jpeg"] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setExportSettings({ format: f })}
              className={`rounded-md border px-3 py-2 text-xs font-medium uppercase transition-colors ${
                settings.format === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-paper hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div>
          <span className="label-mono">Delivery</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(
              [
                ["zip", "ZIP of files"],
                ["merged-pdf", "One merged PDF"],
              ] as [ExportMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                disabled={mode === "merged-pdf" && settings.format !== "pdf"}
                onClick={() => setExportSettings({ mode })}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
                  settings.mode === mode
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-paper hover:bg-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="block">
        <span className="label-mono">Resolution — {settings.scale}× print scale</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.5}
          value={settings.scale}
          onChange={(e) => setExportSettings({ scale: Number(e.target.value) })}
          className="mt-1 w-full accent-[var(--brand)]"
        />
      </label>

      {settings.format !== "png" && (
        <label className="block">
          <span className="label-mono">Quality — {Math.round(settings.quality * 100)}%</span>
          <input
            type="range"
            min={50}
            max={100}
            value={Math.round(settings.quality * 100)}
            onChange={(e) => setExportSettings({ quality: Number(e.target.value) / 100 })}
            className="mt-1 w-full accent-[var(--brand)]"
          />
        </label>
      )}

      <label className="block">
        <span className="label-mono">File name pattern</span>
        <input
          className="field-input mt-1 font-mono"
          value={settings.filenamePattern}
          onChange={(e) => setExportSettings({ filenamePattern: e.target.value })}
        />
        <span className="mt-1 block text-[11px] text-muted-foreground">
          Use {"{"}name{"}"} or any field key, plus {"{"}index{"}"}.
        </span>
      </label>

      <button
        onClick={() => void start()}
        disabled={running}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {running
          ? "Pressing…"
          : count === 1
            ? "Generate & download"
            : `Generate ${count} certificates`}
      </button>
    </div>
  );
}
