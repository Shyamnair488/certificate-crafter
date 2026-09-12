import type { CertField, RecordRow } from "./types";

export type IssueLevel = "error" | "warning";

export interface DataIssue {
  id: string;
  level: IssueLevel;
  title: string;
  detail: string;
  rowIds: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function validateRows(
  rows: RecordRow[],
  fields: CertField[],
  emailColumn: string,
): DataIssue[] {
  const issues: DataIssue[] = [];
  if (!rows.length) return issues;

  // Missing values for placed fields
  for (const field of fields) {
    const missing = rows.filter((r) => !(r[field.key] ?? "").toString().trim());
    if (missing.length) {
      issues.push({
        id: `missing-${field.key}`,
        level: "error",
        title: `${missing.length} row${missing.length === 1 ? "" : "s"} missing “${field.key}”`,
        detail: `The field “${field.label}” is placed on the certificate but has no value in these rows.`,
        rowIds: missing.map((r) => r.__id),
      });
    }
  }

  // Duplicate whole rows (by the field keys used on the certificate)
  const keys = fields.map((f) => f.key);
  if (keys.length) {
    const seen = new Map<string, string[]>();
    for (const r of rows) {
      const sig = keys.map((k) => (r[k] ?? "").toString().trim().toLowerCase()).join("|");
      if (!sig.replace(/\|/g, "")) continue;
      seen.set(sig, [...(seen.get(sig) ?? []), r.__id]);
    }
    const dupes = [...seen.values()].filter((ids) => ids.length > 1).flat();
    if (dupes.length) {
      issues.push({
        id: "duplicate-rows",
        level: "warning",
        title: `${dupes.length} duplicate recipient rows`,
        detail: "These rows repeat the same certificate values and will produce identical files.",
        rowIds: dupes,
      });
    }
  }

  // Email column checks
  const hasEmailColumn = rows.some((r) => emailColumn in r);
  if (hasEmailColumn) {
    const invalid = rows.filter((r) => {
      const v = (r[emailColumn] ?? "").toString().trim();
      return v.length > 0 && !EMAIL_RE.test(v);
    });
    if (invalid.length) {
      issues.push({
        id: "invalid-email",
        level: "error",
        title: `${invalid.length} invalid email address${invalid.length === 1 ? "" : "es"}`,
        detail: `Values in “${emailColumn}” that do not look like an email address.`,
        rowIds: invalid.map((r) => r.__id),
      });
    }

    const blank = rows.filter((r) => !(r[emailColumn] ?? "").toString().trim());
    if (blank.length) {
      issues.push({
        id: "blank-email",
        level: "warning",
        title: `${blank.length} row${blank.length === 1 ? "" : "s"} without an email address`,
        detail: "These recipients can be exported but cannot be emailed.",
        rowIds: blank.map((r) => r.__id),
      });
    }

    const byEmail = new Map<string, string[]>();
    for (const r of rows) {
      const v = (r[emailColumn] ?? "").toString().trim().toLowerCase();
      if (!v) continue;
      byEmail.set(v, [...(byEmail.get(v) ?? []), r.__id]);
    }
    const dupEmails = [...byEmail.entries()].filter(([, ids]) => ids.length > 1);
    if (dupEmails.length) {
      issues.push({
        id: "duplicate-email",
        level: "warning",
        title: `${dupEmails.length} email address${dupEmails.length === 1 ? "" : "es"} used more than once`,
        detail: dupEmails
          .slice(0, 5)
          .map(([e, ids]) => `${e} (${ids.length}×)`)
          .join(", "),
        rowIds: dupEmails.flatMap(([, ids]) => ids),
      });
    }
  } else if (emailColumn) {
    issues.push({
      id: "no-email-column",
      level: "warning",
      title: `No “${emailColumn}” column found`,
      detail: "Add the column to your sheet if you plan to email certificates.",
      rowIds: [],
    });
  }

  return issues;
}

/* ---------- Long-name / layout testing ---------- */

export const NAME_SAMPLES: { id: string; label: string; value: string }[] = [
  { id: "short", label: "Short", value: "Li Wu" },
  { id: "medium", label: "Medium", value: "Alexandra Fernandez" },
  {
    id: "long",
    label: "Very long",
    value: "Dr. Maria Anneliese Konstantinopoulos-Wijeratne III",
  },
];

export interface LayoutFinding {
  id: string;
  level: IssueLevel;
  field: string;
  sample: string;
  message: string;
}

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function boxFor(field: CertField, lines: number): Box {
  const halfW = field.boxWidth / 2;
  const left =
    field.align === "left" ? field.x : field.align === "right" ? field.x - field.boxWidth : field.x - halfW;
  const heightFraction = 0.0; // filled by caller
  return { left, right: left + field.boxWidth, top: field.y - heightFraction, bottom: field.y + lines };
}

/**
 * Measure each field against short / medium / very long sample values and report
 * shrinking, overflow and overlap problems before a batch is generated.
 */
export function testLayout(
  fields: CertField[],
  templateWidth: number,
  templateHeight: number,
): LayoutFinding[] {
  const findings: LayoutFinding[] = [];
  if (typeof document === "undefined" || !fields.length) return findings;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return findings;

  const boxes: { field: CertField; box: Box }[] = [];

  for (const field of fields) {
    const boxW = field.boxWidth * templateWidth;
    let worstLines = 1;

    for (const sample of NAME_SAMPLES) {
      const text = field.uppercase ? sample.value.toUpperCase() : sample.value;
      ctx.font = `${field.italic ? "italic " : ""}${field.fontWeight} ${field.fontSize}px "${field.fontFamily}", serif`;
      const width = ctx.measureText(text).width;

      if (field.autoShrink) {
        const ratio = width > boxW ? boxW / width : 1;
        if (ratio < 0.55) {
          findings.push({
            id: `${field.id}-${sample.id}-shrink`,
            level: "error",
            field: field.label,
            sample: sample.label,
            message: `Text shrinks to ${Math.round(ratio * 100)}% of its size — widen the text box or lower the font size.`,
          });
        } else if (ratio < 0.8) {
          findings.push({
            id: `${field.id}-${sample.id}-shrink`,
            level: "warning",
            field: field.label,
            sample: sample.label,
            message: `Text shrinks to ${Math.round(ratio * 100)}% — still readable, but noticeably smaller than your design.`,
          });
        }
      } else {
        const lines = Math.max(1, Math.ceil(width / boxW));
        worstLines = Math.max(worstLines, lines);
        if (lines > 2) {
          findings.push({
            id: `${field.id}-${sample.id}-wrap`,
            level: "error",
            field: field.label,
            sample: sample.label,
            message: `Wraps onto ${lines} lines and may overflow the certificate. Turn on auto-shrink or widen the box.`,
          });
        } else if (lines === 2) {
          findings.push({
            id: `${field.id}-${sample.id}-wrap`,
            level: "warning",
            field: field.label,
            sample: sample.label,
            message: "Wraps onto 2 lines with a long name.",
          });
        }
      }
    }

    // Vertical extent as a fraction of template height
    const lineH = (field.fontSize * field.lineHeight) / templateHeight;
    const half = (lineH * worstLines) / 2;
    const b = boxFor(field, 0);
    boxes.push({ field, box: { ...b, top: field.y - half, bottom: field.y + half } });

    if (field.y - half < 0 || field.y + half > 1 || b.left < 0 || b.right > 1) {
      findings.push({
        id: `${field.id}-bleed`,
        level: "error",
        field: field.label,
        sample: "Any",
        message: "This field sits partly outside the certificate edges.",
      });
    }
  }

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i]!;
      const b = boxes[j]!;
      const overlapX = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
      const overlapY = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
      if (overlapX > 0.01 && overlapY > 0.005) {
        findings.push({
          id: `${a.field.id}-${b.field.id}-overlap`,
          level: "warning",
          field: `${a.field.label} + ${b.field.label}`,
          sample: "Long names",
          message: "These two fields overlap — move one of them on the proof.",
        });
      }
    }
  }

  return findings;
}
