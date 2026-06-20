import "server-only";
import type { ShippingAddress } from "@/types/order";

// ── Brand tokens (inline styles — email clients ignore <style>/classes) ──────
const INK = "rgb(25,28,31)";
const MUTED = "rgba(25,28,31,0.6)";
const HAIRLINE = "rgb(229,229,229)";
const BG = "rgb(250,250,250)";
const SITE_URL = process.env.BETTER_AUTH_URL ?? "https://museumgrades.com";

export type EmailLineItem = {
  brand: string;
  name: string;
  condition: string;
  priceCents: number;
};

function usd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shared chrome: centered 600px card, ink wordmark header, hairline footer. */
function layout(inner: string, opts: { preheader?: string } = {}): string {
  const font =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${font};color:${INK};-webkit-font-smoothing:antialiased;">
${
  opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(
        opts.preheader
      )}</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${HAIRLINE};">
      <tr><td style="padding:28px 36px;border-bottom:1px solid ${HAIRLINE};text-align:center;">
        <a href="${SITE_URL}" style="text-decoration:none;color:${INK};font-size:13px;font-weight:600;letter-spacing:4px;text-transform:uppercase;">Museum&nbsp;Grades</a>
      </td></tr>
      <tr><td style="padding:36px;">
${inner}
      </td></tr>
      <tr><td style="padding:24px 36px;border-top:1px solid ${HAIRLINE};text-align:center;">
        <p style="margin:0;font-size:11px;letter-spacing:0.5px;color:${MUTED};">
          Museum Grades · Authenticated luxury, curated.<br/>
          <a href="${SITE_URL}" style="color:${MUTED};">museumgrades.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 20px;font-size:22px;font-weight:500;color:${INK};">${esc(
    text
  )}</h1>`;
}

function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK};">${html}</p>`;
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:${INK};">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">${esc(
    label
  )}</a>
  </td></tr></table>`;
}

function itemRows(items: EmailLineItem[]): string {
  return items
    .map(
      (it) => `<tr>
      <td style="padding:12px 0;border-bottom:1px solid ${HAIRLINE};">
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">${esc(
        it.brand
      )}</div>
        <div style="font-size:14px;color:${INK};">${esc(it.name)}</div>
        <div style="font-size:12px;color:${MUTED};">${esc(it.condition)}</div>
      </td>
      <td align="right" style="padding:12px 0;border-bottom:1px solid ${HAIRLINE};font-size:14px;color:${INK};white-space:nowrap;vertical-align:top;">${usd(
        it.priceCents
      )}</td>
    </tr>`
    )
    .join("");
}

function addressBlock(shipping: ShippingAddress): string {
  const cityLine = [shipping.city, shipping.state, shipping.postalCode]
    .filter(Boolean)
    .join(", ");
  const lines = [
    shipping.name,
    shipping.line1,
    shipping.line2,
    cityLine,
    shipping.country,
    shipping.phone,
  ]
    .filter((l) => l && l.trim())
    .map((l) => esc(l as string))
    .join("<br/>");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border-top:1px solid ${HAIRLINE};">
    <tr><td style="padding:16px 0 0;">
      <div style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">Ship to</div>
      <div style="font-size:14px;line-height:1.6;color:${INK};">${lines}</div>
    </td></tr>
  </table>`;
}

function orderTable(items: EmailLineItem[], totalCents: number): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
    ${itemRows(items)}
    <tr>
      <td style="padding:16px 0 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Total</td>
      <td align="right" style="padding:16px 0 0;font-size:18px;font-weight:600;color:${INK};">${usd(
        totalCents
      )}</td>
    </tr>
  </table>`;
}

// ── Builders ────────────────────────────────────────────────────────────────

export function welcomeEmail({ name }: { name: string }): {
  subject: string;
  html: string;
} {
  const first = name?.trim().split(/\s+/)[0] || "there";
  return {
    subject: "Welcome to Museum Grades",
    html: layout(
      heading(`Welcome, ${esc(first)}.`) +
        paragraph(
          "Your account is ready. Museum Grades is a curated edit of authenticated luxury — each piece inspected, graded, and held to a museum standard."
        ) +
        paragraph(
          "Browse the collection and reserve the pieces you love. We'll keep your bag waiting."
        ) +
        button("Explore the collection", `${SITE_URL}/collections/all-bags`),
      { preheader: "Your Museum Grades account is ready." }
    ),
  };
}

export function orderConfirmationEmail({
  name,
  orderId,
  items,
  totalCents,
  receiptUrl,
  orderUrl,
  shipping,
}: {
  name: string;
  orderId: string;
  items: EmailLineItem[];
  totalCents: number;
  receiptUrl?: string | null;
  orderUrl: string;
  shipping?: ShippingAddress;
}): { subject: string; html: string } {
  const first = name?.trim().split(/\s+/)[0] || "there";
  return {
    subject: "Your Museum Grades order is confirmed",
    html: layout(
      heading("Order confirmed") +
        paragraph(
          `Thank you, ${esc(
            first
          )}. We've received your order and are preparing it with care.`
        ) +
        paragraph(
          `<span style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Order</span><br/><span style="font-family:monospace;font-size:13px;color:${INK};">${esc(
            orderId
          )}</span>`
        ) +
        orderTable(items, totalCents) +
        (shipping ? addressBlock(shipping) : "") +
        button("View your order", orderUrl) +
        (receiptUrl
          ? paragraph(
              `<a href="${receiptUrl}" style="color:${MUTED};font-size:13px;">View payment receipt</a>`
            )
          : ""),
      { preheader: "We've received your order." }
    ),
  };
}

export function newOrderAlertEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  totalCents,
  orderUrl,
  shipping,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: EmailLineItem[];
  totalCents: number;
  orderUrl: string;
  shipping: ShippingAddress;
}): { subject: string; html: string } {
  return {
    subject: `New order — ${usd(totalCents)} from ${customerName}`,
    html: layout(
      heading("New order received") +
        paragraph(
          `<strong>${esc(customerName)}</strong> &lt;${esc(
            customerEmail
          )}&gt; just placed an order.`
        ) +
        addressBlock(shipping) +
        paragraph(
          `<span style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Order</span><br/><span style="font-family:monospace;font-size:13px;color:${INK};">${esc(
            orderId
          )}</span>`
        ) +
        orderTable(items, totalCents) +
        button("Open in admin", orderUrl),
      { preheader: `New order from ${customerName} — ${usd(totalCents)}` }
    ),
  };
}

export function passwordResetEmail({
  name,
  url,
}: {
  name: string;
  url: string;
}): { subject: string; html: string } {
  const first = name?.trim().split(/\s+/)[0] || "there";
  return {
    subject: "Reset your Museum Grades password",
    html: layout(
      heading("Reset your password") +
        paragraph(
          `Hi ${esc(
            first
          )}, we received a request to reset your password. Click below to choose a new one.`
        ) +
        button("Reset password", url) +
        paragraph(
          `<span style="font-size:13px;color:${MUTED};">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't change.</span>`
        ),
      { preheader: "Reset your Museum Grades password." }
    ),
  };
}
