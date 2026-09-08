import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useStudio, makeRow } from "@/lib/store";
import { sampleCsv } from "@/lib/sample";
import { downloadBlob } from "@/lib/exporters";

export function DataPanel() {
  const fields = useStudio((s) => s.fields);
  const rows = useStudio((s) => s.rows);
  const setRows = useStudio((s) => s.setRows);
  const addRow = useStudio((s) => s.addRow);
  const updateCell = useStudio((s) => s.updateCell);
  const removeRow = useStudio((s) => s.removeRow);
  const email = useStudio((s) => s.email);
  const fileRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const columns = useMemo(() => {
    const keys = fields.map((f) => f.key);
    for (const r of rows) {
      for (const k of Object.keys(r)) {
        if (k !== "__id" && !keys.includes(k)) keys.push(k);
      }
    }
    if (!keys.includes(email.emailColumn)) keys.push(email.emailColumn);
    return keys;
  }, [fields, rows, email.emailColumn]);

  async function importFile(file?: File) {
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const book = XLSX.read(buffer, { type: "array" });
      const sheet = book.Sheets[book.SheetNames[0]];
      if (!sheet) throw new Error("That file has no sheets.");
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      if (!json.length) throw new Error("No rows found in that file.");
      const parsed = json.map((r) => {
        const values: Record<string, string> = {};
        for (const [k, v] of Object.entries(r)) {
          values[String(k).trim()] = v == null ? "" : String(v).trim();
        }
        return makeRow(values);
      });
      setRows(parsed);
      toast.success(`${parsed.length} records imported.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="label-mono">Step 3 — Recipients</div>
        <span className="text-xs text-muted-foreground">{rows.length} record{rows.length === 1 ? "" : "s"}</span>
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
          void importFile(e.dataTransfer.files?.[0]);
        }}
        className={`rounded-lg border-2 border-dashed p-4 text-center text-xs transition-colors ${
          over ? "border-primary bg-brand-soft/10" : "border-border bg-paper"
        }`}
      >
        <p className="text-muted-foreground">
          Drop an Excel or CSV file, with column headings that match your field names.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv,text/csv"
          className="sr-only"
          onChange={(e) => void importFile(e.target.files?.[0])}
        />
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Import spreadsheet
          </button>
          <button
            onClick={() =>
              downloadBlob(
                new Blob([sampleCsv(columns)], { type: "text/csv" }),
                "platepress-sample.csv",
              )
            }
            className="rounded-md border border-border bg-card px-3 py-1.5 font-medium hover:bg-secondary"
          >
            Download example sheet
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border press-scroll">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-secondary">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest">
                  {c}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.__id} className="border-t border-border">
                {columns.map((c) => (
                  <td key={c} className="p-1">
                    <input
                      className="w-40 rounded-sm bg-transparent px-2 py-1 text-sm outline-none focus:bg-paper"
                      value={r[c] ?? ""}
                      aria-label={`${c} value`}
                      onChange={(e) => updateCell(r.__id, c, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-2 text-right">
                  <button
                    aria-label="Remove record"
                    onClick={() => removeRow(r.__id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No recipients yet. Add one by hand, or import a spreadsheet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => addRow(Object.fromEntries(columns.map((c) => [c, ""])))}
          className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary"
        >
          Add recipient
        </button>
        {rows.length > 0 && (
          <button
            onClick={() => setRows([])}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
