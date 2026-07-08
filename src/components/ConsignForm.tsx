"use client";

import { useState } from "react";

const CONSIGN_EMAIL = "info@museumgrades.com";

export function ConsignForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designer, setDesigner] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Consignment Inquiry — ${designer || "Handbag"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      designer && `Designer / Brand: ${designer}`,
      "",
      "Item details:",
      details,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${CONSIGN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-4 border px-8 py-14 text-center"
        style={{ borderColor: "rgb(229,229,229)" }}
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgb(25,28,31)" }}
        >
          Inquiry Ready
        </p>
        <p
          className="max-w-[380px] text-[15px] leading-[1.7]"
          style={{ color: "rgba(25,28,31,0.65)" }}
        >
          Your email client should now be open with your inquiry addressed to{" "}
          <a
            href={`mailto:${CONSIGN_EMAIL}`}
            className="font-medium underline"
            style={{ color: "rgb(25,28,31)" }}
          >
            {CONSIGN_EMAIL}
          </a>
          . Attach a few photos of your item before sending — we respond with
          pre-paid shipping labels the same day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-[13px] underline"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="consign-name"
          className="text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Full Name
        </label>
        <input
          id="consign-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="consign-email"
          className="text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Email
        </label>
        <input
          id="consign-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="consign-phone"
          className="text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="consign-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="consign-designer"
          className="text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Designer / Brand
        </label>
        <input
          id="consign-designer"
          type="text"
          required
          value={designer}
          onChange={(e) => setDesigner(e.target.value)}
          placeholder="e.g. Hermès, Chanel, Louis Vuitton"
          className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors placeholder:text-[rgba(25,28,31,0.35)] focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="consign-details"
          className="text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          Tell Us About Your Item
        </label>
        <textarea
          id="consign-details"
          required
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Model, size, condition, and anything included (box, dust bag, receipt)…"
          className="resize-none border-b bg-transparent pb-2 text-[15px] leading-[1.6] outline-none transition-colors placeholder:text-[rgba(25,28,31,0.35)] focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <button
        type="submit"
        className="mt-2 h-[47px] border text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
        style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
      >
        Start My Consignment
      </button>

      <p
        className="text-center text-[13px]"
        style={{ color: "rgba(25,28,31,0.6)" }}
      >
        Prefer email? Contact{" "}
        <a
          href={`mailto:${CONSIGN_EMAIL}`}
          className="font-medium underline"
          style={{ color: "rgb(25,28,31)" }}
        >
          {CONSIGN_EMAIL}
        </a>
      </p>
    </form>
  );
}
