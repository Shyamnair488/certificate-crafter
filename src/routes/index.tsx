import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import mark from "@/assets/platepress-mark.png";
import { useStudio } from "@/lib/store";
import { useRun } from "@/lib/run-store";
import { CanvasStage } from "@/components/studio/canvas-stage";
import { TemplatePanel } from "@/components/studio/template-panel";
import { FieldsPanel } from "@/components/studio/fields-panel";
import { DataPanel } from "@/components/studio/data-panel";
import { ExportPanel } from "@/components/studio/export-panel";
import { EmailPanel } from "@/components/studio/email-panel";
import { ProgressOverlay } from "@/components/studio/progress-overlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Platepress — Bulk Certificate Studio" },
      {
        name: "description",
        content:
          "Upload a certificate template, place fields, import a roster and export hundreds of personalised PDFs, PNGs or JPEGs. Free, no sign-up, fully in your browser.",
      },
      { property: "og:title", content: "Platepress — Bulk Certificate Studio" },
      {
        property: "og:description",
        content:
          "Design, personalise and export event certificates in bulk — then email them straight from your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const TABS = [
  { id: "template", label: "Template" },
  { id: "fields", label: "Fields" },
  { id: "data", label: "Recipients" },
  { id: "export", label: "Export" },
  { id: "email", label: "Email" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Studio() {
  const [tab, setTab] = useState<TabId>("template");
  const template = useStudio((s) => s.template);
  const fields = useStudio((s) => s.fields);
  const rows = useStudio((s) => s.rows);
  const previewIndex = useStudio((s) => s.previewIndex);
  const setPreviewIndex = useStudio((s) => s.setPreviewIndex);
  const run = useRun();

  const total = Math.max(1, rows.length);
  const row = rows[previewIndex] ?? null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <img src={mark} alt="Platepress" className="h-8 w-8 rounded-[4px]" />
          <div className="min-w-0">
            <h1 className="truncate font-serif text-lg font-semibold leading-none text-foreground">
              Platepress
            </h1>
            <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
              Bulk certificate studio — free, no sign-up, nothing leaves your device
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground md:inline">
              {fields.length} field{fields.length === 1 ? "" : "s"} · {rows.length} recipient
              {rows.length === 1 ? "" : "s"}
            </span>
            <Link
              to="/guide"
              className="rounded-md border border-border bg-paper px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary"
            >
              Guide
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="order-2 lg:order-1">
          {template ? (
            <div className="space-y-3">
              <CanvasStage template={template} fields={fields} row={row} />
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className="label-mono">Proof</span>
                <button
                  onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                  disabled={previewIndex <= 0}
                  className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-muted-foreground">
                  {rows.length ? `${previewIndex + 1} of ${rows.length}` : "Sample values"}
                </span>
                <button
                  onClick={() => setPreviewIndex(Math.min(rows.length - 1, previewIndex + 1))}
                  disabled={previewIndex >= rows.length - 1}
                  className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40"
                >
                  Next
                </button>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  Drag a field on the proof to reposition it — arrow keys nudge.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <div className="max-w-sm animate-rise">
                <div className="label-mono">No plate mounted</div>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">
                  Upload a certificate template to begin
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use your own artwork (PNG, JPEG or SVG) or load the sample certificate from the
                  Template panel to explore every feature.
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="order-1 lg:order-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex flex-wrap gap-1 border-b border-border p-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="max-h-[calc(100vh-9rem)] overflow-auto p-4 lg:sticky lg:top-20">
              {tab === "template" && <TemplatePanel />}
              {tab === "fields" && <FieldsPanel />}
              {tab === "data" && <DataPanel />}
              {tab === "export" && <ExportPanel />}
              {tab === "email" && <EmailPanel />}
            </div>
          </div>
        </aside>
      </main>

      <ProgressOverlay
        open={run.running}
        label={run.label}
        done={run.done}
        total={run.total || total}
        onCancel={run.cancel}
      />
    </div>
  );
}
