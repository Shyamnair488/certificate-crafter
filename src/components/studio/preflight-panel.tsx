import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useStudio } from "@/lib/store";
import { NAME_SAMPLES, testLayout, validateRows } from "@/lib/validation";
import { CanvasStage } from "./canvas-stage";
import { makeRow } from "@/lib/store";

export function PreflightPanel() {
  const rows = useStudio((s) => s.rows);
  const fields = useStudio((s) => s.fields);
  const elements = useStudio((s) => s.elements);
  const template = useStudio((s) => s.template);
  const emailColumn = useStudio((s) => s.email.emailColumn);
  const removeRows = useStudio((s) => s.removeRows);
  const dedupeRows = useStudio((s) => s.dedupeRows);
  const [sample, setSample] = useState(NAME_SAMPLES[2]!.id);

  const issues = useMemo(
    () => validateRows(rows, fields, emailColumn),
    [rows, fields, emailColumn],
  );
  const findings = useMemo(
    () => (template ? testLayout(fields, template.width, template.height) : []),
    [fields, template],
  );

  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  const layoutErrors = findings.filter((f) => f.level === "error").length;

  const activeSample = NAME_SAMPLES.find((s) => s.id === sample) ?? NAME_SAMPLES[0]!;
  const testRow = useMemo(() => {
    const values: Record<string, string> = {};
    for (const f of fields) values[f.key] = activeSample.value;
    return makeRow(values);
  }, [fields, activeSample]);

  return (
    <div className="space-y-4">
      <div>
        <div className="label-mono">Step 5 — Preflight checks</div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Catch missing values, duplicates, bad email addresses and long names that break the layout
          before you generate a batch.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Data errors", errors, errors ? "text-destructive" : "text-foreground"],
          ["Warnings", warnings, warnings ? "text-foreground" : "text-muted-foreground"],
          ["Layout risks", layoutErrors, layoutErrors ? "text-destructive" : "text-foreground"],
        ].map(([label, value, tone]) => (
          <div key={String(label)} className="rounded-md border border-border bg-paper py-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className={`mt-0.5 text-xl font-semibold ${tone}`}>{value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="label-mono">Data validation</span>
          <button
            onClick={() => {
              const removed = dedupeRows();
              toast[removed ? "success" : "message"](
                removed ? `${removed} duplicate rows removed.` : "No duplicate rows found.",
              );
            }}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            Remove duplicates
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className={`rounded-md border p-2 ${
                issue.level === "error" ? "border-destructive/40 bg-destructive/5" : "border-border bg-paper"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium">{issue.title}</span>
                {issue.rowIds.length > 0 && (
                  <button
                    onClick={() => {
                      removeRows(issue.rowIds);
                      toast.success(`${issue.rowIds.length} rows removed.`);
                    }}
                    className="shrink-0 text-[11px] text-muted-foreground hover:text-destructive"
                  >
                    Drop rows
                  </button>
                )}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{issue.detail}</p>
            </li>
          ))}
          {!issues.length && (
            <li className="rounded-md border border-border bg-paper p-3 text-center text-[11px] text-muted-foreground">
              {rows.length ? "All recipient data looks clean." : "Import or add recipients to run checks."}
            </li>
          )}
        </ul>
      </div>

      <div>
        <span className="label-mono">Long-name test</span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {NAME_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSample(s.id)}
              className={`rounded-md border px-2 py-2 text-[11px] font-medium transition-colors ${
                sample === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-paper hover:bg-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">Testing with “{activeSample.value}”.</p>

        {template && (
          <div className="mt-2 rounded-md border border-border p-2">
            <CanvasStage
              template={template}
              fields={fields}
              elements={elements}
              row={testRow}
              interactive={false}
            />
          </div>
        )}

        <ul className="mt-2 space-y-2">
          {findings.map((f) => (
            <li
              key={f.id}
              className={`rounded-md border p-2 ${
                f.level === "error" ? "border-destructive/40 bg-destructive/5" : "border-border bg-paper"
              }`}
            >
              <div className="text-xs font-medium">
                {f.field} · {f.sample}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{f.message}</p>
            </li>
          ))}
          {!findings.length && (
            <li className="rounded-md border border-border bg-paper p-3 text-center text-[11px] text-muted-foreground">
              {fields.length
                ? "No overflow or overlap detected, even with very long names."
                : "Place a text field to run layout tests."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
