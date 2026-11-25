"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";

// Six feeds. `id` drives the mute toggle, `label` is what the legend shows (named like real
// pipeline sources). Colors: pink = attacks, purple/sky/yellow = the three clouds, neutral = SIEM and fixes.
type Source = "ATTACK" | "SIEM" | "AWS" | "AZURE" | "GCP" | "FIX";

const SOURCES: { id: Source; label: string; dot: string; ink: string; hint: string }[] = [
  { id: "ATTACK", label: "nginx/waf", dot: "var(--pink)", ink: "var(--pink-ink)", hint: "Edge access logs and WAF hits" },
  { id: "SIEM", label: "wazuh/siem", dot: "var(--text)", ink: "var(--text)", hint: "Wazuh, Suricata, pfSense, Elastic" },
  { id: "AWS", label: "aws", dot: "var(--purple)", ink: "var(--purple-ink)", hint: "CloudTrail, GuardDuty, VPC Flow, Config" },
  { id: "AZURE", label: "azure", dot: "var(--sky)", ink: "var(--sky-ink)", hint: "Entra ID, Activity Log, Defender, Sentinel" },
  { id: "GCP", label: "gcp", dot: "var(--yellow)", ink: "var(--yellow-ink)", hint: "Cloud Audit, SCC, Cloud Armor, GKE" },
  { id: "FIX", label: "patch", dot: "var(--text-muted)", ink: "var(--text-secondary)", hint: "Patches and retests" },
];

interface Line {
  /** Source name shown in the log, like a real collector would tag it. */
  tag: string;
  msg: string;
}

// Everything here is made up. IPs are RFC 5737 documentation ranges, hosts and users are
// fictional, and 123456789012 is AWS's own example account ID. Tool names, rule IDs, region
// codes, and MITRE ATT&CK IDs are real, so the shapes match what analysts actually read.
const POOL: Record<Source, Line[]> = {
  ATTACK: [
    { tag: "nginx", msg: '203.0.113.42 "POST /api/v2/login" 403 sqlmap/1.7.2' },
    { tag: "nginx", msg: '192.0.2.88 "GET /download?f=../../etc/passwd" 400 curl/8.4.0' },
    { tag: "nginx", msg: '198.51.100.23 "GET /.git/config" 404 gobuster/3.6' },
    { tag: "nginx", msg: '203.0.113.77 "GET /wp-login.php" 404 Nikto/2.5.0' },
    { tag: "nginx", msg: '192.0.2.141 "POST /api/auth" 429 python-requests/2.31.0' },
    { tag: "nginx", msg: '198.51.100.9 "GET /actuator/env" 403 Nuclei/3.1.0' },
    { tag: "nginx", msg: '192.0.2.61 "GET /api/orders" 401 jwt alg=none rejected' },
    { tag: "modsec", msg: "[id 942100] SQLi libinjection ARGS:email 203.0.113.42 -> BLOCK" },
    { tag: "modsec", msg: "[id 941100] XSS libinjection ARGS:q 192.0.2.15 -> BLOCK" },
    { tag: "modsec", msg: "[id 930120] OS file access ARGS:f 192.0.2.88 -> BLOCK" },
    { tag: "modsec", msg: "[id 931130] SSRF url=169.254.169.254 from 203.0.113.33 -> BLOCK" },
    { tag: "sshd", msg: "Failed password for invalid user oracle from 198.51.100.7 port 51522" },
    { tag: "sshd", msg: "Failed password for root from 203.0.113.19 port 40122 ssh2" },
  ],
  SIEM: [
    { tag: "wazuh", msg: 'rule=5710 lvl=5 agent=web-03 sshd: non-existent user "oracle"' },
    { tag: "wazuh", msg: "rule=100002 lvl=12 agent=win-fin-04 encoded PowerShell T1059.001" },
    { tag: "wazuh", msg: "rule=550 lvl=7 agent=web-03 FIM: /etc/passwd modified" },
    { tag: "wazuh", msg: "rule=31151 lvl=10 agent=lb-01 multiple 400s from 203.0.113.42" },
    { tag: "suricata", msg: "ET SCAN Potential SSH Scan sid=2001219 198.51.100.7 -> 10.0.0.12:22" },
    { tag: "suricata", msg: "ET INFO DNS query to .top TLD sid=2027758 src=10.0.4.21" },
    { tag: "pfsense", msg: "filterlog block in em0 tcp 198.51.100.7:51522 > 10.0.0.12:3389" },
    { tag: "pfsense", msg: "filterlog block in em0 udp 203.0.113.60:5353 > 10.0.0.1:161" },
    { tag: "elastic", msg: 'rule="Multiple Logon Failure Then Success" host=win-fin-04 user=svc-backup' },
    { tag: "elastic", msg: 'rule="Impossible Travel" user=dev.kai geo=ID>NL sev=high' },
    { tag: "sysmon", msg: "eid=10 lsass.exe accessed by unsigned proc host=win-hr-02 T1003.001" },
    { tag: "auditd", msg: 'type=EXECVE comm=nc args="-e /bin/sh" auid=1002 host=lab-11' },
  ],
  AWS: [
    { tag: "cloudtrail", msg: "ap-southeast-3 ConsoleLogin user=audit-ro mfa=false src=203.0.113.24" },
    { tag: "cloudtrail", msg: "ap-south-1 sts:AssumeRole AccessDenied role=dev-sandbox src=198.51.100.14" },
    { tag: "cloudtrail", msg: "ap-southeast-1 s3:PutBucketAcl bucket=logs-demo acl=public-read" },
    { tag: "cloudtrail", msg: "us-east-1 iam:CreateAccessKey user=ci-deploy acct=123456789012" },
    { tag: "cloudtrail", msg: "eu-west-1 ec2:AuthorizeSecurityGroupIngress sg=sg-0demo 0.0.0.0/0:22" },
    { tag: "cloudtrail", msg: "ap-southeast-3 kms:DisableKeyRotation key=prod-data AccessDenied" },
    { tag: "guardduty", msg: "ap-southeast-3 UnauthorizedAccess:EC2/SSHBruteForce i-0abc123def sev=2" },
    { tag: "guardduty", msg: "ap-south-1 Recon:EC2/PortProbeUnprotectedPort i-0def456abc sev=2" },
    { tag: "guardduty", msg: "ap-southeast-1 CryptoCurrency:EC2/BitcoinTool.B!DNS i-0a1b2c3d sev=8" },
    { tag: "vpcflow", msg: "ap-southeast-3 eni-0a1b2c 10.0.3.14:49152 > 203.0.113.9:22 REJECT tcp" },
    { tag: "awsconfig", msg: "ap-southeast-1 s3-bucket-public-read-prohibited NON_COMPLIANT logs-demo" },
    { tag: "securityhub", msg: "ap-south-1 3 new MEDIUM findings acct=123456789012" },
    { tag: "aws-waf", msg: "ap-southeast-3 rule=AWSManagedRulesSQLiRuleSet action=BLOCK 203.0.113.42" },
    { tag: "lambda", msg: "ap-southeast-3 auth-handler errors=4.2% p99=1840ms alarm=ALARM" },
    { tag: "inspector", msg: "ap-southeast-1 CVE-2021-44228 log4j-core 2.14.1 i-0fa12 sev=CRITICAL" },
  ],
  AZURE: [
    { tag: "entra", msg: "SigninLogs dev.kai@contoso.com errorCode=50126 ip=198.51.100.7 app=Azure Portal" },
    { tag: "entra", msg: "SigninLogs audit-ro@contoso.com errorCode=50074 MFA required ip=203.0.113.24" },
    { tag: "entra", msg: "SigninLogs r.admin@contoso.com errorCode=53003 CA blocked ip=192.0.2.77" },
    { tag: "activity", msg: "southeastasia roleAssignments/write caller=ci-deploy role=Owner Succeeded" },
    { tag: "activity", msg: "centralindia storageAccounts/write allowBlobPublicAccess=true rg=rg-demo" },
    { tag: "defender", msg: "Suspected brute-force attack on vm-web-01 sev=High southeastasia" },
    { tag: "defender", msg: "Anonymous scan of storage account stdemo01 sev=Medium eastasia" },
    { tag: "sentinel", msg: 'rule="Multiple failed logins then success" entity=svc-backup sev=Medium' },
    { tag: "sentinel", msg: "incident #1042 opened sev=High MITRE=T1110 entity=vm-web-01" },
    { tag: "nsgflow", msg: "southeastasia nsg-web rule=DenyAllInBound 198.51.100.7:51522 > 10.1.0.4:3389 deny" },
    { tag: "keyvault", msg: "kv-prod-demo SecretGet Forbidden caller=app-func ip=203.0.113.18" },
    { tag: "azpolicy", msg: 'westeurope "Storage accounts should disable public access" NonCompliant' },
    { tag: "appgw-waf", msg: "ruleId=942130 anomalyScore=15 action=Blocked client=203.0.113.42" },
  ],
  GCP: [
    { tag: "cloudaudit", msg: "asia-southeast2 SetIamPolicy ci-deploy@demo-prod.iam role=roles/owner" },
    { tag: "cloudaudit", msg: "storage.objects.get PERMISSION_DENIED principal=allUsers bucket=logs-demo" },
    { tag: "cloudaudit", msg: "iam.serviceAccounts.keys.create sa=ci-deploy@demo-prod.iam status=OK" },
    { tag: "scc", msg: "OPEN_FIREWALL sev=HIGH 0.0.0.0/0:22 project=demo-prod asia-southeast2" },
    { tag: "scc", msg: "PUBLIC_BUCKET_ACL sev=HIGH bucket=logs-demo asia-southeast1" },
    { tag: "scc", msg: "MFA_NOT_ENFORCED sev=MEDIUM org=demo-org user=r.admin" },
    { tag: "gcp-fw", msg: "asia-southeast2 deny-ssh 198.51.100.7 -> 10.2.0.7:22 DENIED" },
    { tag: "gcp-fw", msg: "asia-south1 deny-rdp 203.0.113.60 -> 10.3.0.4:3389 DENIED" },
    { tag: "cloudarmor", msg: "policy=waf-edge rule=owasp-crs-v030301-id942100-sqli deny(403) 203.0.113.42" },
    { tag: "cloudarmor", msg: "policy=waf-edge rate-limit action=throttle 192.0.2.141 429" },
    { tag: "gke-audit", msg: "pods/exec create user=dev.kai ns=prod forbidden by RBAC" },
    { tag: "cloudrun", msg: "auth-api 5xx=3.8% latency_p99=1.7s alert=firing asia-southeast2" },
  ],
  FIX: [
    { tag: "patch", msg: "web-03 openssl 3.0.13 -> 3.0.15 restart=ok" },
    { tag: "retest", msg: "IDOR /invoice/{id} not-reproducible build=2026.11.3" },
    { tag: "waf", msg: "rule 942100 tuned fp=-62% ticket=SEC-214" },
    { tag: "iam", msg: "audit-ro mfa=enforced ticket=SEC-219 closed" },
    { tag: "s3", msg: "logs-demo block-public-access=on region=ap-southeast-1" },
    { tag: "nginx", msg: "limit_req zone=login rate=10r/m burst=5 reloaded" },
    { tag: "secrets", msg: "ci-deploy key rotated, old key revoked, deploy green" },
    { tag: "azpolicy", msg: "deny public blob access enforced on rg-demo tenant-wide" },
    { tag: "orgpolicy", msg: "iam.disableServiceAccountKeyCreation enforced org=demo-org" },
  ],
};

interface Entry {
  id: number;
  time: string;
  src: Source;
  tag: string;
  msg: string;
}

const VISIBLE = 9;
const keyOf = (l: Line) => `${l.tag}|${l.msg}`;

// Fixed order so server HTML and the first client render match exactly.
const SEED_PICKS: [Source, number][] = [
  ["SIEM", 4],
  ["ATTACK", 0],
  ["AWS", 6],
  ["AZURE", 0],
  ["GCP", 3],
  ["ATTACK", 7],
  ["SIEM", 0],
  ["AWS", 9],
  ["FIX", 1],
];

const fmt = (d: Date) => d.toLocaleTimeString("en-GB", { hour12: false });

const SEED: Entry[] = SEED_PICKS.map(([src, i], n) => ({
  id: n,
  time: `21:41:${String(10 + n * 2).padStart(2, "0")}`,
  src,
  ...POOL[src][i],
}));

const rand = (n: number) => Math.floor(Math.random() * n);

// Highlighting: key= prefixes dim, IPs bright, HTTP errors and block verdicts pink,
// good outcomes sky.
const TOKEN =
  /(\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b|(?<=" )\d{3}(?= )|\b[A-Za-z_][\w.-]*=|\b(?:BLOCK|blocked|block|REJECT|AccessDenied|NON_COMPLIANT|NonCompliant|CRITICAL|ALARM|rejected|denied|DENIED|deny|Failed|Forbidden|forbidden|PERMISSION_DENIED|OPEN_FIREWALL|PUBLIC_BUCKET_ACL|MFA_NOT_ENFORCED|High|HIGH|firing)\b|\b(?:not-reproducible|enforced|rotated|revoked|approved|collected|tuned|reloaded|closed|signed|green)\b)/gi;
const BAD = /^(?:BLOCK|blocked|block|REJECT|AccessDenied|NON_COMPLIANT|NonCompliant|CRITICAL|ALARM|rejected|denied|DENIED|deny|Failed|Forbidden|forbidden|PERMISSION_DENIED|OPEN_FIREWALL|PUBLIC_BUCKET_ACL|MFA_NOT_ENFORCED|High|HIGH|firing)$/i;
const GOOD = /^(?:not-reproducible|enforced|rotated|revoked|approved|collected|tuned|reloaded|closed|signed|green)$/i;

function renderMsg(msg: string) {
  return msg.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (/^[A-Za-z_][\w.-]*=$/.test(part)) return <span key={i} className="text-[var(--text-muted)]">{part}</span>;
    if (/^\d{3}$/.test(part)) {
      const bad = part.startsWith("4") || part.startsWith("5");
      return <span key={i} style={{ color: bad ? "var(--pink-ink)" : "var(--sky-ink)" }}>{part}</span>;
    }
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
    AZURE: true,
    GCP: true,
    FIX: true,
  });
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const nextId = useRef(SEED.length);
  const visible = useRef(true);
  const hovering = useRef(false);
  const enabledRef = useRef(enabled);
  const rootRef = useRef<HTMLElement>(null);
  const shown = useRef<string[]>(SEED.map(keyOf));

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
          // Everything except patch notes is noisy, like a real pipeline.
          const weighted = on.flatMap((id) => (id === "FIX" ? [id] : [id, id]));
          const src = weighted[rand(weighted.length)];
          const onScreen = new Set(shown.current);
          const fresh = POOL[src].filter((l) => !onScreen.has(keyOf(l)));
          const choices = fresh.length > 0 ? fresh : POOL[src];
          const line = choices[rand(choices.length)];
          const entry: Entry = { id: nextId.current++, time: fmt(new Date()), src, ...line };
          setEntries((prev) => {
            const next = [...prev, entry].slice(-VISIBLE);
            shown.current = next.map(keyOf);
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
            {paused ? "paused" : "tail -f /var/log/*"}
          </span>
          <div className="flex flex-wrap items-center gap-x-0.5 gap-y-0" role="group" aria-label="Log sources">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={enabled[s.id]}
                title={s.hint}
                onClick={() => toggle(s.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 font-mono transition-opacity hover:bg-[var(--hover-bg)] focus-visible:outline-2 ${
                  enabled[s.id] ? "text-[var(--text-secondary)]" : "opacity-40"
                }`}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                {s.label}
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
                    <span className="hidden shrink-0 tabular-nums text-[var(--text-faint)] sm:inline">{e.time}</span>
                    <span className="w-[72px] shrink-0 truncate font-medium sm:w-[78px]" style={{ color: m.ink }}>
                      {e.tag}
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
        Sample logs, all made up: documentation IPs, fictional hosts, tenants, and projects, plus AWS&rsquo;s example
        account ID. Hover to pause, tap a source to mute it.
      </figcaption>
    </figure>
  );
}
