import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function sendNotificationEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const client = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL ?? "Helios <notifications@helios.lappom.fr>";

  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[notifications:email] stub send", {
        to: input.to,
        subject: input.subject,
      });
      return { ok: true, id: `dev-stub-${Date.now()}` };
    }
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const { data, error } = await client.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    tags: input.tags,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id ?? `resend-${Date.now()}` };
}

export function contentToHtml(content: string): string {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
  return `<div style="font-family:Inter,sans-serif;line-height:1.55;color:#0a0a0a;">${escaped}</div>`;
}
