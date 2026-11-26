// Small shared presentation helpers used across MATILDA screens.
// Kept deliberately plain (no variants/props explosion) — add complexity
// only when a second real need for it shows up.
//
// Colors reference the NOVA brand tokens defined in src/app/globals.css
// (--color-ink, --color-border, --color-brand-ink, etc.). Those tokens
// already swap values for dark mode, so components here don't need
// separate dark: classes.

import Link from "next/link";

export function Tabs({
  tabs,
  active,
}: {
  tabs: { href: string; label: string }[];
  active: string;
}) {
  return (
    <nav className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={
            "px-3 py-2 text-sm font-medium " +
            (tab.href === active
              ? "border-b-2 border-brand-ink text-brand-ink"
              : "text-ink/70 hover:text-ink")
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
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-ink">
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
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/70">
        {title}
      </h2>
      {children}
    </section>
  );
}

// --- Form field helpers, used by every Account Plan authoring form. Kept
// plain (no react-hook-form, no client components) — these are uncontrolled
// fields inside a <form action={serverAction}>, so no client JS is needed.

const fieldClass =
  "rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong";

function toDateInputValue(value?: Date | null) {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-ink/70">
      {label}
      {children}
    </label>
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
    </Field>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  required,
  rows = 2,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
        className={fieldClass}
      />
    </Field>
  );
}

export function DateField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: Date | null;
}) {
  return (
    <Field label={label}>
      <input
        type="date"
        name={name}
        defaultValue={toDateInputValue(defaultValue)}
        className={fieldClass}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={fieldClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// A form wrapped in <details>, used for every "+ New X" / "Edit" control —
// collapsed by default so the page isn't overwhelmed with open forms.
export function FormDisclosure({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details className="w-fit">
      <summary className="cursor-pointer rounded border border-border px-3 py-1.5 text-sm font-medium text-ink-strong">
        {label}
      </summary>
      <div className="mt-3 flex max-w-md flex-col gap-3 rounded-lg border border-border p-4">
        {children}
      </div>
    </details>
  );
}
