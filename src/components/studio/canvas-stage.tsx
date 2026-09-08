import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/store";
import { fieldValue } from "@/lib/render";
import type { CertField, RecordRow, TemplateAsset } from "@/lib/types";

interface Props {
  template: TemplateAsset;
  fields: CertField[];
  row: RecordRow | null;
  interactive?: boolean;
}

function anchorTransform(align: CertField["align"]) {
  if (align === "left") return "translate(0, -50%)";
  if (align === "right") return "translate(-100%, -50%)";
  return "translate(-50%, -50%)";
}

export function CanvasStage({ template, fields, row, interactive = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const selectedId = useStudio((s) => s.selectedId);
  const select = useStudio((s) => s.select);
  const updateField = useStudio((s) => s.updateField);
  const dragRef = useRef<{ id: string } | null>(null);

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
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      updateField(drag.id, { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
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
  }, [interactive, updateField]);

  const scale = width ? width / template.width : 0;

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-lg border border-border bg-card shadow-sm"
      style={{ aspectRatio: `${template.width} / ${template.height}` }}
      onPointerDown={() => interactive && select(null)}
    >
      <img
        src={template.src}
        alt={`Preview of ${template.name}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        draggable={false}
      />
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
                dragRef.current = { id: field.id };
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
              onKeyDown={(e) => {
                if (!interactive) return;
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
                updateField(field.id, {
                  x: Math.min(1, Math.max(0, field.x + delta[0])),
                  y: Math.min(1, Math.max(0, field.y + delta[1])),
                });
              }}
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
