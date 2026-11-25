"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_DATA } from "@/data/site";
import { LogoA } from "@/components/LogoA";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="mb-10 sm:mb-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Top row: Brand + mobile theme toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group -ml-1.5 inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
            aria-label="Rizky Aditya home"
          >
            <LogoA
              size={22}
              variant="badge"
              className="shrink-0 transition-transform duration-150 group-hover:scale-[1.03]"
            />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text)]">
              {SITE_DATA.profile.name}
            </span>
          </Link>

          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation + desktop theme toggle */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 sm:justify-end sm:gap-1 sm:border-b-0 sm:pb-0">
          <nav
            aria-label="Main navigation"
            className="-mx-1.5 flex w-full flex-wrap items-center justify-between gap-y-1 sm:mx-0 sm:w-auto sm:justify-end sm:gap-0.5"
          >
            {SITE_DATA.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-1.5 py-1 text-[13px] transition-colors sm:px-2 sm:text-[13.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)] ${
                    active
                      ? "bg-[var(--hover-bg)] font-medium text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-1.5 hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
