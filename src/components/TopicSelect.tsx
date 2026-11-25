"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export interface TopicOption {
  value: string;
  label: string;
  color: string;
}

interface TopicSelectProps {
  name: string;
  label: string;
  options: TopicOption[];
  defaultValue: string;
}

/**
 * Select-only combobox (WAI-ARIA pattern): focus stays on the button, the list is driven
 * with aria-activedescendant. Submits through a hidden input, so FormData works as usual.
 */
export function TopicSelect({ name, label, options, defaultValue }: TopicSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === defaultValue))
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (i: number) => {
    setValue(options[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className="mb-1.5 block text-xs text-[var(--text-muted)]">
        {label}
      </span>
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${baseId}-value`}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border bg-[var(--bg)] px-3 py-2 text-left text-sm text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-ink)] ${
          open ? "border-[var(--purple)]" : "border-[var(--border-strong)] hover:border-[var(--text-muted)]"
        }`}
      >
        <span id={`${baseId}-value`} className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: selected.color }}
          />
          <span className="truncate">{selected.label}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.8}
        />
      </button>

      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {open ? (
            <motion.ul
              id={listId}
              role="listbox"
              aria-labelledby={labelId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20 mt-1.5 max-h-72 w-full overflow-auto rounded-md border border-[var(--border-strong)] bg-[var(--bg)] p-1 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.35)]"
            >
              {options.map((o, i) => {
                const isSelected = o.value === value;
                return (
                  <li
                    key={o.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-sm ${
                      i === active ? "bg-[var(--hover-bg)]" : ""
                    } ${isSelected ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: o.color }}
                    />
                    <span className="min-w-0 flex-1">{o.label}</span>
                    {isSelected ? (
                      <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--accent-ink)]" strokeWidth={2} />
                    ) : null}
                  </li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
