import localFont from "next/font/local";

// Curated, self-hosted variable fonts (latin `wght` axis, .woff2 in ./fonts).
// Self-hosted on purpose: zero build-time network dependency, no layout shift,
// deterministic across rebuilds. Each exposes a CSS variable; globals.css maps
// `--font-heading` / `--font-body` to the pair chosen for the active design
// direction (see the `design-system` skill). Latin-only — Japanese / CJK glyphs
// fall through to `--font-fallback` defined in globals.css.

export const playfair = localFont({
  src: "./fonts/playfair-display.woff2",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
});

export const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});

export const sora = localFont({
  src: "./fonts/sora.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

export const archivo = localFont({
  src: "./fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

export const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const manrope = localFont({
  src: "./fonts/manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const newsreader = localFont({
  src: "./fonts/newsreader.woff2",
  variable: "--font-newsreader",
  weight: "200 800",
  display: "swap",
});
