import { test, expect } from "bun:test";
import { parseProject } from "./project";
import { useStudio, makeField } from "./store";
import { validateRows } from "./validation";
import { measureField } from "./text-layout";

test("invalid project versions and malformed rows are rejected", () => {
  const project = { app: "platepress", v: 1, template: null, fields: [], elements: [], rows: [], exportSettings: useStudio.getState().exportSettings };
  expect(parseProject(project).v).toBe(1);
  expect(() => parseProject({ ...project, v: 2 })).toThrow();
  expect(() => parseProject({ ...project, rows: [{ __id: "one", name: 5 }] })).toThrow();
});

test("missing placed field values and invalid email addresses identify the affected rows", () => {
  const issues = validateRows([{ __id: "one", name: "", email: "bad" }], [makeField({ key: "name" })], "email");
  expect(issues.find((i) => i.id === "missing-name")?.rowIds).toEqual(["one"]);
  expect(issues.find((i) => i.id === "invalid-email")?.rowIds).toEqual(["one"]);
});

test("batch delivery transitions do not double count sends and retries clear failures", () => {
  const store = useStudio.getState();
  store.addBatch({ id: "test", createdAt: 0, name: "test", format: "pdf", mode: "zip", total: 1, generated: 0, failed: 0, cancelled: false, sent: 0, sendFailed: 0, verified: 0 });
  store.setDelivery([{ id: "entry", batchId: "test", rowId: "row", to: "test@example.com", name: "Test", status: "pending", at: 0 }]);
  store.updateDelivery("entry", { status: "failed" });
  expect(useStudio.getState().batches.find((b) => b.id === "test")?.sendFailed).toBe(1);
  store.updateDelivery("entry", { status: "pending" });
  store.updateDelivery("entry", { status: "sent" });
  store.updateDelivery("entry", { status: "sent" });
  expect(useStudio.getState().batches.find((b) => b.id === "test")?.sent).toBe(1);
  expect(useStudio.getState().batches.find((b) => b.id === "test")?.sendFailed).toBe(0);
});

test("unbroken long names are reported as overflow and shrinking respects print scale", () => {
  const ctx = { font: "", letterSpacing: "0px", measureText(text: string) { return { width: text.length * Number.parseFloat(this.font.split(" ")[1] ?? "10") }; } } as unknown as CanvasRenderingContext2D;
  const field = makeField({ fontSize: 20, boxWidth: 0.1, autoShrink: false });
  expect(measureField(ctx, field, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 100).overflow).toBe(true);
  const shrunk = measureField(ctx, { ...field, autoShrink: true }, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 100, 4);
  expect(shrunk.size).toBe(24);
  expect(shrunk.overflow).toBe(true);
});