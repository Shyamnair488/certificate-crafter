import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "How Platepress works — Guide" },
      {
        name: "description",
        content:
          "A step-by-step guide to building, personalising, exporting and emailing event certificates in bulk with Platepress.",
      },
      { property: "og:title", content: "How Platepress works — Guide" },
      {
        property: "og:description",
        content:
          "Template, fields, recipients, export and email — everything you need to run a certificate batch in minutes.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guide,
});

const STEPS = [
  {
    n: "01",
    title: "Mount your template",
    body: "Drop in a PNG, JPEG or SVG of your certificate artwork — or load the built-in sample to explore first. The proof updates instantly and keeps your artwork's exact proportions.",
  },
  {
    n: "02",
    title: "Place your fields",
    body: "Add a field for each thing that changes: name, award line, date, reference number. Drag it on the proof to position it, or nudge it with the arrow keys. Every field has its own font, size, weight, colour, spacing, alignment and opacity.",
  },
  {
    n: "03",
    title: "Choose your type",
    body: "Pick from the built-in print-quality serif, sans and script families, pull in any Google Font by name, or upload your own TTF/OTF/WOFF file. Auto-shrink keeps long names inside the box.",
  },
  {
    n: "04",
    title: "Bring in recipients",
    body: "Type rows one by one, or import a CSV or Excel sheet. Column headers should match your field keys — download the sample sheet from the Recipients panel to see the exact shape.",
  },
  {
    n: "05",
    title: "Export the run",
    body: "PDF, PNG or JPEG at up to 4× print scale. One recipient gives you a single file; many gives you a ZIP, or one merged multi-page PDF. File names follow your own pattern, e.g. {name}-certificate.",
  },
  {
    n: "06",
    title: "Email them out (optional)",
    body: "Connect your own EmailJS service and send personalised HTML emails with the certificate attached. Your keys stay in the browser tab and are never stored.",
  },
];

const FAQ = [
  {
    q: "Do I need an account?",
    a: "No. Platepress is free and needs no sign-up, no payment and no login.",
  },
  {
    q: "Where does my data go?",
    a: "Nowhere. Templates, spreadsheets and rendering all happen inside your browser. There is no server and no database.",
  },
  {
    q: "How many certificates can I run?",
    a: "Hundreds. The run shows live progress and can be cancelled at any point.",
  },
  {
    q: "What should my spreadsheet look like?",
    a: "One row per recipient, with a header row whose column names match your field keys — for example name, award, date, email.",
  },
];

function Guide() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="label-mono">Platepress guide</span>
          <Link
            to="/"
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the studio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Run a whole certificate batch in minutes
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Platepress is a print-shop workflow in a browser tab: mount a plate, set your type, feed
          the roster, pull the run. Here is the whole process.
        </p>

        <ol className="mt-10 space-y-6">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-lg border border-border bg-card p-5 animate-rise">
              <div className="label-mono">{s.n}</div>
              <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-serif text-2xl font-semibold text-foreground">Sample sheet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your import can look as simple as this:
        </p>
        <pre className="mt-3 overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-[12px] leading-relaxed text-foreground">
{`name,award,date,email
Amara Okonkwo,for exceptional craftsmanship,14 October 2026,amara@example.com
Elias Vance,for outstanding stage production,14 October 2026,elias@example.com`}
        </pre>

        <h2 className="mt-14 font-serif text-2xl font-semibold text-foreground">Common questions</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-lg border border-border bg-card p-5">
              <dt className="font-medium text-foreground">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 rounded-lg border border-border bg-card p-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground">Ready to press?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Load the sample template and you can run your first batch straight away.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the studio
          </Link>
        </div>
      </main>
    </div>
  );
}
