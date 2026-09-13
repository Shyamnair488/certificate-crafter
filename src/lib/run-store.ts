import { create } from "zustand";
import { toast } from "sonner";
import { runExport, downloadBlob } from "./exporters";
import { useStudio } from "./store";

interface RunState {
  running: boolean;
  done: number;
  failed: number;
  total: number;
  label: string;
  cancelled: boolean;
  start: () => Promise<void>;
  cancel: () => void;
}

function batchId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useRun = create<RunState>((set, get) => ({
  running: false,
  done: 0,
  failed: 0,
  total: 0,
  label: "",
  cancelled: false,

  cancel: () => set({ cancelled: true }),

  start: async () => {
    if (get().running) return;
    const { template, fields, elements, rows, exportSettings, addBatch } = useStudio.getState();
    if (!template) {
      toast.error("Add a certificate template first.");
      return;
    }
    if (!fields.length && !elements.length) {
      toast.error("Place at least one field or element on the template.");
      return;
    }

    const signal = { cancelled: false };
    const unsub = useRun.subscribe((s) => {
      if (s.cancelled) signal.cancelled = true;
    });

    const total = Math.max(1, rows.length);
    set({ running: true, cancelled: false, done: 0, failed: 0, total, label: "Warming the press" });

    const id = batchId();
    const startedAt = Date.now();

    try {
      const result = await runExport({
        template,
        fields,
        elements,
        rows,
        settings: exportSettings,
        signal,
        onProgress: (done, failed, all) =>
          set({ done, failed, total: all, label: `Pressing certificate ${done + failed} of ${all}` }),
      });
      set({ label: "Packaging" });
      downloadBlob(result.blob, result.filename);
      addBatch({
        id,
        createdAt: startedAt,
        name: template.name,
        format: exportSettings.format,
        mode: exportSettings.mode,
        total,
        generated: result.count,
        failed: result.failed.length,
        cancelled: false,
        sent: 0,
        sendFailed: 0,
        verified: 0,
      });
      if (result.failed.length) {
        toast.warning(
          `${result.count} certificates downloaded — ${result.failed.length} failed to render.`,
        );
      } else {
        toast.success(
          result.count === 1
            ? "Certificate downloaded."
            : `${result.count} certificates packaged and downloaded.`,
        );
      }
    } catch (err) {
      const { done, failed } = get();
      if (err instanceof Error && err.message === "cancelled") {
        addBatch({
          id,
          createdAt: startedAt,
          name: template.name,
          format: exportSettings.format,
          mode: exportSettings.mode,
          total,
          generated: done,
          failed,
          cancelled: true,
          sent: 0,
          sendFailed: 0,
          verified: 0,
        });
        toast("Run cancelled.");
      } else {
        toast.error(err instanceof Error ? err.message : "The run failed.");
      }
    } finally {
      unsub();
      set({ running: false, cancelled: false, label: "" });
    }
  },
}));
