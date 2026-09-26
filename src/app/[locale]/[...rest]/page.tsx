import { notFound } from "next/navigation";

/**
 * Any URL that is not a real page 404s INSIDE the locale layout, so the 404
 * keeps the header, the footer, and the language the visitor was reading in —
 * instead of dropping to an unstyled default.
 */
export default function CatchAll() {
  notFound();
}
