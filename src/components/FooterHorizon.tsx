"use client";

import { useEffect, useRef } from "react";

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
  accent: [number, number, number];
}

interface BuildingSpec {
  nx: number; // normalized x (0..1)
  nw: number; // normalized width
  nh: number; // relative height (0..1, scaled to safe skyline band below wordmark)
  style: "tower" | "datacenter" | "stepped" | "spire";
  antenna?: boolean;
  seed: number;
}

// Formal, balanced architectural skyline:
// Taller corporate & telecom clusters frame the flanks; refined lower rhythm across center
// so "Rizky Aditya" stays crystal-clear on BOTH mobile and desktop.
const FOREGROUND_SKYLINE: BuildingSpec[] = [
  { nx: 0.015, nw: 0.044, nh: 0.56, style: "tower", seed: 1 },
  { nx: 0.062, nw: 0.05, nh: 0.86, style: "datacenter", antenna: true, seed: 2 },
  { nx: 0.115, nw: 0.04, nh: 0.68, style: "stepped", seed: 3 },
  { nx: 0.158, nw: 0.052, nh: 0.96, style: "spire", antenna: true, seed: 4 },
  { nx: 0.214, nw: 0.042, nh: 0.62, style: "tower", seed: 5 },
  { nx: 0.26, nw: 0.054, nh: 0.74, style: "datacenter", seed: 6 },
  { nx: 0.318, nw: 0.044, nh: 0.66, style: "stepped", seed: 7 },
  { nx: 0.366, nw: 0.046, nh: 0.54, style: "tower", seed: 8 },
  { nx: 0.416, nw: 0.05, nh: 0.62, style: "datacenter", seed: 9 },
  { nx: 0.47, nw: 0.06, nh: 0.72, style: "stepped", seed: 10 },
  { nx: 0.534, nw: 0.048, nh: 0.6, style: "tower", seed: 11 },
  { nx: 0.586, nw: 0.046, nh: 0.54, style: "datacenter", seed: 12 },
  { nx: 0.636, nw: 0.044, nh: 0.68, style: "stepped", seed: 13 },
  { nx: 0.684, nw: 0.052, nh: 0.76, style: "datacenter", seed: 14 },
  { nx: 0.74, nw: 0.044, nh: 0.64, style: "tower", seed: 15 },
  { nx: 0.788, nw: 0.054, nh: 0.94, style: "spire", antenna: true, seed: 16 },
  { nx: 0.846, nw: 0.042, nh: 0.7, style: "stepped", seed: 17 },
  { nx: 0.892, nw: 0.05, nh: 0.84, style: "datacenter", antenna: true, seed: 18 },
  { nx: 0.945, nw: 0.042, nh: 0.54, style: "tower", seed: 19 },
];

// Subtle background city silhouette for crisp architectural depth
const BACKGROUND_SKYLINE: { nx: number; nw: number; nh: number }[] = [
  { nx: 0.04, nw: 0.05, nh: 0.74 },
  { nx: 0.13, nw: 0.06, nh: 0.88 },
  { nx: 0.23, nw: 0.055, nh: 0.8 },
  { nx: 0.34, nw: 0.055, nh: 0.7 },
  { nx: 0.44, nw: 0.06, nh: 0.68 },
  { nx: 0.55, nw: 0.055, nh: 0.72 },
  { nx: 0.66, nw: 0.06, nh: 0.82 },
  { nx: 0.76, nw: 0.055, nh: 0.9 },
  { nx: 0.87, nw: 0.055, nh: 0.78 },
];

function getPalette(): Palette {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    return {
      bg: [28, 28, 28], // --bg #1c1c1c
      dim: [56, 58, 70], // subtle deep slate
      mid: [110, 114, 134], // classic halftone slate
      bright: [176, 180, 202], // sharp formal wordmark & roofline highlight
      accent: [232, 235, 248], // crisp telemetry & signal glint
    };
  }
  return {
    bg: [252, 252, 252], // --bg #fcfcfc
    dim: [216, 218, 224], // soft architectural mist
    mid: [142, 146, 158], // crisp mid halftone
    bright: [66, 68, 78], // formal charcoal wordmark & facade
    accent: [20, 20, 24], // razor-sharp dark ink accent
  };
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

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
      const computed = getComputedStyle(document.body).fontFamily;
      if (computed) fontFamily = computed;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cssWidth = Math.max(300, Math.floor(rect.width));
      cssHeight = Math.max(210, Math.floor(rect.height));

      // Higher density grid on mobile (finer dot pitch) so text, buildings & icons
      // stay razor-sharp and never turn chunky on narrow screens
      const isCompact = cssWidth < 640;
      const cell = isCompact ? 1.25 : 1.75;

      gridW = Math.min(680, Math.max(280, Math.floor(cssWidth / cell)));
      gridH = Math.min(220, Math.max(150, Math.floor(cssHeight / cell)));

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
      const isCompact = cssWidth < 640;

      // Clear offscreen luminance buffer:
      // Red channel = tonal luminance (0..255), Green channel = crisp accent sparks
      sceneCtx.globalCompositeOperation = "source-over";
      sceneCtx.fillStyle = "#000000";
      sceneCtx.fillRect(0, 0, w, h);

      // ------------------------------------------------------------------
      // Dedicated Layout Zones (mathematically prevents buildings from
      // ever covering "Rizky Aditya" on mobile OR desktop!)
      // ------------------------------------------------------------------
      const groundY = Math.floor(h * 0.87);
      // Max building band height: compact ~31% on mobile, ~36% on desktop
      const maxCityH = Math.floor(h * (isCompact ? 0.3 : 0.35));
      // Wordmark baseline sits cleanly above the center skyline roofline
      const textBaselineY = Math.floor(h * (isCompact ? 0.45 : 0.54));

      // ------------------------------------------------------------------
      // 1. Subtle Starfield / Telemetry Dots in Upper Sky
      // ------------------------------------------------------------------
      for (let i = 0; i < 38; i++) {
        const sx = hash(i + 5) * w;
        const sy = hash(i + 83) * h * 0.54;
        const phase = hash(i + 157) * Math.PI * 2;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.05 + phase);
        const lum = Math.floor((22 + pulse * 54) * (1 - sy / (h * 0.62)));
        sceneCtx.fillStyle = `rgb(${lum}, ${Math.floor(lum * 0.35)}, 0)`;
        sceneCtx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
      }

      // ------------------------------------------------------------------
      // 2. Refined Dithered Cyber-Planet Horizon + Tilted Orbital Ring
      // ------------------------------------------------------------------
      const planetCx = w * 0.5;
      const planetR = Math.min(w * 0.42, h * 1.12);
      const planetCy = h * 0.96 + planetR * 0.48;

      // Soft planetary atmospheric glow
      const haloGrad = sceneCtx.createRadialGradient(
        planetCx,
        planetCy,
        planetR * 0.94,
        planetCx,
        planetCy,
        planetR * 1.15
      );
      haloGrad.addColorStop(0, "rgb(82, 18, 0)");
      haloGrad.addColorStop(0.5, "rgb(36, 0, 0)");
      haloGrad.addColorStop(1, "rgb(0, 0, 0)");
      sceneCtx.fillStyle = haloGrad;
      sceneCtx.beginPath();
      sceneCtx.arc(planetCx, planetCy, planetR * 1.15, Math.PI, 0);
      sceneCtx.fill();

      // Planet curved body
      const globeGrad = sceneCtx.createRadialGradient(
        planetCx - planetR * 0.1,
        planetCy - planetR * 0.86,
        planetR * 0.08,
        planetCx,
        planetCy,
        planetR
      );
      globeGrad.addColorStop(0, "rgb(66, 6, 0)");
      globeGrad.addColorStop(0.6, "rgb(34, 0, 0)");
      globeGrad.addColorStop(1, "rgb(14, 0, 0)");
      sceneCtx.fillStyle = globeGrad;
      sceneCtx.beginPath();
      sceneCtx.arc(planetCx, planetCy, planetR, Math.PI, 0);
      sceneCtx.fill();

      // Clean latitude & rotating meridian grid on planet
      sceneCtx.save();
      sceneCtx.beginPath();
      sceneCtx.arc(planetCx, planetCy, planetR, Math.PI, 0);
      sceneCtx.clip();
      sceneCtx.strokeStyle = "rgba(104, 18, 0, 0.42)";
      sceneCtx.lineWidth = 1;
      for (let lat = 0.76; lat <= 0.94; lat += 0.06) {
        sceneCtx.beginPath();
        sceneCtx.arc(planetCx, planetCy, planetR * lat, Math.PI, 0);
        sceneCtx.stroke();
      }
      const rotShift = (t * 0.035) % 1;
      for (let m = -3; m <= 3; m++) {
        const offset = (m + rotShift) * 0.25;
        const rx = Math.max(5, Math.abs(offset) * planetR * 0.92);
        sceneCtx.beginPath();
        sceneCtx.ellipse(planetCx, planetCy, rx, planetR, 0, Math.PI, 0);
        sceneCtx.stroke();
      }
      sceneCtx.restore();

      // Crisp horizon limb arc
      sceneCtx.strokeStyle = "rgb(126, 36, 0)";
      sceneCtx.lineWidth = 1.25;
      sceneCtx.beginPath();
      sceneCtx.arc(planetCx, planetCy, planetR, Math.PI * 1.04, -Math.PI * 0.04);
      sceneCtx.stroke();

      // Tilted orbital ring + 2 satellites cleanly above wordmark
      const orbitCx = w * 0.5;
      const orbitCy = h * (isCompact ? 0.3 : 0.36);
      const orbitRx = w * 0.44;
      const orbitRy = h * 0.18;
      sceneCtx.save();
      sceneCtx.translate(orbitCx, orbitCy);
      sceneCtx.rotate(-0.075);
      sceneCtx.strokeStyle = "rgba(108, 22, 0, 0.52)";
      sceneCtx.lineWidth = 1;
      sceneCtx.setLineDash([3, 5]);
      sceneCtx.beginPath();
      sceneCtx.ellipse(0, 0, orbitRx, orbitRy, 0, Math.PI * 0.96, Math.PI * 2.04);
      sceneCtx.stroke();
      sceneCtx.setLineDash([]);

      for (let s = 0; s < 2; s++) {
        const angle =
          Math.PI + (((t * (0.12 + s * 0.045) + s * 0.52) % 1) * Math.PI);
        const sx = Math.cos(angle) * orbitRx;
        const sy = Math.sin(angle) * orbitRy;
        sceneCtx.fillStyle = "rgb(155, 68, 0)";
        sceneCtx.fillRect(Math.floor(sx - 4), Math.floor(sy), 9, 1);
        sceneCtx.fillStyle = "rgb(245, 235, 0)";
        sceneCtx.fillRect(Math.floor(sx - 1), Math.floor(sy - 1), 3, 3);
      }
      sceneCtx.restore();

      // ------------------------------------------------------------------
      // 3. Formal, Razor-Clear Wordmark: "Rizky Aditya"
      //    Guaranteed readable on mobile AND desktop!
      // ------------------------------------------------------------------
      const wordmark = "Rizky Aditya";
      let fontSize = Math.floor(w * (isCompact ? 0.118 : 0.115));
      sceneCtx.font = `700 ${fontSize}px ${fontFamily}`;
      const measured = sceneCtx.measureText(wordmark).width;
      const maxTextW = w * (isCompact ? 0.88 : 0.82);
      if (measured > maxTextW) {
        fontSize = Math.floor(fontSize * (maxTextW / measured));
        sceneCtx.font = `700 ${fontSize}px ${fontFamily}`;
      }

      // Subtle dark halo behind wordmark so letters separate sharply from planet lines
      sceneCtx.save();
      sceneCtx.textAlign = "center";
      sceneCtx.textBaseline = "alphabetic";
      sceneCtx.lineWidth = Math.max(3, Math.floor(fontSize * 0.14));
      sceneCtx.strokeStyle = "rgba(0, 0, 0, 0.55)";
      sceneCtx.lineJoin = "round";
      sceneCtx.strokeText(wordmark, w * 0.5, textBaselineY);

      const textGrad = sceneCtx.createLinearGradient(
        0,
        textBaselineY - fontSize * 0.9,
        0,
        textBaselineY + fontSize * 0.1
      );
      textGrad.addColorStop(0, "rgb(225, 95, 0)");
      textGrad.addColorStop(0.62, "rgb(178, 36, 0)");
      textGrad.addColorStop(1, "rgb(122, 12, 0)");

      sceneCtx.fillStyle = textGrad;
      sceneCtx.fillText(wordmark, w * 0.5, textBaselineY);

      // Smooth subtle scanner highlight gliding across "Rizky Aditya"
      const shimmerX = ((t * 0.08) % 1.4 - 0.2) * w;
      sceneCtx.globalCompositeOperation = "source-atop";
      const shimmerGrad = sceneCtx.createRadialGradient(
        shimmerX,
        textBaselineY - fontSize * 0.36,
        2,
        shimmerX,
        textBaselineY - fontSize * 0.36,
        w * 0.15
      );
      shimmerGrad.addColorStop(0, "rgba(255, 220, 0, 0.65)");
      shimmerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sceneCtx.fillStyle = shimmerGrad;
      sceneCtx.fillRect(0, 0, w, h);
      sceneCtx.restore();

      // ------------------------------------------------------------------
      // 4. Distant City Depth Layer (soft silhouette behind main towers)
      // ------------------------------------------------------------------
      for (const bg of BACKGROUND_SKYLINE) {
        const bx = Math.floor(bg.nx * w);
        const bw = Math.max(8, Math.floor(bg.nw * w));
        const bh = Math.floor(bg.nh * maxCityH * 0.85);
        const by = groundY - bh;
        sceneCtx.fillStyle = "rgb(36, 0, 0)";
        sceneCtx.fillRect(bx, by, bw, bh);
        sceneCtx.fillStyle = "rgb(56, 0, 0)";
        sceneCtx.fillRect(bx, by, bw, 1);
      }

      // ------------------------------------------------------------------
      // 5. Foreground Modern City & Data-Center Skyline
      //    Clean formal towers with crisp edges, lit windows & server racks
      // ------------------------------------------------------------------
      for (const b of FOREGROUND_SKYLINE) {
        const bx = Math.floor(b.nx * w);
        const bw = Math.max(8, Math.floor(b.nw * w));
        const bh = Math.max(16, Math.floor(b.nh * maxCityH));
        const by = groundY - bh;

        // Tower silhouette body
        const bGrad = sceneCtx.createLinearGradient(0, by, 0, groundY);
        bGrad.addColorStop(0, "rgb(82, 6, 0)");
        bGrad.addColorStop(0.55, "rgb(46, 0, 0)");
        bGrad.addColorStop(1, "rgb(20, 0, 0)");
        sceneCtx.fillStyle = bGrad;
        sceneCtx.fillRect(bx, by, bw, bh);

        // Architectural crown
        if (b.style === "stepped" && bw >= 12) {
          const capW = Math.floor(bw * 0.56);
          const capX = bx + Math.floor((bw - capW) / 2);
          sceneCtx.fillStyle = "rgb(92, 12, 0)";
          sceneCtx.fillRect(capX, by - 4, capW, 4);
          sceneCtx.fillStyle = "rgb(148, 34, 0)";
          sceneCtx.fillRect(capX, by - 4, capW, 1);
        } else if (b.style === "spire" && bw >= 10) {
          sceneCtx.fillStyle = "rgb(90, 10, 0)";
          sceneCtx.beginPath();
          sceneCtx.moveTo(bx + 2, by);
          sceneCtx.lineTo(bx + bw / 2, by - 6);
          sceneCtx.lineTo(bx + bw - 2, by);
          sceneCtx.closePath();
          sceneCtx.fill();
        }

        // Crisp formal top & left edge highlight
        sceneCtx.fillStyle = "rgb(138, 28, 0)";
        sceneCtx.fillRect(bx, by, bw, 1);
        sceneCtx.fillStyle = "rgb(96, 10, 0)";
        sceneCtx.fillRect(bx, by, 1, bh);

        // Rooftop telecom mast & subtle blinking beacon (flank towers only)
        if (b.antenna) {
          const ax = bx + Math.floor(bw * 0.5);
          const mastH = b.style === "spire" ? 12 : 8;
          const mastTop = by - mastH;
          sceneCtx.fillStyle = "rgb(112, 24, 0)";
          sceneCtx.fillRect(ax, mastTop, 1, mastH);
          const pulse =
            0.5 + 0.5 * Math.sin(t * (2.0 + (b.seed % 3) * 0.45) + b.seed);
          if (pulse > 0.45) {
            sceneCtx.fillStyle = `rgb(${Math.floor(190 + pulse * 65)}, ${Math.floor(155 + pulse * 95)}, 0)`;
            sceneCtx.fillRect(ax, mastTop - 1, 2, 2);
          }
        }

        // Facade details: data-center rack bands or tidy corporate windows
        const winStep = bw < 13 ? 3 : 4;
        if (b.style === "datacenter") {
          for (let wy = by + 4; wy < groundY - 3; wy += 4) {
            sceneCtx.fillStyle = "rgb(22, 0, 0)";
            sceneCtx.fillRect(bx + 2, wy, bw - 4, 1);
            const ledOn = Math.sin(t * 2.2 + b.seed * 1.9 + wy * 0.8) > 0.35;
            sceneCtx.fillStyle = ledOn ? "rgb(232, 212, 0)" : "rgb(112, 26, 0)";
            sceneCtx.fillRect(bx + bw - 4, wy, 2, 1);
          }
        } else {
          for (let wy = by + 4; wy < groundY - 3; wy += 4) {
            for (let wx = bx + 3; wx < bx + bw - 3; wx += winStep) {
              const cellHash = hash(b.seed * 97 + wx * 13 + wy * 7);
              if (cellHash > 0.48) {
                const twinkle =
                  cellHash > 0.88
                    ? Math.sin(t * 1.5 + cellHash * 20) > 0
                      ? 210
                      : 92
                    : 132;
                sceneCtx.fillStyle = `rgb(${twinkle}, ${twinkle > 175 ? 165 : 18}, 0)`;
                sceneCtx.fillRect(wx, wy, 2, 2);
              }
            }
          }
        }
      }

      // ------------------------------------------------------------------
      // 6. Refined IT & Cybersecurity Assets (cleanly positioned below text)
      // ------------------------------------------------------------------
      // 6a. Center building crest: Cyber Security Shield + Padlock emblem
      const centerB = FOREGROUND_SKYLINE[9]; // nx: 0.47, nw: 0.06, nh: 0.72
      const shieldCx = Math.floor((centerB.nx + centerB.nw * 0.5) * w);
      const centerRoofY = groundY - Math.floor(centerB.nh * maxCityH);
      const shieldH = isCompact ? 15 : 18;
      const shieldW = isCompact ? 7 : 8;
      const shieldTopY = centerRoofY - shieldH - 5;
      const shieldPulse = 0.5 + 0.5 * Math.sin(t * 1.8);

      sceneCtx.beginPath();
      sceneCtx.moveTo(shieldCx, shieldTopY);
      sceneCtx.lineTo(shieldCx + shieldW, shieldTopY + 3);
      sceneCtx.lineTo(shieldCx + shieldW, shieldTopY + Math.floor(shieldH * 0.55));
      sceneCtx.quadraticCurveTo(
        shieldCx + shieldW - 1,
        shieldTopY + shieldH - 2,
        shieldCx,
        shieldTopY + shieldH
      );
      sceneCtx.quadraticCurveTo(
        shieldCx - shieldW + 1,
        shieldTopY + shieldH - 2,
        shieldCx - shieldW,
        shieldTopY + Math.floor(shieldH * 0.55)
      );
      sceneCtx.lineTo(shieldCx - shieldW, shieldTopY + 3);
      sceneCtx.closePath();
      sceneCtx.fillStyle = "rgb(42, 0, 0)";
      sceneCtx.fill();
      sceneCtx.strokeStyle = `rgb(${Math.floor(155 + shieldPulse * 65)}, ${Math.floor(75 + shieldPulse * 115)}, 0)`;
      sceneCtx.lineWidth = 1.2;
      sceneCtx.stroke();

      // Padlock inside shield
      const lockY = shieldTopY + Math.floor(shieldH * 0.48);
      sceneCtx.fillStyle = `rgb(${Math.floor(195 + shieldPulse * 55)}, ${Math.floor(155 + shieldPulse * 95)}, 0)`;
      sceneCtx.fillRect(shieldCx - 2, lockY, 5, 4);
      sceneCtx.fillRect(shieldCx - 1, lockY - 3, 3, 1);
      sceneCtx.fillRect(shieldCx - 2, lockY - 2, 1, 2);
      sceneCtx.fillRect(shieldCx + 2, lockY - 2, 1, 2);

      // 6b. Left-mid datacenter roof: Crisp Terminal (`>_`) box
      const leftTermB = FOREGROUND_SKYLINE[5]; // nx: 0.26
      const termW = isCompact ? 16 : 20;
      const termH = isCompact ? 11 : 13;
      const termX = Math.floor((leftTermB.nx + leftTermB.nw * 0.5) * w - termW / 2);
      const termY = groundY - Math.floor(leftTermB.nh * maxCityH) - termH - 2;
      sceneCtx.fillStyle = "rgb(38, 0, 0)";
      sceneCtx.fillRect(termX, termY, termW, termH);
      sceneCtx.strokeStyle = "rgb(152, 52, 0)";
      sceneCtx.lineWidth = 1;
      sceneCtx.strokeRect(termX + 0.5, termY + 0.5, termW - 1, termH - 1);
      // Prompt chevron `>`
      sceneCtx.fillStyle = "rgb(205, 175, 0)";
      sceneCtx.fillRect(termX + 3, termY + 4, 1, 1);
      sceneCtx.fillRect(termX + 4, termY + 5, 1, 1);
      sceneCtx.fillRect(termX + 5, termY + 6, 1, 1);
      sceneCtx.fillRect(termX + 4, termY + 7, 1, 1);
      sceneCtx.fillRect(termX + 3, termY + 8, 1, 1);
      // Blinking `_`
      if (Math.floor(t * 2.1) % 2 === 0) {
        sceneCtx.fillStyle = "rgb(248, 240, 0)";
        sceneCtx.fillRect(termX + 8, termY + 8, 4, 1);
      }

      // 6c. Right-mid datacenter roof: Live Network Status Bars / Telemetry Monitor
      const rightMonB = FOREGROUND_SKYLINE[13]; // nx: 0.684
      const monW = isCompact ? 16 : 20;
      const monH = isCompact ? 11 : 13;
      const monX = Math.floor((rightMonB.nx + rightMonB.nw * 0.5) * w - monW / 2);
      const monY = groundY - Math.floor(rightMonB.nh * maxCityH) - monH - 2;
      sceneCtx.fillStyle = "rgb(38, 0, 0)";
      sceneCtx.fillRect(monX, monY, monW, monH);
      sceneCtx.strokeStyle = "rgb(152, 52, 0)";
      sceneCtx.lineWidth = 1;
      sceneCtx.strokeRect(monX + 0.5, monY + 0.5, monW - 1, monH - 1);
      const barCount = isCompact ? 4 : 5;
      for (let bi = 0; bi < barCount; bi++) {
        const bhBar = Math.max(
          2,
          Math.floor(
            (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.6 + bi * 1.15))) *
              (monH - 5)
          )
        );
        sceneCtx.fillStyle = bi === barCount - 1 ? "rgb(235, 220, 0)" : "rgb(168, 95, 0)";
        sceneCtx.fillRect(monX + 3 + bi * 3, monY + monH - 2 - bhBar, 2, bhBar);
      }

      // 6d. Left & Right flank spires: Uplink & Radar Detection Waves (clear of text)
      const leftSpire = FOREGROUND_SKYLINE[3];
      const leftTipX = Math.floor((leftSpire.nx + leftSpire.nw * 0.5) * w);
      const leftTipY = groundY - Math.floor(leftSpire.nh * maxCityH) - 12;

      const rightSpire = FOREGROUND_SKYLINE[15];
      const rightTipX = Math.floor((rightSpire.nx + rightSpire.nw * 0.5) * w);
      const rightTipY = groundY - Math.floor(rightSpire.nh * maxCityH) - 12;

      for (let ring = 0; ring < 2; ring++) {
        const p1 = (t * 0.3 + ring * 0.5) % 1;
        const r1 = 4 + p1 * (isCompact ? 18 : 26);
        sceneCtx.strokeStyle = `rgba(195, 160, 0, ${((1 - p1) * 0.55).toFixed(3)})`;
        sceneCtx.lineWidth = 1.1;
        sceneCtx.beginPath();
        sceneCtx.arc(leftTipX, leftTipY, r1, -Math.PI * 0.82, -Math.PI * 0.18);
        sceneCtx.stroke();

        const p2 = (t * 0.26 + ring * 0.5 + 0.25) % 1;
        const r2 = 4 + p2 * (isCompact ? 20 : 30);
        sceneCtx.strokeStyle = `rgba(195, 160, 0, ${((1 - p2) * 0.55).toFixed(3)})`;
        sceneCtx.beginPath();
        sceneCtx.arc(rightTipX, rightTipY, r2, -Math.PI * 0.88, -Math.PI * 0.12);
        sceneCtx.stroke();
      }

      // ------------------------------------------------------------------
      // 7. Bottom Fiber-Optic Network Backbone & Encrypted Packet Pulses
      // ------------------------------------------------------------------
      const bus1Y = groundY + 1;
      const bus2Y = Math.min(h - 3, groundY + 7);

      sceneCtx.fillStyle = "rgb(88, 12, 0)";
      sceneCtx.fillRect(0, bus1Y, w, 1);
      sceneCtx.fillStyle = "rgb(52, 0, 0)";
      sceneCtx.fillRect(0, bus2Y, w, 1);

      const nodeCount = isCompact ? 7 : 11;
      for (let i = 1; i <= nodeCount; i++) {
        const nx = Math.floor((w * i) / (nodeCount + 1));
        sceneCtx.fillStyle = "rgb(72, 8, 0)";
        sceneCtx.fillRect(nx, bus1Y, 1, bus2Y - bus1Y + 1);
        const active = Math.sin(t * 2.1 + i * 1.15) > 0.25;
        sceneCtx.fillStyle = active ? "rgb(225, 205, 0)" : "rgb(112, 24, 0)";
        sceneCtx.fillRect(nx - 1, bus1Y - 1, 3, 3);
      }

      for (let p = 0; p < 4; p++) {
        const px1 = ((t * 56 + p * (w / 4)) % (w + 48)) - 24;
        const g1 = sceneCtx.createLinearGradient(px1 - 22, bus1Y, px1 + 4, bus1Y);
        g1.addColorStop(0, "rgb(0, 0, 0)");
        g1.addColorStop(1, "rgb(245, 238, 0)");
        sceneCtx.fillStyle = g1;
        sceneCtx.fillRect(Math.floor(px1 - 22), bus1Y - 1, 26, 3);

        const px2 = w - (((t * 44 + p * (w / 4) + 35) % (w + 48)) - 24);
        const g2 = sceneCtx.createLinearGradient(px2, bus2Y, px2 + 18, bus2Y);
        g2.addColorStop(0, "rgb(225, 205, 0)");
        g2.addColorStop(1, "rgb(0, 0, 0)");
        sceneCtx.fillStyle = g2;
        sceneCtx.fillRect(Math.floor(px2), bus2Y - 1, 18, 2);
      }

      // ------------------------------------------------------------------
      // 8. Interactive Cursor Spotlight
      // ------------------------------------------------------------------
      if (pointerStrength > 0.01 && pointerX >= 0 && pointerY >= 0) {
        const gx = (pointerX / cssWidth) * w;
        const gy = (pointerY / cssHeight) * h;
        const spot = sceneCtx.createRadialGradient(gx, gy, 2, gx, gy, 62);
        spot.addColorStop(
          0,
          `rgba(180, 150, 0, ${(0.32 * pointerStrength).toFixed(3)})`
        );
        spot.addColorStop(1, "rgba(0, 0, 0, 0)");
        sceneCtx.globalCompositeOperation = "lighter";
        sceneCtx.fillStyle = spot;
        sceneCtx.fillRect(0, 0, w, h);
        sceneCtx.globalCompositeOperation = "source-over";
      }

      // ------------------------------------------------------------------
      // 9. 4-Tone Ordered Bayer 4x4 Dithering Pass (Formal & Ultra-Clear)
      //    Maps smooth luminance across bg -> dim -> mid -> bright -> accent
      //    so text, buildings & icons stay super crisp with true halftone texture
      // ------------------------------------------------------------------
      const src = sceneCtx.getImageData(0, 0, w, h).data;
      const dst = outImageData.data;
      const levels: [number, number, number][] = [
        palette.bg,
        palette.dim,
        palette.mid,
        palette.bright,
      ];
      const [accR, accG, accB] = palette.accent;

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
            dst[idx] = accR;
            dst[idx + 1] = accG;
            dst[idx + 2] = accB;
            dst[idx + 3] = 255;
            continue;
          }

          // Multi-level Bayer ordered quantization (3 bands between 4 clean ink steps)
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

      const t = (now - startTime) / 1000;
      drawScene(t);
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
      className="relative mx-auto mt-6 h-[225px] w-full max-w-[1160px] select-none overflow-hidden sm:h-[255px] md:h-[285px]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
