"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { DOMAIN_COLOR, PROJECT_DOMAINS, SITE_DATA } from "@/data/site";
import { TopicSelect } from "@/components/TopicSelect";

// Topic choices come from the project tracks, so a new track shows up here automatically.
const TOPICS = [
  ...PROJECT_DOMAINS.map((d) => ({ value: d.label, label: d.label, color: DOMAIN_COLOR[d.id] })),
  { value: "Just saying hi", label: "Collab / just saying hi", color: "var(--text-muted)" },
];
const DEFAULT_TOPIC = "Governance, Risk & Compliance";

export function ContactActions() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim().slice(0, 100);
    const email = String(formData.get("email") || "").trim().slice(0, 160);
    const topic = String(formData.get("topic") || "").trim().slice(0, 60);
    const message = String(formData.get("message") || "").trim().slice(0, 2000);

    if (!name || !email || !message) {
      setStatus("Please fill in your name, email, and message.");
      return;
    }

    const subject = encodeURIComponent(
      `[${topic || "Hey"}] Message from ${name}`
    );
    const body = encodeURIComponent(`${message}\n\nFrom ${name} (${email})`);
    window.location.href = `mailto:${SITE_DATA.profile.email}?subject=${subject}&body=${body}`;
    setStatus("Opening your mail app...");
    form.reset();
  };

  return (
    <div className="space-y-10">
      {/* Direct Links Table */}
      <section aria-label="Contact links">
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {SITE_DATA.contact.links.map((item) => {
            if (item.copyable) {
              const isCopied = copiedKey === item.label;
              return (
                <div
                  key={item.label}
                  className="-mx-2.5 flex items-center justify-between gap-3 rounded-md px-2.5 py-3 transition-colors hover:bg-[var(--hover-bg)]"
                >
                  <a
                    href={item.href}
                    className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="w-24 shrink-0 text-xs text-[var(--text-muted)] sm:text-[13.5px]">
                      {item.label}
                    </span>
                    <span className="truncate font-mono text-[13.5px] text-[var(--text)]">
                      {item.value}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyText(item.label, item.value)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 font-mono text-[11px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              );
            }

            if (item.internal) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="-mx-2.5 flex items-center justify-between gap-3 rounded-md px-2.5 py-3 transition-colors hover:bg-[var(--hover-bg)]"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="w-24 shrink-0 text-xs text-[var(--text-muted)] sm:text-[13.5px]">
                      {item.label}
                    </span>
                    <span className="truncate font-mono text-[13.5px] text-[var(--text)]">
                      {item.value}
                    </span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2.5 flex items-center justify-between gap-3 rounded-md px-2.5 py-3 transition-colors hover:bg-[var(--hover-bg)]"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="w-24 shrink-0 text-xs text-[var(--text-muted)] sm:text-[13.5px]">
                    {item.label}
                  </span>
                  <span className="truncate text-[13.5px] text-[var(--text)]">
                    {item.value}
                  </span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
              </a>
            );
          })}
        </div>
      </section>

      {/* Responsible Disclosure Card */}
      <section className="rounded-md border border-[var(--border)] bg-[var(--hover-bg)]/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-medium text-[var(--text)]">
            Spotted a bug? Responsible Disclosure (RFC 9116)
          </h2>
          <Link
            href="/.well-known/security.txt"
            className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          >
            security.txt ↗
          </Link>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          Found something sketchy on this site or want to report a security
          issue? Send the details to{" "}
          <span className="font-mono text-[var(--text)]">
            {SITE_DATA.profile.email}
          </span>{" "}
          or check <code className="font-mono">/.well-known/security.txt</code>.
        </p>
      </section>

      {/* Minimalist Quick Note Form */}
      <section aria-labelledby="quick-message-heading">
        <h2
          id="quick-message-heading"
          className="mb-3 text-xs font-medium text-[var(--text-muted)]"
        >
          Drop a quick note
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-xs text-[var(--text-muted)]"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                placeholder="Your name"
                className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-xs text-[var(--text-muted)]"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={160}
                placeholder="you@domain.com"
                className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>
          </div>

          <TopicSelect
            name="topic"
            label="What’s it about?"
            options={TOPICS}
            defaultValue={DEFAULT_TOPIC}
          />

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-xs text-[var(--text-muted)]"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              maxLength={2000}
              placeholder="Tell me what you're building, auditing, or wanna chat about..."
              className="w-full resize-y rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="cursor-pointer rounded-md border border-[var(--text)] bg-[var(--text)] px-4 py-2 text-[13.5px] font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
            >
              Send message
            </button>
            {status ? (
              <span
                role="status"
                aria-live="polite"
                className="text-xs text-[var(--text-muted)]"
              >
                {status}
              </span>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
