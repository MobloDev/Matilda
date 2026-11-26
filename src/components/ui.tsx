// Small shared presentation helpers used across MATILDA screens.
// Kept deliberately plain (no variants/props explosion) — add complexity
// only when a second real need for it shows up.

import Link from "next/link";

export function Tabs({
  tabs,
  active,
}: {
  tabs: { href: string; label: string }[];
  active: string;
}) {
  return (
    <nav className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={
            "px-3 py-2 text-sm font-medium " +
            (tab.href === active
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100")
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {children}
    </span>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
