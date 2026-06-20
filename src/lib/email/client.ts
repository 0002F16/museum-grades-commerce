import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Museum Grades <hello@museumgrades.com>";

// Instantiate lazily so a missing key never crashes the module at import time.
const resend = apiKey ? new Resend(apiKey) : null;

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendEmailResult = { ok: boolean; id?: string };

/**
 * Fail-safe transactional email send. Never throws — a delivery problem must
 * never break the user-facing flow (signup, checkout, password reset). When
 * RESEND_API_KEY is unset the email is logged instead of sent, so local dev and
 * CI builds work without credentials.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailArgs): Promise<SendEmailResult> {
  if (!resend) {
    console.info(
      `[email] RESEND_API_KEY unset — skipping send. to=${JSON.stringify(
        to
      )} subject="${subject}"`
    );
    return { ok: false };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error("[email] Resend returned an error:", error);
      return { ok: false };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false };
  }
}
