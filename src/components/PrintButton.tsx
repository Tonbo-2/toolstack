"use client";

/**
 * Print / save-as-PDF trigger. Hidden when printing.
 *
 * 2026-09-26 のチートシート廃止で、いまはどこからも使っていません。この環境では
 * ファイルを削除できないため残しています（印刷するページを作るときに使えます）。
 */
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
