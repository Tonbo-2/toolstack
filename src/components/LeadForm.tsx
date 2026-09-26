"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Lead capture, in two shapes:
 *  - variant "email"   → a one-field signup (2026-09-26 のチートシート廃止で、
 *                        サイト内ではいまどこからも使っていません)
 *  - variant "message" → the correction and question form on /about
 * `tone="dark"` styles it for a dark band; default is the light card surface.
 * Both post to the same DB-backed route (`/api/leads`).
 *
 * Every visible string comes in as `strings` from the server page's dictionary,
 * so the form speaks the language of the page it sits on.
 */

/** The dictionary's `form` section — passed in per page (a client component must
 *  not import the whole dictionary module for the sake of nine labels). */
export interface LeadFormStrings {
  invalidEmail: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  sending: string;
  error: string;
}

const buildSchema = (invalidEmail: string) =>
  z.object({
    name: z.string().max(200).optional(),
    email: z.string().email(invalidEmail),
    message: z.string().max(5000).optional(),
    hp: z.string().optional(), // honeypot
  });

type FormData = z.infer<ReturnType<typeof buildSchema>>;

export function LeadForm({
  variant = "email",
  tone = "light",
  cta = "リストに登録",
  successMessage = "登録が完了しました。",
  successHref,
  successLabel,
  strings,
}: {
  variant?: "email" | "message";
  tone?: "light" | "dark";
  cta?: string;
  successMessage?: string;
  successHref?: string;
  successLabel?: string;
  strings: LeadFormStrings;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const dark = tone === "dark";
  const schema = useMemo(() => buildSchema(strings.invalidEmail), [strings.invalidEmail]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(false);
    if (variant === "message" && (!data.message || data.message.trim().length < 10)) {
      setError(true);
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: window.location.pathname }),
      });
      // Success only on a real 2xx: a swallowed failure would say "thanks"
      // while the address was dropped.
      if (!res.ok) {
        setError(true);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(true);
    }
  };

  const inputClass = dark
    ? "w-full rounded-md border border-background/30 bg-transparent px-3 py-2.5 text-background placeholder:text-background/50 focus:border-background focus:outline-none"
    : "w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none";
  const labelClass = dark ? "text-background/80" : "text-muted";
  const buttonClass = dark
    ? "bg-accent text-accent-foreground hover:bg-accent/90"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  if (submitted) {
    return (
      <div className={dark ? "text-background" : "text-foreground"}>
        <p className="font-heading text-lg font-semibold">{successMessage}</p>
        {successHref && successLabel && (
          <p className="mt-2 text-sm">
            <Link
              href={successHref}
              className={dark ? "underline decoration-accent underline-offset-4" : "text-primary underline underline-offset-4"}
            >
              {successLabel}
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {variant === "message" && (
        <div>
          <label htmlFor="lead-name" className={`mb-1 block text-sm ${labelClass}`}>
            {strings.name}
          </label>
          <input
            id="lead-name"
            {...register("name")}
            className={inputClass}
            placeholder={strings.namePlaceholder}
          />
        </div>
      )}
      <div className={variant === "email" ? "flex flex-col gap-3 sm:flex-row" : ""}>
        <div className="flex-1">
          <label htmlFor="lead-email" className={`mb-1 block text-sm ${labelClass}`}>
            {strings.email}
          </label>
          <input
            id="lead-email"
            type="email"
            {...register("email")}
            className={inputClass}
            placeholder={strings.emailPlaceholder}
          />
          {errors.email && (
            <p className={`mt-1 text-sm ${dark ? "text-accent" : "text-primary"}`}>{errors.email.message}</p>
          )}
        </div>
        {variant === "email" && (
          <div className="sm:pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-11 w-full rounded-md px-5 text-sm font-semibold transition-colors disabled:opacity-50 sm:w-auto ${buttonClass}`}
            >
              {isSubmitting ? strings.sending : cta}
            </button>
          </div>
        )}
      </div>
      {variant === "message" && (
        <div>
          <label htmlFor="lead-message" className={`mb-1 block text-sm ${labelClass}`}>
            {strings.message}
          </label>
          <textarea
            id="lead-message"
            rows={4}
            {...register("message")}
            className={inputClass}
            placeholder={strings.messagePlaceholder}
          />
        </div>
      )}
      {variant === "message" && (
        <button
          type="submit"
          disabled={isSubmitting}
          className={`h-11 rounded-md px-5 text-sm font-semibold transition-colors disabled:opacity-50 ${buttonClass}`}
        >
          {isSubmitting ? strings.sending : cta}
        </button>
      )}
      {/* Honeypot: hidden from people, filled by bots. */}
      <input
        {...register("hp")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {error && (
        <p className={`text-sm ${dark ? "text-accent" : "text-primary"}`}>{strings.error}</p>
      )}
    </form>
  );
}
