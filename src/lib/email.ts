import type { EmailSettings, RecordRow } from "./types";

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export function fillTemplate(text: string, row: RecordRow | null) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key: string) =>
    (row?.[key] ?? "").toString(),
  );
}

export interface SendResult {
  to: string;
  ok: boolean;
  error?: string;
}

export async function sendCertificateEmail(
  settings: EmailSettings,
  row: RecordRow,
  attachmentBase64: string,
  attachmentName: string,
): Promise<SendResult> {
  const to = (row[settings.emailColumn] ?? "").toString().trim();
  if (!to) return { to: "—", ok: false, error: "No email address on this row." };

  const payload = {
    service_id: settings.serviceId,
    template_id: settings.templateId,
    user_id: settings.publicKey,
    ...(settings.privateKey ? { accessToken: settings.privateKey } : {}),
    template_params: {
      ...row,
      to_email: to,
      email: to,
      from_name: settings.fromName,
      subject: fillTemplate(settings.subject, row),
      message_html: fillTemplate(settings.html, row),
      certificate_name: attachmentName,
      certificate_base64: attachmentBase64,
    },
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { to, ok: false, error: text || `Request failed (${res.status})` };
    }
    return { to, ok: true };
  } catch (err) {
    return { to, ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
