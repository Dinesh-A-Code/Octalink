"use client";

import { useRef, useState } from "react";
import { CONTACT_ENDPOINT } from "@/content/site";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "sending" | "sent" | "error";

const BUDGETS = [
  "Not sure yet",
  "Under £5k",
  "£5k – £15k",
  "£15k – £40k",
  "£40k+",
];

const SERVICES = ["Landing page", "Website", "Application", "Something else"];

/**
 * Posts a plain JSON body to a single configurable endpoint, so switching to
 * Formspree, a Resend relay or a Cloudflare Worker is an env-var change with
 * no component edits.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const configured = CONTACT_ENDPOINT.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || status === "sending") return;

    const data = new FormData(event.currentTarget);
    if (data.get("company")) return; // honeypot

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      setStatus("sent");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line p-8 md:p-10">
        <p className="text-lead text-fg">Thanks — that reached us.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We read everything ourselves and reply within a couple of working
          days, usually with a few questions.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <Field label="Company" name="organisation" autoComplete="organization" />

      <fieldset>
        <legend className="eyebrow">What do you need?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <label key={service} className="cursor-pointer">
              <input
                type="radio"
                name="service"
                value={service}
                className="peer sr-only"
              />
              <span className="block rounded-sharp border border-line px-4 py-2.5 text-sm text-muted transition-colors duration-300 hover:border-line-strong peer-checked:border-accent peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {service}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="budget" className="eyebrow">
          Budget range
        </label>
        <select
          id="budget"
          name="budget"
          defaultValue={BUDGETS[0]}
          className="mt-3 w-full appearance-none rounded-sharp border border-line bg-transparent px-4 py-3.5 text-sm text-fg transition-colors duration-300 focus:border-accent"
        >
          {BUDGETS.map((budget) => (
            <option key={budget} value={budget} className="bg-bg text-fg">
              {budget}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow">
          Tell us about the project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="What you are building, who it is for, and any deadline you are working to."
          className="mt-3 w-full resize-y rounded-sharp border border-line bg-transparent px-4 py-3.5 text-sm leading-relaxed text-fg transition-colors duration-300 placeholder:text-faint focus:border-accent"
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company-hp">Company</label>
        <input id="company-hp" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <MagneticButton type="submit" disabled={!configured || status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </MagneticButton>

        {!configured ? (
          <p className="max-w-xs text-xs leading-relaxed text-faint">
            Form delivery is not connected yet. Set{" "}
            <code className="font-mono">NEXT_PUBLIC_CONTACT_ENDPOINT</code> to
            activate it.
          </p>
        ) : null}

        {status === "error" && error ? (
          <p role="alert" className="text-xs text-accent">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className={cn("flex flex-col")}>
      <label htmlFor={name} className="eyebrow">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-3 rounded-sharp border border-line bg-transparent px-4 py-3.5 text-sm text-fg transition-colors duration-300 placeholder:text-faint focus:border-accent"
      />
    </div>
  );
}
