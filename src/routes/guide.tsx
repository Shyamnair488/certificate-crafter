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
    title: "Add logos, signatures and QR codes",
    body: "Upload your logo and authorized signatures, or add a QR code with recipient placeholders. Place each item on the proof. Saved signatures stay on this device; the same placed signature appears throughout a batch.",
  },
  {
    n: "04",
    title: "Bring in recipients",
    body: "Type rows one by one, or import a CSV or Excel sheet. Column headers should match your field keys — download the sample sheet from the Recipients panel to see the exact shape.",
  },
  {
    n: "05",
    title: "Check the roster and long names",
    body: "Preflight identifies missing field values, duplicate recipients and invalid emails. Test short, medium and very long names before export. Fill missing certificate values before generating.",
  },
  {
    n: "06",
    title: "Export the run",
    body: "PDF, PNG or JPEG at up to 4× print scale. One recipient gives you a single file; many gives you a ZIP, or one merged multi-page PDF. File names follow your own pattern, e.g. {name}-certificate.",
  },
  {
    n: "07",
    title: "Email them out (optional)",
    body: "Connect your own EmailJS service and attachment-enabled template. EmailJS receives the message, attachment, recipients and account keys. Sent means accepted by EmailJS, not confirmed delivered. Stop after the current email, then retry failures or resume stopped recipients.",
  },
  {
    n: "08",
    title: "Review batch history",
    body: "Review generated, sent and failed counts in Dashboard. Verified is a manual review flag, not an authenticity check. History and signatures remain on this device; recipient delivery details remain in the current session.",
  },
];

const FAQ = [
  {
    q: "Do I need an account?",
    a: "No. Platepress is free and needs no sign-up, no payment and no login.",
  },
  {
    q: "Where does my data go?",
    a: "Templates, spreadsheets and certificate rendering stay in your browser. Signatures and batch summaries are saved on this device. Emailing sends recipient data, attachments and your account keys to EmailJS. Google Fonts requests go to Google. Saved projects exclude email keys; uploaded fonts must be uploaded again after reopening.",
  },
  {
    q: "How many certificates can I run?",
    a: "Capacity depends on your device, template resolution and export format. Start with a small batch. Live progress shows completed and failed counts; cancellation prevents the final download but cannot interrupt a render already underway.",
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
