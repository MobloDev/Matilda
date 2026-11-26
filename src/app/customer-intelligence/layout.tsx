import Link from "next/link";
import { Tabs } from "@/components/ui";

export default function CustomerIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-12 sm:px-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm font-medium text-brand-ink hover:underline"
        >
          ← Back to Account Overview
        </Link>
        <span className="mt-2 inline-block w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-300">
          Synthetic prototype data
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Customer Intelligence
        </h1>
      </div>
      {children}
    </main>
  );
}
