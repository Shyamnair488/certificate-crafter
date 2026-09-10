import { useState } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import { fillTemplate, sendCertificateEmail, type SendResult } from "@/lib/email";
import { blobToBase64, extFor, fileNameFor, renderToBlob } from "@/lib/exporters";
import type { ExportFormat } from "@/lib/types";

export function EmailPanel() {
  const email = useStudio((s) => s.email);
  const setEmail = useStudio((s) => s.setEmail);
  const rows = useStudio((s) => s.rows);
  const fields = useStudio((s) => s.fields);
  const template = useStudio((s) => s.template);
  const settings = useStudio((s) => s.exportSettings);
  const previewIndex = useStudio((s) => s.previewIndex);

  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<SendResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const previewRow = rows[previewIndex] ?? rows[0] ?? null;
  const configured = Boolean(email.serviceId && email.templateId && email.publicKey);

  async function send(all: boolean) {
    if (!template) {
      toast.error("Add a certificate template first.");
      return;
    }
    if (!fields.length) {
      toast.error("Place at least one field on the template.");
      return;
    }
    if (!configured) {
      toast.error("Add your service ID, template ID and public key.");
      return;
    }
    const targets = all ? rows : previewRow ? [previewRow] : [];
    if (!targets.length) {
      toast.error("Add at least one recipient row.");
      return;
    }

    setSending(true);
    setLog([]);
    const results: SendResult[] = [];
    try {
      for (let i = 0; i < targets.length; i += 1) {
        const row = targets[i]!;
        const blob = await renderToBlob(template, fields, row, {
          ...settings,
          format: email.attachFormat,
        });
        const base64 = await blobToBase64(blob);
        const name = `${fileNameFor(settings.filenamePattern, row, i)}.${extFor(email.attachFormat)}`;
        const res = await sendCertificateEmail(email, row, base64, name);
        results.push(res);
        setLog([...results]);
      }
      const ok = results.filter((r) => r.ok).length;
      if (ok === results.length) toast.success(`${ok} email${ok === 1 ? "" : "s"} sent.`);
      else toast.error(`${ok} of ${results.length} sent — see the delivery log.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sending failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="label-mono">Step 5 — Email delivery (optional)</div>
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

      {log.length > 0 && (
        <div className="rounded-md border border-border bg-paper p-2">
          <div className="label-mono">Delivery log</div>
          <ul className="mt-1 space-y-1 text-[11px]">
            {log.map((r, i) => (
              <li key={`${r.to}-${i}`} className="flex items-start justify-between gap-2">
                <span className="font-mono">{r.to}</span>
                <span className={r.ok ? "text-accent" : "text-destructive"}>
                  {r.ok ? "sent" : r.error}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
