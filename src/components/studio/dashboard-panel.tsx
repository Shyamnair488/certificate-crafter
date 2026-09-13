import { useStudio } from "@/lib/store";

function when(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPanel() {
  const batches = useStudio((s) => s.batches);
  const delivery = useStudio((s) => s.delivery);
  const removeBatch = useStudio((s) => s.removeBatch);
  const clearBatches = useStudio((s) => s.clearBatches);
  const updateBatch = useStudio((s) => s.updateBatch);

  const generated = batches.reduce((n, b) => n + b.generated, 0);
  const failed = batches.reduce((n, b) => n + b.failed + b.sendFailed, 0);
  const sent = batches.reduce((n, b) => n + b.sent, 0) + delivery.filter((d) => d.status === "sent").length;
  const verified = batches.reduce((n, b) => n + b.verified, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="label-mono">Dashboard</div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Every batch you produce on this device, with generation and delivery results.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          ["Generated", generated],
          ["Sent", sent],
          ["Failed", failed],
          ["Verified", verified],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-paper p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="label-mono">Batches ({batches.length})</span>
        {batches.length > 0 && (
          <button
            onClick={clearBatches}
            className="text-[11px] text-muted-foreground hover:text-destructive"
          >
            Clear history
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {batches.map((b) => (
          <li key={b.id} className="rounded-lg border border-border bg-paper p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{b.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {when(b.createdAt)} · {b.format.toUpperCase()} ·{" "}
                  {b.mode === "merged-pdf" ? "merged PDF" : "ZIP"}
                  {b.cancelled ? " · cancelled" : ""}
                </div>
              </div>
              <button
                onClick={() => removeBatch(b.id)}
                aria-label="Delete batch record"
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px]">
              <div>
                <div className="text-muted-foreground">Made</div>
                <div className="font-semibold">{b.generated}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sent</div>
                <div className="font-semibold">{b.sent}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Failed</div>
                <div className={`font-semibold ${b.failed + b.sendFailed ? "text-destructive" : ""}`}>
                  {b.failed + b.sendFailed}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Verified</div>
                <div className="font-semibold">{b.verified}</div>
              </div>
            </div>
            <button
              onClick={() => updateBatch(b.id, { verified: b.verified ? 0 : b.generated })}
              className="mt-2 w-full rounded-md border border-border bg-card px-3 py-1.5 text-[11px] font-medium hover:bg-secondary"
            >
              {b.verified ? "Mark as unverified" : "Mark batch as verified"}
            </button>
          </li>
        ))}
        {!batches.length && (
          <li className="rounded-lg border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
            No batches yet. Generate certificates and they will be listed here.
          </li>
        )}
      </ul>
    </div>
  );
}
