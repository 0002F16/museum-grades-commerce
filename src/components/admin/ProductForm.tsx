"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/app/actions/admin";

const CONDITIONS = ["New", "Excellent", "Shows Wear", "Worn", "Fair"];

export interface ProductFormInitial {
  brand?: string;
  category?: string;
  name?: string;
  price?: number;
  estRetail?: number;
  condition?: string;
  color?: string;
  material?: string;
  description?: string;
  imageUrls?: string[];
}

interface ProductFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: ProductFormInitial;
  submitLabel: string;
  heading: string;
}

const labelCls =
  "text-[11px] font-semibold uppercase tracking-[2px]";
const labelStyle = { color: "rgba(25,28,31,0.6)" };
const inputCls =
  "border bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]";
const inputStyle = { borderColor: "rgb(229,229,229)", color: "rgb(25,28,31)" };

export function ProductForm({ action, initial, submitLabel, heading }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  return (
    <div className="max-w-[640px]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[24px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          {heading}
        </h1>
        <Link
          href="/admin/products"
          className="text-[12px] font-semibold uppercase tracking-[1.5px] transition-opacity hover:opacity-60"
          style={{ color: "rgba(25,28,31,0.6)" }}
        >
          ← Back
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Brand" name="brand" defaultValue={initial?.brand} required />
          <Field label="Category (bag type)" name="category" defaultValue={initial?.category} required />
        </div>

        <Field label="Name" name="name" defaultValue={initial?.name} required />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Price ($)" name="price" type="number" defaultValue={initial?.price?.toString()} required />
          <Field label="Est. retail ($)" name="estRetail" type="number" defaultValue={initial?.estRetail?.toString()} placeholder="Defaults to price" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={labelStyle}>Condition</label>
            <select
              name="condition"
              defaultValue={initial?.condition ?? "Excellent"}
              className={inputCls}
              style={inputStyle}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field label="Color" name="color" defaultValue={initial?.color} />
          <Field label="Material" name="material" defaultValue={initial?.material} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls} style={labelStyle}>Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initial?.description}
            className={inputCls}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls} style={labelStyle}>
            Image URLs <span style={{ color: "rgba(25,28,31,0.4)" }}>· one per line</span>
          </label>
          <textarea
            name="imageUrls"
            rows={4}
            required
            defaultValue={initial?.imageUrls?.join("\n")}
            placeholder="https://…"
            className={`${inputCls} font-mono text-[13px]`}
            style={inputStyle}
          />
        </div>

        {state?.error && (
          <p className="text-[13px]" style={{ color: "rgb(180,40,40)" }}>
            {state.error}
          </p>
        )}

        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="h-[47px] bg-[rgb(25,28,31)] px-10 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {pending ? "Saving…" : submitLabel}
          </button>
          <Link
            href="/admin/products"
            className="text-[13px] transition-opacity hover:opacity-60"
            style={{ color: "rgba(25,28,31,0.6)" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls} style={labelStyle}>{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={type === "number" ? "1" : undefined}
        min={type === "number" ? "0" : undefined}
        className={inputCls}
        style={inputStyle}
      />
    </div>
  );
}
