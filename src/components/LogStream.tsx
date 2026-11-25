"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";

type Source = "ATTACK" | "SIEM" | "AWS" | "GRC" | "FIX";

// Colors follow the site palette: pink = attack, sky = SIEM, purple = cloud, yellow = audit.
const SOURCES: { id: Source; tag: string; dot: string; ink: string; hint: string }[] = [
  { id: "ATTACK", tag: "ATTACK", dot: "var(--pink)", ink: "var(--pink-ink)", hint: "Attack and probe logs" },
  { id: "SIEM", tag: "SIEM", dot: "var(--sky)", ink: "var(--sky-ink)", hint: "SIEM and firewall alerts" },
  { id: "AWS", tag: "AWS", dot: "var(--purple)", ink: "var(--purple-ink)", hint: "Cloud audit logs" },
  { id: "GRC", tag: "GRC", dot: "var(--yellow)", ink: "var(--yellow-ink)", hint: "Compliance and audit evidence" },
  { id: "FIX", tag: "FIX", dot: "var(--text-muted)", ink: "var(--text)", hint: "Patches and retests" },
];

// Everything here is made up. IPs come from the RFC 5737 documentation ranges,
// hosts and users are fictional, and the AWS key is AWS's own published example.
const POOL: Record<Source, string[]> = {
  ATTACK: [
    "WAF blocked SQLi attempt from 203.0.113.42 on /api/v2/login",
    "brute force: 14 failed logins for admin from 198.51.100.7",
    "path traversal probe ../../etc/passwd from 192.0.2.88 (blocked)",
    "reflected XSS payload in q= param rejected, session 7f3a",
    "port scan from 198.51.100.23 hit 41 ports in 6s",
    "nmap -sV fingerprint from 203.0.113.19 (22, 80, 443, 3306)",
    "JWT with alg=none rejected on /api/orders",
    "credential stuffing burst: 220 req/min from 192.0.2.141",
    "SSRF attempt to 169.254.169.254 via url= param (blocked)",
    "IDOR probe /invoice/1043 as user 1042 returned 403",
    "directory fuzz hit /.git/config on staging-02 (404)",
  ],
  SIEM: [
    "wazuh rule 5710 sshd: login attempt using a non-existent user",
    "wazuh rule 100002 custom: encoded PowerShell on win-fin-04",
    "elastic alert: 5 failed logins then success for svc-backup",
    "pfSense: blocked tcp 198.51.100.7:51522 -> 10.0.0.12:3389",
    "wazuh FIM: /etc/passwd modified on web-03",
    "correlation: impossible travel for user dev.kai (ID -> NL)",
    "elastic: DNS query to newly registered domain from lab-11",
    "wazuh rule 31151 web: multiple 400s from one source",
    "sysmon: lsass.exe memory read by unsigned process on win-hr-02",
    "alert triaged: false positive, rule tuned, noise -38%",
  ],
  AWS: [
    "CloudTrail ConsoleLogin MFA=false user=audit-ro region=ap-southeast-3",
    "GuardDuty UnauthorizedAccess:EC2/SSHBruteForce i-0abc123def",
    "S3 PutBucketAcl public-read on logs-demo-bucket (reverted by policy)",
    "IAM key AKIAIOSFODNN7EXAMPLE rotated, previous age 91d",
    "Config: sg-0demo allows 0.0.0.0/0 on 22 (non-compliant)",
    "CloudWatch: lambda auth-handler error rate 4.2%",
    "CloudTrail AssumeRole denied for role dev-sandbox from new IP",
    "Security Hub: 3 new MEDIUM findings in ap-southeast-3",
    "KMS key rotation enabled on prod-data-key",
  ],
  GRC: [
    "audit: control A.8.15 logging evidence collected",
    "access review completed: 3 findings, owners assigned",
    "risk register: R-017 vendor SaaS rescored 12 -> 8",
    "evidence uploaded: backup-restore-test.pdf (A.8.13)",
    "DPIA for HR portal marked approved",
    "SoA updated: A.5.23 cloud services now in scope",
    "internal audit: 2 minor NCs raised, due in 14 days",
    "policy review: incident response plan v3 signed off",
  ],
  FIX: [
    "patch applied: openssl on web-03, restart ok",
    "retest passed: IDOR on /invoice no longer reproduces",
    "WAF rule 942100 tuned, false positives down",
    "MFA enforced for audit-ro, ticket closed",
    "bucket policy hardened, public access blocked",
    "rate limit added to /api/v2/login (10/min per IP)",
    "secret rotated, old key revoked, deploy green",
  ],
};

interface Entry {
  id: number;
  time: string;
  src: Source;
  msg: string;
}

const VISIBLE = 9;

// Fixed order so server HTML and the first client render match exactly.
const SEED_PICKS: [Source, number][] = [
  ["SIEM", 0],
  ["ATTACK", 1],
  ["AWS", 0],
  ["ATTACK", 0],
  ["GRC", 0],
  ["SIEM", 3],
  ["FIX", 1],
  ["AWS", 4],
  ["ATTACK", 3],
];

const fmt = (d: Date) => d.toLocaleTimeString("en-GB", { hour12: false });

const SEED: Entry[] = SEED_PICKS.map(([src, i], n) => ({
  id: n,
  time: `21:41:${String(10 + n * 2).padStart(2, "0")}`,
  src,
  msg: POOL[src][i],
}));

const rand = (n: number) => Math.floor(Math.random() * n);

const TOKEN =
  /(\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b|\b(?:blocked|rejected|denied|failed|non-compliant|public-read)\b|\b(?:passed|approved|rotated|enforced|applied|hardened|completed|collected|approved|revoked)\b)/gi;
const BAD = /^(?:blocked|rejected|denied|failed|non-compliant|public-read)$/i;
const GOOD = /^(?:passed|approved|rotated|enforced|applied|hardened|completed|collected|revoked)$/i;

function renderMsg(msg: string) {
  return msg.split(TOKEN).map((part, i) => {
    if (BAD.test(part)) return <span key={i} style={{ color: "var(--pink-ink)" }}>{part}</span>;
    if (GOOD.test(part)) return <span key={i} style={{ color: "var(--sky-ink)" }}>{part}</span>;
    if (/^\d{1,3}(?:\.\d{1,3}){3}/.test(part)) return <span key={i} className="text-[var(--text)]">{part}</span>;
    return part;
  });
}

export function LogStream() {
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const [enabled, setEnabled] = useState<Record<Source, boolean>>({
    ATTACK: true,
    SIEM: true,
    AWS: true,
    GRC: true,
    FIX: true,
  });
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const nextId = useRef(SEED.length);
  const visible = useRef(true);
  const hovering = useRef(false);
  const enabledRef = useRef(enabled);
  const rootRef = useRef<HTMLElement>(null);
  const shown = useRef<string[]>(SEED.map((e) => e.msg));

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Swap the fixed seed times for real ones, so the stream looks live from the first frame.
  useEffect(() => {
    const now = Date.now();
    setEntries((prev) =>
      prev.map((e, i) => ({ ...e, time: fmt(new Date(now - (prev.length - i) * 1400)) }))
    );
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (visible.current && !hovering.current && !document.hidden) {
        const on = SOURCES.filter((s) => enabledRef.current[s.id]).map((s) => s.id);
        if (on.length > 0) {
          // ATTACK and SIEM are the loudest sources, like a real feed.
          const weighted = on.flatMap((id) => (id === "ATTACK" || id === "SIEM" ? [id, id] : [id]));
          const src = weighted[rand(weighted.length)];
          const onScreen = new Set(shown.current);
          const fresh = POOL[src].filter((m) => !onScreen.has(m));
          const choices = fresh.length > 0 ? fresh : POOL[src];
          const msg = choices[rand(choices.length)];
          const entry: Entry = { id: nextId.current++, time: fmt(new Date()), src, msg };
          setEntries((prev) => {
            const next = [...prev, entry].slice(-VISIBLE);
            shown.current = next.map((n) => n.msg);
            return next;
          });
        }
      }
      timer = setTimeout(tick, 650 + rand(900));
    };

    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  const toggle = (id: Source) =>
    setEnabled((prev) => {
      const onCount = Object.values(prev).filter(Boolean).length;
      if (prev[id] && onCount === 1) return prev; // keep at least one source on
      return { ...prev, [id]: !prev[id] };
    });

  const meta = (id: Source) => SOURCES.find((s) => s.id === id)!;

  return (
    <figure ref={rootRef} className="mt-7">
      <div
        className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--code-bg)]"
        onMouseEnter={() => {
          hovering.current = true;
          setPaused(true);
        }}
        onMouseLeave={() => {
          hovering.current = false;
          setPaused(false);
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--border)] px-3 py-2 text-[11.5px] text-[var(--text-muted)]">
          <span className="flex items-center gap-2">
            <span className={paused || prefersReduced ? "live-dot is-paused" : "live-dot"} aria-hidden="true" />
            {paused ? "paused" : "live log stream"}
          </span>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1" role="group" aria-label="Log sources">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={enabled[s.id]}
                title={s.hint}
                onClick={() => toggle(s.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-0.5 font-mono transition-opacity hover:bg-[var(--hover-bg)] focus-visible:outline-2 ${
                  enabled[s.id] ? "text-[var(--text-secondary)]" : "opacity-40"
                }`}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                {s.tag}
              </button>
            ))}
          </div>
        </div>

        <MotionConfig reducedMotion="user">
          <ul
            aria-hidden="true"
            className="flex h-[200px] flex-col justify-end overflow-hidden px-3 py-2 font-mono text-[11.5px] leading-[20px] [mask-image:linear-gradient(to_bottom,transparent,#000_38%)]"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((e) => {
                const m = meta(e.src);
                return (
                  <motion.li
                    key={e.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-2.5 whitespace-nowrap"
                  >
                    <span className="shrink-0 tabular-nums text-[var(--text-faint)]">{e.time}</span>
                    <span className="w-[52px] shrink-0 font-medium" style={{ color: m.ink }}>
                      {m.tag}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">{renderMsg(e.msg)}</span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </MotionConfig>
      </div>
      <figcaption className="mt-2 font-mono text-[11.5px] text-[var(--text-muted)]">
        Sample logs, all made up (documentation IPs, fictional hosts). Hover to pause, tap a source to mute it.
      </figcaption>
    </figure>
  );
}
