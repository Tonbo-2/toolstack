import type { ReactNode } from "react";

/**
 * Pass-through root layout.
 *
 * The document shell (`<html lang>` / `<body>`) lives in
 * `src/app/[locale]/layout.tsx`, because that is the only place the page's
 * language is known — and `<html lang>` has to match the language of the text on
 * screen. Next expects a file at this path, so this one renders its children
 * unchanged: the html/body it looks for are in the tree directly below.
 *
 * This file is a leftover of the single-language layout and is safe to delete
 * once the repository can be edited outside this session (nothing else imports it).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
