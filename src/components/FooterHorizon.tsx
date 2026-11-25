"use client";

import { useEffect, useRef } from "react";

const WORDMARK = "satorukikyy";

// Classic 4x4 Bayer ordered-dithering matrix normalized to [0, 1)
const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

interface Palette {
  bg: [number, number, number];
  dim: [number, number, number];
  mid: [number, number, number];
  bright: [number, number, number];
  /** [purple, pink, sky, yellow], same roles as the CSS tokens in globals.css. */
  accents: [number, number, number][];
}

// Accent colors mirror the site palette tokens (--purple, --pink, --sky, --yellow).
function getPalette(): Palette {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    return {
      bg: [28, 28, 28],
      dim: [56, 58, 70],
      mid: [110, 114, 134],
      bright: [176, 180, 202],
      accents: [
        [167, 139, 250],
        [244, 114, 182],
        [125, 211, 252],
        [253, 224, 71],
      ],
    };
  }
  return {
    bg: [252, 252, 252],
    dim: [216, 218, 224],
    mid: [142, 146, 158],
    bright: [66, 68, 78],
    accents: [
      [124, 58, 237],
      [236, 72, 153],
      [56, 189, 248],
      [234, 179, 8],
    ],
  };
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * Footer artwork: a night-time dev room drawn on a tiny canvas and pushed through
 * an ordered-dither pass. Scene buffer convention (see the dither step at the bottom):
 *   red channel   = luminance (0 = page background, 255 = brightest ink)
 *   green channel = accent mask (>= ~145 paints an accent color)
 *   blue / green   = which accent: 0 purple, 1/3 pink, 2/3 sky, 1 yellow
 *                    (a ratio, so anti-aliased edges keep their color)
 * Purely decorative, so the wrapper is aria-hidden.
 */
export function FooterHorizon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const sceneCanvas = document.createElement("canvas");
    const sceneCtx = sceneCanvas.getContext("2d", { willReadFrequently: true });
    if (!sceneCtx) return;
    const c = sceneCtx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let palette = getPalette();
    let cssWidth = 0;
    let cssHeight = 0;
    let gridW = 0;
    let gridH = 0;
    let outImageData: ImageData | null = null;
    let fontFamily = "Menlo, monospace";

    let rafId = 0;
    let isVisible = true;
    const startTime = performance.now();
    let pointerX = -1;
    let pointerY = -1;
    let pointerStrength = 0;

    const resolveFont = () => {
      const display = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bricolage")
        .trim();
      const body = getComputedStyle(document.body).fontFamily;
      fontFamily = display ? `${display}, ${body}` : body || fontFamily;
      // Canvas text does not trigger a webfont load on its own.
      document.fonts?.load(`700 40px ${fontFamily}`).catch(() => {});
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cssWidth = Math.max(300, Math.floor(rect.width));
      cssHeight = Math.max(210, Math.floor(rect.height));

      // Finer dot pitch on narrow screens so small props stay readable.
      const isCompact = cssWidth < 640;
      const cell = isCompact ? 1.25 : 1.75;

      gridW = Math.min(680, Math.max(280, Math.floor(cssWidth / cell)));
      gridH = Math.min(240, Math.max(150, Math.floor(cssHeight / cell)));

      canvas.width = gridW;
      canvas.height = gridH;
      sceneCanvas.width = gridW;
      sceneCanvas.height = gridH;
      outImageData = ctx.createImageData(gridW, gridH);
    };

    const drawScene = (t: number) => {
      if (!gridW || !gridH || !outImageData) return;

      const w = gridW;
      const h = gridH;
      const compact = cssWidth < 640;

      // Luminance fill, and accent fill (green >= ~145 reads as accent after dithering).
      const L = (v: number) => `rgb(${Math.round(v)}, 0, 0)`;
      const A = (g = 205, kind = 0) =>
        `rgb(255, ${Math.round(g)}, ${Math.round((g * (((kind % 4) + 4) % 4)) / 3)})`;
      const box = (x: number, y: number, bw: number, bh: number, fill: string) => {
        c.fillStyle = fill;
        c.fillRect(
          Math.round(x),
          Math.round(y),
          Math.max(1, Math.round(bw)),
          Math.max(1, Math.round(bh))
        );
      };
      const frame = (x: number, y: number, bw: number, bh: number, fill: string) => {
        box(x, y, bw, 1, fill);
        box(x, y + bh - 1, bw, 1, fill);
        box(x, y, 1, bh, fill);
        box(x + bw - 1, y, 1, bh, fill);
      };
      const Y = (f: number) => Math.round(f * h);

      // One uniform scale keeps the whole desk a tight cluster with sane proportions.
      // Designed at ~410 grid-px of desk width; never wider than ~60% of the canvas.
      const s = Math.min(0.92, w / 480, h / 200);
      const S = (n: number) => Math.max(1, Math.round(n * s));
      const cx = Math.round(w / 2);
      const XC = (n: number) => Math.round(cx + n * s);

      const floorY = Math.round(h * 0.965);
      const deskY = floorY - S(36);
      const deskThick = S(7);

      c.globalCompositeOperation = "source-over";
      c.fillStyle = "#000000";
      c.fillRect(0, 0, w, h);

      // ------------------------------------------------------------------
      // 1. Room shell: wall lit around the desk, fading to the page background
      // ------------------------------------------------------------------
      const glow = c.createRadialGradient(cx, deskY - S(40), 0, cx, deskY - S(40), S(300));
      glow.addColorStop(0, "rgb(50, 0, 0)");
      glow.addColorStop(0.65, "rgb(26, 0, 0)");
      glow.addColorStop(1, "rgb(0, 0, 0)");
      c.fillStyle = glow;
      c.fillRect(0, 0, w, floorY);

      const floorGrad = c.createLinearGradient(cx - S(290), 0, cx + S(290), 0);
      floorGrad.addColorStop(0, "rgb(0, 0, 0)");
      floorGrad.addColorStop(0.5, "rgb(70, 0, 0)");
      floorGrad.addColorStop(1, "rgb(0, 0, 0)");
      c.fillStyle = floorGrad;
      c.fillRect(0, floorY, w, 1);
      const floorFill = c.createLinearGradient(cx - S(290), 0, cx + S(290), 0);
      floorFill.addColorStop(0, "rgb(0, 0, 0)");
      floorFill.addColorStop(0.5, "rgb(18, 0, 0)");
      floorFill.addColorStop(1, "rgb(0, 0, 0)");
      c.fillStyle = floorFill;
      c.fillRect(0, floorY + 1, w, h - floorY);

      // ------------------------------------------------------------------
      // 2. Fairy lights over the desk (twinkling accent bulbs)
      // ------------------------------------------------------------------
      const bulbs = compact ? 10 : 18;
      const lightsL = Math.max(4, cx - S(235));
      const lightsW = Math.min(w - 8, S(470));
      const bulbAt = (i: number) => {
        const u = i / (bulbs - 1);
        return { x: lightsL + u * lightsW, y: h * 0.02 + Math.sin(Math.PI * u) * h * 0.045 };
      };
      c.strokeStyle = L(58);
      c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i < bulbs; i++) {
        const p = bulbAt(i);
        if (i === 0) c.moveTo(p.x, p.y);
        else c.lineTo(p.x, p.y);
      }
      c.stroke();
      for (let i = 0; i < bulbs; i++) {
        const p = bulbAt(i);
        const on = Math.sin(t * 2.2 + i * 1.9) > -0.3;
        box(p.x, p.y + 1, 2, 2, on ? A(215, i) : L(95));
      }

      // ------------------------------------------------------------------
      // 3. Window above the laptop: moon, stars, an occasional shooting star
      // ------------------------------------------------------------------
      const lapW = S(56);
      const lapH = S(34);
      const lapX = XC(-186);
      if (!compact) {
        const ww = S(48);
        const wh = S(32);
        const wx = lapX + Math.round((lapW - ww) / 2);
        const wy = deskY - 2 - lapH - S(9) - wh;
        box(wx, wy, ww, wh, L(8));
        for (let st = 0; st < 6; st++) {
          if (Math.sin(t * 1.4 + st * 2.3) > -0.2) {
            box(wx + 2 + hash(st + 11) * (ww - 5), wy + 2 + hash(st + 31) * (wh * 0.55), 1, 1, L(210));
          }
        }
        const mx = wx + ww * 0.68;
        const my = wy + wh * 0.32;
        c.fillStyle = L(240);
        c.beginPath();
        c.arc(mx, my, Math.max(3, S(4.2)), 0, Math.PI * 2);
        c.fill();
        c.fillStyle = L(8);
        c.beginPath();
        c.arc(mx + S(2.2), my - 1, Math.max(2.5, S(3.5)), 0, Math.PI * 2);
        c.fill();
        const shoot = (t % 9) / 1.3;
        if (shoot < 1) {
          const sx = wx + ww * (0.95 - shoot * 0.75);
          const sy = wy + wh * (0.06 + shoot * 0.4);
          box(sx, sy, 3, 1, A(210, 3));
          box(sx + 3, sy - 1, 2, 1, L(120));
        }
        frame(wx - 1, wy - 1, ww + 2, wh + 2, L(150));
        box(wx + ww / 2, wy, 1, wh, L(120));
        box(wx, wy + wh * 0.55, ww, 1, L(120));
        box(wx - 2, wy + wh + 1, ww + 4, 2, L(140));
      }

      // ------------------------------------------------------------------
      // 4. Desk lamp light cone (drawn before the wordmark so text stays crisp)
      // ------------------------------------------------------------------
      const lampX = XC(132);
      const lampHeadY = deskY - S(82);
      const lampHeadX = lampX - S(15);
      const flicker = 0.55 + 0.08 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 2.1);
      const cone = c.createLinearGradient(0, lampHeadY, 0, deskY);
      cone.addColorStop(0, `rgba(120, 0, 0, ${(0.5 * flicker).toFixed(3)})`);
      cone.addColorStop(1, "rgba(120, 0, 0, 0)");
      c.globalCompositeOperation = "lighter";
      c.fillStyle = cone;
      c.beginPath();
      c.moveTo(lampHeadX - 4, lampHeadY + 4);
      c.lineTo(lampHeadX + 5, lampHeadY + 4);
      c.lineTo(lampHeadX + S(26), deskY);
      c.lineTo(lampHeadX - S(26), deskY);
      c.closePath();
      c.fill();
      c.globalCompositeOperation = "source-over";

      // ------------------------------------------------------------------
      // 5. Wordmark: "satorukikyy" with a travelling shimmer and a rare glitch
      // ------------------------------------------------------------------
      const fs = Math.floor(w * (compact ? 0.13 : 0.1));
      c.font = `700 ${fs}px ${fontFamily}`;
      c.textBaseline = "alphabetic";
      c.textAlign = "left";
      const widths = Array.from(WORDMARK, (ch) => c.measureText(ch).width);
      const total = widths.reduce((a, b) => a + b, 0);
      const baseY = Y(compact ? 0.31 : 0.33);
      const xs: number[] = [];
      let cursor = (w - total) / 2;
      for (const cw of widths) {
        xs.push(cursor);
        cursor += cw;
      }

      c.lineJoin = "round";
      c.lineWidth = Math.max(3, Math.floor(fs * 0.14));
      c.strokeStyle = "rgba(0, 0, 0, 0.6)";
      for (let i = 0; i < WORDMARK.length; i++) {
        c.strokeText(WORDMARK[i], xs[i], baseY);
      }
      for (let i = 0; i < WORDMARK.length; i++) {
        const wave = Math.max(0, Math.sin(t * 1.5 - i * 0.55));
        c.fillStyle = L(150 + 100 * wave);
        c.fillText(WORDMARK[i], xs[i], baseY);
      }
      const glitchPhase = t % 5.5;
      if (glitchPhase < 0.22) {
        const gi = Math.floor(t / 5.5) % WORDMARK.length;
        const jitter = glitchPhase < 0.11 ? 1 : -1;
        c.fillStyle = A(215, 2);
        c.fillText(WORDMARK[gi], xs[gi] - 2 * jitter, baseY);
        c.fillStyle = A(215, 1);
        c.fillText(WORDMARK[gi], xs[gi] + jitter, baseY);
      }

      // ------------------------------------------------------------------
      // 6. Desk surface and legs
      // ------------------------------------------------------------------
      const deskL = XC(-205);
      const deskW = S(410);
      box(deskL, deskY, deskW, deskThick, L(88));
      box(deskL, deskY, deskW, 1, L(135));
      box(deskL, deskY + deskThick, deskW, 2, L(150));
      box(XC(-195), deskY + deskThick + 2, 2, floorY - deskY - deskThick - 2, L(92));
      box(XC(193), deskY + deskThick + 2, 2, floorY - deskY - deskThick - 2, L(92));

      // ------------------------------------------------------------------
      // 7. Monitors: three 16:9-ish screens on a shared baseline
      // ------------------------------------------------------------------
      const neck = S(7);
      const monitor = (
        x: number,
        mw: number,
        mh: number,
        paint: (sx: number, sy: number, sw: number, sh: number) => void
      ) => {
        const y = deskY - neck - mh;
        box(x, y, mw, mh, L(150));
        box(x + 1, y + 1, mw - 2, mh - 2, L(10));
        paint(x + 2, y + 2, mw - 4, mh - 4);
        const mcx = x + mw / 2;
        box(mcx - 1, y + mh, 2, neck, L(120));
        const baseW = Math.max(8, mw * 0.4);
        box(mcx - baseW / 2, deskY - 1, baseW, 2, L(140));
      };

      // Center: terminal where "FOUND" lines scroll in pink
      monitor(XC(-46), S(92), S(54), (sx, sy, sw, sh) => {
        const rowH = 4;
        const rows = Math.floor(sh / rowH);
        const scroll = t * 1.6;
        const base = Math.floor(scroll);
        const frac = scroll - base;
        for (let i = 0; i <= rows; i++) {
          const idx = base - i;
          const ly = sy + sh - (i + 1) * rowH - frac * rowH + 2;
          if (ly < sy || ly > sy + sh - 3) continue;
          const len = (0.25 + hash(idx * 3.1) * 0.7) * (sw - 6);
          const indent = hash(idx * 7.7) > 0.6 ? 3 : 0;
          const found = hash(idx * 5.3) > 0.84;
          box(sx + 2 + indent, ly, len - indent, 1, found ? A(200, 1) : L(105 + hash(idx) * 45));
        }
        box(sx + 1, sy + sh - 2, 1, 1, L(200));
        if (Math.floor(t * 2) % 2 === 0) box(sx + 3, sy + sh - 3, 2, 2, A(215, 0));
      });

      // Left: live traffic bars
      monitor(XC(-116), S(66), S(42), (sx, sy, sw, sh) => {
        const n = 6;
        const step = (sw - 2) / n;
        for (let b = 0; b < n; b++) {
          const bh = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 2.1 + b * 1.3))) * (sh - 3);
          box(sx + 1 + b * step, sy + sh - 1 - bh, Math.max(1, step - 1), bh, b === n - 1 ? A(205, 2) : L(150));
        }
      });

      // Right: radar sweep
      monitor(XC(50), S(66), S(42), (sx, sy, sw, sh) => {
        const rcx = sx + sw / 2;
        const rcy = sy + sh / 2;
        const rr = Math.min(sw, sh) / 2 - 1;
        c.strokeStyle = L(110);
        c.lineWidth = 1;
        c.beginPath();
        c.arc(rcx, rcy, rr, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.arc(rcx, rcy, rr * 0.5, 0, Math.PI * 2);
        c.stroke();
        const ang = t * 1.8;
        c.strokeStyle = A(210, 0);
        c.beginPath();
        c.moveTo(rcx, rcy);
        c.lineTo(rcx + Math.cos(ang) * rr, rcy + Math.sin(ang) * rr);
        c.stroke();
        for (let b = 0; b < 3; b++) {
          const ba = hash(b + 41) * Math.PI * 2;
          const br = (0.3 + hash(b + 77) * 0.6) * rr;
          const since = (((ang - ba) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (since < 2.2) {
            box(rcx + Math.cos(ba) * br, rcy + Math.sin(ba) * br, 2, 2, A(215, 1));
          }
        }
      });

      // Laptop with a slow code scroll
      if (!compact) {
        box(lapX - 2, deskY - 2, lapW + 4, 2, L(140));
        const lt = deskY - 2 - lapH;
        box(lapX, lt, lapW, lapH, L(150));
        box(lapX + 1, lt + 1, lapW - 2, lapH - 2, L(10));
        const lRows = Math.floor((lapH - 4) / 3);
        const lScroll = t * 0.8;
        for (let r = 0; r < lRows; r++) {
          const idx = Math.floor(lScroll) + r;
          const ly = lt + 2 + r * 3 - (lScroll % 1) * 3;
          if (ly < lt + 2 || ly > deskY - 6) continue;
          box(
            lapX + 3 + (hash(idx * 2.3) > 0.5 ? 2 : 0),
            ly,
            (0.2 + hash(idx * 4.9) * 0.6) * (lapW - 8),
            1,
            hash(idx * 9.1) > 0.88 ? A(200, 2) : L(115)
          );
        }
      }

      // ------------------------------------------------------------------
      // 8. Keyboard with an RGB wave, mouse, and mouse pad (on the desk surface)
      // ------------------------------------------------------------------
      const kbW = S(68);
      const kbX = XC(-34);
      const kbH = Math.max(5, deskThick - 2);
      box(kbX, deskY + 1, kbW, kbH, L(60));
      frame(kbX, deskY + 1, kbW, kbH, L(130));
      const cols = Math.floor((kbW - 4) / 2);
      for (let r = 0; r < 2; r++) {
        for (let col = 0; col < cols; col++) {
          const on = Math.sin(t * 3.2 - col * 0.55 + r * 0.7) > 0.55;
          box(kbX + 2 + col * 2, deskY + 2 + r * 2, 1, 1, on ? A(210, col + Math.floor(t * 2.5)) : L(150));
        }
      }
      const padX = XC(42);
      box(padX, deskY + 1, S(24), kbH, L(52));
      box(padX + S(8), deskY + 2, Math.max(3, S(6)), kbH - 2, L(130));
      box(padX + S(8) + 1, deskY + 2, 1, 1, A(210, 0));

      // ------------------------------------------------------------------
      // 9. Desk accessories: lamp, headphones, mug + steam, plant
      // ------------------------------------------------------------------
      box(lampX - 3, deskY - 1, 7, 2, L(140));
      c.strokeStyle = L(150);
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(lampX, deskY - 1);
      c.lineTo(lampX + 1, lampHeadY + 4);
      c.lineTo(lampHeadX + 3, lampHeadY + 2);
      c.stroke();
      box(lampHeadX - 4, lampHeadY, 10, 4, L(190));
      box(lampHeadX - 2, lampHeadY + 4, 6, 1, A(215, 3));

      // Mug with steam
      const mugX = XC(176);
      const mugS = Math.max(5, S(7));
      box(mugX, deskY - mugS, mugS, mugS, L(190));
      box(mugX + 1, deskY - mugS, mugS - 2, 1, L(60));
      box(mugX + mugS, deskY - mugS + 1, 2, 1, L(160));
      box(mugX + mugS + 1, deskY - mugS + 2, 1, 2, L(160));
      box(mugX + mugS, deskY - mugS + 4, 2, 1, L(160));
      for (let st = 0; st < 3; st++) {
        const p = (t * 0.55 + st / 3) % 1;
        const sx = mugX + 2 + st + Math.sin(t * 2.6 + st * 2) * 1.6;
        box(sx, deskY - mugS - 2 - p * S(14), 1, 2, L(170 * (1 - p)));
      }

      if (!compact) {
        // Headphones on a stand
        const hx = XC(154);
        const hTop = deskY - S(36);
        box(hx, hTop + 8, 1, deskY - hTop - 8, L(120));
        box(hx - 3, deskY - 1, 7, 1, L(130));
        c.strokeStyle = L(185);
        c.lineWidth = 2;
        c.beginPath();
        c.arc(hx + 0.5, hTop + 8, S(8), Math.PI, 0);
        c.stroke();
        box(hx - S(8) - 1, hTop + 7, 3, 7, L(200));
        box(hx + S(8) - 1, hTop + 7, 3, 7, L(200));
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
        box(hx + S(8), hTop + 9, 1, 2, pulse > 0.4 ? A(215, 2) : L(110));

        // Plant swaying slightly
        const px = XC(192);
        box(px, deskY - 6, 7, 6, L(130));
        c.strokeStyle = L(175);
        c.lineWidth = 1.5;
        for (let l = 0; l < 4; l++) {
          const sway = Math.sin(t * 1.2 + l * 1.4) * 1.4;
          const dx = (l - 1.5) * 3;
          c.beginPath();
          c.moveTo(px + 3.5, deskY - 6);
          c.lineTo(px + 3.5 + dx + sway, deskY - 6 - (9 + (l % 2) * 4));
          c.stroke();
        }
      }

      // ------------------------------------------------------------------
      // 10. Under the desk: PC with spinning fan, router stack, network cable
      // ------------------------------------------------------------------
      const towerW = S(58);
      const towerH = S(26);
      const towerX = XC(118);
      const towerY = floorY - towerH;
      box(towerX, towerY, towerW, towerH, L(55));
      frame(towerX, towerY, towerW, towerH, L(150));
      const fcx = towerX + towerW * 0.5;
      const fcy = towerY + towerH * 0.45;
      const fr = Math.min(towerH * 0.32, towerW * 0.3);
      c.strokeStyle = L(165);
      c.lineWidth = 1;
      c.beginPath();
      c.arc(fcx, fcy, fr, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = L(210);
      for (let b = 0; b < 3; b++) {
        const a = t * 5 + (b * Math.PI * 2) / 3;
        c.beginPath();
        c.moveTo(fcx, fcy);
        c.lineTo(fcx + Math.cos(a) * fr, fcy + Math.sin(a) * fr);
        c.stroke();
      }
      box(fcx - 1, fcy - 1, 2, 2, A(215, 0));
      for (let xi = 0; xi < towerW - 4; xi++) {
        const on = Math.sin(t * 3 - xi * 0.5) > 0.2;
        box(towerX + 2 + xi, towerY + towerH - 3, 1, 1, on ? A(205, Math.floor(xi / 6) + Math.floor(t * 2)) : L(70));
      }

      if (!compact) {
        const rx = XC(-170);
        const rw = S(56);
        const ruH = S(7);
        for (let u = 0; u < 3; u++) {
          const ry = floorY - (u + 1) * (ruH + 1);
          box(rx, ry, rw, ruH, L(72));
          frame(rx, ry, rw, ruH, L(140));
          for (let led = 0; led < 5; led++) {
            const on = Math.sin(t * 3.3 + u * 2.1 + led * 1.7) > 0.3;
            box(rx + 3 + led * 3, ry + 2, 1, 1, on ? A(205, led + u) : L(60));
          }
        }
        const cableY = floorY - 3;
        const c0 = rx + rw;
        const c1 = towerX;
        box(c0, cableY, c1 - c0, 1, L(80));
        for (let p = 0; p < 2; p++) {
          const px = c0 + ((t * 32 + p * ((c1 - c0) / 2)) % (c1 - c0));
          box(px, cableY - 1, 5, 2, A(210, 3));
        }
      }

      // ------------------------------------------------------------------
      // 11. Interactive cursor spotlight
      // ------------------------------------------------------------------
      if (pointerStrength > 0.01 && pointerX >= 0 && pointerY >= 0) {
        const gx = (pointerX / cssWidth) * w;
        const gy = (pointerY / cssHeight) * h;
        const spot = c.createRadialGradient(gx, gy, 2, gx, gy, 62);
        spot.addColorStop(0, `rgba(90, 0, 0, ${(0.4 * pointerStrength).toFixed(3)})`);
        spot.addColorStop(1, "rgba(0, 0, 0, 0)");
        c.globalCompositeOperation = "lighter";
        c.fillStyle = spot;
        c.fillRect(0, 0, w, h);
        c.globalCompositeOperation = "source-over";
      }

      // ------------------------------------------------------------------
      // 12. Ordered Bayer 4x4 dithering: luminance -> 4 ink steps, green -> accent
      // ------------------------------------------------------------------
      const src = c.getImageData(0, 0, w, h).data;
      const dst = outImageData.data;
      const levels: [number, number, number][] = [
        palette.bg,
        palette.dim,
        palette.mid,
        palette.bright,
      ];
      const accents = palette.accents;
      const edgeFadePx = Math.max(16, Math.floor(w * 0.065));

      for (let y = 0; y < h; y++) {
        const rowBayer = (y & 3) << 2;
        const topFade = y < 10 ? y / 10 : 1;
        const botFade = y > h - 5 ? (h - y) / 5 : 1;
        const vFade = topFade * botFade;

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) << 2;
          let hFade = 1;
          if (x < edgeFadePx) hFade = x / edgeFadePx;
          else if (x > w - edgeFadePx) hFade = (w - x) / edgeFadePx;

          const fade = vFade * hFade;
          const lum = (src[idx] / 255) * fade;
          const acc = (src[idx + 1] / 255) * fade;
          const threshold = BAYER_4X4[rowBayer + (x & 3)];

          if (acc > 0.56 && acc > threshold * 0.78) {
            const ratio = src[idx + 2] / Math.max(1, src[idx + 1]);
            const [accR, accG, accB] = accents[Math.min(3, Math.round(ratio * 3))];
            dst[idx] = accR;
            dst[idx + 1] = accG;
            dst[idx + 2] = accB;
            dst[idx + 3] = 255;
            continue;
          }

          const scaled = Math.max(0, Math.min(2.999, lum * 3.0));
          const base = Math.floor(scaled);
          const frac = scaled - base;
          const chosen = frac > threshold ? levels[base + 1] : levels[base];

          dst[idx] = chosen[0];
          dst[idx + 1] = chosen[1];
          dst[idx + 2] = chosen[2];
          dst[idx + 3] = 255;
        }
      }

      ctx.putImageData(outImageData, 0, 0);
    };

    const tick = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      const targetStrength = pointerX >= 0 ? 1 : 0;
      pointerStrength += (targetStrength - pointerStrength) * 0.1;

      drawScene((now - startTime) / 1000);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (reducedMotion) {
        drawScene(3.2);
        return;
      }
      if (!rafId && isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -1;
      pointerY = -1;
    };

    resolveFont();
    resize();
    startLoop();

    document.fonts?.ready.then(() => {
      resolveFont();
      if (reducedMotion) drawScene(3.2);
    });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawScene(3.2);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      palette = getPalette();
      if (reducedMotion) drawScene(3.2);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    container.addEventListener("mousemove", onPointerMove, { passive: true });
    container.addEventListener("mouseleave", onPointerLeave, { passive: true });

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mx-auto mt-6 h-[270px] w-full max-w-[1160px] select-none overflow-hidden sm:h-[300px] md:h-[340px]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
