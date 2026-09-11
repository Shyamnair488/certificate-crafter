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

const STEPS = [
  { id: "template", n: "01", label: "Template", hint: "Mount your artwork" },
  { id: "fields", n: "02", label: "Fields", hint: "Place and style text" },
  { id: "data", n: "03", label: "Recipients", hint: "Type or import a roster" },
  { id: "export", n: "04", label: "Export", hint: "PDF, PNG, JPEG or ZIP" },
  { id: "email", n: "05", label: "Email", hint: "Send with attachments" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function Studio() {
  const [step, setStep] = useState<StepId>("template");
  const [navOpen, setNavOpen] = useState(false);
  const template = useStudio((s) => s.template);
  const fields = useStudio((s) => s.fields);
  const rows = useStudio((s) => s.rows);
  const previewIndex = useStudio((s) => s.previewIndex);
  const setPreviewIndex = useStudio((s) => s.setPreviewIndex);
  const run = useRun();

  const row = rows[previewIndex] ?? null;
  const active = STEPS.find((s) => s.id === step)!;

  const nav = (
    <nav className="flex flex-col gap-1">
      {STEPS.map((s) => {
        const on = s.id === step;
        return (
          <button
            key={s.id}
            onClick={() => {
              setStep(s.id);
              setNavOpen(false);
            }}
            className={`flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
              on
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-transparent text-foreground hover:bg-secondary"
            }`}
          >
            <span
              className={`mt-0.5 font-mono text-[10px] tracking-widest ${
                on ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {s.n}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-tight">{s.label}</span>
              <span
                className={`block text-[11px] leading-tight ${
                  on ? "text-primary-foreground/75" : "text-muted-foreground"
                }`}
              >
                {s.hint}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[288px] flex-col border-r border-border bg-card transition-transform lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <img src={mark} alt="Platepress" className="h-9 w-9 rounded-[4px]" />
          <div className="min-w-0">
            <span className="block font-serif text-base font-bold leading-none text-foreground">
              Platepress
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              Certificate production suite
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto press-scroll p-3">{nav}</div>

        <div className="border-t border-border p-3">
          <div className="rounded-md bg-secondary p-3">
            <div className="label-mono">Session</div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {fields.length} field{fields.length === 1 ? "" : "s"} · {rows.length} recipient
              {rows.length === 1 ? "" : "s"}. Nothing is uploaded — every file is processed on this
              device.
            </p>
          </div>
          <Link
            to="/guide"
            className="mt-2 block rounded-md border border-border px-3 py-2 text-center text-xs font-medium transition-colors hover:bg-secondary"
          >
            Read the guide
          </Link>
        </div>
      </aside>

      {navOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="lg:pl-[288px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:px-6">
          <button
            onClick={() => setNavOpen(true)}
            className="rounded-md border border-border px-3 py-2 text-xs font-medium lg:hidden"
          >
            Steps
          </button>
          <div className="min-w-0">
            <div className="label-mono">Step {active.n}</div>
            <h1 className="truncate font-serif text-lg font-bold leading-tight text-foreground">
              {active.label}
            </h1>
          </div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
              Free · No sign-up · Private by design
            </span>
          </div>
        </header>

        <main className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:p-6">
          <section className="order-2 lg:order-1">
            {template ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-3 panel-shadow lg:p-4">
                  <CanvasStage template={template} fields={fields} row={row} />
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 panel-shadow">
                  <span className="label-mono">Proof</span>
                  <button
                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                    disabled={previewIndex <= 0}
                    className="rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {rows.length ? `${previewIndex + 1} of ${rows.length}` : "Sample values"}
                  </span>
                  <button
                    onClick={() => setPreviewIndex(Math.min(rows.length - 1, previewIndex + 1))}
                    disabled={previewIndex >= rows.length - 1}
                    className="rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    Next
                  </button>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    Drag a field on the proof to reposition it — arrow keys nudge.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[52vh] items-center justify-center rounded-lg border border-dashed border-border bg-card p-10 text-center panel-shadow">
                <div className="max-w-sm animate-rise">
                  <div className="label-mono">No template loaded</div>
                  <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-foreground">
                    Upload your certificate artwork to begin
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Bring your own PNG, JPEG or SVG design, or load the sample certificate from the
                    Template panel to explore every feature first.
                  </p>
                </div>
              </div>
            )}
          </section>

          <aside className="order-1 lg:order-2">
            <div className="rounded-lg border border-border bg-card p-4 panel-shadow lg:sticky lg:top-[5.5rem] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto press-scroll">
              {step === "template" && <TemplatePanel />}
              {step === "fields" && <FieldsPanel />}
              {step === "data" && <DataPanel />}
              {step === "export" && <ExportPanel />}
              {step === "email" && <EmailPanel />}
            </div>
          </aside>
        </main>
      </div>

      <ProgressOverlay
        open={run.running}
        label={run.label}
        done={run.done}
        total={run.total || Math.max(1, rows.length)}
        onCancel={run.cancel}
      />
    </div>
  );
}
