import Image from "next/image";

/**
 * A vendor's own mark, shown unchanged (never recolored, cropped or re-backed).
 * Renders nothing when no verified mark exists for the tool, so the row falls
 * back to the plain product name instead of a stand-in badge.
 */
export function ToolMark({
  logo,
  size = 28,
  className = "",
}: {
  logo: string;
  size?: number;
  className?: string;
}) {
  if (!logo) return null;
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-card ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {/* alt is empty: the product name sits next to the mark, so repeating it
          would read the brand twice (see the "Say It Once" rule). */}
      <Image
        src={logo}
        alt=""
        width={size * 2}
        height={size * 2}
        className="object-contain"
        style={{ width: size - 8, height: size - 8, maxWidth: size - 8, maxHeight: size - 8 }}
      />
    </span>
  );
}
