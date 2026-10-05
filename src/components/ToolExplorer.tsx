"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ToolMark } from "@/components/ToolMark";
import { localeHref, type Locale } from "@/lib/i18n";
import { toolDisplayName, type LocalizedCategory, type LocalizedTool } from "@/lib/tools";

/** The dictionary strings this table renders — passed in from the server page. */
export interface ExplorerLabels {
  searchLabel: string;
  searchPlaceholder: string;
  allTools: string;
  shownOne: string;
  shownMany: string;
  caption: string;
  columnTool: string;
  columnCategory: string;
  columnBestFor: string;
  columnWatchFor: string;
  empty: string;
}

/**
 * The filterable directory. Search runs over the product name, the fit
 * statement and the standout line, so a query like "newsletter" or "calls"
 * finds the entry even when the category is not selected.
 *
 * The table stays a real <table>; on small screens each row becomes a stacked
 * block with its own labels instead of a horizontally scrolling grid.
 *
 * Tools arrive already resolved for the page's locale, so searching works on the
 * words the reader actually sees.
 */
export function ToolExplorer({
  tools,
  categories,
  initialCategory = "",
  locale,
  labels,
}: {
  tools: LocalizedTool[];
  categories: LocalizedCategory[];
  initialCategory?: string;
  locale: Locale;
  labels: ExplorerLabels;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (category && tool.category !== category) return false;
      if (!q) return true;
      const label = categories.find((c) => c.slug === tool.category)?.label ?? "";
      return [toolDisplayName(tool), tool.bestFor, tool.standout, label]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [tools, categories, query, category]);

  const chip = (active: boolean) =>
    [
      "rounded-md border px-3 py-1.5 text-sm transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted hover:border-primary hover:text-foreground",
    ].join(" ");

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="tool-search" className="sr-only">
            {labels.searchLabel}
          </label>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(category === "")} onClick={() => setCategory("")}>
            {labels.allTools}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chip(category === c.slug)}
              onClick={() => setCategory(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">
          {filtered.length === 1
            ? labels.shownOne
            : labels.shownMany.replace("{count}", String(filtered.length))}
        </p>
      </div>

      <table className="mt-6 w-full border-collapse text-left">
        <caption className="sr-only">{labels.caption}</caption>
        <thead className="hidden border-b border-border text-xs uppercase tracking-wide text-muted md:table-header-group">
          <tr>
            <th scope="col" className="py-3 pr-4 font-medium">
              {labels.columnTool}
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">
              {labels.columnCategory}
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">
              {labels.columnBestFor}
            </th>
            <th scope="col" className="py-3 font-medium">
              {labels.columnWatchFor}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tool) => {
            const label = categories.find((c) => c.slug === tool.category)?.label ?? "";
            return (
              <tr
                key={tool.slug}
                className="block border-b border-border py-5 md:table-row md:py-0"
              >
                <td className="block align-top md:table-cell md:py-4 md:pr-4">
                  <span className="flex items-center gap-3">
                    <ToolMark logo={tool.logo} />
                    <Link
                      href={localeHref(locale, `/tools/${tool.slug}`)}
                      className="font-heading text-base font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {toolDisplayName(tool)}
                    </Link>
                  </span>
                </td>
                <td className="block align-top text-sm text-muted md:table-cell md:py-4 md:pr-4">
                  <span className="mt-2 block md:mt-0">{label}</span>
                </td>
                <td className="block align-top text-sm text-muted md:table-cell md:py-4 md:pr-4">
                  <span className="mt-2 block whitespace-pre-line md:mt-0">{tool.bestFor}</span>
                </td>
                <td className="block align-top text-sm text-muted md:table-cell md:py-4">
                  <span className="mt-2 block whitespace-pre-line md:mt-0">{tool.watchFor}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-md border border-border bg-card p-6 text-sm text-muted">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
