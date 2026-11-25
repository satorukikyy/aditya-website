import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12">
      <p className="font-mono text-xs text-[var(--text-muted)]">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--text)]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Nothing here. The link might be old, or the page moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--hover-bg)]"
      >
        Back to home
      </Link>
    </div>
  );
}
