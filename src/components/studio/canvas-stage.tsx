import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/store";
import { fieldValue, elementText } from "@/lib/render";
import { qrDataUrl } from "@/lib/qr";
import type { CertElement, CertField, RecordRow, TemplateAsset } from "@/lib/types";

interface Props {
  template: TemplateAsset;
  fields: CertField[];
  elements?: CertElement[];
  row: RecordRow | null;
  interactive?: boolean;
}

function anchorTransform(align: CertField["align"]) {
  if (align === "left") return "translate(0, -50%)";
  if (align === "right") return "translate(-100%, -50%)";
  return "translate(-50%, -50%)";
}

/** Resolve preview sources for image/signature/QR elements. */
function useElementSources(elements: CertElement[], row: RecordRow | null) {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    (async () => {
      const next: Record<string, string> = {};
      for (const el of elements) {
        if (el.kind === "qr") {
          try {
            next[el.id] = await qrDataUrl(elementText(el.qrText, row));
          } catch {
            next[el.id] = "";
          }
        } else {
          next[el.id] = el.src;
        }
      }
      if (alive) setMap(next);
    })();
    return () => {
      alive = false;
    };
  }, [elements, row]);
  return map;
}

export function CanvasStage({ template, fields, elements = [], row, interactive = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const selectedId = useStudio((s) => s.selectedId);
  const selectedElementId = useStudio((s) => s.selectedElementId);
  const select = useStudio((s) => s.select);
  const selectElement = useStudio((s) => s.selectElement);
  const updateField = useStudio((s) => s.updateField);
  const updateElement = useStudio((s) => s.updateElement);
  const dragRef = useRef<{ id: string; kind: "field" | "element" } | null>(null);
  const sources = useElementSources(elements, row);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!interactive) return;
    function move(e: PointerEvent) {
      const drag = dragRef.current;
      const el = wrapRef.current;
      if (!drag || !el) return;
      const rect = el.getBoundingClientRect();
      const x = Number(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)).toFixed(4));
      const y = Number(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)).toFixed(4));
      if (drag.kind === "field") updateField(drag.id, { x, y });
      else updateElement(drag.id, { x, y });
    }
    function up() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [interactive, updateField, updateElement]);

  const scale = width ? width / template.width : 0;

  function nudge(e: React.KeyboardEvent, apply: (dx: number, dy: number) => void) {
    const step = e.shiftKey ? 0.02 : 0.004;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = map[e.key];
    if (!delta) return;
    e.preventDefault();
    apply(delta[0], delta[1]);
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-lg border border-border bg-card shadow-sm"
      style={{ aspectRatio: `${template.width} / ${template.height}` }}
      onPointerDown={() => {
        if (!interactive) return;
        select(null);
        selectElement(null);
      }}
    >
      <img
        src={template.src}
        alt={`Preview of ${template.name}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        draggable={false}
      />

      {/* Logos, signatures and QR codes */}
      {scale > 0 &&
        elements.map((el) => {
          const src = sources[el.id];
          const active = interactive && el.id === selectedElementId;
          return (
            <div
              key={el.id}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? `Move ${el.label}` : undefined}
              onPointerDown={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                selectElement(el.id);
                dragRef.current = { id: el.id, kind: "element" };
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
              onKeyDown={(e) =>
                interactive &&
                nudge(e, (dx, dy) =>
                  updateElement(el.id, {
                    x: Math.min(1, Math.max(0, el.x + dx)),
                    y: Math.min(1, Math.max(0, el.y + dy)),
                  }),
                )
              }
              className={`absolute ${interactive ? "cursor-move" : ""} ${
                active ? "outline outline-2 outline-primary" : "outline outline-1 outline-transparent"
              } ${interactive ? "hover:outline-primary/50" : ""}`}
              style={{
                left: `${el.x * 100}%`,
                top: `${el.y * 100}%`,
                width: `${el.width * 100}%`,
                transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                opacity: el.opacity,
                touchAction: "none",
              }}
            >
              {src ? (
                <img src={src} alt={el.label} className="pointer-events-none w-full" draggable={false} />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded border border-dashed border-primary/50 text-[9px] text-muted-foreground">
                  {el.label}
                </div>
              )}
            </div>
          );
        })}

      {/* Text fields */}
      {scale > 0 &&
        fields.map((field) => {
          const active = interactive && field.id === selectedId;
          return (
            <div
              key={field.id}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? `Move ${field.label}` : undefined}
              onPointerDown={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                select(field.id);
                dragRef.current = { id: field.id, kind: "field" };
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
              onKeyDown={(e) =>
                interactive &&
                nudge(e, (dx, dy) =>
                  updateField(field.id, {
                    x: Math.min(1, Math.max(0, field.x + dx)),
                    y: Math.min(1, Math.max(0, field.y + dy)),
                  }),
                )
              }
              className={`absolute ${interactive ? "cursor-move" : ""} ${
                active ? "outline outline-2 outline-primary" : "outline outline-1 outline-transparent"
              } ${interactive ? "hover:outline-primary/50" : ""}`}
              style={{
                left: `${field.x * 100}%`,
                top: `${field.y * 100}%`,
                transform: anchorTransform(field.align),
                width: `${field.boxWidth * 100}%`,
                textAlign: field.align,
                opacity: field.opacity,
                color: field.color,
                fontFamily: `"${field.fontFamily}", serif`,
                fontWeight: field.fontWeight,
                fontStyle: field.italic ? "italic" : "normal",
                fontSize: field.fontSize * scale,
                lineHeight: field.lineHeight,
                letterSpacing: field.letterSpacing * scale,
                textTransform: field.uppercase ? "uppercase" : "none",
                whiteSpace: field.autoShrink ? "nowrap" : "normal",
                touchAction: "none",
              }}
            >
              <span
                style={
                  field.autoShrink
                    ? { display: "inline-block", maxWidth: "100%", transformOrigin: field.align }
                    : undefined
                }
              >
                {fieldValue(field, row)}
              </span>
            </div>
          );
        })}
    </div>
  );
}
