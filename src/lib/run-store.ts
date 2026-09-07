import { create } from "zustand";
import { toast } from "sonner";
import { runExport, downloadBlob } from "./exporters";
import { useStudio } from "./store";

interface RunState {
  running: boolean;
  done: number;
  total: number;
  label: string;
  cancelled: boolean;
  start: () => Promise<void>;
  cancel: () => void;
}

export const useRun = create<RunState>((set, get) => ({
  running: false,
  done: 0,
  total: 0,
  label: "",
  cancelled: false,

  cancel: () => set({ cancelled: true }),

  start: async () => {
    if (get().running) return;
    const { template, fields, rows, exportSettings } = useStudio.getState();
    if (!template) {
      toast.error("Add a certificate template first.");
      return;
    }
    if (!fields.length) {
      toast.error("Place at least one field on the template.");
      return;
    }

    const signal = { cancelled: false };
    const unsub = useRun.subscribe((s) => {
      if (s.cancelled) signal.cancelled = true;
    });

    set({
      running: true,
      cancelled: false,
      done: 0,
      total: Math.max(1, rows.length),
      label: "Warming the press",
    });

    try {
      const result = await runExport({
        template,
        fields,
        rows,
        settings: exportSettings,
        signal,
        onProgress: (done, total) =>
          set({ done, total, label: `Pressing plate ${done} of ${total}` }),
      });
      set({ label: "Packaging" });
      downloadBlob(result.blob, result.filename);
      toast.success(
        result.count === 1
          ? "Certificate downloaded."
          : `${result.count} certificates packaged and downloaded.`,
      );
    } catch (err) {
      if (err instanceof Error && err.message === "cancelled") {
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
