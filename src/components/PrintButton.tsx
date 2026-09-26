"use client";

/** Print / save-as-PDF trigger for the cheat sheet. Hidden when printing. */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="h-11 rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary print:hidden"
    >
      {label}
    </button>
  );
}
