interface Props {
  open: boolean;
  label: string;
  done: number;
  failed?: number;
  total: number;
  onCancel?: () => void;
}

export function ProgressOverlay({ open, label, done, failed = 0, total, onCancel }: Props) {
  if (!open) return null;
  const processed = done + failed;
  const pct = total ? Math.round((processed / total) * 100) : 0;
  const remaining = Math.max(0, total - processed);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-cardfill">
        <div className="label-mono">{label || "Working"}</div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-4xl font-semibold text-foreground">{pct}%</span>
          <span className="text-sm text-muted-foreground">
            {processed} of {total}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Completed", done, "text-foreground"],
            ["Failed", failed, failed ? "text-destructive" : "text-muted-foreground"],
            ["Remaining", remaining, "text-muted-foreground"],
          ].map(([label2, value, tone]) => (
            <div key={String(label2)} className="rounded-md border border-border bg-paper py-2">
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {label2}
              </dt>
              <dd className={`mt-0.5 text-lg font-semibold ${tone}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-[2px] bg-primary animate-press" aria-hidden />
          <span className="text-xs text-muted-foreground">
            Everything is rendered on your device — nothing is uploaded.
          </span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-5 w-full rounded-md border border-border bg-paper px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Cancel run
          </button>
        )}
      </div>
    </div>
  );
}
