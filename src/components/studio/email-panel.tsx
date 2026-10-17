import { useRef, useState } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import { fillTemplate, sendCertificateEmail, type SendResult } from "@/lib/email";
import { blobToBase64, extFor, fileNameFor, renderToBlob } from "@/lib/exporters";
import type { DeliveryEntry, ExportFormat, RecordRow } from "@/lib/types";

export function EmailPanel() {
  const email = useStudio((s) => s.email);
  const setEmail = useStudio((s) => s.setEmail);
  const rows = useStudio((s) => s.rows);
  const fields = useStudio((s) => s.fields);
  const template = useStudio((s) => s.template);
  const settings = useStudio((s) => s.exportSettings);
  const previewIndex = useStudio((s) => s.previewIndex);

  const elements = useStudio((s) => s.elements);
  const delivery = useStudio((s) => s.delivery);
  const setDelivery = useStudio((s) => s.setDelivery);
  const updateDelivery = useStudio((s) => s.updateDelivery);
  const [sending, setSending] = useState(false);
  const [delay, setDelay] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const stopRef = useRef(false);

  const previewRow = rows[previewIndex] ?? rows[0] ?? null;
  const configured = Boolean(email.serviceId && email.templateId && email.publicKey);
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function deliver(targets: RecordRow[], entries: DeliveryEntry[]): Promise<void> {
    if (!template) { toast.error("Add a certificate template first."); return; }
    if (!fields.length && !elements.length) { toast.error("Place at least one field on the template."); return; }
    if (!configured) { toast.error("Add your service ID, template ID and public key."); return; }
    if (!targets.length) { toast.error("Add at least one recipient row."); return; }
    if (targets.length > 200)
      toast.warning(`Sending ${targets.length} emails — EmailJS free plans allow about 200 per month.`);
    setSending(true);
    stopRef.current = false;
    let ok = 0;
    let bad = 0;
    for (let i = 0; i < targets.length; i += 1) {
      if (stopRef.current) break;
      const row = targets[i]!;
      const entry = entries[i]!;
      if (!EMAIL_RE.test(entry.to)) {
        updateDelivery(entry.id, { status: "failed", error: "Invalid or missing email address", at: Date.now() });
        bad += 1;
        continue;
      }
      updateDelivery(entry.id, { status: "sending", error: undefined, at: Date.now() });
      try {
        const blob = await renderToBlob(template, fields, elements, row, { ...settings, format: email.attachFormat });
        const base64 = await blobToBase64(blob);
        const name = `${fileNameFor(settings.filenamePattern, row, i)}.${extFor(email.attachFormat)}`;
        const res: SendResult = await sendCertificateEmail(email, row, base64, name);
        updateDelivery(entry.id, { status: res.ok ? "sent" : "failed", error: res.error, at: Date.now() });
        if (res.ok) ok += 1; else bad += 1;
      } catch (err) {
        bad += 1;
        updateDelivery(entry.id, { status: "failed", error: err instanceof Error ? err.message : "Failed", at: Date.now() });
      }
      if (delay && i < targets.length - 1) await new Promise((r) => setTimeout(r, delay * 1000));
    }
    setSending(false);
    if (!bad) toast.success(`${ok} email${ok === 1 ? "" : "s"} sent.`);
    else toast.error(`${ok} sent, ${bad} failed — use “Retry failed”.`);
  }

  function entryFor(row: RecordRow): DeliveryEntry {
    return {
      id: Math.random().toString(36).slice(2, 10),
      rowId: row.__id,
      to: (row[email.emailColumn] ?? "").toString().trim(),
      name: (row["name"] ?? row[fields[0]?.key ?? ""] ?? "").toString(),
      status: "pending",
      at: Date.now(),
    };
  }

  function send(all: boolean) {
    const targets = all ? rows : previewRow ? [previewRow] : [];
    const entries = targets.map(entryFor);
    setDelivery(entries);
    void deliver(targets, entries);
  }

  function retryFailed() {
    const failed = delivery.filter((d) => d.status === "failed");
    const targets: RecordRow[] = [];
    const entries: DeliveryEntry[] = [];
    for (const d of failed) {
      const row = rows.find((r) => r.__id === d.rowId);
      if (!row) continue;
      const fresh = { ...d, to: (row[email.emailColumn] ?? "").toString().trim(), status: "pending" as const };
      updateDelivery(d.id, fresh);
      targets.push(row);
      entries.push(fresh);
    }
    void deliver(targets, entries);
  }

  const counts = {
    sent: delivery.filter((d) => d.status === "sent").length,
    failed: delivery.filter((d) => d.status === "failed").length,
    pending: delivery.filter((d) => d.status === "pending" || d.status === "sending").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="label-mono">Email delivery (optional)</div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Everything is sent straight from your browser using your own EmailJS account. Your keys are
          never stored or uploaded anywhere.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="label-mono">Service ID</span>
          <input
            className="field-input mt-1 font-mono"
            value={email.serviceId}
            onChange={(e) => setEmail({ serviceId: e.target.value })}
            placeholder="service_xxxxxxx"
          />
        </label>
        <label className="block">
          <span className="label-mono">Template ID</span>
          <input
            className="field-input mt-1 font-mono"
            value={email.templateId}
            onChange={(e) => setEmail({ templateId: e.target.value })}
            placeholder="template_xxxxxxx"
          />
        </label>
        <label className="block">
          <span className="label-mono">Public key</span>
          <input
            className="field-input mt-1 font-mono"
            value={email.publicKey}
            onChange={(e) => setEmail({ publicKey: e.target.value })}
            placeholder="Your public key"
          />
        </label>
        <label className="block">
          <span className="label-mono">Private key (optional)</span>
          <input
            className="field-input mt-1 font-mono"
            type="password"
            value={email.privateKey}
            onChange={(e) => setEmail({ privateKey: e.target.value })}
            placeholder="Only if strict mode is on"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="label-mono">From name</span>
          <input
            className="field-input mt-1"
            value={email.fromName}
            onChange={(e) => setEmail({ fromName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label-mono">Email column</span>
          <input
            className="field-input mt-1 font-mono"
            value={email.emailColumn}
            onChange={(e) => setEmail({ emailColumn: e.target.value })}
          />
        </label>
      </div>

      <label className="block">
        <span className="label-mono">Subject</span>
        <input
          className="field-input mt-1"
          value={email.subject}
          onChange={(e) => setEmail({ subject: e.target.value })}
        />
      </label>

      <div>
        <span className="label-mono">Attachment format</span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(["pdf", "png", "jpeg"] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setEmail({ attachFormat: f })}
              className={`rounded-md border px-3 py-2 text-xs font-medium uppercase transition-colors ${
                email.attachFormat === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-paper hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <div className="flex items-center justify-between">
          <span className="label-mono">Message HTML</span>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {showPreview ? "Edit HTML" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div
            className="mt-1 max-h-64 overflow-auto rounded-md border border-border bg-paper p-2"
            dangerouslySetInnerHTML={{ __html: fillTemplate(email.html, previewRow) }}
          />
        ) : (
          <textarea
            className="field-input mt-1 h-40 font-mono text-[11px]"
            value={email.html}
            onChange={(e) => setEmail({ html: e.target.value })}
          />
        )}
        <span className="mt-1 block text-[11px] text-muted-foreground">
          Use {"{{"}name{"}}"} or any column key to personalise the message.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={sending}
          onClick={() => void send(false)}
          className="rounded-md border border-border bg-paper px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
        >
          Send test to current row
        </button>
        <button
          disabled={sending}
          onClick={() => void send(true)}
          className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Sending…" : `Send all (${rows.length})`}
        </button>
      </div>

      <label className="block">
        <span className="label-mono">Delay between emails — {delay}s</span>
        <input type="range" min={0} max={10} value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="mt-1 w-full accent-[var(--brand)]" />
      </label>

      {sending && (
        <button onClick={() => (stopRef.current = true)} className="w-full rounded-md border border-border px-4 py-2 text-xs font-medium hover:bg-secondary">
          Stop sending
        </button>
      )}

      {delivery.length > 0 && (
        <div className="rounded-md border border-border bg-paper p-2">
          <div className="flex items-center justify-between">
            <span className="label-mono">Delivery tracking</span>
            {counts.failed > 0 && !sending && (
              <button onClick={retryFailed} className="text-[11px] font-medium text-primary hover:underline">
                Retry failed ({counts.failed})
              </button>
            )}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {counts.sent} sent · {counts.failed} failed · {counts.pending} pending
          </div>
          <ul className="mt-2 max-h-60 space-y-1 overflow-auto text-[11px]">
            {delivery.map((d) => (
              <li key={d.id} className="flex items-start justify-between gap-2">
                <span className="min-w-0 truncate font-mono">{d.to || "—"}</span>
                <span className={d.status === "sent" ? "text-accent" : d.status === "failed" ? "text-destructive" : "text-muted-foreground"} title={d.error}>
                  {d.status === "failed" ? `failed${d.error ? ": " + d.error.slice(0, 40) : ""}` : d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
